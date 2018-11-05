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
    statusReson:'您的售后申请已经提交,请耐心等待',
    showMore:false,
    delectIndex:'',
    delectOrderId:'',
    delectOrder:false,
    takeOver:false,
    overIndex:'',
    overOrderId:'',
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status,
    })
    common.methods.getLoginMess(this.getOrderList)
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //查看退款进度
  getDetailReson(e){
    
    let _self=this;
    let reson = {
      url: '/mobile/order/customerService/getCustomerServiceInfo',
      data: {
        orderId: e.currentTarget.dataset.orderid
      },
      callback: function (res) {
        if(res.data.code==0){
          if (res.data.result.status == 0){
            _self.setData({
              statusReson: '您的售后申请已经提交,请耐心等待'
            })
          }else if (res.data.result.status==1){
            _self.setData({
              statusReson: '商家已同意您的申请'
            })
          }else if (res.data.result.status == 2){
            _self.setData({
              statusReson: '商家拒绝了您的申请，理由是：' + res.data.result.refuseReason
            })
          }else if (res.data.result.status == 3){
            _self.setData({
              statusReson: '您的物流信息已提交，请等待商家确认'
            })
          } else if (res.data.result.status == 4) {
            _self.setData({
              statusReson: '您的售后申请已完成'
            })
          } else if (res.data.result.status == 5) {
            _self.setData({
              statusReson: '等待财务审核'
            })
          }
          _self.setData({
            showMore: true,
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
    common.methods.mothod1(reson)
  },
  //关闭退款进度查看
  closeDetailReson(){
    this.setData({
      showMore: false,
    })
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
    // console.log(e.currentTarget.dataset.key
    this.setData({
      status: e.currentcurrentTarget.dataset.key,
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
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.key)
  },
  //查看详情
  getDetail(e){
    //console.log(e.currentTarget.dataset.orderid)
    wx: wx.navigateTo({
      url: './listMore/listMore?id=' + e.currentTarget.dataset.orderid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getReturn(e){
    wx: wx.navigateTo({
      url: './returnList/returnList?id=' + e.currentTarget.dataset.orderid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //确认收货
  takeOver(e){
    this.setData({
      overIndex: e.currentTarget.dataset.index,
      overOrderId: e.currentTarget.dataset.orderid,
      takeOver: true,
    });
  },
  closeTakeOver() {
    this.setData({
      takeOver: false,
    });
  },
  sureTakeOver(){
    let _self = this;
    let orderS = this.data.orderList;
    let delect = {
      url: '/mobile/order/confirmGet',
      data: {
        memberId: app.userId,
        orderId: this.data.overOrderId
      },
      callback: function (res) {
        if (res.data.code == 0) {
          orderS.splice(_self.data.overIndex, 1); // 删除购物车列表里这个商品
          _self.setData({
            orderList: orderS,
            takeOver: false,
          });
          wx.showToast({
            title: '收货成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
    common.methods.mothod1(delect)
  },
  //删除订单
  deleteOrder(e){
    this.setData({
      delectIndex: e.currentTarget.dataset.index,
      delectOrderId: e.currentTarget.dataset.orderid,
      delectOrder:true,
    });
  },
  
  sureDelectOrder(){
    let _self = this;
    let orderS = this.data.orderList;
    let delect = {
      url: '/mobile/order/deleteOrder',
      data: {
        memberId: app.userId,
        orderId: this.data.delectOrderId
      }, 
      callback: function (res) {
        if(res.data.code==0){
          orderS.splice(_self.data.delectIndex, 1); // 删除购物车列表里这个商品
          _self.setData({
            orderList: orderS,
            delectOrder: false,
          });
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000
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
    common.methods.mothod1(delect)
  },
  closeDelectOrder(){
    this.setData({
      delectOrder: false,
    });
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