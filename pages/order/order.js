// pages/order/order.js
import http from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[]
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    http('getOrder', 'POST').then(res => {
      console.log(res)
      if(res.errCode==0){
        this.setData({
          orderList: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})