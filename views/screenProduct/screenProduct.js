// views/screenProduct/screenProduct.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTrue:false,
    indexPrice:false,
    isPrice:false,
    isUp:false,
    isShow:false,
    isShownum:1,
    keyWord:'',
    dataList:[],
    page:1,
    rows:10,
    pcatId:'',//产品父分类id
    catId: '',//产品分类id
    isNew: '',//是否新品 1是
    isVip: '',//是否VIP 1是
    brandId: '',//	品牌id
    sellerId: '',//商户id
    sellerIds: '',//商户id集合
    memberId:'',//
    sort: 1,//排序 1综合排序 2销量 3价格升序 4价格降序
    catIds: [],//平台分类id集合
    brandIds: [],//品牌id集合
    sellerCatId: '',//商户产品分类id
    goldBean: '',//金豆数量
    allBrand: [],//所以品牌
    allClass:[],//所以分类
    indexSort:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        keyWord: options.KeyWord ? options.KeyWord : '',
        goldBean: options.goldBean ? options.goldBean : ''
      })
    this.getallP(1)
    this.getallP(2)
    this.getProductList(1)
  },
  //获取产品
  getProductList(num){
    let _self=this
    let data={
      url:'/mobile/product/productList',
      data:{
        keyword: this.data.keyWord,
        page: this.data.page,
        rows: this.data.rows,
        pcatId: this.data.pcatId,//产品父分类id
        catId: this.data.catId,//产品分类id
        isNew: this.data.isNew,//是否新品 1是
        isVip: this.data.isVip,//是否VIP 1是
        brandId: this.data.brandId,//	品牌id
        sellerId: this.data.sellerId,//商户id
        sellerIds: this.data.sellerIds,//商户id集合
        memberId: app.userId,//
        sort: this.data.sort,//排序 1综合排序 2销量 3价格升序 4价格降序
        catIds: this.data.catIds,//平台分类id集合
        brandIds: this.data.brandIds,//品牌id集合
        sellerCatId: this.data.sellerCatId,//商户产品分类id
        goldBean: this.data.goldBean,//金豆数量app.memberData.goldBean
      },
      callback:function(res){
        if(num==1){
          _self.setData({
            dataList: res.data.result
          })
        }else{
          _self.setData({
            dataList: _self.data.dataList.concat(res.data.result)
          })
        }
      }
    }
    common.methods.mothod1(data)
  },
  //获取所有品牌/分类
  getallP(num){
    let _self = this
    let data={
      url:'/mobile/product/category/getBrands',
      data:{},
      callback:function(res){
        let arr=res.data.result
        if(num==1){
          arr.map(function (item, index) {
            item.checked = false
          })
          _self.setData({
            allBrand: arr
          })
        }else{
          let newarr=[]
          arr.map(function (item, index) {
            item.children.map(function(val,key){
              val.checked=false
              newarr.push(val)
            })
          })
          _self.setData({
            allClass: newarr
          })
        }
      }
    }
    if(num==2){
      data.url ='/mobile/product/category/getCategory'
    }
    common.methods.mothod1(data)
  },
  //确定按钮
  seachScreen(){
    this.setData({
      indexSort: '',
      page:1,
      rows:10,
      indexPrice:false,
      isPrice:false,
      sort:1,
      isShow:false,
      // keyWord:''
    })
    this.getProductList(1)
  },
  //changeshijian
  checkboxChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    let allBrands = this.data.allBrand
    let choses = e.detail.value
    allBrands.map(function(item,index){
      item.checked = false
      choses.map(function(val,key){
        if (item.brandId==val){
          item.checked=true
        }
      })
    })
    this.setData({
      allBrand: allBrands,
      brandIds: choses.join(',')
    })
  },
  checkboxChange2: function (e) {
    let allClasss = this.data.allClass
    let choses = e.detail.value
    allClasss.map(function (item, index) {
      item.checked=false
      choses.map(function (val, key) {
        if (item.catId == val) {
          item.checked = true
        }
      })
    })
    this.setData({
      allClass: allClasss,
      catIds: choses.join(',')
    })
  },
  //筛选弹框
  changeIsshow(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  changeBC(e){
    this.setData({
      isShownum: e.currentTarget.dataset.num
    })
  },
  changeupDown(){//价格上下
    this.setData({
      isPrice:true,
      isUp:!this.data.isUp,
      indexSort:'',
      indexPrice:true,
      sort: !this.data.isUp ? 3 : 4,
      page:1,
      rows:10
    })
    this.getProductList(1)
  },
  //跳转详情
  goDetial(e){
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../detial/detial?id=' + item.productId + '&type=' + item.type,
    })
  },
  //改变排序方式
  changeSort(e){
    let index = e.currentTarget.dataset.index
      if(index==this.data.indexSort) return
      else{
        this.setData({
          indexSort: index,
          sort:index,
          isPrice:false,
          indexPrice:false,
          page: 1,
          rows: 10,
        })
        this.getProductList(1)
      }
  },
  //回到顶部
  toScrollTop() {//回到顶部方法
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
  },
  //滚轮
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.setData({
        page:this.data.page+1
      })
    this.getProductList(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})