<template>
  <view class="content">
    <view class="container" :style="{height: editorHeight+'px'}">
      <editor id="editor" class="ql-container" :placeholder="placeholder"
              @statuschange="onStatusChange" @ready="onEditorReady">
      </editor>
    </view>

    <view class="toolbar" catchtouchend="format" :style="{bottom: isIOS ? keyboardHeight+'px' : 0}">
      <i class="iconfont icon-charutupian" @click="insertImage"></i>
      <i class="iconfont icon-format-header-2"
         :class="{'ql-active': formats.header === 2}"
         @click="format('header', 2)"></i>
      <i class="iconfont icon-format-header-3"
         :class="{'ql-active': formats.header === 3}"
         @click="format('header', 3)"></i>
      <i class="iconfont icon-zitijiacu"
         :class="{'ql-active': formats.bold}"
         @click="format('bold')"></i>
      <i class="iconfont icon-zitixieti"
         :class="{'ql-active': formats.italic}"
         @click="format('italic')"></i>
      <i class="iconfont icon-zitixiahuaxian"
         :class="{'ql-active': formats.underline}"
         @click="format('underline')"></i>
      <i class="iconfont icon--checklist" @click="format('list', 'check')"></i>
      <i class="iconfont icon-youxupailie"
         :class="{'ql-active': formats.list === 'ordered'}"
         @click="format('list', 'ordered')"></i>
      <i class="iconfont icon-wuxupailie"
         :class="{'ql-active': formats.list === 'bullet'}"
         @click="format('list', 'bullet')"></i>
    </view>
    <button @click="release">发布</button>
  </view>
</template>

<script>

export default {
  data() {
    return {
      formats: {},
      readOnly: false,
      placeholder: '开始输入...',
      editorHeight: 300,
      keyboardHeight: 0,
      isIOS: false,
      html: '<h1>lzy</h1>'
    }
  },
  components: {
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.isIOS = isIOS
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          },
        })
      }, duration)
    })
  },
  methods: {
    // 点击发布
    release() {
      this.showSettingLayer = false;
      this.editorCtx.getContents({
        success: res => {
          console.log(res)
        }
      })
    },
    readOnlyChange() {
      this.readOnly = !this.data.readOnly
    },
    updatePosition(keyboardHeight) {
      const toolbarHeight = 50
      const { windowHeight, platform } = wx.getSystemInfoSync()
      const editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
      this.editorHeight = editorHeight
      this.keyboardHeight = keyboardHeight
    },
    calNavigationBarAndStatusBar() {
      const systemInfo = wx.getSystemInfoSync()
      const { statusBarHeight, platform } = systemInfo
      const isIOS = platform === 'ios'
      const navigationBarHeight = isIOS ? 44 : 48
      return statusBarHeight + navigationBarHeight
    },
    onEditorReady() {
      wx.createSelectorQuery().select('#editor').context((res)=> {
        this.editorCtx = res.context
        this.editorCtx.setContents({
          html: this.html
        })
      }).exec()
    },
    blur() {
      this.editorCtx.blur()
    },
    format(name, value) {
      // console.log(e)
      // const { name, value } = e.target.dataset
      if (!name) return
      // console.log('format', name, value)
      this.editorCtx.format(name, value)
    },
    onStatusChange(e) {
      const formats = e.detail
      console.log(e)
      this.formats = formats
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success() {
          console.log('insert divider success')
        },
      })
    },
    clear() {
      this.editorCtx.clear({
        success(res) {
          console.log('clear success')
        },
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate,
      })
    },
    insertImage() {
      const that = this
      wx.chooseImage({
        count: 1,
        success(res) {
          that.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            data: {
              id: 'abcd',
              role: 'god',
            },
            width: '80%',
            success() {
              console.log('insert image success')
            },
          })
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import "./iconfont.scss";

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.ql-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-size: 16px;
  line-height: 1.5;
  overflow: auto;
  padding: 10px 10px 20px 10px;
  border: 1px solid #ECECEC;
}

.ql-active {
  color: #22C704;
}

.iconfont {
  display: inline-block;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 20px;
}

.toolbar {
  box-sizing: border-box;
  padding: 0 10px;
  height: 50px;
  width: 100%;
  position: fixed;
  left: 0;
  right: 100%;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ECECEC;
  border-left: none;
  border-right: none;
}
</style>
