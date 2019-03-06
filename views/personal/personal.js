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
    
    //this.firstGoin()
  },
  //点击全部订单
  getAllList(){
    wx.navigateTo({
      url: '../orderList/orderList?status=0',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击待付款订单
  getDaifuList() {
    wx.navigateTo({
      url: '../orderList/orderList?status=1',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击待送订单
  getDaiSongList() {
    wx.navigateTo({
      url: '../orderList/orderList?status=2',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击待付款订单
  getDaiShouList() {
    wx.navigateTo({
      url: '../orderList/orderList?status=3',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击我的钱包
  getMyWallet(){
    wx.navigateTo({
      url: './myWallet/myWallet',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击我的优惠券
  getMycoupon(){
    wx.navigateTo({
      url: './myCoupon/myCoupon',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击邀请店主
  invitePink(){
    wx.navigateTo({
      url: './invitePink/invitePink',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击我的发现
  getMyFind(){
    wx.navigateTo({
      url: '../myFind/myFind',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击设置
  getMySet(){
    wx.navigateTo({
      url: './mySet/mySet',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击我的收藏
  getMycollect(){
    wx.navigateTo({
      url: './myCollect/myCollect',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiPingList() {
    wx.navigateTo({
      url: '../orderList/orderList?status=4',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiTuiList() {
    wx.navigateTo({
      url: '../orderList/orderList?status=5',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  inviteSuper(){
    wx.navigateTo({
      url: './inviteSuper/inviteSuper',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getPerson(){
    wx.navigateTo({
      url: './webView/webView?id=' + app.userId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //我的客户
  getCounstom(){
    wx.navigateTo({
      url: './myCustom/myCustom',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //报表中心
  amountRecord(){
    wx.navigateTo({
      url: './amountRecord/amountRecord?memberId=' + app.userId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getInviteList(){
    wx.navigateTo({
      url: './inviteList/inviteList',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //粉领续费
  renewPink(){
    wx.navigateTo({
      url: './renewPink/renewPink',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //我的试用
  getMyTry(){
    wx.navigateTo({
      url: './myTry/myTry',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //帮助中心
  getHelp(){
    wx: wx.navigateTo({
      url: './helpCent/helpCent',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //合伙人
  getPartent(){
    wx: wx.navigateTo({
      url: './partner/partner',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //推广海报
  getHaiBao(){
    wx.navigateTo({ url: '/views/goldBeanPage/putHaibao/putHaibao'})
  },
    //首次进入
    firstGoin(){
      let _self = this;
      // this.setData({
      //   personalList: app.memberData,
      //   time: app.memberData.validTime.split("至")[1]
      // })
      // if (app.memberData.isShowRenewButton!=0){
      //   _self.setData({
      //     showXufei: true,
      //   })
      // }
      let banners = {
        url: '/mobile/member/getMember',
        data: {
          memberId: app.userId
        },
        callback: function (res) {
          app.memberData = res.data.result
          _self.setData({
            personalList: res.data.result,
            time: res.data.result.validTime.split("至")[1] ? res.data.result.validTime.split("至")[1] : ''
          })
          if (res.data.result.isShowRenewButton != 0){
            _self.setData({
              showXufei:true,
            })
          }else{
            _self.setData({
              showXufei: false,
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
    common.methods.getLoginMess(this.firstGoin, this)
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
    this.firstGoin();
    wx.hideNavigationBarLoading()
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
