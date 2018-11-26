// views/personal/sellerShop/sellerShop.js
var common = require("../../../utils/common.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellerShop:[],
    sort:1,//排序方式
    isNew:'',
    productList:[],
    page:1,
    isMore:true,
    isCollect:true,
    sellerShopList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.iCollect==1){
    //   this.setData({
    //     isCollect: true
    //   })
    // }else{
    //   this.setData({
    //     isCollect: false
    //   })
    // }
    this.setData({
      sellerShop: options
    })
    wx.setNavigationBarTitle({
      title: this.data.sellerShop.sellername
    })
    common.methods.getLoginMess(this.getProductList, this)
    this.getSellShop();
  },
  //获取商家信息
  getSellShop(){
    let _self = this
    let banners = {
      url: '/mobile/sellerShop/sellerShop',
      data: {
        memberId: app.userId,
        sellerId: this.data.sellerShop.id,
      },
      callback: function (res) {
        
        _self.setData({
          sellerShopList: res.data.result,
          isCollect: res.data.result.isCollect
        })
      }
    }
    common.methods.mothod1(banners)
  },
  //获取产品列表
  getProductList(isMoreSure){
    let _self = this
    let banners = {
      url: '/mobile/product/productList',
      data: {
        memberId: app.userId,
        sellerId: this.data.sellerShop.id,
        page: this.data.page,
        rows: 20,
        isNew: this.data.isNew,
        sort:this.data.sort
      },
      callback: function (res) {
        if (res.data.result.length < 20) {
          _self.setData({
            isMore: false,
          })
        }
        if (isMoreSure === 2) {
          _self.setData({
            productList: _self.data.productList.concat(res.data.result),
          })
        } else {

          _self.setData({
            productList: res.data.result,
          })
        }


      }
    }
    common.methods.mothod1(banners)
  },
  //取消收藏
  removeCollect(){
    this.sureCollect(1);
  },
  addCollect(){
    this.sureCollect(2);
  },
  //收藏接口
  sureCollect(isCollect){
    let _self = this
    console.log(this.data.sellerShopList.sellerId)
    let banners = {
      url: '/mobile/collect/doCollect',
      data: {
        memberId: app.userId,
        objId: _self.data.sellerShopList.sellerId,
        type:2,
      },
      callback: function (res) {
        if (isCollect==1){
          wx.showToast({
            title: '取消收藏',
            icon: 'success',
            duration: 2000
          })
          
          _self.setData({
            isCollect:0,
          })
        } else {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
         
          _self.setData({
            isCollect: 1,
          })
        }
       
      }
    }
    common.methods.mothod1(banners)
  },
  //点击综合
  getAllProduct(){
    this.setData({
      isNew:'',
      page:1,
      isMore:true,
      sort:1,
    })
    this.getProductList();
  },
  //点击销量
  getSalesProduct() {
    this.setData({
      isNew: '',
      page: 1,
      isMore: true,
      sort: 2,
    })
    this.getProductList();
  },
  //点击新品
  getNewProduct() {
    this.setData({
      isNew: 1,
      page: 1,
      isMore: true,
      sort: '',
    })
    this.getProductList();
  },
  //点击价格
  getPriceProduct(){
    if(this.data.sort==3){
      this.setData({
        sort:4
      })
    }else{
      this.setData({
        sort: 3
      })
    }
    this.setData({
      isNew: '',
      page: 1,
      isMore: true,
    })
    this.getProductList();
  },
  //跳转产品详情
  getGoodsDetail(e) {
    console.log(e.currentTarget.dataset.productid)
    wx: wx.navigateTo({
      url: '../../detial/detial?id=' + e.currentTarget.dataset.productid + '&type=' + e.currentTarget.dataset.type,
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
    if (this.data.isMore) {
      this.setData({
        page: this.data.page + 1
      })
      this.getProductList(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})