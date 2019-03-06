// views/personal/boundMobile/boundMobile.js
var common = require("../../../utils/common.js");
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAlert: false,
    txma: '',
    phone: '',
    isDisabled: true,
    currentTime: 60,
    time: '',
    code: '',
    isPassWord:true,
    payPassWord:'',
    phoneStr:'',
    updataType:'',
    placehold:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      phoneStr: options.phone.substr(0, 3) + "****" + options.phone.substr(7),
      updataType: options.type ? options.type : '',
      placehold: options.type == 'login' ? '输入登录密码，至少6位' : '输入支付密码'
    })
  },
  getWxGraphCode() {
    this.getTXma();
    this.setData({
      isAlert: true,
    })
  },
  closeAlert() {
    this.setData({
      isAlert: false
    })
  },
  getCode() {
    var that = this;
    var interval
    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + 's后重新发送'
    })
    interval = setInterval(function () {
      that.setData({
        time: (currentTime - 1) + 's后重新发送'
      })
      currentTime--;
      if (currentTime <= 0) {
        console.log(currentTime)
        clearInterval(interval)
        that.setData({
          currentTime: 60,
          isDisabled: true
        })
      }
    }, 1000)
  },
  //input事件
  changeValue(e) {
    this.setData({
      txma: e.detail.value
    })
    if (e.detail.value.toString().length == 4) {
      this.setData({
        btnActive: true
      })
    }

  },
  //输入支付密码
  getPayPassword(e){
    this.setData({
      payPassWord: e.detail.value
    })
  },
  //是否可见支付密码
  changeType(){
    this.setData({
      isPassWord: !this.data.isPassWord
    })
  },
  //获取图形码
  getTXma() {
    let _self = this
    let data = {
      callback: function (res) {
        let base64 = wx.arrayBufferToBase64(res.data);
        _self.setData({
          TXmaimg: "data:image/png;base64," + base64,
        })
      }
    }
    common.methods.getGraphCode(data)
  },
  tosure() {
    if (this.data.txma) {
      this.sendPhone()
    } else {
      wx.showToast({ title: '请先填写验证码', icon: 'none' })
    }
  },
  //发送验证码
  sendPhone() {
    let _self = this
    let data = {
      url: '/mobile/code/sendCode2',
      data: {
        memberId: app.userId,
        mobile: this.data.phone,
        graphCode: this.data.txma
      },
      callback: function (res) {
        wx.showToast({ title: '发送成功', icon: 'none' })
        _self.setData({
          isAlert: false,
          isDisabled: false,
        })
        _self.getCode();
      }
    }
    common.methods.mothod1(data)
  },
  getCodeDetail(e) {
    this.setData({
      code: e.detail.value
    })
  },
  doNext() {
    if (this.data.code === '') {
      wx.showToast({ title: '请输入验证码', icon: 'none' })
      return;
    }
    if (this.data.payPassWord==''){
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return;
    }
    if (this.data.updataType == 'login' && this.data.payPassWord.length<6){
      wx.showToast({ title: '登录密码长度不可小于6位', icon: 'none' })
      return;
    }
    let _self = this
    let payPasswordStr = utilMd5.hexMD5(_self.data.payPassWord)
    // console.log(_self.data.payPassWord)
    let data = {
      url: this.data.updataType == 'login' ? '/mobile/member/updatePassword' : '/mobile/member/updatePayPassword',
      data: {
        memberId: app.userId,
        code: _self.data.code,
        // payPassword: payPasswordStr
      },
      callback: function (res) {
        wx.showToast({ title: '修改成功', icon: 'none' })
        wx.redirectTo({
          url: '/views/personal/mySet/mySet',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        
      }
    }
    if (this.data.updataType == 'login'){
      data.data.newPassword = payPasswordStr
    }else{
      data.data.payPassword = payPasswordStr
    }
    common.methods.mothod1(data)
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

})