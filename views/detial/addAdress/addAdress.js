// views/detial/addAdress/addAdress.js
var common = require('../../../utils/common.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backType:'',//上个页面type
    isCrossBorderProduct:'',//跨境商品需要身份证号
    isOverseasDirectMailProduct:'',//海外直邮需要身份证号，身份证正反面照片
    adressList:[],//地址列表
    ids:''//购物车id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // this.setData({
      //   backType: options.backType,
      //   isCrossBorderProduct: options.isCrossBorderProduct,
      //   isOverseasDirectMailProduct: options.isOverseasDirectMailProduct
      // })
    this.setData({
      backType: options.backType ? options.backType : '',
      ids: options.ids ? options.ids : '',
    })
      if(options.backType){
        this.setData({
          isCrossBorderProduct: options.isCrossBorderProduct ? options.isCrossBorderProduct : '',
          isOverseasDirectMailProduct: options.isOverseasDirectMailProduct ? options.isOverseasDirectMailProduct : ''
        })
      }
    console.log(options)      
    this.getaddress()
  },
//地址列表接口
  getaddress(){
    let _self=this
    let data={
      url:'/mobile/address/memberAddresses',
      data:{
        memberId: app.userId
      },
      callback:function(res){
        _self.setData({
          adressList:res.data.result
        })
      }
    }
    common.methods.mothod1(data)
  },
  //跳转新增
  addNewAdress(){
    wx.navigateTo({
      url: '../addNewAdress/addNewAdress?backType=' + this.data.backType + '&isCrossBorderProduct=' + this.data.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + this.data.isOverseasDirectMailProduct+'&ids='+this.data.ids 
    })
  },
  //编辑
  updataOne(e){
    wx.navigateTo({
      url: '../addNewAdress/addNewAdress?backType=' + this.data.backType + '&isCrossBorderProduct=' + this.data.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + this.data.isOverseasDirectMailProduct+
        '&id=' + e.currentTarget.dataset.id + '&addType=updata' + '&ids=' + this.data.ids 
    })
  },
  //删除
  deleteOne(e){
    let _self=this
    let data={
      url:'/mobile/address/deleteAddress',
      data:{
        addressId: e.currentTarget.dataset.id
      },
      callback:function(res){
        const arr = _self.data.adressList
        arr.splice(e.currentTarget.dataset.index,1)
          _self.setData({
            adressList: arr
          })
      }
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除此地址',
      success(res) {
        if (res.confirm) {
          common.methods.mothod1(data)
        } else if (res.cancel) {
          wx.showToast({ title: '已取消', icon: 'none' })
        }
      }
    })
   
  },
  choseMo(e){
    let _self = this
    let data={
      url:'/mobile/address/setDefaultAddress',
      data:{
        memberId:app.userId,
        addressId: e.currentTarget.dataset.id
      },
      callback:function(res){
        const arr = _self.data.adressList
        arr.map(function(val,index){
          if (index == e.currentTarget.dataset.index){
            val.type=1
          }else{
            val.type=0
          }
        })
        _self.setData({
          adressList:arr
        })
      }
    }
    common.methods.mothod1(data)
  },
  choseThis(e){
    if (this.data.backType==1){
      let item = e.currentTarget.dataset.item
      if (item.mobile) {
        let arrnum = item.mobile.split('')
        arrnum.splice(3, 4, '****')
        item.mobile = arrnum.join('')
      }
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];  //上一个页面
      let info = prevPage.data //取上页data里的数据也可以修改
      prevPage.setData({ addressMess: item })//设置数据
      // wx.redirectTo({
      //   url: '../toSureBuy/toSureBuy?adressID=' + e.currentTarget.dataset.id
      // })
      wx.navigateBack({
        delta:1
      })
    } else if (this.data.backType == 2){
      wx.redirectTo({
        url: '../../carToBuy/carToBuy?adressID=' + e.currentTarget.dataset.id + '&ids=' + this.data.ids
      })
    } else if (this.data.backType == 3){
      wx.navigateTo({
        url: '/views/personal/buyPink/buyPink?addressId=' + e.currentTarget.dataset.id
      })
    }else return
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
    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
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