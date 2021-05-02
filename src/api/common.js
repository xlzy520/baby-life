import request from '@/utils/request'

wx.cloud.init()
export const db = wx.cloud.database()

const errorMessageError = {
  '-502005': '数据库或数据表不存在',
}

const needFnMethods = ['orderBy', 'doc']

export const dbRequest = (collectionName, actions = []) => new Promise(((resolve, reject) => {
  let baseService = db.collection(collectionName)
  if (!actions.length) {
    baseService = baseService.get()
  }
  for (let i = 0; i < actions.length; i++) {
    const item = actions[i]
    const { method, params } = item
    if (!params) {
      baseService = baseService[method]()
    } else if (needFnMethods.includes(method)) {
      baseService = baseService[method](...params)
    } else {
      baseService = baseService[method](params)
    }
  }
  baseService.then(res => {
    resolve(res)
  }).catch(err => {
    const msg = errorMessageError[err.errCode] || ''
    uni.showToast({ title: `请求失败,${msg}`, icon: 'none' })
    console.table(err)
    reject(err)
  }).finally(() => {

  })
}))

export function getWeather(data) {
  return uni.request({
    url: `https://api.seniverse.com/v3/weather/now.json?key=7ka55qtzvvc4re1y&location=${data}`,
  })
}
