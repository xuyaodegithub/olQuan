// views/plusPage/plusPage.js
var common = require("../../utils/common.js")
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      dataType:9,
      banners:[],
      advers:[],
      classBtn: ['今日特卖', '|', '热门特卖', '|','明日预告'],
      classNum:0,
      page:1,
      rows:10,
      type:1,
      dataList:[],
      isGetStoreCommission:'',
      topTrue:false,
      classTop: false,
      classTopNum:'',
      DialogMess: [],
      isDialog: false,
      seachValue:'',
    isStartOrClose: true,
    GetscrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(this.route)
    // if (options.type) {
    //   app.type = options.type
    // }
    common.methods.getLoginMess(this.firstPage,this)
    // this.setTop('#classTopTT')
  },
  setTop(str) {
    let _self = this
    let query = wx.createSelectorQuery()
    query.select(str).boundingClientRect((rect) => {
      console.log(rect.top)
        _self.setData({
          classTopNum: rect.top
        })
    }).exec()
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
        }, _self.setTop('#classTopTT'))
      }
    }
    common.methods.mothod1(banners)
    this.getDatalist('/mobile/plus/timeProduct',1)
    this.getTankuang()
    this.getSeachValue()
  },
  //搜索内容
  getSeachValue() {
    let _self = this
    let data = {
      url: '/mobile/find/getSearchRemind',
      data: {
        memberId: app.userId,
        type: 2
      },
      callback: function (res) {
        _self.setData({
          seachValue: res.data.result
        })
      }
    }
    common.methods.mothod1(data)
  },
  //分类切换
  changClass(e){
    if (this.data.classNum === e.currentTarget.dataset.index || e.currentTarget.dataset.index === 1 || e.currentTarget.dataset.index === 3){
      return
    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
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
    wx.showLoading({
      mask: true
    })
    console.log(e)
    wx.navigateTo({
      url: '../detial/detial?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
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
    if (!this.data.isStartOrClose) { return }
    let _self = this
    this.setData({
      isStartOrClose: false,
      GetscrollTop: e.scrollTop
    }, () => {
      setTimeout(() => {
        _self.setData({
          isStartOrClose: true
        })
      }, 50)
    })
    // if (e.scrollTop > 250) {
    //   this.setData({
    //     topTrue: true
    //   })
    // } else {
    //   this.setData({
    //     topTrue: false
    //   })
    // }
    // if (e.scrollTop > this.data.classTopNum)
    // this.setData({
    //   classTop:true
    // })
    // else 
    // this.setData({
    //   classTop: false
    // })
  },
  //分享赚
  sharePeople(){

  },
  //弹框类型
  goactiveAA(e) {
    11//活动
    let item = e.currentTarget.dataset.item
    if (item.type == 11) {
      wx.navigateTo({
        url: '/views/activePage/activePage?id=' + item.url.split('id=')[1],
      })
    } else if (item.type == 1) {
      wx.navigateTo({
        url: '/views/tryPage/tryPage',
      })
    } else {

    }
    this.setdialog(item.dialogId)
  },
  //弹框记录
  setdialog() {
    let data = {
      url: '/mobile/index/openDialog',
      data: {
        memberId: app.userId,
        dialogId: id
      },
      callback: function (res) {
        console.log('success')
      }
    }
    common.methods.mothod1(data)
  },
  //关闭弹框
  closeDG() {
    this.setData({
      isDialog: false,
    })
  },
  //弹框信息
  getTankuang() {
    let _self = this
    let data = {
      url: '/mobile/index/getDialog',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        if (res.data.result.length > 0) {
          _self.setData({
            isDialog: true
          })
        }
        _self.setData({
          DialogMess: res.data.result
        })
      }
    }
    common.methods.mothod1(data)
  },
  //遮罩穿透
  myCatchTouch() {
    return
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
      console.log(ops)
      return{
        title: ops.target.dataset.item.productName,
        path: '/views/detial/detial?id=' + ops.target.dataset.item.productId + '&recId=' + app.userId+'&isMore=1',//当前页面 path ，必须是以 / 开头的完整路径
        imageUrl: ops.target.dataset.item.productImage,
        success: function (res) {
          //成功
          console.log(999)
        },
        fail: function (res) {
          // 转发失败
          console.log(res);
        }
      }
    }else{
      return {
        title: '特卖',
        path: '/views/plusPage/plusPage',//当前页面 path ，必须是以 / 开头的完整路径
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
  }
})
