// views/personal/myCoupon/myCoupon.js
var common = require("../../../utils/common.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtm:['未使用','已使用','已过期'],
    status:0,
    page:1,
    couponList:[],
    isMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getMycoupon, this)
  },
  getMycoupon(isMoreSure){
    let _self = this
    let banners = {
      url: '/mobile/coupon/myCoupons',
      data: {
        memberId: app.userId,
        page:this.data.page,
        rows:10,
        status: this.data.status+1
      },
      callback: function (res) {
        if (res.data.result.data.length<10){
          _self.setData({
            isMore: false,
          })
        }
        if(isMoreSure===2){
          _self.setData({
            couponList: _self.data.couponList.concat(res.data.result.data),
          })
        }else{
          
          _self.setData({
            couponList: res.data.result.data,
          })
        }
        

      }
    }
    common.methods.mothod1(banners)
  },
  changeType(e){
    this.setData({
      status: e.currentTarget.dataset.key,
      isMore:true,
      page:1
    })
    this.getMycoupon();
    console.log(this.data.status)
  },
  //点击立即使用
  getDetailGood(e){
    //  console.log(e.currentTarget.dataset)
    if(this.data.status==0){
      wx: wx.navigateTo({
        url: '../../detial/detial?id=' + e.currentTarget.dataset.productid + '&type=' + e.currentTarget.dataset.producttype,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
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
    if(this.data.isMore){
      this.setData({
        page: this.data.page + 1
      })
      this.getMycoupon(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})