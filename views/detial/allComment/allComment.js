// views/detial/allComment/allComment.js
var common = require('../../../utils/common.js')
var md5 = require('../../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      commontList:[],
      page:1,
      rows:10,
      id:'',
      topTrue:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        id: options.id
      })
    }else{
      return
    }
    this.getcommonts()
  },
//firstin
  getcommonts(){
    let _self=this
    let data={
      url:'/mobile/product/comment/getComments',
      data:{
        productId: this.data.id,
        page:this.data.page,
        rows:this.data.rows
      },
      callback:function(res){
        let arr = _self.data.commontList
        let newArr = arr.concat(res.data.result)
        _self.setData({
          commontList: newArr
        })
      }
    }
    common.methods.mothod1(data)
  },
  //图片预览
  previewImage(e) {//点击图片大图预览
    // var current = e.target.dataset.src;
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.item[e.currentTarget.dataset.index], // 当前显示图片的http链接  
      urls: e.currentTarget.dataset.item // 需要预览的图片http链接列表  
    })
  },
  toScrollTop() {//回到顶部方法
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
  },
  onPageScroll: function (e) { // 页面滚动触发事件的处理函数
    // console.log(e.scrollTop)
    if (e.scrollTop > 300) {
      this.setData({
        topTrue: true
      })
    } else {
      this.setData({
        topTrue: false
      })
    }
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
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
        this.setData({
          page:this.data.page+1
        })
    this.getcommonts()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})