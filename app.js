//app.js
import http from '/utils/util'
App({
  onShow: function (options) {
    this.globalData.alearGetUserMes = false
    let that = this
    if (options.scene){
      let scene = options.scene + ""
      let merchantId = scene.split('&')[0];
      let userType = scene.split("&")[1];
    }
    wx.login({
      success(res){
        if(res.code){
          let params = {
            code: res.code,
            'userType': '1',
            'merchantId': '0'
          }
          http('login/getToken', 'POST', params).then(res=>{
            if(res.errCode==0){
              that.globalData.sessionId = res.data.sessionId
              that.globalData.token = res.data.token
              if (that.getTokenAfter) {
                that.getTokenAfter()
              }
            }
          })
        }
      }
    })
  },
  globalData:{
    sessionId: null,
    token:null,
    alearGetUserMes:false
  }
})