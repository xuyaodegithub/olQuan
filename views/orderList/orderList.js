// views/orderList/orderList.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtm: [
      '全部',
      '待付款',
      '待配送',
      '待收货',
      '待评价',
      '退款'
    ],
    status:0,
    page:1,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取订单列表
  getOrderList(){
    let _self = this;
    let statusNew = '';
    if (this.data.status == 0) {
      statusNew = '';
    } else if (this.data.status == 1) {
      statusNew = 0;
    } else if (this.data.status == 2) {
      statusNew = 1;
    } else if (this.data.status == 3) {
      statusNew = 2;
    } else if (this.data.status == 4) {
      statusNew = 3;
    } else if (this.data.status == 5) {
      statusNew = 5;
    }
    let banners = {
      url: '/mobile/order/myOrder',
      data: {
        memberId: app.userId,
        type: 1,
        page: this.data.page,
        rows: 20,
        status: statusNew
      },
      callback: function (res) {
        _self.setData({
          orderList: res.data.result,

        })
      }
    }
    common.methods.mothod1(banners)
  },
  // 点击头部列表事件
  changeType(e) {
    // console.log(e.target.dataset.key
    this.setData({
      status: e.currentTarget.dataset.key,
      page:1,
    })
    this.getOrderList();
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