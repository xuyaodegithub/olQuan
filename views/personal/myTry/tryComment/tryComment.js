// views/personal/myTry/tryComment/tryComment.js
var common = require("../../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    type:'',
    length:0,
    content:'',
    title:'',
    imgList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId:options.id,
      type:options.type
    })
    common.methods.getLoginMess(this.getFirst, this)
  },
  getFirst(){
    let _self=this;
    let obj = {
      url: '/mobile/order/orderDetail',
      data: {
        memberId: app.userId,
        orderId: _self.data.orderId
      },
      callback: function (res) {
        _self.setData({
          orderCount: res.data.result
        })
      }
    }
    common.methods.mothod1(obj)
  },
  //试用标题
  getTitle(e){
    this.setData({
      title: e.detail.value,
    })
  },
  //试用感受
  getContent(e){
    this.setData({
      content: e.detail.value,
      length: e.detail.value.length
    })
  },
  addImage(){
    let _self = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths)
        const tempFilePaths = res.tempFilePaths
        wx.showToast({
          title: '正在上传...',
          icon: 'loading'
        })
        wx.uploadFile({
          header: {
            "Content-Type": "multipart/form-data"
          },
          url: app.baseUrl + '/mobile/imageUpload/saveImage', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'image',
          // formData: {
          //   'user': 'test'
          // },
          success(res) {
            const result = JSON.parse(res.data)
            if (res.statusCode == 200 && result.code === 0) {
              console.log(result.result)
              // _self.setData({
              //   imgList: result.result.savePath
              // })
              
              wx.hideToast();
            }
          },
          fail(err) {
            wx.showToast({
              title: '图片上传失败',
              icon: 'fail'
            })
          }
        })
      }
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