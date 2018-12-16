// views/personal/myTry/myTry.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
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
    common.methods.getLoginMess(this.getFirst, this);
  },
  getFirst() {
    this.setData({
      memList: app.memberData
    })
    let _self = this;
    let banners = {
      url: '/mobile/member/freeUseCore',
      data: {
        memberId: app.userId,
      },
      callback: function (res) {
        _self.setData({
          orderDetail: res.data.result
        })
      }
    }
    common.methods.mothod1(banners)
  },
  getTryList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=0',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaifuList() {
    wx: wx.navigateTo({
      url: './tryList/tryList?status=1',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiSongList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=2',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiShouList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=3',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiPingList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=4',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiTuiList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=5',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getExplain(){
    wx: wx.navigateTo({
      url: '/views/personal/myTry/tryExplain/tryExplain',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDetailed(){
    wx: wx.navigateTo({
      url: '/views/personal/myTry/tryDetailed/tryDetailed?id=' + this.data.memList.subFreeUseCount,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getTryShow(){
    wx: wx.navigateTo({
      url: '/views/personal/myTry/tryShow/tryShow',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
 
})