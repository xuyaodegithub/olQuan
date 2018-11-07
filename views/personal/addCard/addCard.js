// views/personal/addCard/addCard.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    imgurl:'',
    userImageBase64:'',
    region: [],
    bankLisr: ["请选择开户银行","中国人民银行","中国工商银行","中国农业银行","中国建设银行","中国招商银行","中国银行","上海浦发银行","广发银行","民生银行","平安银行","光大银行","兴业银行","中信银行","上海银行","宁波银行","交通银行","深圳发展银行","中国邮政储蓄银行"],
    index:0,
    type:2,
    memberList:[],
    isDefalut:true,
    isDefalutSrc:1,
    accountNo:'',
    accountNo2:'',
    accountName:'',
    accountBank:'',
    accountBankS:'',
    cityName:'',
    code:'',
    accountId:'',
    graphCodeSrc:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    common.methods.getLoginMess(this.getMember);
    this.getGraphCodeDetail();
  },
  //绑定账户
  sureCreate(){
    if(this.data.type==2){
      if (this.data.accountName == '' || this.data.accountNo == '' || this.data.accountBank == '' || this.data.accountBankS=='' || this.data.cityName==''){
        wx.showToast({
          title: '请填写完成信息！',
          icon: 'none',
          duration: 2000
        })
      }
    }
    if(this.data.type==1){
      if (this.data.accountName == '' || this.data.accountNo==''){
        wx.showToast({
          title: '请填写完成信息！',
          icon: 'none',
          duration: 2000
        })
      }
    }
    if(this.data.code==''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
    }
    if(this.data.accountNo!=this.data.accountNo2){
      wx.showToast({
        title: '2次输入账号不同',
        icon: 'none',
        duration: 2000
      })
    }
    let accountBankSend=''
    if (this.data.accountBank!='' && this.data.accountBankS!=''){
      accountBankSend = this.data.accountBank + '-' + this.data.accountBankS;
    }else{
      accountBankSend='';
    }
    let data ={
      memberId: app.userId,
      type:this.data.type,
      id: this.data.accountId,
      accountNo: this.data.accountNo,
      accountName: this.data.accountName,
      accountBank:accountBankSend,
      cityName: this.data.cityName,
      code:this.data.code,
      isDefault:this.data.isDefalutSrc,
    }
    console.log(data);
  },
  cheshi(){

  },
  //进入加载
  getMember() {
    let _self = this
    let banners = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId,
       
      },
      callback: function (res) {
        _self.setData({
          memberList: res.data.result,
        })
      }
    }
    common.methods.mothod1(banners)
  },
  //获取图形码
  getGraphCodeDetail(){
    let _self = this;
    let banners = {
      callback: function (res) {
        let base64 = wx.arrayBufferToBase64(res.data);
        _self.setData({
          imgurl: "data:image/png;base64," + base64,
        })
      }
    }
    common.methods.getGraphCode(banners)
  },
  accountNoDeatil(e){
    this.setData({
      accountNo: e.detail.value
    })
  },
  accountNo2Detail(e){
    this.setData({
      accountNo2: e.detail.value
    })
  },
  accountBankStr(e){
    this.setData({
      accountBankS: e.detail.value
    })
  },
  changeTypeTwo(){
    this.setData({
      type: 2,
      region:[],
      index:0
    })
  },
  changeTypeNoe() {
    this.setData({
      type: 1,
      accountBankS:'',
      accountNo:'',
      accountNo2:'',
      cityName:'',
      accountBank:'',
    })
  },
  bindRegionChange: function (e) {
    console.log(this.data.region.length)
    this.setData({
      region: e.detail.value,
      cityName: e.detail.value[0] + e.detail.value[1]
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      accountBank: this.data.bankLisr[e.detail.value]
    })
  },
  //是否设置默认账户
  changeDefalut(){
    this.setData({
      isDefalut: !this.data.isDefalut
    })
    if (this.data.isDefalut){
      this.setData({
        isDefalutSrc: 1
      })
    }else{
      this.setData({
        isDefalutSrc: '',
      })
    }
    console.log(this.data.isDefalutSrc)
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