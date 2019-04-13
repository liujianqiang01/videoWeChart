// componeten/nav/nav.js
import http from '../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  }, 
  attached(){
    let route = getCurrentPages()[getCurrentPages().length - 1].route
    this.setData({
      route: route,
    })
    this.getUtil()
  },
  /**
   * 组件的初始数据
   */
  data: {
    alearGetUserMes:false,
    showPay: true,
    route:'pages/index/index'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goHome(e){
      const route = getCurrentPages()[getCurrentPages().length - 1].route
      if (route != 'pages/index/index') {
        wx.redirectTo({
          url: '../../pages/index/index'
        })
      }
    },
    goOrder(e){
      let res = e.detail
      if (getApp().globalData.alearGetUserMes == true) {
        wx.navigateTo({
          url: '../../pages/order/order'
        })
        return
      }
      let params = JSON.parse(res.rawData)
      getApp().globalData.alearGetUserMes = true
      http('login/login', 'POST', params).then(res => {
        wx.navigateTo({
          url: '../../pages/order/order'
        })
      })
    },
    goMy(e){
      let res = e.detail
      if (getApp().globalData.alearGetUserMes == true) {
        const route = getCurrentPages()[getCurrentPages().length - 1].route
        if (route != 'pages/my/my') {
          wx.redirectTo({
            url: '../../pages/my/my'
          })
        }
        return
      }
      let params = JSON.parse(res.rawData)
      getApp().globalData.alearGetUserMes = true
      http('login/login', 'POST', params).then(res => {
        const route = getCurrentPages()[getCurrentPages().length - 1].route
        if (route != 'pages/my/my') {
          wx.redirectTo({
            url: '../../pages/my/my'
          })
        }
      })
    },
    //上传用户信息
    upUserMes(e) {
      
    },
    getUtil() {
      var that = this;
      http('login/util', 'POST').then(res => {
        if (res.errCode == 0) {
          that.setData({
            showPay: res.data.showPay
          })
        }
      })
    }
  }
})
