import http from '../../utils/util.js'
Page({
  data: {
    show:false,
    showPay: false,
    earning:0,
    unEarning:0,
    updataMer:true,
    haveMes:false,
    applyReason: true,
    reason:null,
    merchantMes:{
      menchantName:null,
      menchantAddr:null,
      mobile:null
    },
     applyPrice: {
      monthCardPrice: 0,
      seasonCardPrice: 0,
      yearCardPrice: 0
    },
    applyPriceHidden : true,
    imgurl:null,
    maHidden:true

  },
  onShow: function () {
    this.getMerchantInfo()
    this.setData({
      showPay : getApp().globalData.showPay
    })
    if (getApp().globalData.token && getApp().globalData.sessionId) {
      this.getTokenAfter()
    }else{
      getApp().getTokenAfter = this.getList
    }
  },
  getMerchantInfo(){
    http('merchant/getMerchant', 'POST').then(res => {
      if (res.errCode == 0) {
        if(res.data.mobile == null){
          this.changeMes()
        }
      }
    })
  },
  getTokenAfter(){
    if (getApp().globalData.userType == 1) {
      http('order/getEarnings', 'POST').then(res => {
        if (res.errCode == 0) {
          this.setData({
            earning: res.data.earning,
            unEarning: res.data.unEarning,
            show: true,
           
          })
        }
      })
      http('merchant/getMerchant','POST').then(res=>{
        if(res.errCode!=0){
          this.setData({
            updataMer:true,
            haveMes: false
          })
        }else{
          this.setData({
            ['merchantMes.menchantName']: res.data.menchantName,
            ['merchantMes.menchantAddr']: res.data.menchantAddr,
            ['merchantMes.mobile']: res.data.mobile,
            haveMes:true
          })
        }
      })
    } else {
      this.setData({
        show: false
      })
    }
  },
  help : function(e){
    let url = e.currentTarget.dataset.url
    console.log(url)
    getApp().globalData.skipUrl = url
    wx.navigateTo({
      title: "下载地址",
      url: '../../pages/help/help'
    })
  },
  bindMes(e){
    let name = e.currentTarget.dataset.name
    let value = e.detail.value
    let key = `merchantMes.${name}`
    console.log(key)
    this.setData({
      [key]: value.Trim()
    })
  },
  bindApplyPrice(e) {
    let name = e.currentTarget.dataset.name
    let value = e.detail.value
    let key = `applyPrice.${name}`
    this.setData({
      [key]: value.Trim()
    })
  },
  saveApplyPrice(e) {
    http('merchant/applyPrice', 'POST', this.data.applyPrice).then(res => {
      if (res.errCode == 0) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        this.setData({
          applyPriceHidden: true
      })     
      }else{
        wx.showToast({
          title: '申请失败',
          icon: 'none'
        })
      }
      })
  },
  saveMes(){
    let noNUll=true
    for (let key in this.data.merchantMes){
      console.log(key)
      if (!this.data.merchantMes[key]){
        noNUll = false
        break;
      }
    }
    if(!noNUll){
      wx.showToast({
        title: '请填写完整信息',
        icon:'none'
      })
    }else{
      http('merchant/saveMerchant', 'POST', this.data.merchantMes).then(res=>{
        if(res.errCode!=0){
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
        }else{
          this.setData({
            updataMer: true,
            haveMes: true
          })
        }
      })
    }
  },
  changeMes(){
    this.setData({
      updataMer: false,
      haveMes: true
    })
  },
  close(){
    this.setData({
      updataMer: true
    })
  },
  applyPrice() {
    this.setData({
      applyPriceHidden: false,
    })
  },
  closeApplyPrice() {
    this.setData({
      applyPriceHidden: true,
    })
  },
  wholesale() {
    wx.navigateTo({
      url: '../../pages/wholesale/wholesale'
    })
  },
  recommend() {
    wx.navigateTo({
      url: '../../pages/recommend/recommend'
    })
  },
  applyFor() {
    this.setData({
      applyReason: false,
    })
  },
  closeApply() {
    this.setData({
      applyReason: true
    })
  },
  saveReaso(e) {
    if (!this.data.reason) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
    } else {
      
      let param = { reason: this.data.reason}
      http('login/apply', 'POST', param).then(res => {
        if (res.errCode != 0) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
          this.setData({
            applyReason: true
          })
        }
      })
    }
  },
  bindReason(e) {
    let reason = e.currentTarget.dataset.reason
    let value = e.detail.value
    this.setData({
      reason: value.Trim()
    })
  },
  erWeiMa(){
    var that = this
    var merchant = getApp().globalData.merchantId;
    wx.request({
      // 获取token
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
      data: {
        appid: 'wx4ff803a9d7c7f8ff',
        secret: 'd48f8005f7ab92421b8ee9b8604dbc75'
      },
      success(res) {
        wx.request({
          // 调用接口C
          url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + res.data.access_token,
          method: 'POST',
          responseType: 'arraybuffer',
          data: {
            "path": '/pages/index/index?merchantId=' + merchant,
            "width": 280
          },
          success(res) {
            var base64 = wx.arrayBufferToBase64(res.data);
            that.sendImage(base64)
          }
        })
      }
  })
  }, 
  closeMa() {
    this.setData({
      maHidden: true
    })
  },
  sendImage(image){
    http('merchant/saveImage', 'POST', {image:image}).then(res => {
      var path ='https://filmunion.com.cn/video/image/erweima/'
      if (res.errCode == 0) {
        path = path + res.data
        this.setData({
          imgurl: path,
          maHidden: false
        })
      }
    })
  }
  
})
