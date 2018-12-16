// views/orderList/evaluate/evaluate.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    options:'',
    productIds:'',
    scores:'',
    images:'',
    contents:'',
    title:'',
    orderMess:{},
    pArrayData:[]
  },
//订单评论
 setorderMess(){
   let _self=this
   let data={
     url:'/mobile/product/comment/doComment',
     data:{
       orderId: this.data.orderId,
       memberId:app.userId,
       productIds: this.data.productIds,//产品集合
       scores: this.data.scores,//评分集合
      //  title: this.data.title,//标题集合
       contents: this.data.contents,//内容集合
       images: this.data.images,//图片集合
     },
     callback:function(res){
      //  wx.showToast({ title: '评论成功', icon: 'none' })
       wx.redirectTo({
         url: '/views/orderList/orderList?status=0',
         success: function (res) { },
         fail: function (res) { },
         complete: function (res) { },
       })
      //  _self.setData({

      //  })
     }
   }
   common.methods.mothod1(data)
 },
 //订单信息
  getorderMess(){
    let _self=this
    let data={
      url:'/mobile/order/orderDetail',
      data:{
        orderId: this.data.orderId
      },
      callback:function(res){
        let item=res.data.result
        let fiveImg=[
          '../../../image/collected03.png',
          '../../../image/collected03.png',
          '../../../image/collected03.png',
          '../../../image/collected03.png',
          '../../../image/collected03.png'
        ]
        // let upAddimg=[]
        item.items.map(function(val,key){
          val.normal = val.normal.split(' ')
          val.fiveImg = fiveImg
          val.content = ''
          val.upAddimg = []
          val.chose = -1
        })
        _self.setData({
          orderMess: item,
          pArrayData: item.items
        })
      }
    }
    common.methods.mothod1(data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        orderId: options.orderId,
        productIds: options.ids
      })
    this.getorderMess()
  },
  changeCon(e){
    let item = this.data.pArrayData
    item[e.currentTarget.dataset.index].content = e.detail.value 
    this.setData({
      pArrayData:item
    })
    // console.log(this.data.pArrayData)
  },
  //星星
  choseFive(e){
    let oindex = e.currentTarget.dataset.index
    let indexson = e.currentTarget.dataset.indexson
    let items = this.data.pArrayData
    items[oindex].chose = indexson
    // console.log(items)
    this.setData({
      pArrayData: items
    })
  },
  //uploadImg
  uploadImg(e) {
    let _self = this
    // let oindex = e.currentTarget.dataset.index
    // let indexson = e.currentTarget.dataset.indexson
    // let items = this.data.pArrayData
    //e.currentTarget.dataset.index
    // console.log(items)
    ///mobile/imageUpload/saveImage
    wx.chooseImage({
      // count: 1,//最多选择张数
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success(res) {
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
  //提交
  uploadMess(){
    let item = this.data.pArrayData
    let scores=[]
    let contents=[]
    let imgs=[]
    let strC=''
    item.map(function(val,key){
      let str = val.chose > -1 ? val.chose : 0
      scores.push(str+1)
      // let strC = val.content.length > 0 ? '@@@'+val.content : '@@@#'
      if(key==0){
        strC = val.content.length > 0 ?  val.content : '#'
      }else{
        strC = val.content.length > 0 ? '@@@' + val.content : '@@@#'
      }
      contents.push(strC)
      let oneImg = val.upAddimg.join('#')
      imgs.push(oneImg)
    })
    this.setData({
      scores: scores.join(','),
      contents: contents.join(''),
      images: imgs
    })
    this.setorderMess()
  },
  //图片上传
  upImgTo(e,img){
    let _self = this
    let oindex = e.currentTarget.dataset.index
    let indexson = e.currentTarget.dataset.indexson
    let items = this.data.pArrayData
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
          // console.log(items[oindex], indexson)
          if (indexson == 999) {
            items[oindex].upAddimg.unshift(result.result.savePath)
          } else {
            items[oindex].upAddimg.splice(indexson, 1, result.result.savePath)
          }
          // console.log(items)
          _self.setData({
            pArrayData: items
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
  //删除
  deleteThis(e){
    let oindex = e.currentTarget.dataset.index
    let indexson = e.currentTarget.dataset.indexson
    let items = this.data.pArrayData
    items[oindex].upAddimg.splice(indexson,1)
    this.setData({
      pArrayData: items
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
  // onShareAppMessage: function () {

  // }
})