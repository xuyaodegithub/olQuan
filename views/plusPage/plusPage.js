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
      dataList:[],
      isGetStoreCommission:'',
      topTrue:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      app.type = options.type
    }
    common.methods.getLoginMess(this.firstPage)
    
    // let _self=this
    // if (app.userId){
    //   this.firstPage()
    // }else{
    //   app.getLogin().then(function(res){
    //     _self.firstPage()
    //   }).catch(function(err){
    //     console.log(err)
    //   })
    // }
  },
  //首次进入
  firstPage(){
    let _self = this
    _self.setData({
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
    this.getDatalist('/mobile/plus/timeProduct',1)
  },
  //分类切换
  changClass(e){
    if (this.data.classNum === e.currentTarget.dataset.index || e.currentTarget.dataset.index === 1 || e.currentTarget.dataset.index === 3){
      return
    }
    this.setData({
      classNum: e.currentTarget.dataset.index,
      page: 1,
      rows: 10
    })
    if (e.currentTarget.dataset.index===0){
        this.setData({
          type:1,
        })
        this.getDatalist('/mobile/plus/timeProduct',1)
      } else if (e.currentTarget.dataset.index === 4){
          this.setData({
            type: 2,
          })
      this.getDatalist('/mobile/plus/timeProduct',1)
    } else if (e.currentTarget.dataset.index === 2){
      this.setData({
        type:'',
      })
      this.getDatalist('/mobile/plus/recommendProduct',1)
      }
  
  },
  //今日特卖、明日预告
  getDatalist(str,which){
    // console.log(app.isGetStoreCommission + '--' + app.userId + '--' + app.openId + '--' + app.unionid + '--')
    let _self=this
      let data={
        url:str,
        data: {
          memberId: app.userId,
          page: this.data.page,
          rows: this.data.rows
          },
          callback:function(res){
            if(which===1){
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
    if(this.data.type){
      data.data.type = this.data.type
    }
    common.methods.mothod1(data)
  },
  goDetial(e){
    console.log(e)
    wx.navigateTo({
      url: '../detial/detial?plusId=' + e.currentTarget.dataset.plusid,
    })
  },
  toScrollTop() {//回到顶部方法
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
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
    let _self = this
    // wx.startPullDownRefresh()
    wx.showNavigationBarLoading()
    _self.setData({
      page: 1,
      rows: 10,
      classNum: 0,
      type:1
    })
    let data = {
      url: '/mobile/plus/timeProduct',
      data: { page: 1, rows: 10, memberId: app.userId, type: this.data.type },
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
  onReachBottom: function () {
      this.setData({
        page:this.data.page+1
      })
    if (this.data.classNum === 0 || this.data.classNum === 4){
      this.getDatalist('/mobile/plus/timeProduct',2)
    }else{
      this.getDatalist('/mobile/plus/recommendProduct', 2)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮、、menu
      console.log(ops.target)
    }
    return {
      title: '特卖',
      path: '/views/plusPage/plusPage?type=plusPage',//当前页面 path ，必须是以 / 开头的完整路径
      success: function (res) {
        //成功
        console.log(999)
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  }
})