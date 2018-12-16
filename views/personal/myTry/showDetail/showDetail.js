// views/personal/myTry/showDetail/showDetail.js
var common = require("../../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentId:'',
    placeValue:'回复买家',
    parentCommentId:0,
    content:'',
    douClick:true,
    isMother:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      commentId: options.id
    })
    common.methods.getLoginMess(this.getFirst, this);
  },
  getFirst(){
    let _self=this;
    let banners = {
      url: '/mobile/product/comment/freeUseDetail',
      data: {
        memberId: app.userId,
        commentId: _self.data.commentId
      },
      callback: function (res) {
         _self.setData({
          orderList: res.data.result
        })
      }
    }
    common.methods.mothod1(banners)
  },
  previewImage(e){
    // console.log(e.currentTarget.dataset)
    wx.previewImage({
      current: e.currentTarget.dataset.itemlist[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: e.currentTarget.dataset.itemlist // 需要预览的图片http链接列表
    })
  },
  getGoodsDetail(){
    if(this.data.orderList.type==2){
      wx: wx.navigateTo({
        url: '/views/detial/detial?id=' + this.data.orderList.productId + '&type=4',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx: wx.navigateTo({
        url: '/views/detial/detial?id=' + this.data.orderList.productId + '&type=1',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  addGoods(){
    let changeList = this.data.orderList;
    let _self = this;
    let banners = {
      url: '/mobile/product/comment/doGoodFreeUseShow',
      data: {
        memberId: app.userId,
        productCommentId: _self.data.orderList.id
      },
      callback: function (res) {
        if (changeList.isGood === 1) {
          changeList.isGood = 0;
          changeList.goodCount = changeList.goodCount - 1;
          _self.setData({
            orderList: changeList
          })
          wx.showToast({
            title: '取消点赞',
            icon: 'none',
            duration: 2000
          })
        } else {
          changeList.isGood = 1;
          changeList.goodCount = changeList.goodCount + 1;
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
  getOneName(e){
    console.log(e.currentTarget.dataset)
    this.setData({
      placeValue: '回复' + e.currentTarget.dataset.name,
      parentCommentId: e.currentTarget.dataset.id,
      indexId: e.currentTarget.dataset.index,
      content:'',
      isMother:1,
    })
  },
  getOneNameMore(e){
    console.log(e.currentTarget.dataset)
    this.setData({
      placeValue: '回复' + e.currentTarget.dataset.name,
      parentCommentId: e.currentTarget.dataset.id,
      indexId: e.currentTarget.dataset.index,
      content: '',
      isMother: 2,
    })
  },
  getContent(e){
    this.setData({
      content: e.detail.value,
    })
  },
  getBotton(){
   
      let data = {
        parentCommentId: this.data.parentCommentId,
        productCommentId: this.data.orderList.id,
        content: this.data.content,
        memberId: app.userId,
      }
      console.log(data)
      if (this.data.content === '') {
        wx.showToast({
          title: '请填写回复内容',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      
      let _self = this;
      let orderListTrue=this.data.orderList
      let banners = {
        url: '/mobile/product/comment/doCommentFreeUseShow',
        data: data,
        callback: function (res) {
          if (_self.data.parentCommentId===0){
            orderListTrue.commentCommentDtos.push(res.data.result);
            _self.setData({
              orderList: orderListTrue
            })
            console.log(_self.data.orderList)
          }else{
            orderListTrue.commentCommentDtos[_self.data.indexId].children.push(res.data.result);
            _self.setData({
              orderList: orderListTrue
            })
          }
          wx.showToast({
            title: '评论成功',
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

  },

  /**
   * 用户点击右上角分享
   */
  
})