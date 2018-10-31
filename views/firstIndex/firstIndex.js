// firstIndex/firstIndex.js
var common = require("../../utils/common.js")
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      topBtm: ['试用', '欢乐送', '发现'],
      num:1,
      page:1,
      rows:10,
      jindouresult:{},
      dataList:[],
      icons:[],
      advers:[],
      banner:[],
      classBtn: [],
      classNum: 0,
      smallclassNum:0,
      scrollNum:false,
      topTrue:false
  },
  changeType(e){
    this.setData({
      num: e.currentTarget.dataset.key
    })
  },
  callBack(res){
    this.setData({
      banner: res.data.result.banners,
      icons: res.data.result.icons,
      advers: res.data.result.advers
    })
  },
  // toDetial(e){
  //   console.log(e)
  //   wx.navigateTo({
  //     url: '../detial/detial?id=' + e.currentTarget.dataset.id
  //   })
  // },
  //回到顶部
  toScrollTop(){//回到顶部方法
    wx.pageScrollTo({
      scrollTop: 0,
      duration:400
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let _self=this
   let data={
     url:'/mobile/happyGive/indexData',
     data:{
       memberId: app.userId
     },
     callback: this.callBack
   }
   let obj = {
     url: '/mobile/happyGive/indexProductData',
     data: {
       memberId: app.userId
     },
     callback:function(res){
       _self.setData({
         jindouresult:res.data.result
       })
     }
   }
   let classF={
     url:'/mobile/product/category/getCategory',
     data:{},
     callback:function(res){
       _self.setData({
         classBtn: res.data.result
       })
     }
   }
   let procuct={
     url:'/mobile/product/productList',
     data:{
       pcatId:0,
       memberId:894559,
       page: this.data.page,
       rows:this.data.rows
     },
     callback:function(res){
       _self.setData({
         dataList:res.data.result
       })
     }
   }
   common.methods.mothod1(data)
   common.methods.mothod1(obj)
   common.methods.mothod1(classF)
   common.methods.mothod1(procuct)
  },
  //等分点击事件
  goCalssF(e){
    console.log(e.currentTarget.dataset.link)
    if (e.currentTarget.dataset.type===4){
      wx.navigateTo({
        url: '../plusPage/plusPage',
      })
    }else{
      console.log('活动')
    }
   
  },
  //分类切换
  changeClass(e){
    if (this.data.classNum === e.currentTarget.dataset.index){
      return
    }
    this.setData({
      classNum: e.currentTarget.dataset.index,
      smallclassNum:'',
      page:1,
      rows:10
    })
    this.getdataList(1)
  },
  //小分类切换
  smallClass(e){
    // console.log(e)
    // console.log(e.currentTarget.dataset.catid)
    if (this.data.smallclassNum === e.currentTarget.dataset.index){
      return
    }
    this.setData({
      smallclassNum: e.currentTarget.dataset.index,
      page:1,
      rows:10
    })
    this.getdataList(1)
  },
  //分类下banner
  goActive(e){
    console.log(e.currentTarget.dataset.url)
  },
  //跳转详情页
  goDetial(e){
      wx:wx.navigateTo({
        url: '../detial/detial?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
  },
  //请求产品分类
  getdataList(num){
    let _self = this
      let data={
        url: '/mobile/product/productList',
        data: {
          page: this.data.page,
          rows: this.data.rows,
          memberId: app.userId,
          pcatId: this.data.classBtn[this.data.classNum].catId,
          // catId: this.data.classBtn[this.data.classNum].children.length>0 ? this.data.classBtn[this.data.classNum].children[this.data.smallclassNum].catId : ''
        },
        callback:function(res){
          if(num===1){
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
    if (this.data.classBtn[this.data.classNum].children.length > 0 && this.data.smallclassNum !== ''){
      data.data.catId = this.data.classBtn[this.data.classNum].children[this.data.smallclassNum].catId
    }else{
      data.data.catId=''
    }
    common.methods.mothod1(data)      
  },
  //滚轮
  onPageScroll: function (e) { // 页面滚动触发事件的处理函数
    // console.log(e.scrollTop)
    if(e.scrollTop>200){
      this.setData({
        topTrue:true
      })
    }else{
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
    let _self=this
    // wx.startPullDownRefresh()
    wx.showNavigationBarLoading()
    _self.setData({
      page: 1,
      rows: 10,
      classNum: 0,
      smallclassNum: ''
    })
    let data = {
      url: '/mobile/product/productList',
      data: { page: 1, rows: 10, memberId: app.userId, pcatId: 0 },
      callback: function (res) {
        _self.setData({
          dataList: res.data.result
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        // wx.showToast({
        //   title: '刷新成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      }
    }
    common.methods.mothod1(data)      
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
   console.log(e)
  //  let _self=this
    this.setData({
      page:this.data.page+1
    })
    this.getdataList(2)
    // let data={
    //   url:'/mobile/product/productList',
    //   data:{
    //     page: this.data.page,
    //     rows:this.data.rows,
    //     memberId: app.userId,
    //     pcatId: this.classBtn[classNum].catId
    //   },
    //   callback:function(res){
    //     _self.setData({
    //         dataList: _self.data.dataList.concat(res.data.result)
    //     })
    //     // if (res.data.result.length<10) { 
    //     // }
    //   }
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '自己的小程序',
      path: "/pages/index/index",//当前页面 path ，必须是以 / 开头的完整路径
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})