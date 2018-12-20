// views/personal/listSNRC/listSNRC.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topList:['金豆兑换SNRC','SNRC兑换金豆'],
    speListAgree:0,
    page:1,
    listDetail:[],
    isMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getFrist, this)
  },
  getFrist(isMoreSure){
    let _self = this;
    let banners = {
      url: '/mobile/moca/exchangeRecords',
      data: {
        memberId: app.userId,
        type: this.data.speListAgree+1,
        page:this.data.page,
        rows:10
      },
      callback: function (res) {
        if (res.data.code == 0) {
          if (res.data.result.length < 10) {
            _self.setData({
              isMore: false,
            })
          }
          if (isMoreSure==2){
            _self.setData({
              listDetail: _self.data.listDetail.concat(res.data.result),
            })
          }else{
            _self.setData({
              listDetail: res.data.result,
            })
          }
          
          
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }

      }
    }
    common.methods.mothod4(banners)
  },
  changeType(e){
    this.setData({
      speListAgree: e.currentTarget.dataset.key,
      isMore:true,
      page:1
    })
    this.getFrist();
  },
  changeSnrc(){
    wx.navigateTo({
      url: '/views/personal/changeSnrc/changeSnrc',
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
    let _self = this
    // wx.startPullDownRefresh()
    wx.showNavigationBarLoading()
    this.setData({
      isMore:true,
      page:1,
    })
    this.getFrist();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(1)
    if (this.data.isMore) {
      this.setData({
        page: this.data.page + 1
      })
      this.getFrist(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})