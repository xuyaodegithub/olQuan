// views/company/company.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noPlay:false,
    showTwo:true,
    showOne:true,
    controls1: false,
    controls2:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  paly(e){
    let type = e.currentTarget.dataset.type
    let strobj
    if(type==2){
      strobj=wx.createVideoContext('video2')
       this.setData({
          showTwo:false,
         controls2:true,
        })
      wx.createVideoContext('video1').pause()
    }else{
      strobj = wx.createVideoContext('video1')
      wx.createVideoContext('video2').pause()
        this.setData({
          showOne: false,
          controls1:true
        })
    }
    strobj.play()
    // this.setData({
    //   showTwo:false,
    //   showOne:false
    // })
  },
  goplay() {
    wx.createVideoContext('video2').pause()
    this.setData({
      showOne: false,
      controls1: true
    })
  },
  goplay2(){
    this.setData({
      showTwo: false,
      controls2: true,
    })
    wx.createVideoContext('video1').pause()
  },
  stopVideo1() {
    this.setData({
      showOne: true
    })
   },
  stopVideo2(){
    this.setData({
      showTwo: true,
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
      title: '杭州天天电子商务有限公司企业简介',
      path: '/views/company/company',//当前页面 path ，必须是以 / 开头的完整路径
      imageUrl: '/image/123.png',//转发图标
      // desc: this.data.productData.summary,
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