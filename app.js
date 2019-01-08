//app.js
import http from '/utils/util'
App({
  onShow: function (options) {
    this.globalData.alearGetUserMes = false
    let that = this
    let scene, merchantId, userType
    let open = {}
    if (options.scene){
      scene = (options.scene + "").split("&")
      for (let i = 0; i < scene.length;i++){
        let arr = scene[i].split("=")
        open[arr[0]] = arr[1]
      }
      // merchantId = scene.split('&')[0];
      // userType = scene.split("&")[1];
    }
    wx.login({
      success(res){
        if(res.code){
          let params = {
            code: res.code,
            'userType': open.userType ? open.userType:"",
            'merchantId': open.merchantId ? open.merchantId:""
          }
          http('login/getToken', 'POST', params).then(res=>{
            if(res.errCode==0){
              that.globalData.sessionId = res.data.sessionId
              that.globalData.token = res.data.token
              that.globalData.userType = res.data.userType
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
    alearGetUserMes:false,
    userType:null
  }
})