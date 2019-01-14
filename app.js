//app.js
import http from '/utils/util'
App({
  onLaunch() {
    String.prototype.Trim = function () {
      return this.replace(/(^\s*)/g, "");
    }
  },
  onShow: function (options) {
    console.log(options)
    this.globalData.alearGetUserMes = false
    let that = this
    let scene, param
    wx.login({
      success(res) {
        if (res.code) {
          let params = {
            code: res.code,
            'param': options.query.param ? options.query.param : ""
          }
          http('login/getToken', 'POST', params).then(res => {
            if (res.errCode == 0) {
              that.globalData.sessionId = res.data.sessionId
              that.globalData.token = res.data.token
              that.globalData.userType = res.data.userType
              that.globalData.showPay = res.data.showPay
              if (that.getTokenAfter) {
                that.getTokenAfter()
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    sessionId: null,
    token: null,
    alearGetUserMes: false,
    userType: null,
    showPay: false
  }
})