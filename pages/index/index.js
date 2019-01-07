//index.js
//获取应用实例
var app = getApp()
import http from '../../utils/util.js'
Page({
  data: {
    list:[]
  },
  onShow: function () {
    if (getApp().globalData.token && getApp().globalData.sessionId) {
      this.getList()
    } else {
      getApp().getTokenAfter = this.getList
    }
  },
  getList(){
    http('getVipType', 'POST').then(res => {
      if (res.errCode == 0) {
        this.setData({
          list: res.data
        })
      }
    })
  },
  goBuy(e){
    let params = {
      vipType:e.currentTarget.dataset.viptype
    }
    http('subOrder', 'POST',params).then(res=>{
      if(res.errCode==0){
        this.getPayForm(JSON.parse(res.data).prepayId)
      }else{
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getPayForm(prepayId){
    console.log(prepayId)
    http('getPayForm', "POST", { repayId: prepayId }).then(res => {
      if(res.errCode==0){
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) { },
          fail(res) { }
        })
      }
    })
  }
})