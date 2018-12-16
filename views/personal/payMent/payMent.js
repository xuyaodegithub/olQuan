// views/personal/payMent/payMent.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    coffersFeeShow: false,//是否选择小金库
    amountFeeShow:false,//是否选择余额
    scoreFeeShow:false,//是否选择积分
    goldBeanFeeShow:false,//是否选择金豆
    couponFee:5,
    totalFee:15000,
    payPasswordShow:false,
    finalFeeObj:'',
    payPassword:false,
    isShowPass:false,
    doubleClick:true,
    amountFee:0,
    scoreFee:0,
    coffersFee:0,
    goldBeanFee:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id,
    })
    common.methods.getLoginMess(this.getFirstList, this);
  },
  getFirstList() {
    
    this.setData({
      memberList: app.memberData,
    })
    let _self = this;
    let find = {
      url: '/mobile/order/orderDetail',
      data: {
        orderId: _self.data.orderId,
      },
      callback: function (res) {
        let curObjFee = res.data.result
        console.log(curObjFee)
        _self.setData({
          curObjList: curObjFee.orderNo,
          totalFeeObj: res.data.result.totalFee.toFixed(2),
          couponFeeObj: res.data.result.couponFee.toFixed(2),
          curObj: curObjFee,
          finalFeeObj: (res.data.result.totalFee - res.data.result.couponFee).toFixed(2)
        })
      }
    }
    
    common.methods.mothod1(find)
  },
  //选择小金库
  inputCoofers(){
    this.setData({
      goldBeanFee: 0,
      amountFee: 0,
      scoreFee: 0,
      coffersFeeShow: !this.data.coffersFeeShow,
      amountFeeShow: false,
      scoreFeeShow:false,
      goldBeanFeeShow:false,
    })
    if (this.data.coffersFeeShow) {
      if ((this.data.curObj.totalFee - this.data.curObj.couponFee) > this.data.memberList.coffers) {
        this.setData({
          coffersFee: this.data.memberList.coffers,
          coffersFeeObj: (this.data.memberList.coffers).toFixed(2)
        })
      } else {
        this.setData({
          coffersFee: (this.data.curObj.totalFee - this.data.curObj.couponFee),
          coffersFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee).toFixed(2)
        })
      }
    } else {
      this.setData({
        coffersFee: 0,
        coffersObj: 0
      })
    }
    this.setData({
      finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - this.data.coffersFee)
    })
  },
  //输入小金库
  inputCoffersFee(e){
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
    if (valueNum >= (this.data.totalFee - this.data.couponFee)) {
      valueNum = (this.data.totalFee - this.data.couponFee)
    }
    if (valueNum >= this.data.memberList.coffers) {
      valueNum = this.data.memberList.coffers
    }
    this.setData({
      coffersFee: valueNum,
      coffersFeeObj: (valueNum / 1).toFixed(2),
      finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - valueNum ).toFixed(2)
    })
  },
  //选择余额
  inputAmount(){
    this.setData({
      goldBeanFee: 0,
      coffersFee: 0,
      scoreFee: 0,
      coffersFeeShow: false,
      amountFeeShow: !this.data.amountFeeShow,
      scoreFeeShow: false,
      goldBeanFeeShow: false,
    })
    if (this.data.amountFeeShow) {
      if ((this.data.curObj.totalFee - this.data.curObj.couponFee) > this.data.memberList.amount) {
        this.setData({
          amountFee: this.data.memberList.amount,
          amountFeeObj: (this.data.memberList.amount).toFixed(2)
        })
      } else {
        this.setData({
          amountFee: (this.data.curObj.totalFee - this.data.curObj.couponFee),
          amountObj: (this.data.curObj.totalFee - this.data.curObj.couponFee).toFixed(2)
        })
      }
    } else {
      this.setData({
        amountFee: 0,
        amountObj: 0
      })
    }
    this.setData({
      finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - this.data.amountFee)
    })
  },
  //输入余额
  inputAmountFee(e){
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
    if (valueNum >= (this.data.totalFee - this.data.couponFee)) {
      valueNum = (this.data.totalFee - this.data.couponFee)
    }
    if (valueNum >= this.data.memberList.amount) {
      valueNum = this.data.memberList.amount
    }
    this.setData({
      amountFee: valueNum,
      amountFeeObj: (valueNum / 1).toFixed(2),
      finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - valueNum).toFixed(2)
    })
  },
  //选择积分
  inputScore(){
    this.setData({
      goldBeanFee:0,
      coffersFee: 0,
      amountFee: 0,
      coffersFeeShow: false,
      amountFeeShow: false,
      scoreFeeShow: !this.data.scoreFeeShow,
      goldBeanFeeShow: false,
    })
    if (this.data.scoreFeeShow){
      if ((this.data.curObj.totalFee - this.data.curObj.couponFee) * 100 > this.data.memberList.score){
        this.setData({
          scoreFee: this.data.memberList.score,
          scoreFeeObj: (this.data.memberList.score / 100).toFixed(2)
        })
      }else{
        this.setData({
          scoreFee: (this.data.curObj.totalFee - this.data.curObj.couponFee)*100,
          scoreFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee).toFixed(2)
        })
      }
    }else{
      this.setData({
        scoreFee: 0,
        scoreFeeObj: 0
      })
    }
    this.setData({
      finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - this.data.scoreFee/100)
    })
  },
  //输入框输入积分
  inputScoreFee(e){
    let valueNum = e.detail.value;
    valueNum = valueNum.replace(/\D/g, '');
    if (valueNum >= (this.data.totalFee - this.data.couponFee) * 100){
      valueNum = (this.data.totalFee - this.data.couponFee)*100
    }
    if (valueNum >= this.data.memberList.score){
      valueNum = this.data.memberList.score
    }
    this.setData({
      scoreFee: valueNum,
      scoreFeeObj: (valueNum / 100).toFixed(2),
      finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - valueNum / 100).toFixed(2)
    })
  },
  //选择金豆
  inputGoldBean(){
    this.setData({
      coffersFee:0,
      amountFee:0,
      scoreFee:0,
      coffersFeeShow: false,
      amountFeeShow: false,
      scoreFeeShow: false,
      goldBeanFeeShow: !this.data.goldBeanFeeShow,
    })
    if (this.data.goldBeanFeeShow) {
      if ((this.data.curObj.totalFee - this.data.curObj.couponFee) * 10 > this.data.memberList.goldBean) {
        this.setData({
          goldBeanFee: this.data.memberList.goldBean,
          goldBeanFeeObj: (this.data.memberList.goldBean / 10).toFixed(2)
        })
      } else {
        this.setData({
          goldBeanFee: (this.data.curObj.totalFee - this.data.curObj.couponFee) * 10,
          goldBeanFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee).toFixed(2)
        })
      }
    } else {
      this.setData({
        goldBeanFee: 0,
        goldBeanFeeObj: 0
      })
    }
    this.setData({
      finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - this.data.goldBeanFee / 10)
    })
  },
  //输入金豆
  inputGoldBeanFee(e){
    let valueNum = e.detail.value;
    valueNum = valueNum.replace(/\D/g, '');
    if (valueNum >= (this.data.totalFee - this.data.couponFee) * 10) {
      valueNum = (this.data.totalFee - this.data.couponFee) * 10
    }
    if (valueNum >= this.data.memberList.goldBean) {
      valueNum = this.data.memberList.goldBean
    }
    this.setData({
      goldBeanFee: valueNum,
      goldBeanFeeObj: (valueNum / 10).toFixed(2),
      finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - valueNum / 10).toFixed(2)
    })
  },
  //输入密码
  getpayPassword(e){
    this.setData({
      payPassword: e.detail.value
    })
  },
  cancelTixian(){
    this.setData({
      payPasswordShow: false,
    })
    
  },
  //提交订单
  submitOrder(){
    console.log(this.data.curObj)
    if (this.data.coffersFeeShow || this.data.goldBeanFeeShow || this.data.scoreFeeShow || this.data.amountFeeShow) {
      this.setData({
        isShowPass: true
      })
    } else {
      this.setData({
        isShowPass: false
      })
    }
    if (this.data.memberList.enabledPayPassword == 1 && this.data.isShowPass) {
      this.setData({
        payPasswordShow: true,
      })

    } else {
      wx.showLoading()
      this.orderPayMent();
    }
  },
  passworeTixian() {
    if (this.data.payPassword == '') {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading()
    this.orderPayMent();
  },
  //确定订单
  orderPayMent(){
    let _self = this;
    let dataList={
      memberId: _self.data.memberList.id,
      orderId:_self.data.orderId,
      payMethod:6,
      amount: _self.data.amountFee,
      score: _self.data.scoreFee,
      coffers: _self.data.coffersFee,
      goldBean: _self.data.goldBeanFee
    }

    if (_self.data.payPasswordShow) {
      dataList.payPassword = utilMd5.hexMD5(this.data.payPassword)
    }
    _self.setData({
      doubleClick: false,
    })
    let find = {
      url: '/mobile/order/singleOrderPay',
      data: dataList,
      callback: function (res) {
        _self.setData({
          doubleClick: true,
        })
        if(res.data.code==1){
          wx.hideLoading()
          if(_self.data.curObj.type==2){
            wx: wx.redirectTo({
              url: '/views/personal/myTry/tryList/tryList?status=2',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }else{
            wx: wx.redirectTo({
              url: '/views/orderList/orderList?status=2',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
          
        }else if(res.data.code==0){
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
        }else{
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