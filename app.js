//app.js
import http from '/utils/util'
App({
  onLaunch() {
    String.prototype.Trim = function () {
      return this.replace(/(^\s*)/g, "");
    }
  },
  onShow: function (options) {
    this.globalData.alearGetUserMes = false
    let that = this
    let merchantId
    wx.login({
      success(res) {
        if (res.code) {
          wx.getSystemInfo({
            success: function (res) {
              var device;
              if (res.platform == "devtools") {
                device = "PC"
              } else if (res.platform == "ios") {
                device = "IOS"
              } else if (res.platform == "android") {
                device = "android"
              }
              let params = {
                code: res.code,
                'merchantId': options.query.scene ? options.query.scene : "",
                "device": device
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
    merchantId:null,
    skipUrl : ""
  }
})