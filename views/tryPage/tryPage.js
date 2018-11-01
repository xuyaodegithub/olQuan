// trypage/trypage.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    advers:[],
    classNum:2,
    page:1,
    rows:10,
    classBtn: [
      { title: '精品试用', imgChose: '../../image/jingpinChoose.png', imgNoChose: '../../image/jingpinNo.png'},      { title: '|', imgChose: '', imgNoChose: '' },
      { title: '付邮试用', imgChose: '../../image/youPay.png', imgNoChose: '../../image/youNoPay.png'},              { title: '|', imgChose: '', imgNoChose: '' },
      { title: '整点抢试', imgChose: '../../image/chooseClock.png', imgNoChose:'../../image/noChooseClock.png'}
      ],
    isGetStoreCommission:'',
    productType:5,
    dataList:[],
    time:'',
    timeList:[],
    timeActive:'',
    topTrue:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getAdvers)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //首次进入
  getAdvers(){
    let _self = this
    console.log(app.isGetStoreCommission)
    this.setData({
      isGetStoreCommission: app.isGetStoreCommission
    })
    let banners = {
      url: '/mobile/plus/advers',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          banners: res.data.result.banners,
          advers: res.data.result.advers
        })
      }
    }
    common.methods.mothod1(banners)
    this.getDataList('/mobile/freeUse/getFreeUseProducts',1)
  },
  //获取产品
  getDataList(url,num){
    let _self=this
    let List = {
      url: url,
      data: {
        page: _self.data.page,
        rows: _self.data.rows
      },
      callback: function (res) {
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
    if (_self.data.productType){
      List.data.type = _self.data.productType
    }
    if (_self.data.time){
      List.data.time = _self.data.time
    }
    common.methods.mothod1(List)
  },
  //分类切换
  changeClass(e){
    // console.log(e.currentTarget.dataset.index)
    let _self=this
    if (e.currentTarget.dataset.index === 1 || e.currentTarget.dataset.index === 3 || e.currentTarget.dataset.index===this.data.classNum){
      return
    }
    let url = '/mobile/freeUse/getFreeUseProducts'
    this.setData({
      classNum: e.currentTarget.dataset.index,
      time: '',
      page:1,
      rows:10
    })
    if (e.currentTarget.dataset.index===0){
      this.setData({
        productType: 1
      })
    } else if (e.currentTarget.dataset.index === 2){
      this.setData({
        productType: 5,
      })
    }else{
      this.setData({
        productType: '',
      })
      url = '/mobile/freeUse/getWholePointFreeUseProducts'
      let timer={
        url:'/mobile/freeUse/getWholePointFreeUseTimes',
        data:{},
        callback:function(res){
          _self.setData({
            timeList: res.data.result,
          })
          res.data.result.forEach(function(val,index){
            if (val.isCurrentActivity===1){
              _self.setData({
                timeActive:index
              })
              return
            }
          })
         
        }
      }
      common.methods.mothod1(timer)
    }
    this.getDataList(url,1)
  },
  //进详情
  goDetial(e){
    wx:wx.navigateTo({
      url: '../detial/detial?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
//时间段
  gettimeDataList(e){
    if (e.currentTarget.dataset.index === this.data.timeActive){
      return
    }
    this.setData({
      timeActive: e.currentTarget.dataset.index,
      time: e.currentTarget.dataset.time,
      page:1,
      rows:10
    })
    this.getDataList('/mobile/freeUse/getWholePointFreeUseProducts',1)
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
  onPageScroll: function (e) { // 页面滚动触发事件的处理函数
    // console.log(e.scrollTop)
    if (e.scrollTop > 200) {
      this.setData({
        topTrue: true
      })
    } else {
      this.setData({
        topTrue: false
      })
    }
  },
  toScrollTop() {//回到顶部方法
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    if (this.data.productType === 1 || this.data.productType === 5){
      this.getDataList('/mobile/freeUse/getFreeUseProducts', 2)
    }else{
      this.getDataList('/mobile/freeUse/getWholePointFreeUseProducts', 2)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})