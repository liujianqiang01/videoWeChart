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
    applyPriceHidden : true
  },
  onShow: function () {
    this.setData({
      showPay : getApp().globalData.showPay
    })
    if (getApp().globalData.token && getApp().globalData.sessionId) {
      this.getTokenAfter()
    }else{
      getApp().getTokenAfter = this.getList
    }
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
  help : function(){
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
  }
})
