// views/personal/changeSnrc/changeSnrc.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limitCount:'',
    memList:[],
    goldenDou:'',
    showLimitCount:false,
    walletAccount:'',
    amountNum:'',
    sureMobile:false,
    isPassword: false,
    graphicCode: false,
    doubleClick: true,//阻止二次点击
    currentTime: 60, 
    isDisabled: true,   
    code:'',
    sign:'',
    getTime:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log((new Date()).valueOf())
    common.methods.getLoginMess(this.getFirst, this)
  },
  getFirst(){
    this.setData({
      memList: app.memberData,
      goldenDou: parseInt(app.memberData.goldBean / 10)
    })
    let _self = this;
    let banners = {
      url: '/mobile/moca/exchangeInfo',
      data: {},
      callback: function (res) {
        if (res.data.code == 0) {
          _self.setData({
            limitCount: res.data.result,
          })
          if (res.data.result.exchangeSNRCLimitCount!=-1){
            _self.setData({
              showLimitCount:true
            })
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }

      }
    }
    common.methods.mothod4(banners)
  },
  //获取SNRC地址
  getWalletAccount(e){
    this.setData({
      walletAccount: e.detail.value
    })
  },
  //清除SNRC地址
  celearWalletAccount(){
    this.setData({
      walletAccount:'',
    })
  },
  //获取SNRC数量
  getAmount(e) {
    let number = e.detail.value
    number = number.replace(/\D/g, '')
    if (number >= this.data.goldenDou){
      number=this.data.goldenDou
    }
    this.setData({
      amountNum: number
    })
  },
  //清除SNRC数量
  celearAmount() {
    this.setData({
      amountNum : '',
    })
  },
  //兑换全部SNRC
  changeAll(){
    this.setData({
      amountNum: this.data.goldenDou  
    })
  },
  sureChangeMoney() {
    if (this.data.walletAccount == '') {
      wx.showToast({
        title: '请输入钱包地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.amountNum == '' || this.data.amountNum == 0) {
      wx.showToast({
        title: '兑换SNRC数量不能为空或0',
        icon: 'none',
        duration: 2000
      })
      return;
    }
   
    if (this.data.limitCount.exchangeSNRCMininumCount != -1) {

      if (this.data.amountNum > this.data.limitCount.exchangeSNRCLimitCount) {
        wx.showToast({
          title: '今日剩余' + this.data.limitCount.exchangeSNRCLimitCount + '个SNRC可兑',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (this.data.amountNum < this.data.limitCount.exchangeSNRCMininumCount) {
        wx.showToast({
          title: '今日最低起兑换' + this.data.limitCount.exchangeSNRCLimitCount + '个SNRC',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }     
    if (this.data.memList.enabledPayPassword == 1) {
      this.setData({
        isPassword:true
      })
      return;
    } else {
      if (this.data.memList.mobile != '' && this.data.memList.mobile != null) {
        this.setData({
          sureMobile: true
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '兑换金豆请先绑定手机号码,是否前往绑定',
          cancelText: '否',
          confirmText: '去绑定',
          // confirmColor:'#e50f72',
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
    }

  },
  //输入密码
  getpayPassword(e) {
    this.setData({
      payPassword: e.detail.value
    })
  },
  //输入密码 取消
  cancelTixian() {
    this.setData({
      isPassword: false
    })
  },
  //密码兑换
  passworeTixian(){
    if (this.data.payPassword == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({  
      doubleClick: false,
      getTime: (new Date()).valueOf(),
    })
    this.setData({
      sign: 'time=' + this.data.getTime + '&goldBean=' + this.data.amountNum * 10 + '&payPassword=' + utilMd5.hexMD5(this.data.payPassword) + '&walletAccount=' + this.data.walletAccount + '&secretKey=F81455FF4FB19762'
    })
    console.log(this.data.sign)
    this.changeGoldenCode();
  },
  //手机验证兑换
  telSureChange(){
    if(this.data.code==''){
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({  
      doubleClick:false,
      getTime: (new Date()).valueOf(),
      
    })
    this.setData({
      sign: 'code=' + this.data.code + '&time=' + this.data.getTime + '&goldBean=' + this.data.amountNum * 10 + '&walletAccount=' + this.data.walletAccount + '&secretKey=F81455FF4FB19762'
    })
    console.log(this.data.sign)
    this.changeGoldenCode();
  },
  //点击获取验证码
  getWxGraphCode() {
    // this.setData({
    //   isDisabled: false
    // })
    // this.getCode();
    this.setData({
      graphicCode: true
    })
    this.getGraphCodeDetail();
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
      mobile: _self.data.memList.mobile,
      graphCode: _self.data.graphCode
    }
    console.log(dataList)
    wx.request({
      url: app.baseUrl + '/mobile/code/sendCode2',
      data: {
        memberId: app.userId,
        mobile: _self.data.memList.mobile,
        graphCode: _self.data.graphCode
      },
      dataType: 'json',
      method: 'POST',
      header: {
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
  //获取验证码code
  getCodeDetail(e) {
    this.setData({
      code: e.detail.value
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
  //提交金豆兑换
  changeGoldenCode(){
    let _self=this;
    let dataList={
      memberId: this.data.memList.id,
      walletAccount: this.data.walletAccount,
      goldBean: this.data.amountNum * 10,
      sign: utilMd5.hexMD5(this.data.sign),
      time: this.data.getTime,
    }
    if (this.data.memList.enabledPayPassword == 1){
      dataList.payPassword = utilMd5.hexMD5(this.data.payPassword)
    } else {
      dataList.code = this.data.code
    }
    console.log(dataList)
    let banners = {
      url: '/mobile/moca/exchangeSNRC',
      data: dataList,
      callback: function (res) {
        _self.setData({
          doubleClick: true,
        })
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '/views/personal/listSNRC/listSNRC',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }

      }
    }
    common.methods.mothod4(banners)
  },
  //跳转兑换记录
  getListSnrc(){
    wx.navigateTo({
      url: '/views/personal/listSNRC/listSNRC',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
  
})