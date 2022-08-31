import Vue from 'vue'
import formRules from '@/utils/formRules'
import setting from '@/setting'
// import '../uview-comp'

const AV = require('./lib/av-core-min.js');
const adapters = require('./lib/leancloud-adapters-weapp.js');

AV.setAdapters(adapters);
AV.init({
  appId: 'cttNHy2dFGSYcjXZmjsv1Pk3-gzGzoHsz',
  appKey: 'sxeY8ZAOSm9DNkGMwZx70HOi',
  // 请将 xxx.example.com 替换为你的应用绑定的自定义 API 域名
  serverURLs: "https://cttnhy2d.lc-cn-n1-shared.com",
});
Vue.prototype.$av = AV


import divider from '@/components/divider'

import dayjs from 'dayjs'
import uView from 'uview-ui'

import App from './App'

import '@/style/tailwind.css'
import '@/style/index.scss'

Vue.component('divider', divider)

const relativeTime = require('dayjs/plugin/relativeTime')
const localeCN = require('dayjs/locale/zh-cn')
const isToday = require('dayjs/plugin/isToday')
const isYesterday = require('dayjs/plugin/isYesterday')

dayjs.locale(localeCN)

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)

Vue.config.productionTip = false

Vue.prototype.$rules = formRules
Vue.prototype.$dayjs = dayjs

Vue.prototype.$baseUrl = setting.baseUrl
Vue.prototype.$uploadUrl = setting.baseUrl + 'api/common/file/upload'

Vue.prototype.$showToast = (title, icon = 'none', otherOptions) => {
  uni.showToast({ title, icon, ...otherOptions })
}

App.mpType = 'app'

Vue.use(uView)

const app = new Vue({
  ...App,
})
app.$mount()
