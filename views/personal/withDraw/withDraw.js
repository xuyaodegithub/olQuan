// views/personal/withDraw/withDraw.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    memberList:[],
    moreMoney:false,
    poundage:'',
    accountMoney:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getMember)
  },
  //进入加载
  getMember() {
    let _self = this
    let banners = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          memberList: res.data.result,
        })
      }
    }
    common.methods.mothod1(banners)
  },
  //点击全部提现
  getAllMoney(){
    this.setData({
      inputValue: this.data.memberList.amount
    })
  },
  //确认提现
  sureGetAllMoney(){
    if (this.data.inputValue == ''){
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000
      })
      return 
    } else if (this.data.inputValue<200){
      wx.showToast({
        title: '最低提现金额为200元',
        icon: 'none',
        duration: 2000
      })
      return 
    } else if (this.data.inputValue > this.data.memberList.amount){
      wx.showToast({
        title: '余额不足',
        icon: 'none',
        duration: 2000,
        moreMoney:false,
      })
      return 
    }
  },
  //点击余额明细
  lookMoney(){
    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=1&number=' + this.data.memberList.amount,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //提现记录
  presentRecrdList(){
    wx: wx.navigateTo({
      url: '../presentRecord/presentRecord',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //input正则
  bindKeyInput(e){
   
    let valueNum = e.detail.value;
    //清除"数字"和"."以外的字符
    valueNum = valueNum.replace(/[^\d.]/g, "");

    //验证第一个字符是数字而不是
    valueNum = valueNum.replace(/^\./g, "");

    //只保留第一个. 清除多余的
    // console.log(this.addObj.totalFee)

    valueNum = valueNum.replace(/\.{2,}/g, ".");
    valueNum = valueNum.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    //只能输入两个小数
    valueNum = valueNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (valueNum >= 200) {
      this.setData({
        moreMoney: true,
        poundage: (valueNum*0.01).toFixed(2),
        accountMoney: (valueNum - valueNum*0.01).toFixed(2),
      })
    } else {
      this.setData({
        moreMoney: false
      })
    }
    this.setData({
      inputValue: valueNum
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