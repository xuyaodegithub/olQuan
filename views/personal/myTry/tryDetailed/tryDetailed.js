// views/personal/myTry/tryDetailed/tryDetailed.js
var common = require("../../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frequency:'',
    isMoreNone:true,
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      frequency:options.id
    })
    this.getFirst();
  },
  getFirst(isMore) {
    let _self = this;
    let banners = {
      url: '/mobile/freeUse/memberFreeUseRecord',
      data: {
        memberId: app.userId,
        page: _self.data.page,
        rows:20,
      },
      callback: function (res) {
        if (res.data.result.length <20) {
          _self.setData({
            isMoreNone: false
          })
        }
        if (isMore === 2) {
          _self.setData({
            orderList: _self.data.orderList.concat(res.data.result)
          })
        } else {
          _self.setData({
            orderList: res.data.result
          })
        }
        
      }
    }
    common.methods.mothod1(banners)
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
    if (this.data.isMoreNone){
      this.setData({
        page: this.data.page + 1
      })
      this.getFirst(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})