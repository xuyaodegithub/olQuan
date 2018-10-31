// views/plusPage/plusPage.js
var common = require("../../utils/common.js")
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      banners:[],
      advers:[],
      classBtn: ['今日特卖', '|', '热门特卖', '|','明日预告'],
      classNum:0,
      page:1,
      rows:10,
      type:1,
      dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self=this
      let banners={
        url:'/mobile/plus/advers',
        data:{
          memberId: app.userId
        },
        callback:function(res){
          _self.setData({
            banners: res.data.result.banners,
            advers: res.data.result.advers
          })
        }
      }
    common.methods.mothod1(banners)
    this.getDatalist()
  },
  //分类切换
  changClass(e){
    if (this.data.classNum === e.currentTarget.dataset.index){
      return
    }else{
      this.setData({
        classNum: e.currentTarget.dataset.index
      })
    }
  },
  //今日特卖、明日预告
  getDatalist(){
    let _self=this
      let data={
        url:'/mobile/plus/timeProduct',
        data: {
          memberId: app.userId,
          page: this.data.page,
          rows: this.data.rows,
          type: this.data.type
          },
          callback:function(res){
            _self.setData({
              dataList:res.data.result
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