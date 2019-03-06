// views/personal/payMent/payMent.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    coffersFeeShow: false,//是否选择小金库
    amountFeeShow:false,//是否选择余额
    scoreFeeShow:false,//是否选择积分
    goldBeanFeeShow:false,//是否选择金豆
    couponFee:5,
    totalFee:15000,
    payPasswordShow:false,
    finalFeeObj:'',
    finalPriceObj:'',
    payPassword:false,
    isShowPass:false,
    doubleClick:true,
    isamount:'',
    // scoreFee:0,
    iscoffers:'',
    isgoldBean:'',
    freeUseGoldBean:0,
    finalPrice:'',
    memberList:{},
    payWhich: [
      { title: '微信', yn: 1, img: '../../../image/weixin.png' },
      { title: '找人代付', yn: 0, img: '../../../image/payforanother.png' },
    ],
    isPayAnother:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id,
    })
    common.methods.getLoginMess(this.getFirstList, this);
  },
  getFirstList() {
    // this.setData({
    //   memberList: app.memberData,
    // })
    let _self = this;
    let banners = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          memberList: res.data.result,
    })
      }
    }
    let find = {
      url: '/mobile/order/orderDetail',
      data: {
        orderId: _self.data.orderId,
      },
      callback: function (res) {
        let curObjFee = res.data.result
        console.log(curObjFee)
        _self.setData({
          curObjList: curObjFee.orderNo,
          totalFeeObj: res.data.result.totalFee.toFixed(2),
          couponFeeObj: res.data.result.couponFee.toFixed(2),
          freeUseGoldBean: res.data.result.freeUseGoldBean.toFixed(2),
          curObj: curObjFee,
          finalFeeObj: (res.data.result.totalFee - res.data.result.couponFee).toFixed(2),
          finalPrice: res.data.result.totalFee,
          finalPriceObj: (res.data.result.totalFee - res.data.result.couponFee).toFixed(2),
        })
      }
    }
    common.methods.mothod1(find)
    common.methods.mothod1(banners)
  },
  //选择小金库
  inputchecked(e){
    // this.setData({
    //   // goldBeanFee: 0,
    //   // amountFee: 0,
    //   // scoreFee: 0,
    //   coffersFeeShow: !this.data.coffersFeeShow,
    //   amountFeeShow: false,
    //   scoreFeeShow:false,
    //   goldBeanFeeShow:false,
    // })
    // if (this.data.coffersFeeShow) {
    //   if ((this.data.curObj.totalFee - this.data.curObj.couponFee) > this.data.memberList.coffers) {
    //     this.setData({
    //       coffersFee: this.data.memberList.coffers,
    //       coffersFeeObj: (this.data.memberList.coffers).toFixed(2)
    //     })
    //   } else {
    //     this.setData({
    //       coffersFee: (this.data.curObj.totalFee - this.data.curObj.couponFee),
    //       coffersFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee).toFixed(2)
    //     })
    //   }
    // } else {
    //   this.setData({
    //     coffersFee: 0,
    //     coffersObj: 0
    //   })
    // }
    // this.setData({
    //   finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - this.data.coffersFee)
    // })
    let oldLastPrice = this.data.finalPriceObj
    let choseNum = this.data.memberList[e.currentTarget.dataset.mean]
    let valuePrice = ''
      let num = e.currentTarget.dataset.num
      let _self = this
      if (num == 1) {
        if (parseFloat(oldLastPrice) >= parseFloat(choseNum)) valuePrice = choseNum
        else valuePrice = parseFloat(oldLastPrice)
        this.setData({
          coffersFeeShow: !this.data.coffersFeeShow,
          iscoffers: valuePrice
        })
      } else if (num == 2) {
        if (parseFloat(oldLastPrice) >= parseFloat(choseNum)) valuePrice = choseNum
        else valuePrice = parseFloat(oldLastPrice)
        this.setData({
          amountFeeShow: !this.data.amountFeeShow,
          isamount: valuePrice
        })
      } else {
        if (parseFloat(oldLastPrice) >= parseFloat(choseNum / 10)) valuePrice = choseNum
        else valuePrice = parseInt(oldLastPrice * 10)
        this.setData({
          goldBeanFeeShow: !this.data.goldBeanFeeShow,
          isgoldBean: valuePrice
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
  // //输入小金库
  // inputCoffersFee(e){
  //   let valueNum = e.detail.value;
  //   //清除"数字"和"."以外的字符
  //   valueNum = valueNum.replace(/[^\d.]/g, "");

  //   //验证第一个字符是数字而不是
  //   valueNum = valueNum.replace(/^\./g, "");

  //   //只保留第一个. 清除多余的
  //   // console.log(this.addObj.totalFee)

  //   valueNum = valueNum.replace(/\.{2,}/g, ".");
  //   valueNum = valueNum.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

  //   //只能输入两个小数
  //   valueNum = valueNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  //   if (valueNum >= (this.data.totalFee - this.data.couponFee)) {
  //     valueNum = (this.data.totalFee - this.data.couponFee)
  //   }
  //   if (valueNum >= this.data.memberList.coffers) {
  //     valueNum = this.data.memberList.coffers
  //   }
  //   this.setData({
  //     coffersFee: valueNum,
  //     coffersFeeObj: (valueNum / 1).toFixed(2),
  //     finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - valueNum ).toFixed(2)
  //   })
  // },
  // //选择余额
  // inputAmount(){
  //   this.setData({
  //     goldBeanFee: 0,
  //     coffersFee: 0,
  //     scoreFee: 0,
  //     coffersFeeShow: false,
  //     amountFeeShow: !this.data.amountFeeShow,
  //     scoreFeeShow: false,
  //     goldBeanFeeShow: false,
  //   })
  //   if (this.data.amountFeeShow) {
  //     if ((this.data.curObj.totalFee - this.data.curObj.couponFee) > this.data.memberList.amount) {
  //       this.setData({
  //         amountFee: this.data.memberList.amount,
  //         amountFeeObj: (this.data.memberList.amount).toFixed(2)
  //       })
  //     } else {
  //       this.setData({
  //         amountFee: (this.data.curObj.totalFee - this.data.curObj.couponFee),
  //         amountFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee).toFixed(2)
  //       })
  //     }
  //     console.log(this.data.amountFeeObj)
  //   } else {
  //     this.setData({
  //       amountFee: 0,
  //       amountFeeObj: 0
  //     })
  //   }
  //   this.setData({
  //     finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - this.data.amountFee)
  //   })
  // },
  // //输入余额
  // inputAmountFee(e){
  //   let valueNum = e.detail.value;
  //   //清除"数字"和"."以外的字符
  //   valueNum = valueNum.replace(/[^\d.]/g, "");

  //   //验证第一个字符是数字而不是
  //   valueNum = valueNum.replace(/^\./g, "");

  //   //只保留第一个. 清除多余的
  //   // console.log(this.addObj.totalFee)

  //   valueNum = valueNum.replace(/\.{2,}/g, ".");
  //   valueNum = valueNum.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

  //   //只能输入两个小数
  //   valueNum = valueNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  //   if (valueNum >= (this.data.totalFee - this.data.couponFee)) {
  //     valueNum = (this.data.totalFee - this.data.couponFee)
  //   }
  //   if (valueNum >= this.data.memberList.amount) {
  //     valueNum = this.data.memberList.amount
  //   }
  //   this.setData({
  //     amountFee: valueNum,
  //     amountFeeObj: (valueNum / 1).toFixed(2),
  //     finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - valueNum).toFixed(2)
  //   })
  // },
  // //选择积分
  // inputScore(){
  //   this.setData({
  //     goldBeanFee:0,
  //     coffersFee: 0,
  //     amountFee: 0,
  //     coffersFeeShow: false,
  //     amountFeeShow: false,
  //     scoreFeeShow: !this.data.scoreFeeShow,
  //     goldBeanFeeShow: false,
  //   })
  //   if (this.data.scoreFeeShow){
  //     if ((this.data.curObj.totalFee - this.data.curObj.couponFee) * 100 > this.data.memberList.score){
  //       this.setData({
  //         scoreFee: this.data.memberList.score,
  //         scoreFeeObj: (this.data.memberList.score / 100).toFixed(2)
  //       })
  //     }else{
  //       this.setData({
  //         scoreFee: (this.data.curObj.totalFee - this.data.curObj.couponFee)*100,
  //         scoreFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee).toFixed(2)
  //       })
  //     }
  //   }else{
  //     this.setData({
  //       scoreFee: 0,
  //       scoreFeeObj: 0
  //     })
  //   }
  //   this.setData({
  //     finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - this.data.scoreFee/100)
  //   })
  // },
  // //输入框输入积分
  // inputScoreFee(e){
  //   let valueNum = e.detail.value;
  //   valueNum = valueNum.replace(/\D/g, '');
  //   if (valueNum >= (this.data.totalFee - this.data.couponFee) * 100){
  //     valueNum = (this.data.totalFee - this.data.couponFee)*100
  //   }
  //   if (valueNum >= this.data.memberList.score){
  //     valueNum = this.data.memberList.score
  //   }
  //   this.setData({
  //     scoreFee: valueNum,
  //     scoreFeeObj: (valueNum / 100).toFixed(2),
  //     finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - valueNum / 100).toFixed(2)
  //   })
  // },
  // //选择金豆
  // inputGoldBean(){
  //   this.setData({
  //     coffersFee:0,
  //     amountFee:0,
  //     scoreFee:0,
  //     coffersFeeShow: false,
  //     amountFeeShow: false,
  //     scoreFeeShow: false,
  //     goldBeanFeeShow: !this.data.goldBeanFeeShow,
  //   })
  //   if (this.data.goldBeanFeeShow) {
  //     if ((this.data.curObj.totalFee - this.data.curObj.couponFee) * 10 > this.data.memberList.goldBean) {
  //       this.setData({
  //         goldBeanFee: this.data.memberList.goldBean,
  //         goldBeanFeeObj: (this.data.memberList.goldBean / 10).toFixed(2)
  //       })
  //     } else {
  //       this.setData({
  //         goldBeanFee: (this.data.curObj.totalFee - this.data.curObj.couponFee) * 10,
  //         goldBeanFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee).toFixed(2)
  //       })
  //     }
  //   } else {
  //     this.setData({
  //       goldBeanFee: 0,
  //       goldBeanFeeObj: 0
  //     })
  //   }
  //   this.setData({
  //     finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - this.data.goldBeanFee / 10)
  //   })
  // },
  // //输入金豆
  // inputGoldBeanFee(e){
  //   let valueNum = e.detail.value;
  //   valueNum = valueNum.replace(/\D/g, '');
  //   if (valueNum >= (this.data.totalFee - this.data.couponFee) * 10) {
  //     valueNum = (this.data.totalFee - this.data.couponFee) * 10
  //   }
  //   if (valueNum >= this.data.memberList.goldBean) {
  //     valueNum = this.data.memberList.goldBean
  //   }
  //   this.setData({
  //     goldBeanFee: valueNum,
  //     goldBeanFeeObj: (valueNum / 10).toFixed(2),
  //     finalFeeObj: (this.data.curObj.totalFee - this.data.curObj.couponFee - valueNum / 10).toFixed(2)
  //   })
  // },
  changeValue(e) {
    let index = e.currentTarget.dataset.num
    // console.log(e)
    let valueNum = e.detail.value;
    //清除"数字"和"."以外的字符
    if (index == 3) {
      valueNum = valueNum.replace(/[^\d]/g, "");
    } else {
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
      if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.memberList['amount'])) {
        this.setData({
          isamount: parseFloat(price * 100) / 100,
          finalPriceObj: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.memberList['amount'])) {
        if (parseFloat(price) > parseFloat(this.data.memberList['amount'])) {
          this.setData({
            isamount: this.data.memberList['amount'],
            finalPriceObj: (price - parseFloat(this.data.memberList['amount'])).toFixed(2)
          })
        } else {
          this.setData({
            isamount: parseFloat(price * 100) / 100,
            finalPriceObj: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.memberList['amount'])) {
        this.setData({
          isamount: this.data.memberList['amount'],
          finalPriceObj: (price - parseFloat(this.data.memberList['amount'])).toFixed(2)
        })
      } else {
        this.setData({
          isamount: valueNum,
          finalPriceObj: valueNum ? (price - parseFloat(valueNum)).toFixed(2) : price
        })
      }
    } else if (index == 1) {
      let price = this.getLastPrice(1)
      console.log(price)
      if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.memberList['coffers'])) {
        console.log(valueNum, price)
        this.setData({
          iscoffers: parseFloat(price * 100) / 100,
          finalPriceObj: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.memberList['coffers'])) {
        if (parseFloat(price) > parseFloat(this.data.memberList['coffers'])) {
          this.setData({
            iscoffers: this.data.memberList['coffers'],
            finalPriceObj: (price - parseFloat(this.data.memberList['coffers'])).toFixed(2)
          })
        } else {
          this.setData({
            iscoffers: parseFloat(price * 100) / 100,
            finalPriceObj: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.memberList['coffers'])) {
        this.setData({
          iscoffers: this.data.memberList['coffers'],
          finalPriceObj: (price - parseFloat(this.data.memberList['coffers'])).toFixed(2)
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
      if (parseFloat(valueNum / 10) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.memberList['goldBean'])) {
        console.log(valueNum, price)
        this.setData({
          isgoldBean: parseInt(price * 10),
          finalPriceObj: parseFloat(price - parseInt(price * 10) / 10).toFixed(2)
        })
      } else if (parseFloat(valueNum / 10) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.memberList['goldBean'])) {
        if (parseFloat(price) > parseFloat(this.data.memberList['goldBean'] / 10)) {
          this.setData({
            isgoldBean: this.data.memberList['goldBean'],
            finalPriceObj: (price - parseFloat(this.data.memberList['goldBean'] / 10)).toFixed(2)
          })
        } else {
          this.setData({
            isgoldBean: parseInt(price * 10),
            finalPriceObj: parseFloat(price - parseInt(price * 10) / 10).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum / 10) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.memberList['goldBean'])) {
        this.setData({
          isgoldBean: this.data.memberList['goldBean'],
          finalPriceObj: (price - parseFloat(this.data.memberList['goldBean'] / 10)).toFixed(2)
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
    let couponPrice = this.data.couponFeeObj ? this.data.couponFeeObj : 0//优惠券价格
    let lastPrice
    if (num === 0) {
      lastPrice = parseFloat(parseFloat(this.data.finalPrice) - parseFloat(isGoldBean / 10) - parseFloat(isCoffers) - parseFloat(isAmount) - couponPrice).toFixed(2)
    } else if (num === 1) lastPrice = parseFloat(parseFloat(this.data.finalPrice) - parseFloat(isGoldBean / 10) - parseFloat(isAmount) - couponPrice).toFixed(2)
    else if (num === 2) lastPrice = parseFloat(this.data.finalPrice - parseFloat(isGoldBean / 10) - isCoffers - couponPrice).toFixed(2)
    else lastPrice = parseFloat(this.data.finalPrice - parseFloat(isCoffers) - isAmount - couponPrice).toFixed(2)
    return lastPrice
  },
  //输入密码
  getpayPassword(e){
    this.setData({
      payPassword: e.detail.value
    })
  },
  cancelTixian(){
    this.setData({
      payPasswordShow: false,
    })
    
  },
  //提交订单
  submitOrder(){
    console.log(this.data.curObj)
    if (this.data.iscoffers || this.data.isgoldBean || this.data.isscore || this.data.isamount) {
      this.setData({
        isShowPass: true
      })
    } else {
      this.setData({
        isShowPass: false
      })
    }
    if (this.data.memberList.enabledPayPassword == 1 && this.data.isShowPass) {
      this.setData({
        payPasswordShow: true,
      })

    } else {
      wx.showLoading({ mask: true })
      this.orderPayMent();
    }
  },
  passworeTixian() {
    if (this.data.payPassword == '') {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({ mask: true})
    this.orderPayMent();
  },
  //选择支付方式
  chosePay(e) {
    let _self = this
    let index = e.currentTarget.dataset.index
    let items = this.data.payWhich
    items.map((val, key) => {
      if (key == index) {
        val.yn = 1
        if (val.title == '找人代付') {
          _self.setData({
            isPayAnother: 1
          })
        } else {
          _self.setData({
            isPayAnother: 0
          })
        }
      } else val.yn = 0
    })
    this.setData({
      payWhich: items
    })
  },
  //确定订单
  orderPayMent(){
    // wx.showLoading({
    //   mask:true
    // })
    let _self = this;
    let dataList={
      memberId: _self.data.memberList.id,
      orderId:_self.data.orderId,
      payMethod:6,
      isPayAnother: this.data.isPayAnother
      // amount: _self.data.amountFee,
      // score: _self.data.scoreFee,
      // coffers: _self.data.coffersFee,
      // goldBean: _self.data.goldBeanFee
    }
    if (this.data.isamount) dataList.amount = this.data.isamount
    if (this.data.iscoffers) dataList.coffers = this.data.iscoffers
    if (this.data.isgoldBean) dataList.goldBean = this.data.isgoldBean
    if (_self.data.payPasswordShow) {
      dataList.payPassword = utilMd5.hexMD5(this.data.payPassword)
    }
    // _self.setData({
    //   doubleClick: false,
    // })
    let find = {
      url: '/mobile/order/singleOrderPay',
      data: dataList,
      callback: function (res) {
        // _self.setData({
        //   doubleClick: true,
        // })
        wx.hideLoading()
        if (_self.data.isPayAnother == 1) {
          let str = res.data.result.payRecordNo
          wx.navigateTo({
            url: '../../detial/otherPay/otherPay?ordeNo=' + str,
          })
          wx.hideLoading()
          return
        }
        if(res.data.code==1){
          wx.hideLoading()
          if(_self.data.curObj.type==2){
            wx: wx.redirectTo({
              url: '/views/personal/myTry/tryList/tryList?status=2',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }else{
            wx: wx.redirectTo({
              url: '/views/orderList/orderList?status=2',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
          
        }else if(res.data.code==0){
          wx.requestPayment({
            timeStamp: res.data.result.timeStamp,
            nonceStr: res.data.result.nonceStr,
            package: res.data.result.package_,
            signType: res.data.result.signType,
            paySign: res.data.result.paySign,
            success(res1) {
              // wx.showToast({ title: '支付成功', icon: 'none' })
              _self.setData({
                payPasswordShow: false,
                orderSucessBak: true
              })
              if (_self.data.curObj.type == 2) {
                wx: wx.redirectTo({
                  url: '/views/personal/myTry/tryList/tryList?status=2',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else {
                wx: wx.redirectTo({
                  url: '/views/orderList/orderList?status=2',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            },
            fail(res) {
              // wx.showToast({ title: '支付失败', icon: 'none' })
            }
          })
        }else{
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