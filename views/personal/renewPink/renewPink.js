// views/personal/renewPink/renewPink.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amountFeeShow:false,
    coffersFeeShow:false,
    payPasswordShow:false,
    doubleClick: true,
    payPassword:'',
    doubleClick: true,
    isDouble:true,
    isShowPass:false,
    pledgeMethod:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getFirst, this);
  },
  getFirst() {
    this.setData({
      memList: app.memberData
    })
    let _self = this;
    let banners = {
      url: '/mobile/store/renewConfirmOrder',
      data: {
        memberId: app.userId,
      },
      callback: function (res) {
        _self.setData({
          memberList: res.data.result
        })
      }
    }
    common.methods.mothod1(banners)
  },
  //点击余额
  inputAmount(){
    this.setData({
      amountFeeShow: !this.data.amountFeeShow,
      coffersFeeShow: false,
    })
    
  },
  //点击小金库
  inputCoffers(){
    this.setData({
      amountFeeShow: false,
      coffersFeeShow: !this.data.coffersFeeShow,
    })
  },
  //输入密码
  getpayPassword(e) {
    this.setData({
      payPassword: e.detail.value
    })
  },
  //取消
  cancelTixian() {
    this.setData({
      payPasswordShow: false,
    })

  },
  //提交订单
  submitOrder(){
    if (this.data.amountFeeShow || this.data.coffersFeeShow){
      this.setData({
        isShowPass:true
      })
    }else{
      this.setData({
        isShowPass: false
      })
    }
    if(this.data.amountFeeShow){
      this.setData({
        pledgeMethod:3
      })
    }
    if (this.data.coffersFeeShow) {
      this.setData({
        pledgeMethod: 2
      })
    }
    if (!this.data.amountFeeShow && !this.data.coffersFeeShow){
      this.setData({
        pledgeMethod: ''
      })
    }
    if (this.data.isShowPass && this.data.memList.enabledPayPassword){
      this.setData({
        payPasswordShow:true
      })
    }else{
      this.orderPayMent()
    }
  },
  //密码支付
  passworeTixian() {
    if (this.data.payPassword == '') {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // wx.showLoading()
    this.orderPayMent();
  },
  orderPayMent(){
    let _self = this;
    let dataList = {
      memberId: _self.data.memList.id,
      pledgeMethod: _self.data.pledgeMethod,
      payMethod: 6,
    }

    if (_self.data.payPasswordShow) {
      dataList.payPassword = utilMd5.hexMD5(this.data.payPassword)
    }
    console.log(dataList)
    _self.setData({
      doubleClick: false,
    })
    let find = {
      url: '/mobile/store/renewCreateOrder',
      data: dataList,
      callback: function (res) {
        _self.setData({
          doubleClick: true,
        })
        if (res.data.code == 1) {
          wx.hideLoading()
          // wx: wx.redirectTo({
          //   url: '/views/orderList/orderList?status=2',
          //   success: function (res) { },
          //   fail: function (res) { },
          //   complete: function (res) { },
          // })
        } else if (res.data.code == 0) {
          wx.requestPayment({
            timeStamp: res.data.result.timeStamp,
            nonceStr: res.data.result.nonceStr,
            package: res.data.result.package_,
            signType: res.data.result.signType,
            paySign: res.data.result.paySign,
            success(res1) {
              // wx.showToast({ title: '支付成功', icon: 'none' })
              _self.setData({
                payPasswordShow: false,
                orderSucessBak: true
              })
            },
            fail(res) {
              wx.showToast({ title: '支付失败', icon: 'none' })
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }

      }
    }

    common.methods.mothod3(find)
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