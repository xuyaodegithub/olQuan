// views/personal/reCharge/reCharge.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:['500元','1000元','2000元','5000元','其他金额'],
    listIndex:0,
    amountNum:'',
    amount:'',
    limtAmount:'',
    doubleClick:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getFirst, this, options)
  },
  getFirst(){
    let _self = this;
    let banners = {
      url: '/mobile/amountRecharge/minRechargeAmount',
      data: {},
      callback: function (res) {
        _self.setData({
          limtAmount: res.data.result
        })
      }
    }
    common.methods.mothod1(banners)
  },
  //查看充值明细
  getListMore(){
    wx.navigateTo({
      url: '/views/personal/reChargeList/reChargeList',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  chooseMoney(e){
    this.setData({
      listIndex: e.currentTarget.dataset.index
    })
  },
  //其他金额输入
  amountObj(e){
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
    this.setData({
      amountNum: valueNum
    })
  },
  //确认充值
  sureRecharge(){
    let aumounObj
    switch (this.data.listIndex){
      case 0:
        aumounObj=500;
        break;
      case 1:
        aumounObj = 1000;
        break;
      case 2:
        aumounObj = 2000;
        break;
      case 3:
        aumounObj = 5000;
        break;
      case 4:
        aumounObj = Number(this.data.amountNum);
        break;
    }
    if (aumounObj==''){
      wx.showToast({
        title: '充值金额不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (aumounObj<Number(this.data.limtAmount)){
      wx.showToast({
        title: '最低充值' + Number(this.data.limtAmount)+'元',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let _self=this;
    _self.setData({
      doubleClick:false,
    })
    let banners = {
      url: '/mobile/amountRecharge/amountRecharge',
      data: {
        memberId: app.userId,
        payMethod:6,
        amount: aumounObj
      },
      callback: function (res) {
        _self.setData({
          doubleClick: true,
        })
        if(res.data.code==0){
          wx.requestPayment({
            timeStamp: res.data.result.timeStamp,
            nonceStr: res.data.result.nonceStr,
            package: res.data.result.package_,
            signType: res.data.result.signType,
            paySign: res.data.result.paySign,
            success(res1) {
              wx.reLaunch({
                url: '/views/personal/personal'
              })
            },
            fail(res) {
              // wx.showToast({ title: '支付失败', icon: 'none' })
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
    common.methods.mothod3(banners)
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
  
})