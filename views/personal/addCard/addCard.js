// views/personal/addCard/addCard.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    region: [],
    bankLisr: ["请选择开户银行","中国人民银行","中国工商银行","中国农业银行","中国建设银行","中国招商银行","中国银行","上海浦发银行","广发银行","民生银行","平安银行","光大银行","兴业银行","中信银行","上海银行","宁波银行","交通银行","深圳发展银行","中国邮政储蓄银行"],
    index:0,
    type:2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getCityList)
  },
  //进入加载
  getCityList() {
    let _self = this
    let banners = {
      url: '/mobile/city/getProvinces',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          multiArray: res.data.result,
        })
      }
    }
    common.methods.mothod1(banners)
  },
  changeTypeTwo(){
    this.setData({
      type: 2
    })
  },
  changeTypeNoe() {
    this.setData({
      type: 1
    })
  },
  bindRegionChange: function (e) {
    console.log(this.data.region.length)
    this.setData({
      region: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
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