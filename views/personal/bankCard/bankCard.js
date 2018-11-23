// views/personal/bankCard/bankCard.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountList:[],
    isWaithDraw:'',
    isMoreNone:false,
    page:1,
    cancleAccount:false,
    cancleId:'',
    cancleIndex:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getAccountList,this)
    console.log(options.isWaithDraw)
    if (options.isWaithDraw){
      this.setData({
        isWaithDraw: 1,
      })
    }
  },
  addCardMore(){
    wx: wx.navigateTo({
      url: '../addCard/addCard?isWaithDraw=' + this.data.isWaithDraw,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //选择账号
  chooseAccount(e){
    if(this.data.isWaithDraw){
      let index = e.currentTarget.dataset.index;
      wx: wx.navigateTo({
        url: '../withDraw/withDraw?accountId=' + this.data.accountList[index].accountId + '&accountName=' + this.data.accountList[index].accountBank + '&accountNo=' + this.data.accountList[index].accountNo,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  modifyCardMore(e){
    wx: wx.navigateTo({
      url: '../addCard/addCard?modify=1&isWaithDraw=' + this.data.isWaithDraw + '&accountId=' + e.currentTarget.dataset.accountid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //进入加载
  getAccountList(isMore) {
    let _self = this
    let banners = {
      url: '/mobile/memberAccount/accounts',
      data: {
        memberId: app.userId,
        page: _self.data.page,
        rows: 10,
      },
      callback: function (res) {
        if (res.data.result.length < 10) {
          _self.setData({
            isMoreNone: true
          })
        }
        if (isMore === 2) {
          _self.setData({
            accountList: _self.data.accountList.concat(res.data.result)
          })
        } else {
          _self.setData({
            accountList: res.data.result,
          })
        }
        
      }
    }
    common.methods.mothod1(banners)
  },
  //删除账号
  removeList(e){
    this.setData({
      cancleId: e.currentTarget.dataset.accountid,
      cancleIndex: e.currentTarget.dataset.index,
      cancleAccount:true
    })
    
  },
  // 取消删除账号
  callOff(){
    this.setData({
      cancleAccount: false
    })
  },
  //确定删除账户
  sureCancelAccount(){
    let _self = this;
    let orderS = this.data.accountList;
    let banners = {
      url: '/mobile/memberAccount/delete',
      data: {
        memberId: app.userId,
        accountId: _self.data.cancleId,
      },
      callback: function (res) {
        orderS.splice(_self.data.cancleIndex, 1); // 删除购物车列表里这个商品
        _self.setData({
          accountList: orderS,
          cancleAccount: false
        })
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isMoreNone) {
      this.setData({
        page: this.data.page + 1
      })
      this.getAccountList(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})