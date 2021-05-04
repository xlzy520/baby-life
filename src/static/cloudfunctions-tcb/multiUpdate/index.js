const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const {
    collectionName, userInfo, ids, newData
  } = event

  try {
    return await db.collection(collectionName).where({
      cloudPath: _.in(ids),
    }).update({
      data: newData,
    })
  } catch (e) {
    console.error(e)
  }
}
