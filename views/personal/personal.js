// views/personal/personal.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showXufei:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.firstGoin)
    //this.firstGoin()
  },
  //点击全部订单
  getAllList(){
    wx: wx.navigateTo({
      url: '../orderList/orderList?status=0',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击待付款订单
  getDaifuList() {
    wx: wx.navigateTo({
      url: '../orderList/orderList?status=1',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击待付款订单
  getDaiSongList() {
    wx: wx.navigateTo({
      url: '../orderList/orderList?status=2',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击待付款订单
  getDaiShouList() {
    wx: wx.navigateTo({
      url: '../orderList/orderList?status=3',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiPingList() {
    wx: wx.navigateTo({
      url: '../orderList/orderList?status=4',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiTuiList() {
    wx: wx.navigateTo({
      url: '../orderList/orderList?status=5',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
    //首次进入
    firstGoin(){
      let _self = this
      let banners = {
        url: '/mobile/member/getMember',
        data: {
          memberId: app.userId
        },
        callback: function (res) {
          _self.setData({
            personalList: res.data.result,
            time: res.data.result.validTime.split("至")[1]
          })
          if (res.data.result.isShowRenewButton != 0){
            _self.setData({
              showXufei:true,
            })
          }
        }
      }
      let obj = {
        url: '/mobile/order/orderCount',
        data: {
          memberId: app.userId
        },
        callback: function (res) {
          _self.setData({
            orderCount: res.data.result
          })
        }
      }
      common.methods.mothod1(banners)
      common.methods.mothod1(obj)
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
