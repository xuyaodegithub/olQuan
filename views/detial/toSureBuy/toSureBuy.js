// views/detial/toSureBuy/toSureBuy.js
var common = require('../../../utils/common.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    OrderList:'',
    phoneNum:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList()
  },
//确认订单信息
  getOrderList(){
    let _self=this
    let callBackMess = wx.getStorageSync('productMess')
    let data={
      url:'/mobile/order/buyNowConfirmOrder',
      data:{
        productId: callBackMess.productId,
        num: callBackMess.num,
        memberId: app.userId,
        uutype: app.uutype,
        type: callBackMess.type
        },
        callback:function(res){
          let arr = res.data.result
          if (arr.receiveAddress.mobile){
            let arrnum = arr.receiveAddress.mobile.split('')
            arrnum.splice(3, 4, '****')
            arr.receiveAddress.mobile = arrnum.join('')
            console.log(arr.mobile)
          }
          if (arr.sellers[0].productDetails[0].normal){
            let normalArr = arr.sellers[0].productDetails[0].normal.split(' ')
            arr.sellers[0].productDetails[0].normal = normalArr
          }
          _self.setData({
            OrderList: arr
          })
        }
    }
    if (callBackMess.normalId){
      data.data.normalId = callBackMess.normalId
    }
    common.methods.mothod1(data)
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