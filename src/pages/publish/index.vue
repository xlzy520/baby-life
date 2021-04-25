<template>
  <!-- 组件必须设置高度，否则内部容器填充不起来 -->
  <view class="w-full overflow-auto album-content">
    <r-album ref="rAlbum" v-model="list" @sort="onAlbumSort" @click="onAlbumClick"
             @add="onAlbumAdd" @delete="onAlbumDelete">
      <template v-slot:before>
        <view class="px-3 pt-2">
          <u-input v-model="text" type="textarea" :focus="false" :maxlength="927"
                   class="moment-think" height="50" :auto-height="false" placeholder="这一刻的想法..." />
        </view>
      </template>
      <template v-slot:after>
        <view class="px-2 pb-2">
          <u-cell-group>
            <u-cell-item title="所在位置" icon="map" :arrow="true" :borderGap="false">
            </u-cell-item>
          </u-cell-group>
          <u-button type="success" @click="publish" ripple>发表</u-button>
        </view>
      </template>
    </r-album>
  </view>
</template>

<script>
import RAlbum from '@/components/r-album'
import { ImgList } from '@/utils/enum'

export default {
  components: {
    RAlbum,
  },
  data() {
    return {
      // id是DB主键，如果id重复会造成在拖拽排序时候，会影响相同ID的元素
      list: [],
      commentSwitch: true,
      text: '',
    }
  },
  onLoad() {

  },
  methods: {
    publish() {
    },
    onAlbumSort(list) {
      // 返回排序后的数组集合
      // 更新后台排序号
      console.info('排序成功')
    },
    onAlbumClick(res) {
      // 图片预览
      uni.previewImage(res.index, res.list)
    },
    onAlbumAdd(res) {
      // 新增图片，会返回图片的排序号和图片路径
      // 需要保存到后台后，然后add到组件中
      console.info('新增成功')
      console.log(res)
      this.$refs.rAlbum.add({
        // id必须不能重复！！！！
        id: Math.floor(Math.random() * 1000 + 1),
        sortID: res.sortID,
        src: res.src,
      })
    },
    onAlbumDelete(data) {
      // 返回删除的图片实体
      // 到后台删除
      console.info('删除成功')
    },
  },
}
</script>

<style lang="scss">
.moment-think{
  ::v-deep .u-input__input{
    height: 300upx;
  }
}
</style>
