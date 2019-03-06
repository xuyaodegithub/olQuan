// views/personal/wllletList/otherAccount/otherAccount.js
var common = require("../../../../utils/common.js")
var md5 = require('../../../../utils/md5.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountMess:'',
    accountNo:'',
    numValue:'',
    isPasswordShow:false,
    isPassword:'',
    sureMobile: false,
    isDisabled: true,
    memberList:'',
    graphicCode: false,
    cangetCode:false,
    imgurl:'',
    graphCode:'',
    currentTime:60,
    whichPay:0,
    accountId:'',
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      accountId: options.no
    })
    this.getOtherMess(options)
    this.getMember()
  },
  getOtherMess(options){
    let _self=this
    let data={
      url:'/mobile/gtransfer/getAccountInfo',
      data:{
        accountNo: options.no
      },
      callback:function(res){
        _self.setData({
          accountMess:res.data.result
        })
      }
    }
    common.methods.mothod1(data)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //setNum
  setNum(e){
    let valueNum = e.detail.value;
    valueNum = valueNum.replace(/[^\d]/g, "");
    this.setData({
      numValue: valueNum
    })
  },
  getparssword(e){
    let valueNum = e.detail.value;
    // valueNum = valueNum.replace(/[^\d]/g, "");
    this.setData({
      isPassword: valueNum
    })
  },
//sureToGive
  sureToGive(){
    let _self=this
    if (!this.data.numValue){
      wx.showToast({
        title: '请输入金豆数量',
        icon:'none'
      })
      return
    }
    if (this.data.memberList.enabledPayPassword==1){
      this.setData({
        // isPasswordShow:true
        whichPay:1
      })
    }else{
      if (!this.data.memberList.mobile) {
        wx.showModal({
          title: '提示',
          content: '您当前未绑定手机号，请先前去绑定',
          cancelColor: '#333333',
          confirmColor: '#931EFF',
          success(res) {
            if (res.confirm) {
                wx.navigateTo({
                  url: '/views/bindPhone/bindPhone',
                })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return
      }
      this.setData({
        // sureMobile: true
        whichPay:2
      })
    }
    if (this.data.whichPay>0){
      wx.showModal({
        title: '提示',
        content: '确认转账' + this.data.numValue + '金豆?',
        cancelColor: '#333333',
        confirmColor: '#931EFF',
        success(res) {
          if (res.confirm) {
            _self.setData({
                isPasswordShow: _self.data.whichPay == 1 ? true : false,
                sureMobile: _self.data.whichPay==2 ? true : false,
                whichPay:0
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //关闭获取图形码
  colseCodeGet() {
    this.setData({
      graphicCode: false
    })
  },
  //关闭密码
  concalPay() {
    this.setData({
      isPasswordShow: false
    })
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
  //刷新图形码
  codeRefresh() {
    this.getGraphCodeDetail();
  },
  //发送验证码
  sendCode() {
    let _self = this;
    let dataList = {
      memberId: app.userId,
      mobile: _self.data.memberList.mobile,
      graphCode: _self.data.graphCode
    }
    // console.log(dataList)
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
        // console.log(currentTime)
        clearInterval(interval)
        that.setData({
          currentTime: 60,
          isDisabled: true
        })
      }
    }, 1000)
  },
  //密码确认
  surePay(num) {
    let _self = this
    if (!this.data.isPassword){
      wx.showToast({
        title: '请输入支付密码',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      mask: true
    })
    this.toChangeAccount(2)
  },
  //转账接口
  toChangeAccount(num){
    let _self=this
    let data = {
      url: '/mobile/gtransfer/transfer',
      data: {
        memberId: app.userId,
        goldBean: this.data.numValue,
        accountNo: this.data.accountId,
        // code: '',//短信
        // payPassword: ''//支付密码
      },
      callback: function (res) {
        wx.hideLoading()
        wx.showModal({
          content: '您已转账成功',
          showCancel: false,
          confirmColor: '#931EFF',
          confirmText:'知道啦',
          success(res) {
            if (res.confirm) {
              _self.setData({
                isPasswordShow:false,
                sureMobile:false,
                isPassword:'',
                code:'',
                numValue:''
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
    if (num==1) {
      data.data.code = this.data.code
    } else {
      data.data.payPassword = md5.hexMD5(this.data.isPassword)
    }
    common.methods.mothod1(data)
  },
  //获取验证码code
  getCodeDetail(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //关闭手机验证码提现
  colseMobile() {
    this.setData({
      sureMobile: false
    })
  },
  getWxGraphCode() {
    this.setData({
      graphicCode: true
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
  //输入验证码转账
  telSureChange() {
    if (this.data.code.length != 6) {
      wx.showToast({
        title: '请输入6位数验证码',
        icon: 'none'
      });
      return
    }
    let _self = this;
    wx.showLoading({
      mask: true
    })
    this.toChangeAccount(1)
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
        if (_self.data.optionsId) {
          _self.setData({
            memberList: res.data.result,
          })
        } else {

          _self.setData({
            memberList: res.data.result,
            // accountName: res.data.result.accountName,
            // acconuntNo: res.data.result.accountNo2,
            // acconuntId: res.data.result.accountId
          })
        }

      }
    }
    common.methods.mothod1(banners)
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