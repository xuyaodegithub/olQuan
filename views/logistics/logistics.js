// views/logistics/logistics.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      linkUrl: encodeURI(app.baseUrl + '/weixin/express/toexpressvm?no=' + options.no + '&expressName=' + options.expressName)
        // /weixin/express/toexpressvm?no=75119991919220&expressName=中通速递
    })
    // console.log(this.data.linkUrl)
  },
  errTap(e){
    // console.log(e)
    // wx.showToast({ title: '请前往OL圈公众号查看', icon: 'none' })
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
  //  */
  // onShareAppMessage: function () {

  // }
})