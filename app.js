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
    let scene, merchantId
    wx.login({
      success(res) {
        if (res.code) {
          let params = {
            code: res.code,
            'merchantId': options.query.merchantId ? options.query.merchantId : ""
          }
          http('login/getToken', 'POST', params).then(res => {
            if (res.errCode == 0) {
              that.globalData.sessionId = res.data.sessionId
              that.globalData.token = res.data.token
              that.globalData.userType = res.data.userType
              that.globalData.showPay = res.data.showPay
              that.globalData.merchantId = res.data.merchantId
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
    showPay: false,
    merchantId:null
  }
})