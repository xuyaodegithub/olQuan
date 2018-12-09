// seachSome/seachsome.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  value:'',
  seachList:[],//搜索记录
  hostseachList:[],//热门搜索记录
  placeholder:''
  },
  seachSome(e){
    let str = e.detail.value
    if (str){
      wx.navigateTo({
        url: '../screenProduct/screenProduct?KeyWord=' + str
      })
    }else{
      wx.navigateTo({
        url: '../screenProduct/screenProduct?KeyWord=' + this.data.placeholder
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      placeholder: options.value
    })
    this.getseachRecord()
  },
  //获取搜索记录
  getseachRecord() { 
    let _self=this
    let data={
      url: '/mobile/search/searchRecords',
      data:{
        memberId:app.userId
      },
      callback:function(res){
          _self.setData({
            seachList: res.data.result.memberSearchRecords,
            hostseachList: res.data.result.hotSearchRecords
          })
      }
    }
    common.methods.mothod1(data)
  }, 
  deleteThose(){//删除记录
    let _self = this
    let data = {
      url: '/mobile/search/cleanSearchRecord',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          seachList: [],
          // hostseachList: []
        })
      }
    }
    common.methods.mothod1(data)
  },
  //进入搜索结果页面
  goscreen(e){
    // e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../screenProduct/screenProduct?KeyWord=' + e.currentTarget.dataset.item.value
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
  // onPullDownRefresh: function () {
  
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  
  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})