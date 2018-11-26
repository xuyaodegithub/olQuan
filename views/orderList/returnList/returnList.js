// views/orderList/returnList/returnList.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    array: ['请选择申请原因', '7天无理由退货', '买错了', '商家发错货','质量问题','与商家协商退款/货','不想要了'],
    index:0,
    descReson:'',
    mobile:'',
    orderList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id,
    })
    common.methods.getLoginMess(this.getOrderList, this)
  },
  getOrderList() {
    let _self = this;
    let banners = {
      url: '/mobile/order/orderDetail',
      data: {
        orderId: this.data.orderId,
      },
      callback: function (res) {
        _self.setData({
          orderList: res.data.result,
          orderMobile: res.data.result.mobile.substr(0, 3) + '****' + res.data.result.mobile.substr(res.data.result.mobile.length - 4),
          mobile: res.data.result.mobile
        })

      }
    }
    common.methods.mothod1(banners)
  },
  //选择器
  bindPickerChange(e){
    this.setData({
      index: e.detail.value
    })
  },
  //更多原因
  descDetail(e){
    this.setData({
      descReson: e.detail.value
    })
  }, 
  mobileNum(e){
    this.setData({
      mobile: e.detail.value
    })
  },
  getReturn(){
    let _self = this;
    if(this.data.index==0){
      wx.showToast({
        title: '选择退款原因',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(this.data.mobile==''){
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let data = {
      orderId: this.data.orderList.orderId,
      type:1,
      reason: this.data.array[this.data.index],
      mobile: this.data.mobile,
      desc:this.data.descReson
    }
    let apply = {
      url: '/mobile/order/customerService/apply',
      data:data,
      callback: function (res) {
        if(res.data.code==0){
          wx: wx.navigateTo({
            url: '../../orderList/orderList?status=5',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
         
        }

      }
    }
    common.methods.mothod1(apply)
    console.log(data)
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