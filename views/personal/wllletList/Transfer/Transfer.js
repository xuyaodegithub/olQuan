// views/personal/wllletList/Transfer/Transfer.js
var common = require("../../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
//扫一扫
  openQrcode(){
    let _self=this
    wx.scanCode({
      onlyFromCamera: false,//是否只能从相机扫码，不允许从相册选择图片
      scanType: ['barCode', 'qrCode'],
      success(res) {
        console.log(res)
        let rgb = /^[a-zA-Z0-9\@]+$/
        if (rgb.test(res.result)){
          _self.setData({
            account: res.result
          })
        }else{
          wx.showToast({
            title: '请扫描正确二维码',
            icon:'none'
          })
        }
      },
      fail(err){
        console.log(err)
      }
    })
  },
  nextTo(){
    // let rgb = /^[a-zA-Z0-9\@]+$/
    if (this.data.account && this.data.account.length < 8){
      wx.showToast({
        title: '账号格式不正确',
        icon:'none'
      })
      return
    }
    if (this.data.account==='') {
      wx.showToast({
        title: '请输入账号或扫描对方二维码',
        icon: 'none'
      })
      return
    }
    let _self=this
    let data={
      url:'/mobile/gtransfer/validAccountNo',
      data:{
        accountNo: this.data.account
      },
      callback:function(res){
        if(res.data.result==1){
          wx.navigateTo({
            url: '../otherAccount/otherAccount?no=' + _self.data.account,
          })
        }else{
          wx.showModal({
            content: res.data.message,
            showCancel:false,
            confirmColor:'#931EFF',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    }
    common.methods.mothod1(data)
  },
  setAccount(e){
    let value = e.detail.value;
    this.setData({
      account: value.replace(/[^\w@]/g, "")
    })
    // this.accountId = this.accountId.replace(/[^\w@]/g, "");
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
  // onShareAppMessage: function () {

  // }
})