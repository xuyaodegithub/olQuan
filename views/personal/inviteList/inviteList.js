// views/personal/inviteList/inviteList.js
var common = require("../../../utils/common.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['全部', '申请中', '已同意', '已拒绝'],
    status:'',
    memList:[],
    inviteList:[],
    page:1,
    speListAgree:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getApplyList();
  },
  getApplyList(isMoreSure){
    this.setData({
      memList: app.memberData,
    })
    let _self = this
    let banners = {
      url: '/mobile/memberInvite/inviteRecords',
      data: {
        memberId: app.userId,
        page: this.data.page,
        rows: 10,
        status: _self.data.status
      },
      callback: function (res) {
        if (res.data.result.length < 10) {
          _self.setData({
            isMore: false,
          })
        }
        if (isMoreSure === 2) {
          _self.setData({
            inviteList: _self.data.inviteList.concat(res.data.result),
          })
        } else {

          _self.setData({
            inviteList: res.data.result,
          })
        }


      }
    }
    common.methods.mothod1(banners)
  },
  changeType(e){
    let statusStr
    statusStr = e.currentTarget.dataset.key - 1;
    if (statusStr<0){
      statusStr=''
    }
    this.setData({
      status: statusStr,
      speListAgree: e.currentTarget.dataset.key,
      isMore: true,
      page: 1
    })
    this.getApplyList();
    console.log(this.data.status)
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
    if (this.data.isMore) {
      this.setData({
        page: this.data.page + 1
      })
      this.getApplyList(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})