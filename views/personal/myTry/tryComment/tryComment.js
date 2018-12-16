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
    orderCount:{},
    productId:'',
    updataData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId:options.id,
      type:options.type,
    }, this.getFirst)
    // common.methods.getLoginMess(this.getFirst, this)
  },
  //获取评论
  getComment(){
    if(this.data.type==1){
      return
    }
    let _self=this
    let data={
      url:'/mobile/product/comment/getComments',
      data:{
        productId: this.data.orderCount.items[0].productId,
        orderNo: this.data.orderCount.orderNo,
        // orderNo:
      },
      callback:function(res){
        _self.setData({
          updataData:res.data.result[0],
          title: res.data.result[0].title,
          content: res.data.result[0].content,
          imgList: res.data.result[0].images,
        })
      }
    }
    common.methods.mothod1(data)
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
        }, _self.getComment)
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
  addImage(e){
    let _self = this;
    wx.chooseImage({
      count: 9,
      // sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths)
        const tempFilePaths = res.tempFilePaths
        wx.showToast({
          title: '正在上传...',
          icon: 'loading'
        })
        tempFilePaths.map(function(val,index){
          _self.upImgTo(e,val)
        })
      }
    })
  },
  //图片上传
  upImgTo(e,img) {
    let _self = this
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let items = this.data.imgList
    console.log(items)
    wx.uploadFile({
      header: {
        "Content-Type": "multipart/form-data"
      },
      url: app.baseUrl + '/mobile/imageUpload/saveImage', //仅为示例，非真实的接口地址
      filePath: img,
      name: 'image',
      // formData: {
      //   'user': 'test'
      // },
      success(res) {
        const result = JSON.parse(res.data)
        if (res.statusCode == 200 && result.code === 0) {
          if(type==1){
            items.splice(index,1,result.result.savePath)
          }else{
            items.unshift(result.result.savePath)
          }
          _self.setData({
            imgList: items
          })
          wx.hideToast();
        } else {
          wx.hideToast();
        }
      },
      fail(err) {
        wx.hideToast();
        wx.showToast({
          title: '图片上传失败',
          icon: 'fail'
        })
      }
    })
  },
  //delete
  deleteThis(e){
    let index = e.currentTarget.dataset.index
    let item = this.data.imgList
    item.splice(index,1)
    this.setData({
      imgList:item
    })
  },
  //提交
  uploadMess(){
    let _self = this
    let imgs = this.data.imgList.join('#')
    let data = {
      url: '/mobile/product/comment/doComment',
      data: {
        orderId: this.data.orderId,
        memberId: app.userId,
        productIds: this.data.orderCount.items[0].productId,//产品集合
        scores: 5,//评分集合
        title: this.data.title,//标题集合
        contents: this.data.content,//内容集合
        images: imgs ,//图片集合
      },
      callback: function (res) {
        //  wx.showToast({ title: '评论成功', icon: 'none' })
        wx.redirectTo({
          url: '../myTry',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }
    if(this.data.type==2){
      data.data.commentId = this.data.updataData.id
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