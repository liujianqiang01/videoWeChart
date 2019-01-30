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
    priceList:null,
    totalNumber:[0,0,0],
    saleNumber: [0, 0, 0],
    surplusNumber: [0, 0, 0],
    wholesalePrice: [0, 0, 0],
    salePrice: [0, 0, 0],
    excelType:0,
    excelhidden:true,
    excelnumber: 0
  
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
  getList() {
    http('getMVipType', 'POST').then(res => {
      if (res.errCode == 0) {
        console.log(res)
        this.setData({
          list: res.data.tVipPrices,
          totalNumber: res.data.totalNumber,
          saleNumber: res.data.saleNumber,
          surplusNumber: res.data.surplusNumber,
          wholesalePrice: res.data.wholesalePrice,
          salePrice: res.data.salePrice,
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
      [numberName]: this.data.numberArray[id] >= 10000 ? 10000 : number + 50,
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
      [numberName]: this.data.numberArray[id] <= 0 ? 0 : number - 50,
      [disabled1Name]: this.data.numberArray[id] <= 0 ? true : false,
      [disabled2Name]: this.data.numberArray[id] <= 10000 ? false : true,
      clickTime: this.data.clickTime + 1,
    });
    this.getCountPrice(this.data.clickTime,e);
  }, 
  getCountPrice(clickTime,e) {
    var t = 0;
    for (var i in this.data.numberArray) {
      t = t + this.data.numberArray[i]
    }
    if (t <= 0) {
      return;
    }
    var that = this;
    setTimeout(function(){
      var last = that.data.clickTime;
      let params = {
        numbers:that.data.numberArray
      }
      if (last == clickTime){
        http('wholesalePrice/getTotalPrice', 'POST',params).then(res => {
          if (res.errCode == 0) {
            //检查库存
            var number_tem =[0,0,0];
            for (var index in number_tem) {
              var eques = true;
              for (var list in res.data.list) {
                var vipType = (res.data.list[list].vipType - 1);
                if (index == [vipType] ){
                    number_tem[index] = res.data.list[index].number;
                }
                if (number_tem[index] == that.data.numberArray[index]) {
                  eques = false;
                }
              }           
              if (eques){
                wx.showToast({
                  title:"库存不足"
                })
                return;
              }
            }
            
            that.setData({
              totalPrice :res.data.totalPrice,
              priceList : res.data.list
            })
          }
        })
      }
    }, 1000);
  },
  goWholesale(){
    var t = 0;
    for (var i in this.data.numberArray) {
      t = t + this.data.numberArray[i]
    }
    if (t <= 0) {
      wx.showToast({
        title: "请输入数量",
        icon: 'none'
      })
      return;
    }
    var that = this;
    let params = {
      number: that.data.numberArray,
      totalPrice: that.data.totalPrice
    }
      http('wholesaleOrder/subOrder', 'POST', params).then(res => {
        if (res.errCode == 0) {
          console.log(res.data.data)
          this.getPayForm(JSON.parse(res.data.data).prepayId)
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
  getPayForm(prepayId) {
    http('getPayForm', "POST", { prepayId: prepayId }).then(res => {
      if (res.errCode == 0) {
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
  excel(e){
    var vipType = e.currentTarget.dataset.id;
    this.setData({
      excelType: vipType,
      excelhidden:false,
      excelnumber: 0
    })
  },
  closeExcel(){
    this.setData({
      excelhidden: true
    })
  }, 
  excelnumber(e) {
    console.log(e.detail.value);
    this.setData({
      excelnumber: e.detail.value
    })
  },
  excelDownload(){
    var vipType = this.data.excelType;
    var number = this.data.excelnumber;
    if (number <= 0){
      wx.showToast({
        title: "请输入数量",
         icon: 'none'
      })
      return;
    }
    var baseUrl = 'https://filmunion.com.cn/video/wholesaleOrder/excelDownload';
   //var baseUrl = 'http://localhost:8080/wholesaleOrder/excelDownload';
    var data = '?vipType=' + vipType + '&number=' + number;
    wx.downloadFile({
      url: baseUrl+data,
      header: {
        Cookie: getApp() ? 'JSESSIONID=' + getApp().globalData.sessionId : "",
        token: getApp() ? getApp().globalData.token : ""
      },
      success: function (res) {
        if (res.statusCode == 200){
          var filePath = res.tempFilePath;
          var savedFilePath ="";
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function (result) {
              savedFilePath = result.savedFilePath
              console.log(savedFilePath)
              wx.openDocument({
                filePath: savedFilePath,
                fileType: 'xlsx',
                success: function (res) {
                  console.log('打开文档成功')
                },
                fail: function (res) {
                  console.log(res);
                },
                complete: function (res) {
                  console.log(res);
                }
              })
            }
          })
          
         
        }else{
          wx.showToast({
            title: '请先采购',
            icon: 'none'
          })
        }
      },
  
      fail: function (res) {
        console.log('文件下载失败');
      },
      complete: function (res) { },
    })
  }
})