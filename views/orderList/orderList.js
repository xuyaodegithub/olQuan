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
    orderList:[],
    isMoreNone:false,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getOrderList)
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取订单列表
  getOrderList(isMore){
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
        rows: 10,
        status: statusNew
      },
      callback: function (res) {
        if (res.data.result.length<10){
          _self.setData({
            isMoreNone: true
          })
        }
        if (isMore === 1) {
          _self.setData({
            orderList: res.data.result
          })
        } else {
          _self.setData({
            orderList: _self.data.orderList.concat(res.data.result)
          })
        }
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
      isMoreNone:false,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
    this.getOrderList(1);
    
  },
  //取消订单
  cancelOrder(e){
    console.log(e.target.dataset.index)
    console.log(e.target.dataset.key)
  },
  //查看详情
  getDetail(e){
    //console.log(e.target.dataset.orderid)
    wx: wx.navigateTo({
      url: './listMore/listMore?id=' + e.target.dataset.orderid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getReturn(e){
    wx: wx.navigateTo({
      url: './returnList/returnList?id=' + e.target.dataset.orderid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    let _self = this
    // wx.startPullDownRefresh()
    wx.showNavigationBarLoading()
    _self.setData({
      page: 1,
      isMoreNone: false,
    })
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
    let data = {
      url: '/mobile/order/myOrder',
      data: { page: 1, rows: 10, memberId: app.userId, type: 1, status: statusNew},
      callback: function (res) {
        _self.setData({
          dataList: res.data.result
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        // wx.showToast({
        //   title: '刷新成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      }
    }
    common.methods.mothod1(data)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.isMoreNone)
    if(!this.data.isMoreNone){
      this.setData({
        page: this.data.page + 1
      })
      this.getOrderList(2);
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})