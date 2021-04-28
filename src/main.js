import Vue from 'vue'
import formRules from '@/utils/formRules'
import setting from '@/setting'
// import '../uview-comp'

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
