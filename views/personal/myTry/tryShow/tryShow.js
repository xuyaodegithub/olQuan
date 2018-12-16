// views/personal/myTry/tryShow/tryShow.js
var common = require("../../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMoreNone:true,
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFirst();
  },
  getFirst(isMore){
    let _self = this;
    let banners = {
      url: '/mobile/product/comment/freeUseShow',
      data: {
        memberId: app.userId,
        page: _self.data.page,
        rows: 10,
        type:1
      },
      callback: function (res) {
        if (res.data.result.length < 10) {
          _self.setData({
            isMoreNone: false
          })
        }
        if (isMore === 2) {
          _self.setData({
            orderList: _self.data.orderList.concat(res.data.result)
          })
        } else {
          _self.setData({
            orderList: res.data.result
          })
        }

      }
    }
    common.methods.mothod1(banners)
  },
  addGoods(e){
    // console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index;
    let productCommentId = e.currentTarget.dataset.id;
    let changeList = this.data.orderList;
    let _self = this;
    let banners = {
      url: '/mobile/product/comment/doGoodFreeUseShow',
      data: {
        memberId: app.userId,
        productCommentId: productCommentId
      },
      callback: function (res) {
        if (changeList[index].isGood === 1) {
          changeList[index].isGood = 0;
          changeList[index].goodCount = changeList[index].goodCount - 1;
          _self.setData({
            orderList: changeList
          })
          wx.showToast({
            title: '取消点赞',
            icon: 'none',
            duration: 2000
          })
        }else{
          changeList[index].isGood =1;
          changeList[index].goodCount = changeList[index].goodCount + 1;
          _self.setData({
            orderList: changeList
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 2000
          })
        }

      }
    }
    common.methods.mothod1(banners)
    
  },
  getShowDetail(e){
    // console.log(e.currentTarget.dataset.commentid)
    wx: wx.navigateTo({
      url: '../showDetail/showDetail?id=' + e.currentTarget.dataset.commentid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
    if (this.data.isMoreNone) {
      this.setData({
        page: this.data.page + 1
      })
      this.getFirst(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
 
})