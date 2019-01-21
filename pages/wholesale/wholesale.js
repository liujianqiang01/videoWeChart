// pages/wholesale/wholesale.js
var app = getApp()
import http from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numberArray: [0,0,0],
    disabled1Array: [false, false, false],
    disabled2Array: [false, false, false],
    clickTime : 0,
    totalPrice:0,
    priceList:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onReachBottom();
    this.getList();
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

  },
  getList() {
    http('getVipType', 'POST').then(res => {
      if (res.errCode == 0) {
        this.setData({
          list: res.data,
          showPay: getApp().globalData.showPay
        })
      }
    })
  },
  addNum(e) {
    var id = e.currentTarget.dataset.id;
    var number = this.data.numberArray[id];
    var numberName = 'numberArray['+id+']';
    var disabled1Name = 'disabled1Array[' + id + ']';
    var disabled2Name = 'disabled2Array[' + id + ']';
    this.setData({
      [numberName]: this.data.numberArray[id] >= 10000 ? 10000 : number + 100,
        [disabled1Name]: this.data.numberArray[id] >= 0 ? false : true,
      [disabled2Name]: this.data.numberArray[id] >= 10000 ? true : false,
      clickTime: this.data.clickTime + 1
    });
    this.getCountPrice(this.data.clickTime,e);
  },
  subNum(e) {
    var id = e.currentTarget.dataset.id;
    var number = this.data.numberArray[id];
    var numberName = 'numberArray[' + id + ']';
    var disabled1Name = 'disabled1Array[' + id + ']';
    var disabled2Name = 'disabled2Array[' + id + ']';
    this.setData({
      [numberName]: this.data.numberArray[id] <= 0 ? 0 : number - 100,
      [disabled1Name]: this.data.numberArray[id] <= 0 ? true : false,
      [disabled2Name]: this.data.numberArray[id] <= 10000 ? false : true,
      clickTime: this.data.clickTime + 1,
    });
    this.getCountPrice(this.data.clickTime,e);
  }, 
  getCountPrice(clickTime,e) {
    var that = this;
    setTimeout(function(){
      var last = that.data.clickTime;
      let params = {
        numbers:that.data.numberArray
      }
      if (last == clickTime){
        http('wholesalePrice/getTotalPrice', 'POST',params).then(res => {
          if (res.errCode == 0) {
            that.setData({
              totalPrice :res.data.totalPrice,
              priceList : res.data.list
            })
          }
        })
      }
    }, 1000);
  }
})