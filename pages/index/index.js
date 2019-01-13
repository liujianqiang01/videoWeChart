//index.js
//获取应用实例
var app = getApp()
import http from '../../utils/util.js'
Page({
  data: {
    list:[],
    banners:[]
  },
  onShow: function () {
    if (getApp().globalData.token && getApp().globalData.sessionId) {
      this.getList();
      this.getBanner();
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
    http('order/subOrder', 'POST',params).then(res=>{
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
    http('getPayForm', "POST", { prepayId: prepayId }).then(res => {
      if(res.errCode==0){
        let data = JSON.parse(res.data)
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success(res) { 
            wx.showToast({
              title: '支付成功',
            })
          },
          fail(res) {
            console.log(res)
           }
        })
      }
    })
  },
  getBanner() {
    http('getBanner', 'POST').then(res => {
      if (res.errCode == 0) {
        this.setData({
          banners: res.data
        })
      }
    })
  },
})