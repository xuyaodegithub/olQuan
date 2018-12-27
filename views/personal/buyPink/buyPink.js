// views/personal/buyPink/buyPink.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    curObj:[],
    showAddress:false,
    addressName:'',//收件人
    getGifTel:'',//收件人手机
    address:'',//详细地址
    coffersFee:0,//小金库
    amountFee:0,
    coffersFeeShow:false,//是否选择小金库
    pledgeMethod:'',//抵扣方式
    region: [],
    regionID: [],
    amountFeeShow: false,////是否选择余额
    cityDetail: '请选择收货地址',
    isOrderGet: false,
    isShowPass: false,
    AllAdressList: [],//全部省市区
    payPasswordShow:false,
    payPassword:'',
    doubleClick:true,
    addressId:'',
    addressObj:[],
    dh:'',
    isSuper:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.addressId) {
      this.setData({
        addressId: options.addressId,
      })
    }
    this.setData({
      orderList: wx.getStorageSync('buyPink'),
      isSuper: options.isSuper ? options.isSuper:''
    })
    this.getList();
    console.log(this.data.orderList)
  },
  //点击去首页
  getIndex(){
    wx.reLaunch({
      url: '/views/firstIndex/firstIndex',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击去试用
  getTryIndex() {
    wx.reLaunch({
      url: '/views/tryPage/tryPage"',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getAddressList(id){
    let _self = this
    let banners = {
      url: '/mobile/address/getAddress',
      data: {
        addressId:id,
      },
      callback: function (res) {
        _self.setData({
          addressObj:res.data.result,
          dh: res.data.result.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        })
      }
    }
    common.methods.mothod1(banners)
  },
  getList(){
    let _self = this
    let url
    let dataList
    if (this.data.isSuper!=1){
      url ='/mobile/store/applyToStoreConfirm';
      dataList={
        memberId: app.userId,
        giftBagId: _self.data.orderList.bagId,
        uutype: 1
      }
    }else{
      url = '/mobile/buySupervisor/newConfirmOrder';
      dataList = {
        memberId: app.userId,
        bagId: _self.data.orderList.bagId,
        uutype: 1
      }
    }
    let banners = {
      url: url,
      data: dataList,
      callback: function (res) {
        _self.setData({
          curObj: res.data.result,
          prodrctFee: res.data.result.totalFee.toFixed(2),
          finalPrice: res.data.result.totalFee,
          finalPriceObj: res.data.result.totalFee.toFixed(2),
        })
        if (res.data.result.receiveAddress==null){
          if(_self.data.isSuper!=1){
            _self.getAllcity();
            _self.setData({
              showAddress: true,
              addressId: '',
            })
          }else{
            wx.navigateTo({
              url: '/views/detial/addAdress/addAdress?backType=3',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
          
        }else{
          if(_self.data.addressId!=''){
            _self.getAddressList(_self.data.addressId)
          }else{
            _self.setData({
              showAddress: false,
              addressId: res.data.result.receiveAddress.id,
            })
            _self.getAddressList(res.data.result.receiveAddress.id)
          }
          
        }
      }
    }
    common.methods.mothod1(banners)
  },
  //选择地址
  getOtherAddress(){
    wx.navigateTo({
      url: '/views/detial/addAdress/addAdress?backType=3',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //获取全部城市
  getAllcity(){
    let _self=this;
    let banners = {
      url: '/mobile/city/getAllCity',
      data: {},
      callback: function (res) {
        _self.setData({
          AllAdressList: res.data.result
        })
      }
    }
    common.methods.mothod1(banners)
  },
    //收件人手机号
  clearMoregetGifTel(e){
    let valueNum = e.detail.value;
    valueNum = valueNum.replace(/[^\d]/g, '');
    this.setData({
      getGifTel: valueNum
    })
  },
  //收件人
  getAddressName(e){
    this.setData({
      addressName: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
    })
    let _self=this;
    let allId = []
    const choseAdres = this.data.region
    const allAdres = this.data.AllAdressList
    if (choseAdres[0] === '北京市' || choseAdres[0] === '天津市' || choseAdres[0] === '上海市' || choseAdres[0] === '重庆市') {
      choseAdres[0] = choseAdres[0].substring(0, 2)
    }
    // console.log(choseAdres)
    // if (choseAdres){}
    allAdres.map(function (val, index) {
      if (val.name === choseAdres[0]) {
        allId.push(val.id)
        val.childreList.map(function (item, key) {
          if (item.name === choseAdres[1]) {
            allId.push(item.id)
            item.childreList.map(function (itemSon, keyson) {
              if (itemSon.name === choseAdres[2]) {
                allId.push(itemSon.id)
                _self.setData({
                  regionID: allId
                })
                return
              }
            })
            return
          }
        })
        return
      }
    })
    // console.log(this.data.regionID)
  },
  getAddress(e){
    this.setData({
      address: e.detail.value
    })
  },
  //选择小金库
  inputCoofers(){
    this.setData({
      coffersFeeShow: !this.data.coffersFeeShow,
      amountFeeShow:false
    })
    if (this.data.coffersFeeShow){
      this.setData({
        pledgeMethod:2
      })
      if (this.data.curObj.coffers <= this.data.curObj.totalFee){
        this.setData({
          coffersFee: this.data.curObj.coffers,
          coffersFeeObj: this.data.curObj.coffers.toFixed(2)
        })
      }else{
        this.setData({
          coffersFee: this.data.curObj.totalFee,
          coffersFeeObj: this.data.curObj.totalFee.toFixed(2)
        })
      }
    }else{
      this.setData({
        coffersFee:0,
        pledgeMethod:'',
      })
    }
    this.setData({
      finalPriceObj: (this.data.finalPrice - this.data.coffersFee).toFixed(2)
    })
  },
  inputAmount(){
    this.setData({
      amountFeeShow: !this.data.amountFeeShow,
      coffersFeeShow: false
    })
    if (this.data.amountFeeShow) {
      this.setData({
        pledgeMethod: 3
      })
      if (this.data.curObj.amount <= this.data.curObj.totalFee) {
        this.setData({
          amountFee: this.data.curObj.amount,
          amountFeeObj: this.data.curObj.amount.toFixed(2)
        })
      } else {
        this.setData({
          amountFee: this.data.curObj.totalFee,
          amountFeeObj: this.data.curObj.totalFee.toFixed(2)
        })
      }
    } else {
      this.setData({
        amountFee: 0,
        pledgeMethod: '',
      })
    }
    this.setData({
      finalPriceObj: (this.data.finalPrice - this.data.amountFee).toFixed(2)
    })
  },
  cancelTixian(){
    this.setData({
      payPasswordShow:false,
    })
  },
  getpayPassword(e){
    this.setData({
      payPassword: e.detail.value
    })
  },
  //提交
  payOrder(){
    
    let _self = this;
    if (Number(this.data.amountFee) == 0 && Number(this.data.coffersFee) == 0){
      this.setData({
        isShowPass:true
      })
    }else{
      this.setData({
        isShowPass: false
      })
    }
   
    if (this.data.curObj.receiveAddress==null){
      
      if (this.data.addressName==''){
        wx.showToast({
          title: '请输入收货人姓名',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.data.getGifTel == '' || this.data.getGifTel.length != 11){
        wx.showToast({
          title: '请输入正确收货手机号码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.data.region.length==0 || this.data.address==''){
        wx.showToast({
          title: '请输入收货地址',
          icon: 'none',
          duration: 2000
        })
        return
      }
      
      
    }
    if (this.data.curObj.enabledPayPassword == 1 && !this.data.isShowPass) {
      this.setData({
        payPasswordShow: true,
      })

    } else {
      wx.showLoading()
      this.sureOrderPay();
    }
  },
  passworeTixian(){
    if (this.data.payPassword==''){
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading()
    this.sureOrderPay();
  },
  //提交订单
  sureOrderPay(){
    let _self=this;
    let dataList
    let url
    if(this.data.isSuper!=1){
      url ='/mobile/store/newApplyToStore'
      dataList = {
        memberId: app.userId,
        giftBagId: _self.data.orderList.bagId,
        addressId: _self.data.addressId,
        payMethod: 6,//小程序支付
        pledgeMethod: _self.data.pledgeMethod,
        inviteCode: _self.data.orderList.inviteId,
        // inviteCode:"15658160809",
        uutype: app.uutype,
        provinceId: _self.data.regionID[0],
        cityId: _self.data.regionID[1],
        districtId: _self.data.regionID[2],
        address: _self.data.address,
        addressMobile: _self.data.getGifTel,
        addressName: _self.data.addressName,
      }
    }else{
      dataList = {
        memberId: app.userId,
        bagId: _self.data.orderList.bagId,
        addressId: _self.data.addressId,
        payMethod: 6,//小程序支付
        pledgeMethod: _self.data.pledgeMethod,
        inviteCode: _self.data.orderList.inviteId,
        // inviteCode:"15658160809",
        uutype: app.uutype,
      }
      url = '/mobile/buySupervisor/newCreateOrder'
    }
    
    if (_self.data.payPasswordShow){
      dataList.payPassword = utilMd5.hexMD5(this.data.payPassword)
    }
    _self.setData({
      doubleClick:false,
    })
    console.log(dataList)
    let banners = {
      url: url,
      data: dataList,
      callback: function (res) {
        wx.hideLoading()
        _self.setData({
          doubleClick:true
        })
        if(res.data.code==0){
          if (res.data.result.payInfo){
            wx.requestPayment({
              timeStamp: res.data.result.payInfo.timeStamp,
              nonceStr: res.data.result.payInfo.nonceStr,
              package: res.data.result.payInfo.package_,
              signType: res.data.result.payInfo.signType,
              paySign: res.data.result.payInfo.paySign,
              success(res1) {
                // wx.showToast({ title: '支付成功', icon: 'none' })
                _self.setData({
                  payPasswordShow: false,
                  orderSucessBak:true
                })
              },
              fail(res) {
                // wx.showToast({ title: '支付失败', icon: 'none' })
              }
            })
          }
        } else if (res.data.code == 2){
          wx.reLaunch({
            url: '/views/detial/paySuccess/paySuccess?orderMess=' + res.data.result.orderPayRecordNo
          })
        } else if (res.data.code == 1){
          _self.setData({
            payPasswordShow:false,
            orderSucessBak: true
          })
        }else{
          wx.showToast({ title: res.data.message, icon: 'none' })
        }
      }
    }
    common.methods.mothod3(banners)
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  
})