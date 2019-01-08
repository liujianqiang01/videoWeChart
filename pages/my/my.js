import http from '../../utils/util.js'
Page({
  data: {
    show:false,
    money:0
  },
  onShow: function () {
    if (getApp().globalData.token && getApp().globalData.sessionId) {
      this.getTokenAfter()
    }else{
      getApp().getTokenAfter = this.getList
    }
  },
  getTokenAfter(){
    if (getApp().globalData.userType == 1) {
      http('getEarnings', 'POST').then(res => {
        if (res.errCode == 0) {
          this.setData({
            money: res.data,
            show: true
          })
        }
      })
    } else {
      this.setData({
        show: false
      })
    }
  },
  help : function(){
    wx.navigateTo({
      title: "帮助中心",
      url: "https://mp.weixin.qq.com/s/Z7MphZ7StE20YDnxMYvPxA/",
    })
  }
})
