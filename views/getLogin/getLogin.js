// views/getLogin/getLogin.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },


  bindGetUserInfo:  function (e) {
    var  that  =  this;
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    if (e.detail.userInfo){
      // if (!app.type){
      //   wx.reLaunch({
      //     url: '/views/firstIndex/firstIndex'
      //   })
      // }else{
      //   wx.reLaunch({
      //     url: '../' + app.type + '/' + app.type
      //   })
      // }
      let callBackUrl = wx.getStorageSync('callBackUrl')
      if (callBackUrl){
        let url = '/' + callBackUrl.url
        if (callBackUrl.id){
          url = '/' + callBackUrl.url + '?id=' + callBackUrl.id
        }
        if (callBackUrl.type){
          url += '&type=' + callBackUrl.type
        }
        if (callBackUrl.recId) {
          url += '&recId=' + callBackUrl.recId
        }
        if (callBackUrl.inviteId) {
          url += '?inviteId=' + callBackUrl.inviteId
        }
        if (callBackUrl.inviteMemberId) {
          url += '&inviteMemberId=' + callBackUrl.inviteMemberId
        }
        if (callBackUrl.isShare) {
          url += '&isShare=' + callBackUrl.isShare
        }
        console.log(url)
        wx.reLaunch({
          url: url
        })
      }else{
        wx.reLaunch({
          url: '/views/firstIndex/firstIndex'
        })
      }
    }else{
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
    //接下来写业务代码
    //最后，记得返回刚才的页面
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.scene)
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