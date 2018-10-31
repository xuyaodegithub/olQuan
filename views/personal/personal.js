// views/personal/personal.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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