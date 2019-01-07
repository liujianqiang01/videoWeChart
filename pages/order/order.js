// pages/order/order.js
import http from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    pageNum:1,
    getAll:false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onReachBottom()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.getAll){
      return;
    }
    this.setData({
      getAll: true
    })
    let params = {
      pageNum: this.data.pageNum,
      pageSize:10
    }
    http('getOrder', 'POST',params).then(res => {
      console.log(res)
      if (res.errCode == 0 && res.data.list) {
        this.setData({
          orderList: this.data.orderList.concat(res.data.list),
          pageNum:this.data.pageNum+1
        })
        if (res.data.list.length==10){
          this.setData({
            getAll:false
          })
        }
      }
    }).catch(()=>{
      this.setData({
        getAll: false
      })
    })
  },
  goPay(e){
    let prepayId = e.currentTarget.dataset.prepayid
    http('getPayForm', "POST", { repay_id: prepayId }).then(res => {
      if (res.errCode == 0) {
        let data = JSON.parse(res.data)
        console.log(data.timeStamp)
        console.log(data.nonceStr)
        console.log(data.package)
        console.log(data.signType)
        console.log(data.paySign)

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
  } 
})