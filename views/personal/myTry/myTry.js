// views/personal/myTry/myTry.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subFreeUseCount:'',//剩余次数
    limitNum:1,//兑换次数
    memList:'',
    orderDetail:'',
    globAcount:{},
    canorcanson:true,
    showAlert:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getFirst, this);
  },
  getFirst() {
    let _self = this;
    let banners = {
      url: '/mobile/member/freeUseCore',
      data: {
        memberId: app.userId,
      },
      callback: function (res) {
        _self.setData({
          orderDetail: res.data.result
        })
      }
    }
    common.methods.mothod1(banners)
    this.getMber()
  },
  //用户接口
  getMber(){
    let _self=this
    let banners2 = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        app.memberData = res.data.result
        _self.setData({
          subFreeUseCount: res.data.result.subFreeUseCount,
        })
      }
    }
    common.methods.mothod1(banners2)
  },
  //兑换权限
  goldBeanToFreeUseCount(num){
    let _self=this
    let data = {
      url: '/mobile/freeUse/isGoldBeanToFreeUseCount',
      data: {
        memberId: app.userId,
        num: 1
      },
      callback: function (res) {
        // if(num==1){
          if(res.data.result.isGoldBeanToFreeUseCount==1){
            _self.setData({ showAlert: true })
            if (res.data.result.goldBean < res.data.result.freeUseCountGoldBean) {
              _self.setData({
                canorcanson: false
              })
            } else _self.setData({ canorcanson: true})
          } else wx.showToast({ title: '活动尚未开启', icon: 'none' })
        // }
        _self.setData({
          globAcount: res.data.result
        })
      }
    }
    common.methods.mothod1(data)
  },
  getTryList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=0',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaifuList() {
    wx: wx.navigateTo({
      url: './tryList/tryList?status=1',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiSongList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=2',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiShouList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=3',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiPingList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=4',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDaiTuiList(){
    wx: wx.navigateTo({
      url: './tryList/tryList?status=5',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getExplain(){
    wx: wx.navigateTo({
      url: '/views/personal/myTry/tryExplain/tryExplain',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getDetailed(){
    wx: wx.navigateTo({
      url: '/views/personal/myTry/tryDetailed/tryDetailed?id=' + this.data.memList.subFreeUseCount,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getTryShow(){
    wx: wx.navigateTo({
      url: '/views/personal/myTry/tryShow/tryShow',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  openChange(){
    this.goldBeanToFreeUseCount()
    // globAcount: res.data.result
    // if (this.data.globAcount.isGoldBeanToFreeUseCount==1){
    //   this.goldBeanToFreeUseCount()
    //   this.setData({
    //     showAlert: true
    //   })
    // }else wx.showToast({title: '活动尚未开启',icon:'none'})
  
  },
  closeAlert(){
    this.setData({
      showAlert: false,
      limitNum:1
    })
  },
  addSubnum(e){
    let index = e.currentTarget.dataset.index
    let allnum = this.data.globAcount.goldBean
    let limit = this.data.limitNum
    if (index==2){
      if (((limit + 1) * this.data.globAcount.freeUseCountGoldBean) > allnum) {
        return
      } else {
        limit += 1
      }
    }else{
      if (limit<=1){
        limit=1
      }else{
        limit-=1
      }
    }
    this.setData({
      limitNum:limit
    })
  },
  tochoseSure(){
    wx.showLoading({
      mask: true
    })
    let _self=this
    let data={
      url:'/mobile/freeUse/goldBeanToFreeUseCount',
      data:{
        memberId:app.userId,
        count:this.data.limitNum
      },
      callback:function(res){
        // let shenyuNum = parseInt(_self.data.subFreeUseCount)
        _self.setData({
          // subFreeUseCount: res.data.result,
          limitNum: 1,
          showAlert: false
        })
        wx.hideLoading()
        wx.showToast({
          title: '兑换成功',
          icon:'none'
        })
        _self.getMber()
      }
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