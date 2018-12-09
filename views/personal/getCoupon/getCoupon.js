// views/personal/getCoupon/getCoupon.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityId: options.id
    })
    common.methods.getLoginMess(this.getCouponDetail, this);
    
  },
  //获取优惠券活动详情
  getCouponDetail(){
    let _self = this
    let banners = {
      url: '/mobile/coupon/getActivityInfo',
      data: {
        memberId: app.userId,
        activityId:_self.data.activityId
      },
      callback: function (res) {
        _self.setData({
          couponList: res.data.result,
        })
        wx.setNavigationBarTitle({
          title: res.data.result.name
        })
      }
    }
    common.methods.mothod1(banners)
  },
  getCoupon(e){
    let _self = this
    let data = {
      url: '/mobile/coupon/receiveCoupon',
      data: {
        memberId: app.userId,
        couponId: e.currentTarget.dataset.id
      },
      callback: function (res) {
        wx.showToast({ title: '领取成功!', icon: 'none' })
        let couponData = _self.data.couponList
        if (couponData.dtos[e.currentTarget.dataset.index].isCanUse === 1) {
          couponData.dtos[e.currentTarget.dataset.index].receivedStatus = 3
        } else {
          couponData.dtos[e.currentTarget.dataset.index].receivedStatus = 2
        }
        couponData.dtos[e.currentTarget.dataset.index].vaildNum--
        _self.setData({
          couponList: couponData
        })
      }
    }
    common.methods.mothod1(data) 
    
  },
  //跳转商品详情
  getGoodsDetail(e){
    wx: wx.navigateTo({
      url: '../../detial/detial?id=' + e.currentTarget.dataset.productid + '&type=' + e.currentTarget.dataset.producttype,
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
    return {
      title: this.data.couponList.shareTitle,
      desc: this.data.couponList.shareDescription,
      imageUrl: this.data.couponList.shareIcon,
      path: '/views/personal/getCoupon/getCoupon',//当前页面 path ，必须是以 / 开头的完整路径
      success: function (res) {
        //成功
        console.log(999)
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  }
})