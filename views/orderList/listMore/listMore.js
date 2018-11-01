// views/orderList/listMore/listMore.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id,
    })
    common.methods.getLoginMess(this.getOrderList)
  },
  getOrderList(){
    let _self = this;
    let banners = {
      url: '/mobile/order/orderDetail',
      data: {
        orderId: this.data.orderId,
      },
      callback: function (res) {
        _self.setData({
          orderList: res.data.result,
          orderMobile: res.data.result.mobile.substr(0, 3) + '****' + res.data.result.mobile.substr(res.data.result.mobile.length - 4)
        })
        
      }
    }
    common.methods.mothod1(banners)
  },
  /**
   * 一键复制
   */
  copyBtn: function (e) {
    let that = this;
    wx.setClipboardData({
      data: that.data.orderList.orderNo,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
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
    wx.stopPullDownRefresh()
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