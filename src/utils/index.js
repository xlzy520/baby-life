import dayjs from 'dayjs'
import setting from '@/setting'

const QQMapWX = require('@/lib/qqmap-wx-jssdk.min.js')

const qqmapsdk = new QQMapWX({
  key: setting.MAP_KEY,
})

export const formatTime = (time, template = 'YY/MM/DD HH:mm:ss') => dayjs(time).format(template)

/**
 * 授权请求
 *
 * @export
 * @param {*} authorizeScope 更多scope参考：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 * @param {*} modal modal弹窗参数信息
 * @returns
 */
export function setAuthorize(authorizeScope, modal) {
  return new Promise((resolve, reject) => {
    if (!modal) {
      modal = {
        title: '授权',
        content: '需要您设置授权已使用相应功能',
        confirmText: '设置',
      }
    }
    uni.getSetting({
      success(res) {
        // hasAuthor === undefined  表示 初始化进入，从未授权
        // hasAuthor === true       表示 已授权
        // hasAuthor === false      表示 授权拒绝
        const hasAuthor = res.authSetting[authorizeScope]
        switch (hasAuthor) {
          case undefined:
            uni.authorize({
              scope: authorizeScope,
              success: res => {
                resolve(res)
              },
              fail: err => {
                uni.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 3000,
                })
                reject(err)
              },
            })
            break
          case true:
            resolve()
            break
          case false:
            uni.showModal({
              ...modal,
              success: res => {
                if (res.confirm) {
                  uni.openSetting({
                    success: res => {
                      if (res.authSetting[authorizeScope]) {
                        resolve(res)
                      } else {
                        reject(res)
                        uni.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 3000,
                        })
                      }
                    },
                    fail: err => {
                      reject(err)
                      uni.showToast({
                        title: '打开设置异常',
                        icon: 'none',
                        duration: 3000,
                      })
                    },
                  })
                } else {
                  reject(res)
                  uni.showToast({
                    title: '授权失败',
                    icon: 'none',
                    duration: 3000,
                  })
                }
              },
              fail: err => {
                reject(err)
                uni.showToast({
                  title: '弹窗异常',
                  icon: 'none',
                  duration: 3000,
                })
              },
            })
            break
        }
      },
      fail: err => {
        reject(err)
        uni.showToast({
          title: '获取当前设置异常',
          icon: 'none',
          duration: 3000,
        })
      },
    })
  })
}

/**
 * 获取用户当前位置信息
 *
 * @export
 */
export function getLocation() {
  return new Promise((resolve, reject) => {
    const scope = 'scope.userLocation'
    const modal = {
      title: '授权',
      content: '需要您授权使用位置信息',
      confirmText: '设置',
    }
    setAuthorize(scope, modal)
      .then(() => {
        uni.getLocation({
          altitude: true,
          success: res => {
            resolve(res)
          },
          fail: err => {
            reject(err)
            uni.showToast({
              title: '获取位置信息失败',
              icon: 'none',
              duration: 3000,
            })
          },
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 逆地址解析（坐标转具体位置信息）
 * @doc 文档参考：https://lbs.qq.com/qqmap_wx_jssdk/method-reverseGeocoder.html
 * @export
 * @param {*} location 坐标：{ latitude: 39.984060, longitude: 116.307520 }
 * @returns
 */
export function reverseGeocoder(location) {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location,
      get_poi: 1,
      poi_options: 'policy=1;page_size=20;page_index=1',
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 3000,
        })
      },
    })
  })
}

/**
 * 地图关键词搜索
 * @doc 文档参考：https://lbs.qq.com/qqmap_wx_jssdk/method-search.html
 * @export
 * @param {*} keyword 搜索关键词
 * @param {*} location 坐标：{ latitude: 39.984060, longitude: 116.307520 }
 * @returns
 */
export function mapSearch(keyword, location) {
  return new Promise((resolve, reject) => {
    qqmapsdk.search({
      keyword,
      location,
      page_size: 20,
      auto_extend: 0,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 3000,
        })
      },
    })
  })
}

export function fromNowFormat(timestamp) {
  if (!timestamp) return '未知'
  const time = dayjs(timestamp)
  if (time.isToday()) {
    return '今天'
  } else if (time.isYesterday()) {
    return '昨天'
  } else if (new Date().getFullYear().toString() === time.format('YYYY')) {
    return time.format('MM月DD日')
  } else {
    return time.format('YYYY年MM月DD日')
  }
}
