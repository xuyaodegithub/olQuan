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
    productData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,options.id, options.type,'---------------------')
    this.setData({
      productId: options.id,
      productType: options.type
    })
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
              type: this.data.productType
            },
            callback:res => {
              _self.setData({
                productData: res.data.result,
              })
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