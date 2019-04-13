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
  closeMa() {
    this.setData({
      maHidden: true
    })
  },
  erWeiMa(){
    http('merchant/saveImage', 'POST').then(res => {
      var path ='https://filmunion.com.cn/video/image/erweima/'
      if (res.errCode == 0) {
        path = path + res.data
        this.saveImage(path)
        this.setData({
          imgurl: path,
          maHidden: false
        })
      }
    })
  },
  saveImage(imgSrc){
  wx.downloadFile({
    url: imgSrc,
    success: function (res) {
      console.log(res);
      //图片保存到本地
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function (data) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (err) {
          console.log(err);
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            console.log("当初用户拒绝，再次发起授权")
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                } else {
                  console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                }
              }
            })
          }
        },
        complete(res) {
          console.log(res);
        }
      })
    }
  })
  }
})
