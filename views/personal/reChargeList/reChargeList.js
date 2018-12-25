// views/personal/reChargeList/reChargeList.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listObj:[],
    page:1,
    isMoreNone:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getFirst, this, options)
  },
  getFirst(isMoreList){
    let _self = this;
    let banners = {
      url: '/mobile/amountRecharge/rechargeRecord',
      data: {
        memberId: app.userId,
        page:_self.data.page,
        rows:20
      },
      callback: function (res) {
        if (res.data.result.length < 20){
          _self.setData({
            isMoreNone: false
          })
        }
        if (isMoreList==2){
          _self.setData({
            listObj: _self.data.listObj.concat(res.data.result)
          })
        }else{
          _self.setData({
            listObj: res.data.result
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
      this.getFirst(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
 
})