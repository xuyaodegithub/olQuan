// views/personal/withDraw/withDraw.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    memberList:[],
    moreMoney:false,
    poundage:'',
    accountMoney:'',
    accountName:'',
    acconuntNo:'',
    acconuntId:'',
    optionsId:'',
    accountType:'',
    graphicCode: false,
    cangetCode: false,
    imgurl:'',
    sureMobile:false,
    isDisabled: true,
    currentTime: 60, 
    time: '',
    code:'',
    doubleClick:true,//阻止二次点击
    isPassword:false,
    payPassword:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.accountId)
    if (options.accountId){
      console.log(1)
      this.setData({
        optionsId:1,
        accountName: options.accountName,
        acconuntNo: options.accountNo,
        acconuntId: options.accountId,
        accountType: options.accountType
      })
    }
    common.methods.getLoginMess(this.getMember,this)
    
  },
  //输入验证码提现
  telSureChange(){
    if(this.data.code.length!=6){
      wx.showToast({
        title: '请输入6位数验证码',
        icon: 'none'
      });
      return
    }
    this.setData({
      doubleClick:false,
    })
    let _self =this;
    let banners = {
      url: '/mobile/withdraw/withdrawAmount',
      data: {
        memberId: app.userId,
        accountId: _self.data.acconuntId,
        amount:_self.data.inputValue,
        code:_self.data.code
      },
      callback: function (res) {
        if(res.data.code==0){
          _self.getMember();
          _self.setData({
            sureMobile: false,
            moreMoney: false,
            inputValue: '',
          })
          
        } else if (res.data.code == 4){
          wx.showToast({
            title: '验证码错误',
            icon:'none'
          });
          _self.setData({
            doubleClick: true,
          })
        }else{
          _self.setData({
            doubleClick: true,
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }
        
      }
    }
    common.methods.mothod3(banners)
  },
  //密码提现
  passworeTixian(){
    this.setData({
      doubleClick: false,
    })
    let _self = this;
    let banners = {
      url: '/mobile/withdraw/withdrawAmount',
      data: {
        memberId: app.userId,
        accountId: _self.data.acconuntId,
        amount: _self.data.inputValue,
        payPassword: utilMd5.hexMD5(_self.data.payPassword)
      },
      callback: function (res) {
        if (res.data.code == 0) {
          _self.getMember();
          _self.setData({
            isPassword: false,
            moreMoney: false,
            inputValue:'',
          })

        } else {
          _self.setData({
            doubleClick: true,
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }

      }
    }
    common.methods.mothod3(banners)
  },
  getWxGraphCode(){
    // this.setData({
    //   isDisabled: false
    // })
    // this.getCode();
    this.setData({
      graphicCode:true
    })
    this.getGraphCodeDetail();
  },
  //获取图形码
  getGraphCodeDetail() {
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
  //输入条形码
  inputGraphicCode(e) {
    this.setData({
      graphCode: e.detail.value
    })
    if (e.detail.value.length == 4) {
      this.setData({
        cangetCode: true
      })
    } else {
      this.setData({
        cangetCode: false
      })
    }
  },
  //发送验证码
  sendCode() {
    let _self = this;
    let dataList = {
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
            graphCode: '',
            cangetCode: false
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
  getCode() {
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
  codeRefresh() {
    this.getGraphCodeDetail();
  },
  //关闭获取图形码
  colseCodeGet() {
    this.setData({
      graphicCode: false
    })
  },
  //关闭手机验证码提现
  colseMobile(){
    this.setData({
      sureMobile: false
    })
  },
  //选择提现账号
  chooseAccountId(){
    wx.navigateTo({
      url: '../bankCard/bankCard?isWaithDraw=1',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //进入加载
  getMember() {
    let _self = this
    let banners = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        if(_self.data.optionsId){
          _self.setData({
            memberList: res.data.result,
          })
        }else{
          
          _self.setData({
            memberList: res.data.result,
            accountName: res.data.result.accountName,
            acconuntNo: res.data.result.accountNo2,
            acconuntId: res.data.result.accountId
          })
        }
        
      }
    }
    common.methods.mothod1(banners)
  },
  //点击全部提现
  getAllMoney(){
    if (this.data.memberList.amount<200){
      wx.showToast({
        title: '余额不足200，无法提现',
        icon:'none'
      })
      return
    }
    this.setData({
      moreMoney:true,
      inputValue: this.data.memberList.amount,
      poundage: (this.data.memberList.amount * 0.01).toFixed(2),
      accountMoney: (this.data.memberList.amount - this.data.memberList.amount * 0.01).toFixed(2),
    })
  },
  //确认提现
  sureGetAllMoney(){
    if (this.data.acconuntId == '' || this.data.acconuntId == null || this.data.acconuntId == undefined){
      wx.showToast({
        title: '请选择提现账号',
        icon: 'none',
        duration: 2000
      })
      return 
    }
    if (this.data.inputValue == ''){
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000
      })
      return 
    } else if (this.data.inputValue<200){
      wx.showToast({
        title: '最低提现金额为200元',
        icon: 'none',
        duration: 2000
      })
      return 
    } else if (this.data.inputValue > this.data.memberList.amount){
      wx.showToast({
        title: '余额不足',
        icon: 'none',
        duration: 2000,
        
      })
      return 
    }
    console.log(this.data.memberList.enabledPayPassword)
    if (this.data.memberList.enabledPayPassword ==1){
      this.setData({
        isPassword: true
      })
      return
    }else{
      this.setData({
        sureMobile: true
      })
    }
  },
  //输入密码 取消提现
  cancelTixian(){
    this.setData({
      isPassword: false
    })
  },
  //点击余额明细
  lookMoney(){
    wx: wx.navigateTo({
      url: '../wllletList/walletList?type=1&number=' + this.data.memberList.amount,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //提现记录
  presentRecrdList(){
    wx: wx.navigateTo({
      url: '../presentRecord/presentRecord',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //获取验证码code
  getCodeDetail(e){
    this.setData({
      code: e.detail.value
    })
  },
  //输入密码提现
  getpayPassword(e){
    this.setData({
      payPassword: e.detail.value
    })
  },
  //input正则
  bindKeyInput(e){
   
    let valueNum = e.detail.value;
    //清除"数字"和"."以外的字符
    valueNum = valueNum.replace(/[^\d.]/g, "");

    //验证第一个字符是数字而不是
    valueNum = valueNum.replace(/^\./g, "");

    //只保留第一个. 清除多余的
    // console.log(this.addObj.totalFee)

    valueNum = valueNum.replace(/\.{2,}/g, ".");
    valueNum = valueNum.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    //只能输入两个小数
    valueNum = valueNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (valueNum >= 200) {
      this.setData({
        moreMoney: true,
        poundage: (valueNum*0.01).toFixed(2),
        accountMoney: (valueNum - valueNum*0.01).toFixed(2),
      })
    } else {
      this.setData({
        moreMoney: false
      })
    }
    this.setData({
      inputValue: valueNum
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
  onShow: function (options) {
   
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