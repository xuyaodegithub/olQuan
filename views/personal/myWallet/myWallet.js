// views/personal/myWallet/myWallet.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getMember)
  },
  //进入加载
  getMember(){
    let _self = this
    let banners = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          memberList: res.data.result,
        })
      }
    }
    common.methods.mothod1(banners)
  },
  //点击我的银行卡
  accountCountDetail(){
    wx: wx.navigateTo({
      url: '../bankCard/bankCard',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击体现
  withDraw(){
    wx: wx.navigateTo({
      url: '../withDraw/withDraw',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击账号余额
  getAmount(e){
    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=1&number=' + e.currentTarget.dataset.number,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击待定余额
  getWaitAmount(e) {
    
    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=5&number=' + e.currentTarget.dataset.number,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击小金库
  getCoffers(e) {
    
    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=3&number=' + e.currentTarget.dataset.number,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击金豆
  getGoldBean(e) {
    
    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=6&number=' + e.currentTarget.dataset.number,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击待定金豆
  getWaitGoldBean(e) {
    
    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=7&number=' + e.currentTarget.dataset.number,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击可用积分
  getScore() {
   
    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=2&isScore=1',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击可用积分
  getWaitScore() {

    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=4&isScore=1',
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
  onShareAppMessage: function () {

  }
})