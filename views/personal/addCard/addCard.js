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
    cangetCode:false,
    graphicCode:false,
    isHasMobile:false,
    time:'',
    isDisabled:true,
    currentTime:60,
    graphCode:'',
    cityDetail:'请选择开户城市',
    dataList:{},
    isWaithDraw:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    common.methods.getLoginMess(this.getMember, this);
    if (options.isWaithDraw==1){
      this.setData({
        isWaithDraw: 1,
      })
    }
    if (options.modify){
      this.setData({
        accountId: options.accountId,
      })
      this.modifyCardDetail();
    }
  },
  //修改信息时
  modifyCardDetail(){
    let _self=this;
    let banners = {
      url: '/mobile/memberAccount/accountById',
      data: {
        memberId: app.userId,
        accountId:_self.data.accountId
      },
      callback: function (res) {
        _self.setData({
          type: res.data.result.type,
          id: res.data.result.accountId,
          accountNo2: res.data.result.accountNo,
          accountNo: res.data.result.accountNo,
          accountName: res.data.result.accountName,
          accountBank: res.data.result.detailBank,
          cityName: res.data.result.city,
          isDefalutSrc: res.data.result.isDefault,
          cityDetail: res.data.result.city
        })
        if (res.data.result.isDefault){
          _self.setData({
            isDefalut:true
          })
        }else{
          _self.setData({
            isDefalut: false
          })
        }
      }
    }
    common.methods.mothod1(banners)
  },
  //绑定账户
  sureCreate(){
    if(this.data.type==2){
      if (this.data.accountName == '' || this.data.accountNo == '' || this.data.accountBank == '' || this.data.accountBankS=='' || this.data.cityName==''){
        wx.showToast({
          title: '请填写完成信息！!',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    if(this.data.type==1){
      if (this.data.accountName == '' || this.data.accountNo==''){
        wx.showToast({
          title: '请填写完成信息！',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    if(this.data.code==''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.accountNo!=this.data.accountNo2){
      wx.showToast({
        title: '2次输入账号不同',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.type == 1){
      this.setData({
        dataList: {
          memberId: app.userId,
          type: this.data.type,
          id: this.data.accountId,
          accountNo: this.data.accountNo,
          accountName: this.data.accountName,
          code: this.data.code,
          isDefault: this.data.isDefalutSrc,
        }
      })
      
    }else{
      this.setData({
        dataList: {
          memberId: app.userId,
          type: this.data.type,
          id: this.data.accountId,
          accountNo: this.data.accountNo,
          accountName: this.data.accountName,
          accountBank: this.data.accountBank + '-' + this.data.accountBankS,
          cityName: this.data.cityName,
          code: this.data.code,
          isDefault: this.data.isDefalutSrc,
        }
      })
    }
    let _self = this
    let banners = {
      url: '/mobile/memberAccount/save',
      data: _self.data.dataList,
      callback: function (res) {
        wx.navigateBack({
          url: '../bankCard/bankCard?isWaithDraw=' + _self.data.isWaithDraw ,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        
      }
    }
    common.methods.mothod1(banners)
  },
  //
  //取消绑定手机号
  colseMobile(){
    this.setData({
      isHasMobile: false,
    })
  },
  //点击获取验证码
  getGraphicCode(){
    if(!this.data.memberList.mobile){
      this.setData({
        isHasMobile: true,
      })
    }else{
      this.getGraphCodeDetail();
      this.setData({
        graphicCode: true
      })
      
    }
    // this.setData({
    //   isDisabled: false
    // })
    // this.getCode();
  },
  getCode(){
    var that = this;
    var interval 
    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + 's后重新发送'
    })
    interval = setInterval(function () {
      that.setData({
        time: (currentTime - 1) + 's后重新发送'
      })
      currentTime--;
      if (currentTime <= 0) {
        console.log(currentTime)
        clearInterval(interval)
        that.setData({
          currentTime: 60,
          isDisabled: true
        })
      }
    }, 1000)
  },
  //刷新图形码
  codeRefresh(){
    this.getGraphCodeDetail();
  },
  //关闭获取图形码
  colseCodeGet(){
    this.setData({
      graphicCode: false
    })
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
        console.log(res.data.result)
        if (!res.data.result.mobile){
          _self.setData({
            isHasMobile: true,
          })
        }else{
          _self.setData({
            isHasMobile: false,
          })
        }
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
  //输入图形码
  inputGraphicCode(e){
    this.setData({
      graphCode: e.detail.value
    })
    if (e.detail.value.length==4){
      this.setData({
        cangetCode: true
      })
    }else{
      this.setData({
        cangetCode: false
      })
    }
  },
  //发送验证码
  sendCode(){
    let _self = this;
    let dataList={
      memberId: app.userId,
      mobile: _self.data.memberList.mobile,
      graphCode: _self.data.graphCode
    }
    console.log(dataList)
    wx.request({
      url: app.baseUrl + '/mobile/code/sendCode2',
      data: {
        memberId: app.userId,
        mobile: _self.data.memberList.mobile,
        graphCode: _self.data.graphCode
      },
      dataType: 'json',
      method: 'POST',
      header: {
        'cookie': wx.getStorageSync("sessionid"),//读取cookie
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '发送成功',
            icon: 'none',
            duration: 2000
          })
          _self.setData({
            isDisabled: false,
            graphicCode: false,
            graphCode:'',
            cangetCode:false
          })
          _self.getCode();
        } else {
          _self.getGraphCodeDetail();
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '请求错误',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  accountNameDetail(e){
    this.setData({
      accountName: e.detail.value
    })
  },
  codeDetail(e){
    this.setData({
      code: e.detail.value
    })
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