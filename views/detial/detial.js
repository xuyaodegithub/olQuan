// detial/detial.js
var common=require('../../utils/common.js')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[
      "https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/af3d8818094a4fcc721132c960043600b8d28ece",
      "https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/158389d6dce7d00d5ba1338a55e9519307debc95",
      "https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/24df7839631eadb3112a62eaf798bd7dab4a1f43",
      "https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/bcf66e8aa2ee47d1875355023d1b674661531ab4"
    ],
    productId:'',
    productType:'',
    uutype:1,
    productData:{},
    levelCode:'',//等级
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productId: options.id,
      productType: options.type,
      levelCode: app.memberData.levelCode
    })
    console.log(options, options.id, options.type,'---------------------')    
    this.getProductDetial()
  },
//firstin
    getProductDetial(){
      let _self=this
      let data={
            url:'/mobile/product/productDetail',
            data:{
              productId: this.data.productId,
              memberId: app.userId,
              uutype: app.uutype,
              type: this.data.productType,
              viewType: this.data.viewType ? 1 : ''
            },
            callback:res => {
              // let reg = new RegExp("<img","g")
              // console.log(typeof res.data.result.detail)
              if (res.data.result.detail) {
                res.data.result.detail = res.data.result.detail.replace(/\<img/g, "<img style='display:block;width:100%;'")
               }
              // console.log(res.data.result.detail.replace(/\<img/g, "<img style='display:block;width:100%;'"))
              _self.setData({
                productData: res.data.result,
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
  onShareAppMessage: function () {
  
  }
})