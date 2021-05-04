<template>
	<view class="w-full h-full dragsort-box">
		<movable-area id="drag" class="w-full dragsort-area">
			<view id="dragsort-before" class="dragsort-before">
				<slot name="before"></slot>
			</view>
			<view id="dragsort-list" class="dragsort-list" :style="{'height':listHeight+'px'}"></view>
			<movable-view v-for="(item, index) in list" :key="index" :x="item.x" :y="item.y"
                    :data-id="item.id" :data-sortid="item.sortID" :data-isadd="item.isAdd"
                    @touchstart="touchstart" @touchmove.stop="touchmove" @touchend="touchend"
                    :direction="item.direction" damping="40" :animation="item.animation"
                    :disabled="item.disabled" class="layout-items-center dragsort-view"
                    :class="{
                      'dragsort-view-active': isDrag&&activeModel&&activeModel.id === item.id
                    }"
                    :style="{ 'width':item.width+'px', 'height':item.height+'px' }">
				<view v-if="!item.isAdd" class="dragsort-view-item" @click.stop="onClick(item,index,list)">
          <video class="preview-video" v-if="item.fileType === 'video'" :src="item.src"></video>
          <u-image v-else width="100%" height="100%" :src="fixResourcesUrl(item.src)"
                   @click="previewImg"></u-image>
        </view>
				<view v-if="item.isAdd" class="dragsort-view-item" @click.stop="onAdd">
					<view class="layout-center w-full h-full btnAdd">
						<u-icon class="btnAdd-icon" name="plus" color="#B2B2B2" size="90"></u-icon>
					</view>
				</view>
			</movable-view>
			<view id="dragsort-after" class="dragsort-after">
				<slot name="after"></slot>
			</view>
			<view id="dragsort-delete" class="w-full layout-col-around dragsort-delete"
            :class="isDrag?'opacity':''">
				<u-icon class="deleteicon" name="trash" color="#FFFFFF" size="34"></u-icon>
				<view>{{deleteText}}</view>
			</view>
		</movable-area>
	</view>
</template>

<script>
import { dbRequest } from '@/api/common'

let timeOut = 0
const debounceWait = 300
let touchTimeOut = 0
const touchDebounceWait = 300
let touchMoveTimeOut = 0
const touchMoveDebounceWait = 10
let lastTouchE = null

export default {
  name: 'drag-sort',
  mixins: [],
  components: {},
  data() {
    return {
      list: [], // 外部传入集合总数
      row: 0, // 总行数，根据集合总数和列数进行计算
      width: 0, // Item元素宽度，根据列数进行计算
      height: 0, // Item元素高度，同宽度
      windowWidth: 0, // 屏幕宽度
      listHeight: 0, // 拖拽元素列表的高度【主要是用于撑起拖拽区域dragsort-list】
      beforeHeight: 0, // before区域高度
      afterHeight: 0, // after区域高度
      topY: 0, // 容器距离设备顶部的距离
      topX: 0, // 容器距离设备左侧偏移位置
      activeModel: null, // 当前激活的元素
      activeX: 0, // 激活元素旧的x偏移
      activeY: 0, // 激活元素旧的y偏移
      targetModel: null, // 当前目标元素
      targetX: 0, // 记录的旧的目标元素x偏移
      targetY: 0, // 记录的旧的目标元素y偏移
      isDrag: false, // 标记是否为拖动触发
      deleteArea: null, // 删除区域信息
      deleteText: '拖动到此处删除',
      modelCount: 0, // 记录元素个数，排除新增按钮元素
      maxSortID: 0, // 当前数组中最大的排序号
      addObject: null, // 新增按钮实体元素
      isUpdate: false, // 数据是否需要更新，如果没有找到目标元素，那么此值始终是false，用于判断是否需要触发update更新事件
    }
  },
  computed: { },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    // 默认3列
    column: {
      type: Number,
      default: () => 3,
    },
    // 元素最多数量
    maxCount: {
      type: Number,
      default: () => 36,
    },
    // 容器左右内间隔【同padding】,单位px
    areaXGap: {
      type: Number,
      default: () => 15,
    },
    // 容器上下内间隔【同padding】,单位px
    areaYGap: {
      type: Number,
      default: () => 10,
    },
    // 元素的间距【元素和元素之间的间隔】,单位px
    viewGap: {
      type: Number,
      default: () => 4,
    },
    lon_lat: {
      type: Object,
      default: () => ({}),
    },
    location: {
      type: String,
      default: '',
    },
    weather: {
      type: String,
      default: '',
    },
  },
  watch: {
    value: {
      handler() {
        // console.info(this.value);
        this.reset()
        this.init()
        this.initGrid()
      },
      deep: true,
    },
  },
  created() {
    const res = uni.getSystemInfoSync()
    this.windowWidth = res.windowWidth
  },
  mounted() {
    this.$nextTick(function () {
      const query = uni.createSelectorQuery().in(this)
      query.select('#dragsort-before').boundingClientRect()
      query.select('#dragsort-after').boundingClientRect()
      query.exec((res) => {
        this.beforeHeight = res[0].height
        this.afterHeight = res[1].height

        this.init()
        this.initGrid()
      })
    })
  },
  updated() {},
  filters: {},
  methods: {
    previewImg() {
      uni.previewImage({
        urls: this.list,
        longPressActions: {
          itemList: ['保存图片'],

        },
      })
    },
    reset() {
      this.addObject = null
    },
    // 对传入的集合进行初始化处理，根据排序号进行排序操作，后续内部处理不会改变集合的元素索引排序
    init() {
      const arr = []
      if (this.value && this.value.length > 0) {
        arr.push(...this.value)
      }

      // 先根据排序编号进行排序,序号越小越靠前
      arr.sort(function (a, b) {
        return a.sortID - b.sortID
      })
      // 只取前this.maxCount个元素，不能多于this.maxCount个元素
      // console.info(arr);
      // console.info(arr.length);
      // console.info(this.maxCount);
      if (arr.length >= this.maxCount) {
        this.list = arr.slice(0, this.maxCount)
        this.modelCount = this.maxCount
        this.maxSortID = this.list[this.list.length - 1].sortID
      } else if (arr.length < this.maxCount) {
        this.list = arr
        if (arr.length > 0) {
          this.modelCount = this.list.length
          this.maxSortID = this.list[this.list.length - 1].sortID
        }
        // 如果元素数量少于this.maxCount个则新增一个上传图片按钮
        this.list.push({
          id: 0,
          sortID: 10000, // 按钮始终放在末尾位置，默认排序号10000
          src: '',
          isAdd: true,
        })
      }
    },
    // 初始化处理，根据每列显示数和总行数，计算每个元素偏移
    initGrid(list = this.list) {
      const arr = []
      let x = 0
      // let y = this.beforeHeight;
      let tmpIndex = 0
      if (list && list.length > 0) {
        // 先计算出总行数
        this.row = Math.ceil(list.length / this.column)
        // 计算每个元素的宽高，宽高相同,这里屏幕宽度-容器内间距*2（包含左右的内间距）-元素间距（元素的数量-1即为这个间距值的数量，比如3个元素，那么只会有1和2的间距，2和3的间距）
        this.height = this.width = (this.windowWidth - this.areaXGap * 2 - (this.column - 1) * this.viewGap) / this.column
        // 元素列表所占据的总高度（包含各种内边距，元素和元素的间距）
        this.listHeight = this.height * this.row + this.areaYGap * 2 + (this.row - 1) * this.viewGap
        // 每行循环，设置x和y偏移
        for (var row = 1; row <= this.row; row++) {
          // 取出第一行数据，根据分页算法
          const min = (row - 1) * this.column
          let max = row * this.column
          max = max > list.length ? list.length : max
          const rowList = list.slice(min, max)
          // 计算偏移
          const lastx = this.areaXGap
          const lasty = (this.beforeHeight + this.areaYGap + (row - 1) * (this.height + this.viewGap))
          rowList.map((item, index) => {
            if (index == 0) {
              x = lastx
            } else {
              x = lastx + index * (this.width + this.viewGap)
            }
            if (item.isAdd) {
              this.addObject = {
                ...item,
                y: lasty,
                x,
                // 默认上传图片按钮不可移动
                direction: 'all',
                disabled: true,
                animation: true,
                rowNumber: row,
                columnNumber: index + 1,
                width: this.width,
                height: this.height,
              }
              arr.push(this.addObject)
            } else {
              arr.push({
                ...item,
                y: lasty,
                x,
                // 默认上传图片按钮不可移动
                direction: 'all',
                disabled: false,
                animation: true,
                rowNumber: row,
                columnNumber: index + 1,
                width: this.width,
                height: this.height,
              })
            }
            tmpIndex++
          })
        }
      }
      this.list = arr
    },
    fixResourcesUrl(url) {
      // 此方法是用于修改url【某些平台下图片必须使用全路径】
      return url
    },
    // 查找目标元素【当前鼠标X坐标和Y坐标】
    findTarget(touchX, touchY) {
      // 如果当前拖拽元素不存在，直接返回
      if (this.activeModel == null) return
      // 设置标志，用于判断是否需要更新元素操作
      let isAddContain = true
      // 循环找出，当前鼠标坐标点在哪个元素的范围内，即找出目标元素
      this.list.map((res, index) => {
        // 如果当前鼠标坐标在目标元素内则重排更新排序号
        // 需要排除掉自己和上传图片按钮
        if (res.x < touchX && touchX <= (res.x + this.width) && touchY > res.y && touchY <= (res.y + this.height) && this.activeModel.id != res.id && !res.isAdd) {
          // 此处目标元素肯定不是上传图片按钮，所以设置一下标志
          isAddContain = false
          // 记录目标索引ID
          this.targetModel = res
          this.isUpdate = true

          // // 获取目标元素的排序号
          // let temNumber = res.sortID;
          // // 获取拖拽元素排序号
          // var activeModel = this.getModel(this.activeID);
          // let activeNumber = activeModel.sortID;
          // // 如果是小向大移动，那么在拖拽元素和当前目标元素之间的(包括目标元素)顺序都要-1
          // if (activeNumber < temNumber) {
          // 	this.list.map((_item,_index)=>{
          // 		// 这里需要改排序号的包括目标元素自己
          // 		if( activeNumber < _item.sortID && _item.sortID <= temNumber){
          // 			_item.sortID--;
          // 			// 这里不光排序号要-1，x偏移也需要自减，y偏移可能需要自减
          // 			// _item.x = _item.x  -
          // 		}
          // 	})
          // }
          // // 如果是大向小移动，那么在当前目标元素之后(包括目标元素)和拖拽元素之间的元素顺序都需要+1
          // else if(activeNumber > temNumber){
          // 	this.list.map((_item,_index)=>{
          // 		// 这里需要改排序号的包括目标元素自己
          // 		if( temNumber <= _item.sortID && _item.sortID < activeNumber){
          // 			_item.sortID++;
          // 		}
          // 	})
          // }
          // // 改完之后，把目标元素原排序号更新到拖拽元素上
          // activeModel.sortID = temNumber;
        }
      })
      // 如果目标元素非新增按钮，则更新操作
      if (!isAddContain && this.isUpdate) {
        this.updateList()
      }
    },
    // 更新元素偏移
    updateList() {
      // console.info(this.list);
      // 把目标元素旧的偏移记录下来
      this.targetX = this.targetModel.x
      this.targetY = this.targetModel.y
      const targetSortID = this.targetModel.sortID
      const rowNumber = this.targetModel.rowNumber
      const columnNumber = this.targetModel.columnNumber
      // 其实需要改变x.y偏移和排序号的始终是拖拽元素和目标元素之间的元素
      if (this.activeModel.sortID > targetSortID) {
        // 从大到小,需要判断是同行移动，还是跨行移动
        if (this.activeModel.rowNumber === rowNumber) {
          // 单行只需要改变x偏移，从后往前以此修改之间元素偏移
          let sortid = this.activeModel.sortID - 1
          for (; sortid >= targetSortID; sortid--) {
            const model = this.getModelBySortID(sortid)
            model.x += (this.width + this.viewGap)
            model.sortID++
            model.columnNumber++
          }
        } else {
          // 如果激活元素和目标元素不在一行
          let sortid = this.activeModel.sortID - 1
          for (; sortid >= targetSortID; sortid--) {
            const model = this.getModelBySortID(sortid)
            model.sortID++
            // 此时由于不在同一行，需要改变的元素可能存在需要换行的情况，需要分别处理
            if (model.columnNumber === this.column) {
              // 如果当前元素处于最后一列，那么需要换行
              model.columnNumber = 1
              model.rowNumber++
              model.y = (this.beforeHeight + this.areaYGap + (model.rowNumber - 1) * (this.height + this.viewGap))
              model.x = this.areaXGap + (model.columnNumber - 1) * (this.width + this.viewGap)
            } else {
              // 如果当前元素不处于临界状态，不需要考虑换行问题
              model.x += (this.width + this.viewGap)
              model.columnNumber++
            }
          }
        }
      } else if (this.activeModel.sortID < targetSortID) {
        // 从小到大，需要判断是同行移动，还是跨行移动
        if (this.activeModel.rowNumber === rowNumber) {
          // 单行只需要改变x偏移，从前往后以此修改之间元素偏移
          let sortid = this.activeModel.sortID + 1
          for (; sortid <= targetSortID; sortid++) {
            const model = this.getModelBySortID(sortid)
            model.x -= (this.width + this.viewGap)
            model.sortID--
            model.columnNumber--
          }
        } else {
          // 如果激活元素和目标元素不在一行
          let sortid = this.activeModel.sortID + 1
          for (; sortid <= targetSortID; sortid++) {
            const model = this.getModelBySortID(sortid)
            model.sortID--
            // 此时由于不在同一行，需要改变的元素可能存在需要换行的情况，需要分别处理
            if (model.columnNumber === 1) {
              // 如果当前元素处于第一列，那么需要减一行
              model.columnNumber = this.column
              model.rowNumber--
              model.y = (this.beforeHeight + this.areaYGap + (model.rowNumber - 1) * (this.height + this.viewGap))
              model.x = this.areaXGap + (model.columnNumber - 1) * (this.width + this.viewGap)
            } else {
              // 如果当前元素不处于临界状态，不需要考虑换行问题
              model.x -= (this.width + this.viewGap)
              model.columnNumber--
            }
          }
        }
      }
      this.activeModel.sortID = targetSortID
      this.activeModel.columnNumber = columnNumber
      this.activeModel.rowNumber = rowNumber
    },
    removeItem() {
      // 大于sortID的元素都需要移动
      const activeSortID = this.activeModel.sortID
      // 找出当前删除元素的索引
      let _index = -1
      this.list.map((item, index) => {
        if (item == this.activeModel) {
          _index = index
        }
      })
      //
      if (_index > -1) {
        this.list.splice(_index, 1)
      }

      // 取出元素【排序】最后一个元素，把一些旧的数据记录起来
      // 这里不能直接用索引取！！！
      // 这里还需要判断当前删除的元素是不是排序最大的那个，如果是的话lastModel就是activeModel
      const lastModel = this.maxSortID == activeSortID ? this.activeModel : this.getModelBySortID(this.maxSortID)
      // var lastX= lastModel.x;
      // var lastY= lastModel.y;
      const lastRowNumber = lastModel.rowNumber
      const lastColumnNumber = lastModel.columnNumber

      for (let i = 0; i < this.list.length; i++) {
        const model = this.list[i]

        if (model.sortID > activeSortID) {
          // 大于当前删除元素的排序号需要自减
          // 新增按钮不需要更改排序号
          if (!model.isAdd) {
            model.sortID--
          }
          if (model.rowNumber == 1) {
            // 如果第一行y偏移不变，行数不变
            model.x -= (this.width + this.viewGap)
            model.columnNumber--
          } else {
            // 如果不是第一行情况下
            if (model.columnNumber == 1) {
              // 如果当前元素处于第一列，那么需要减一行，并且列需要变成上一行最后一个元素
              model.columnNumber = this.column
              model.rowNumber--
              model.y = (this.beforeHeight + this.areaYGap + (model.rowNumber - 1) * (this.height + this.viewGap))
              model.x = this.areaXGap + (model.columnNumber - 1) * (this.width + this.viewGap)
            } else {
              // 如果当前元素不处于临界状态，不需要考虑换行问题
              model.x -= (this.width + this.viewGap)
              model.columnNumber--
            }
          }
        }
      }

      // 如果此时新增按钮不存在，肯定数据元素数量为最大值，由于删除了一个元素，需要将新增按钮插入到list中
      // console.info(this.list);
      if (!this.addObject) {
        // 这里不能直接使用lastY和lastX
        // 如果删除的是最后一个元素
        // lastX和lastY是该元素拖动最后位置的偏移值，所以这里需要动态计算
        this.addObject = {
          id: 0,
          sortID: 10000, // 按钮始终放在末尾位置，默认排序号10000
          src: '',
          isAdd: true,
          // y: lastY,
          // x: lastX,
          direction: 'all',
          disabled: true,
          animation: true,
          rowNumber: lastRowNumber,
          columnNumber: lastColumnNumber,
          width: this.width,
          height: this.height,
        }
        this.addObject.x = this.areaXGap + (this.addObject.columnNumber - 1) * (this.width + this.viewGap)
        this.addObject.y = (this.beforeHeight + this.areaYGap + (this.addObject.rowNumber - 1) * (this.height + this.viewGap))

        this.list.push(this.addObject)
        // console.info(this.list);
      }
      // console.info(this.addObject);
      // 元素列表所占据的总高度（包含各种内边距，元素和元素的间距）
      this.listHeight = this.height * this.addObject.rowNumber + this.areaYGap * 2 + (this.addObject.rowNumber - 1) * this.viewGap
    },
    touchstart(e) {
      // 如果是新增按钮被触及不用管
      if (e.currentTarget.dataset.isadd) {
        return
      }

      const me = this
      // 这里是因为click事件也会触发touchstart、touchmove、touchend事件
      // 所以防抖延迟处理，如果是click，那么会依次立即触发touchstart->touchmove->touchend，而在touchend中会将定时器清除
      // 如果是按住不动保持touchDebounceWait时间，此时不会触发touchend事件
      touchTimeOut = setTimeout(function () {
        me.isDrag = true

        // 计算 x y 轴点击位置
        const query = uni.createSelectorQuery().in(me)
        query.select('#drag').boundingClientRect()
        query.select('#dragsort-delete').boundingClientRect()
        query.exec((res) => {
          // 获取删除区域信息
          me.deleteArea = res[1]
          // console.info(res);
          // 获取容器drag位置信息，TOP为距离顶部的距离，LEFT为距离左边的距离
          me.topY = res[0].top
          me.topX = res[0].left

          // 记录当前拖拽元素
          me.activeModel = me.getModel(e.currentTarget.dataset.id)
          me.activeModel.width += 10
          me.activeModel.height += 10
          me.activeX = me.activeModel.x
          me.activeY = me.activeModel.y

          // 获取鼠标实时的坐标
          const temY = e.mp.touches[0].clientY - me.topY
          const temX = e.mp.touches[0].clientX - me.topX
          // 这里需要处理一下，如果直接把鼠标实时坐标复制给拖拽元素的xy偏移，那么此时元素的左上角会对准当前鼠标位置
          // 而正常情况下，我们点击的可能是元素的正中间，或者别的位置，所以需要修正一下
          // 这里x和y分别减去宽度和高度的一半，相当于把元素向左和向上偏移一半，把元素中心位置对应到鼠标点击的问题
          const itemY = temY - (me.height + 10) / 2
          const itemX = temX - (me.width + 10) / 2
          // 把当前坐标设置到当前拖拽元素的xy偏移值
          me.activeModel.y = itemY
          me.activeModel.x = itemX
          me.activeModel.animation = false
        })
      }, touchDebounceWait)
    },
    touchmove(e) {
      // 如果是新增按钮被触及不用管
      if (e.currentTarget.dataset.isadd) {
        return
      }

      const me = this
      if (touchMoveTimeOut) clearTimeout(touchMoveTimeOut)
      touchMoveTimeOut = setTimeout(function () {
        // 如果当前拖拽元素不存在，直接返回
        if (me.activeModel == null) return

        // 这里主要是为了解决touchmove触发比较频繁，而手指在操作时候，会产生小范围抖动，会造成拖动元素快速来回抖动
        // 所以这里修复如果和上次相比，移动距离小于20px则直接会返回
        if (lastTouchE) {
          if (Math.abs(e.mp.touches[0].clientY - lastTouchE.mp.touches[0].clientY) < 20 &&
						Math.abs(e.mp.touches[0].clientX - lastTouchE.mp.touches[0].clientX) < 20) {
            return
          }
        }
        lastTouchE = e

        // 获取鼠标实时的坐标
        const temY = e.mp.touches[0].clientY - me.topY
        const temX = e.mp.touches[0].clientX - me.topX
        // 这里需要处理一下，如果直接把鼠标实时坐标复制给拖拽元素的xy偏移，那么此时元素的左上角会对准当前鼠标位置
        // 而正常情况下，我们点击的可能是元素的正中间，或者别的位置，所以需要修正一下
        // 这里x和y分别减去宽度和高度的一半，相当于把元素向左和向上偏移一半，把元素中心位置对应到鼠标点击的问题
        // console.info(me.activeModel);
        const itemY = temY - (me.height + 10) / 2
        const itemX = temX - (me.width + 10) / 2
        // 把当前坐标设置到当前拖拽元素的xy偏移值
        me.activeModel.y = itemY
        me.activeModel.x = itemX
        me.activeModel.animation = false

        // 判断是否进入删除区域
        if (temY >= me.deleteArea.top) {
          // 进入删除区域，不做排序操作
          me.deleteText = '松手即可删除'
          return
        } else {
          me.deleteText = '拖动到此处删除'
        }

        // touchmove触发太频繁，防抖处理，N秒后判断是否需要更改排序和偏移
        // 这里防抖函数使用util内的，延迟没有作用，还是会执行多次，暂时无法解决 不知道什么问题
        if (timeOut) clearTimeout(timeOut)
        timeOut = setTimeout(function () {
          me.findTarget(temX, temY)
        }, debounceWait)
      }, touchMoveDebounceWait)
    },
    touchend(e) {
      // 如果是新增按钮被触及不用管
      if (e.currentTarget.dataset.isadd) {
        return
      }

      if (touchTimeOut) clearTimeout(touchTimeOut)

      // 如果当前拖拽元素不存在，直接返回
      if (this.activeModel == null) return

      // 判断是否删除操作
      // 获取鼠标实时的坐标
      // console.info(e);
      const temY = e.mp.changedTouches[0].clientY - this.topY
      // let temX = e.mp.touches[0].clientX - me.topX
      // 判断是否进入删除区域
      if (temY >= this.deleteArea.top) {
        // 进入删除区域，不做排序操作，直接触发删除
        this.removeItem()
        this.modelCount--
        this.maxSortID--
        this.$emit('delete', {
          model: this.activeModel,
          list: this.list.filter(item => !item.isAdd),
        })
      } else {
        // 将拖拽元素移动到排序号所在的位置
        this.activeModel.width -= 10
        this.activeModel.height -= 10
        if (this.targetModel) {
          // 如果目标元素存在情况下，激活元素的偏移即为目标元素旧的偏移
          this.activeModel.x = this.targetX
          this.activeModel.y = this.targetY
        } else {
          // 如果目标元素不存在，还原激活元素的旧的位置
          this.activeModel.x = this.activeX
          this.activeModel.y = this.activeY
        }
        this.activeModel.animation = true
        // 如果确实更新了数据，那么触发事件
        if (this.isUpdate) {
          this.isUpdate = false
          this.$emit('sort', this.list.filter(item => !item.isAdd))
        }
      }

      // 重置数据
      this.activeModel = null
      this.targetModel = null
      this.isDrag = false
      this.deleteArea = null
      this.deleteText = '拖动到此处删除'
      lastTouchE = null
    },
    getModel(pk_id) {
      // 根据主键key查找元素
      if (this.list && this.list.length > 0) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id == pk_id) {
            return this.list[i]
          }
        }
      }
      return null
    },
    getModelBySortID(sortID) {
      // 根据主键key查找元素
      if (this.list && this.list.length > 0) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].sortID == sortID) {
            return this.list[i]
          }
        }
      }
      return null
    },
    onClick(model, index, list) {
      this.$emit('click', {
        model,
        index,
        list: list.filter(item => !item.isAdd),
      })
    },
    onAdd() {
      const self = this
      uni.chooseMedia({
        count: 9 - self.modelCount, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          console.log(res)
          if (res.tempFiles) {
            res.tempFiles.map((item, index) => {
              // 延迟触发一下
              setTimeout(() => {
                uni.showLoading({ title: '上传中...' })
                self.maxSortID++
                const src = item.tempFilePath
                const filePath = item.tempFilePath
                // 上传图片
                const cloudPath = Date.now().toString() + filePath.match(/\.[^.]+?$/)[0]
                wx.cloud.uploadFile({
                  cloudPath,
                  filePath,
                  success: res => {
                    console.log('[上传文件] 成功：', res)
                    if (item.fileType === 'video') {
                      delete item.thumbTempFilePath
                    }
                    delete item.tempFilePath
                    this.saveToDB({
                      cloudPath: res.fileID,
                      createTime: Date.now(),
                      location: this.location,
                      lon_lat: this.lon_lat,
                      weather: this.weather,
                      ...item,
                    })
                    self.$emit('add', {
                      ...item, src, cloudPath: res.fileID, sortID: self.maxSortID,
                    })
                  },
                  fail: e => {
                    console.error('[上传文件] 失败：', e)
                    wx.showToast({
                      icon: 'none',
                      title: '上传失败',
                    })
                  },
                  complete: () => {
                    wx.hideLoading()
                  },
                })
              }, 200)
            })
          }
        },
      })
    },
    saveToDB(data) {
      const actions = [
        { method: 'add', params: { data } }
      ]
      dbRequest('album', actions)
    },
    // 供外部调用，新增一个元素
    add(item) {
      // console.info(item);
      // 如果没有新增按钮，则不新增
      if (!this.addObject) {
        return
      }
      this.modelCount++

      // 有新增按钮情况下，包括新增按钮，元素长度是否为maxCount
      // 是的话，新增按钮需要移除
      if (this.list.length === this.maxCount) {
        const model = { ...item, ...this.addObject }
        model.isAdd = false
        model.disabled = false
        model.src = item.src
        model.id = item.id
        model.sortID = item.sortID

        this.list.splice(this.maxCount - 1, 1, model)
        this.addObject = null
      } else {
        const model = { ...item, ...this.addObject }
        model.isAdd = false
        model.disabled = false
        model.src = item.src
        model.id = item.id
        model.sortID = item.sortID

        this.list.splice(this.list.length - 1, 0, model)
        // 新增按钮可能存在需要换行的情况，需要分别处理
        if (this.addObject.columnNumber === this.column) {
          // 如果处于最后一列，那么需要换行
          this.addObject.columnNumber = 1
          this.addObject.rowNumber++
          this.addObject.y = (this.beforeHeight + this.areaYGap + (this.addObject.rowNumber - 1) * (this.height + this.viewGap))
          this.addObject.x = this.areaXGap + (this.addObject.columnNumber - 1) * (this.width + this.viewGap)
          // 元素列表所占据的总高度（包含各种内边距，元素和元素的间距）
          this.listHeight = this.height * this.addObject.rowNumber + this.areaYGap * 2 + (this.addObject.rowNumber - 1) * this.viewGap
        } else {
          // 如果不处于临界状态，不需要考虑换行问题
          this.addObject.x = this.addObject.x + (this.width + this.viewGap)
          this.addObject.columnNumber++
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
	.dragsort-box {

	}
	.dragsort-area {
		/*height: 100%;*/
    height: calc(100vh - 40rpx);
	}

	.dragsort-before {}

	/* 需要撑开拖拽内容区域高度 */
	.dragsort-list {}

	.dragsort-after {}

	.dragsort-delete {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		/* padding: 14rpx 0; */
		height: 90rpx;
		background-color: #dd6161;
		color: #FFFFFF;
		opacity: 0;
	}
	.opacity{
		opacity: 1;
	}

	.deleteicon {
		font-size: 17px;
	}

	.dragsort-view {
		position: absolute !important;
		text-align: center;
    background-color: #C0C4CC;
		color: #fff;
    border-radius: 5px;
		box-sizing: border-box;
		z-index: 90;
	}

	.dragsort-view-active {
    box-shadow: 0 0 40rpx #DDDDDD;
		z-index: 99;
	}

	.dragsort-view-item {
		position: relative;
		flex: 1;
		font-size: 16px;
		width: 100%;
		height: 100%;
	}

	.btnAdd{
		background-color: #F7F7F7;
	}
	.btnAdd-icon{
		color: #B2B2B2;
		font-size: 90rpx;
	}

</style>
