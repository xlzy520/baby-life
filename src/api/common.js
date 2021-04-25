// import _request from '@/utils/request'

const db = wx.cloud.database()

const errorMessageError = {
  '-502005': '数据库或数据表不存在',
}

export const dbRequest = (collectionName, actions = []) => new Promise(((resolve, reject) => {
  let baseService = db.collection(collectionName)
  if (!actions.length) {
    baseService = baseService.get()
  }
  for (let i = 0; i < actions.length; i++) {
    const item = actions[i]
    const { method, condition } = item
    if (!condition) {
      baseService = baseService[method]()
    } else {
      baseService = baseService[method](condition)
    }
  }
  baseService.then(res => {
    console.log(res)
    resolve(res)
  }).catch(err => {
    const msg = errorMessageError[err.errCode] || ''
    uni.showToast({ title: `请求失败,${msg}`, icon: 'none' })
    console.table(err)
    reject(err)
  }).finally(() => {

  })
}))

export default {
  getBlogList() {
    db.collection('blog').get().then(res => {
      console.log(res)
      return res
    })
  },

}
