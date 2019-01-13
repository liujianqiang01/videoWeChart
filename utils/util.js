let baseUrl ='https://filmunion.com.cn/video/'
//let baseUrl = 'http://localhost:8080/'
module.exports = function (url, method,data ) {
  let meth = method.toUpperCase()
  if (meth != "GET" && meth != "DELETE" && meth != "POST" && meth != "PUT") {
    meth = 'GET'
  }
  // const app = getApp()
  return new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + url,
      data: data,
      method: meth,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Cookie: getApp() ? 'JSESSIONID='+getApp().globalData.sessionId: "",
        token: getApp() ? getApp().globalData.token : ""
      },
      success: function (res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res.data)
      }
    })
  })
}