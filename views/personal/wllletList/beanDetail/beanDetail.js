// views/personal/wllletList/beanDetail/beanDetail.js
var common = require("../../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentRecordId:'',
    day:'',//送多少天
    dayamount:'',//每天送多少
    pushday:'',//已送多少天
    isMoreNone:true,
    page:1,
    amountList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      parentRecordId: options.id,
      day: options.day,
      dayamount: options.dayamount,
      pushday: options.pushday
    })
    this.getAmountDetail();
  },
  //获取钱包明细
  getAmountDetail(isMore) {
    let _self = this
    let banners = {
      url: '/mobile/member/amountDetail',
      data: {
        memberId: app.userId,
        type: 8,
        page: _self.data.page,
        rows: 10,
        parentRecordId: _self.data.parentRecordId
      },
      callback: function (res) {
        if (res.data.code == 0) {
          if (res.data.result.length < 10) {
            _self.setData({
              isMoreNone: false
            })
          }
          if (isMore === 2) {
            _self.setData({
              amountList: _self.data.amountList.concat(res.data.result)
            })
          } else {
            _self.setData({
              amountList: res.data.result,
            })
          }
          console.log(_self.data.amountList)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isMoreNone) {
      this.setData({
        page: this.data.page + 1
      })
      this.getAmountDetail(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})