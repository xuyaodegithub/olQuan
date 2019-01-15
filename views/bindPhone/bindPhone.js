// views/bindPhone/bindPhone.js
var common = require('../../utils/common.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isAlert:false,
    phone:'',//手机号
    yzma:'',//手机验证码
    txma:'',//图像验证码
    TXmaimg:'',//图像验图片
    oldCode:'',//原手机code
    btnActive:false,
    backType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type){
        this.setData({
          type: options.type,
          oldCode: options.code
        })
      }
    console.log(options)
    console.log(options.type==1)
  },
  closeAlert(){
    this.setData({
      isAlert:false
    })
  },
  //input事件
  changeValue(e){
    if (e.currentTarget.dataset.num==1){
      this.setData({
        phone: e.detail.value
      })
    } else if (e.currentTarget.dataset.num == 2){
      this.setData({
        yzma: e.detail.value
      })
    }else{
      this.setData({
        txma: e.detail.value
      })
      if (e.detail.value.toString().length==4){
          this.setData({
            btnActive:true
          })
      }
    }
  },
  //打开弹框
  openAlert(){
    if (this.data.phone.toString().length<11){
      wx.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }
    this.setData({
      isAlert:true
    })
    this.getTXma()
  },
  //获取图形码
  getTXma(){
    let _self=this
    let data={
      callback:function(res){
        let base64 = wx.arrayBufferToBase64(res.data);
        _self.setData({
          TXmaimg: "data:image/png;base64," + base64,
        })
      }
    }
    common.methods.getGraphCode(data)
  },
  tosure(){
    if (this.data.txma){
      this.sendPhone()
    }else{
      wx.showToast({ title: '请先填写验证码', icon: 'none' })
    }
  },
  //发送验证码
  sendPhone(){
    let _self=this
    let data={
      url:'/mobile/code/sendCode2',
      data:{
        memberId: app.userId,
        mobile:this.data.phone,
        graphCode: this.data.txma
      },
      callback:function(res){
        wx.showToast({title: '发送成功',icon:'none'})
        _self.setData({
          isAlert: false
        })
      }
    }
    common.methods.mothod1(data)
  },
  //绑定手机号
  allPhone(){
    if (this.data.phone===''){
      wx.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (this.data.yzma===''){
      wx.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    if (this.data.yzma.length!=6) {
      wx.showToast({ title: '请输入6位数验证码', icon: 'none' })
      return
    }
    let _self=this
    let dataList={
      memberId: app.userId,
      mobile: this.data.phone,
      code: this.data.yzma
    }
    if(this.data.type==1){
      dataList.oldCode=this.data.oldCode
    }
    console.log(dataList)
    let data={
      url:'/mobile/member/boundMobile',
      data: dataList,
      callback:function(res){
        if (_self.data.type==1){
          wx.redirectTo({
            url: '/views/personal/mySet/mySet',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }else{
          app.memberData.mobile = _self.data.phone
          wx.navigateBack({
            delta: 1
          })
        }
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
  // onShareAppMessage: function () {

  // }
})