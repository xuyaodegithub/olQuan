// trypage/trypage.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    advers:[],
    classNum:2,
    classBtn: [
      { title: '精品试用', imgChose: '../../image/jingpinChoose.png', imgNoChose: '../../image/jingpinNo.png'},      { title: '|', imgChose: '', imgNoChose: '' },
      { title: '付邮试用', imgChose: '../../image/youPay.png', imgNoChose: '../../image/youNoPay.png'},              { title: '|', imgChose: '', imgNoChose: '' },
      { title: '整点抢试', imgChose: '../../image/chooseClock.png', imgNoChose:'../../image/noChooseClock.png'}
      ],
    isGetStoreCommission:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getAdvers)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //轮播
  getAdvers(){
    let _self = this
    console.log(app.isGetStoreCommission)
    this.setData({
      isGetStoreCommission: app.isGetStoreCommission
    })
    let banners = {
      url: '/mobile/plus/advers',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          banners: res.data.result.banners,
          advers: res.data.result.advers
        })
      }
    }
    common.methods.mothod1(banners)
  },
  changeClass(e){
    console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index === 1 || e.currentTarget.dataset.index ===3){
      return
    }
    this.setData({
      classNum: e.currentTarget.dataset.index
    })
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