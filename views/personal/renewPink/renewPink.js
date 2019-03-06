// views/personal/renewPink/renewPink.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amountFeeShow:false,
    coffersFeeShow:false,
    goldBeanFeeShow:false,
    payPasswordShow:false,
    // doubleClick: true,
    payPassword:'',
    // doubleClick: true,
    isDouble:true,
    isShowPass:false,
    pledgeMethod:'',
    isgoldBean: '',
    isamount: '',
    iscoffers: '',
    finalPriceObj:'',
    prodrctFee:'',
    curObj:{},
    finalPrice:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getFirst, this);
  },
  getFirst() {
    this.setData({
      memList: app.memberData
    })
    let _self = this;
    let banners = {
      url: '/mobile/store/renewConfirmOrder',
      data: {
        memberId: app.userId,
      },
      callback: function (res) {
        _self.setData({
          memberList: res.data.result,
          curObj: res.data.result,
          finalPriceObj: Number(res.data.result.totalFee).toFixed(2),
          prodrctFee: Number(res.data.result.totalFee).toFixed(2),
          finalPrice: Number(res.data.result.totalFee),
        })
      }
    }
    common.methods.mothod1(banners)
  },
  //点击余额
  inputchecked(e){
    // this.setData({
    //   amountFeeShow: !this.data.amountFeeShow,
    //   coffersFeeShow: false,
    // })
    let num = e.currentTarget.dataset.num
    let _self=this
    if (num == 1) {
      this.setData({
        coffersFeeShow: !this.data.coffersFeeShow
      })
    } else if (num == 2) {
      this.setData({
        amountFeeShow: !this.data.amountFeeShow
      })
    } else {
      this.setData({
        goldBeanFeeShow: !this.data.goldBeanFeeShow
      })
    }
    let data = [this.data.coffersFeeShow, this.data.amountFeeShow, this.data.goldBeanFeeShow]
    data.map(function (val, index) {
      if (!val) {
       if (index == 2) {
          _self.setData({
            isgoldBean: ''
          })
       } else if (index == 1) {
          _self.setData({
            isamount: ''
          })
        } else {
          _self.setData({
            iscoffers: ''
          })
        }
      }
    })
    let lsatPrice = this.getLastPrice(0)
    this.setData({
      finalPriceObj: lsatPrice
    })
    
  },
  changeValue(e) {
    let index = e.currentTarget.dataset.num
    // console.log(e)
    let valueNum = e.detail.value;
    //清除"数字"和"."以外的字符
    if (index==3){
      valueNum = valueNum.replace(/[^\d]/g, "");
    }else{
      valueNum = valueNum.replace(/[^\d.]/g, "");
    }
    //验证第一个字符是数字而不是
    valueNum = valueNum.replace(/^\./g, "");
    //只保留第一个. 清除多余的
    // console.log(this.addObj.totalFee)
    valueNum = valueNum.replace(/\.{2,}/g, ".");
    valueNum = valueNum.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    //只能输入两个小数
    valueNum = valueNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    // console.log(valueNum, typeof valueNum)
    // let price = this.data.couponSell ? this.data.productPrice - this.data.couponSell : this.data.productPrice
    if (index == 2) {
      let price = this.getLastPrice(2)
      if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.curObj['amount'])) {
        this.setData({
          isamount: parseFloat(price * 100) / 100,
          finalPriceObj: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.curObj['amount'])) {
        if (parseFloat(price) > parseFloat(this.data.curObj['amount'])) {
          this.setData({
            isamount: this.data.curObj['amount'],
            finalPriceObj: (price - parseFloat(this.data.curObj['amount'])).toFixed(2)
          })
        } else {
          this.setData({
            isamount: parseFloat(price * 100) / 100,
            finalPriceObj: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.curObj['amount'])) {
        this.setData({
          isamount: this.data.curObj['amount'],
          finalPriceObj: (price - parseFloat(this.data.curObj['amount'])).toFixed(2)
        })
      } else {
        this.setData({
          isamount: valueNum,
          finalPriceObj: valueNum ? (price - parseFloat(valueNum)).toFixed(2) : price
        })
      }
    } else if (index == 1) {
      let price = this.getLastPrice(1)
      if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.curObj['coffers'])) {
        console.log(valueNum, price)
        this.setData({
          iscoffers: parseFloat(price * 100) / 100,
          finalPriceObj: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.curObj['coffers'])) {
        if (parseFloat(price) > parseFloat(this.data.curObj['coffers'])) {
          this.setData({
            iscoffers: this.data.curObj['coffers'],
            finalPriceObj: (price - parseFloat(this.data.curObj['coffers'])).toFixed(2)
          })
        } else {
          this.setData({
            iscoffers: parseFloat(price * 100) / 100,
            finalPriceObj: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.curObj['coffers'])) {
        this.setData({
          iscoffers: this.data.curObj['coffers'],
          finalPriceObj: (price - parseFloat(this.data.curObj['coffers'])).toFixed(2)
        })
      } else {
        // console.log(valueNum, price, 222222222222222222)
        this.setData({
          iscoffers: valueNum,
          finalPriceObj: valueNum ? (price - parseFloat(valueNum)).toFixed(2) : price
        })
      }
    } else {
      let price = this.getLastPrice(3)
      if (parseFloat(valueNum / 10) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.curObj['goldBean'])) {
        console.log(valueNum, price)
        this.setData({
          isgoldBean: parseInt(price * 10),
          finalPriceObj: parseFloat(price - parseInt(price * 10) / 10).toFixed(2)
        })
      } else if (parseFloat(valueNum / 10) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.curObj['goldBean'])) {
        if (parseFloat(price) > parseFloat(this.data.curObj['goldBean'] / 10)) {
          this.setData({
            isgoldBean: this.data.curObj['goldBean'],
            finalPriceObj: (price - parseFloat(this.data.curObj['goldBean'] / 10)).toFixed(2)
          })
        } else {
          this.setData({
            isgoldBean: parseInt(price * 10),
            finalPriceObj: parseFloat(price - parseInt(price * 10) / 10).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum / 10) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.curObj['goldBean'])) {
        this.setData({
          isgoldBean: this.data.curObj['goldBean'],
          finalPriceObj: (price - parseFloat(this.data.curObj['goldBean'] / 10)).toFixed(2)
        })
      } else {
        this.setData({
          isgoldBean: valueNum,
          finalPriceObj: valueNum ? (price - parseFloat(valueNum / 10)).toFixed(2) : price
        })
      }
    }
  },
  //计算价格
  getLastPrice(num) {
    let isGoldBean = this.data.isgoldBean ? this.data.isgoldBean : 0//金豆
    // let isScore = this.data.iscore ? this.data.isScore : 0//积分
    let isCoffers = this.data.iscoffers ? this.data.iscoffers : 0//小金库
    let isAmount = this.data.isamount ? this.data.isamount : 0//余额
    // let couponPrice = this.data.couponSell ? this.data.couponSell : 0//优惠券价格
    let lastPrice
    if (num === 0) {
      lastPrice = parseFloat(parseFloat(this.data.finalPrice) - parseFloat(isGoldBean / 10) - parseFloat(isCoffers) - parseFloat(isAmount)).toFixed(2)
    } else if (num === 1) lastPrice = parseFloat(parseFloat(this.data.finalPrice) - parseFloat(isGoldBean / 10) - parseFloat(isAmount)).toFixed(2)
    else if (num === 2) lastPrice = parseFloat(this.data.finalPrice - parseFloat(isGoldBean / 10) - isCoffers).toFixed(2)
    else lastPrice = parseFloat(this.data.finalPrice - parseFloat(isCoffers) - isAmount).toFixed(2)
    return lastPrice
  },
  // //点击小金库
  // inputCoffers(){
  //   this.setData({
  //     amountFeeShow: false,
  //     coffersFeeShow: !this.data.coffersFeeShow,
  //   })
  // },
  //输入密码
  getpayPassword(e) {
    this.setData({
      payPassword: e.detail.value
    })
  },
  //取消
  cancelTixian() {
    this.setData({
      payPasswordShow: false,
    })

  },
  //提交订单
  submitOrder(){
    if (this.data.isgoldBean && this.data.isgoldBean<10){
      wx.showToast({
        title: '金豆最低10个起用',
        icon:'none'
      })
      return
    }
    // if (this.data.amountFeeShow || this.data.coffersFeeShow){
    //   this.setData({
    //     isShowPass:true
    //   })
    // }else{
    //   this.setData({
    //     isShowPass: false
    //   })
    // }
    // if(this.data.amountFeeShow){
    //   this.setData({
    //     pledgeMethod:3
    //   })
    // }
    // if (this.data.coffersFeeShow) {
    //   this.setData({
    //     pledgeMethod: 2
    //   })
    // }
    // if (!this.data.amountFeeShow && !this.data.coffersFeeShow){
    //   this.setData({
    //     pledgeMethod: ''
    //   })
    // }
    let trueOrF = [this.data.isgoldBean, this.data.isamount, this.data.iscoffers].some(function (val, index) {
      return val
    })
    // console.log(trueOrF, this.data.memList.enabledPayPassword)
    if (trueOrF && this.data.memList.enabledPayPassword){
      this.setData({
        payPasswordShow:true
      })
    }else{
      wx.showLoading({
        mask:true
      })  
      this.orderPayMent()
    }
  },
  //密码支付
  passworeTixian() {
    if (this.data.payPassword == '') {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // wx.showLoading()
    wx.showLoading({
      mask: true
    })  
    this.orderPayMent();
  },
  orderPayMent(){
    let _self = this;
    let dataList = {
      memberId: _self.data.memList.id,
      // pledgeMethod: _self.data.pledgeMethod,
      payMethod: 6,
    }
    if (this.data.isamount) dataList.amount = this.data.isamount
    if (this.data.iscoffers) dataList.coffers = this.data.iscoffers
    if (this.data.isgoldBean) dataList.goldBean = this.data.isgoldBean
    if (_self.data.payPasswordShow) {
      dataList.payPassword = utilMd5.hexMD5(this.data.payPassword)
    }
    // console.log(dataList)
    // _self.setData({
    //   doubleClick: false,
    // })
    let find = {
      url: '/mobile/store/renewCreateOrder',
      data: dataList,
      callback: function (res) {
        // _self.setData({
        //   doubleClick: true,
        // })
        wx.hideLoading()
        if (res.data.code == 1) {
          wx.reLaunch({
            url: '/views/personal/personal'
          })
        } else if (res.data.code == 0) {
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
                orderSucessBak: true
              })
              wx.reLaunch({
                url: '/views/personal/personal'
              })
            },
            fail(res) {
              // wx.showToast({ title: '支付失败', icon: 'none' })
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }

      }
    }

    common.methods.mothod3(find)
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