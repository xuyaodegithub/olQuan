// views/detial/toSureBuy/toSureBuy.js
var common = require('../../utils/common.js')
var md5 = require('../../utils/md5.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    OrderList: '',
    // totalfell:0,
    // productData: {},//商品信息
    addressMess: '',//地址信息
    productPrice: 0,//总价
    productType: 1,
    phoneNum: '',
    moneyClass: [/*{ title: '积分', mean: 'score', showOrhidden: false }, */{ title: '余额', mean: 'amount', showOrhidden: false }, { title: '小金库', mean: 'coffers', showOrhidden: false }, { title: '金豆', mean: 'goldBean', showOrhidden: false }],
    moneyNum: '',//分类num
    muchNum: '',//实际减多少、四中支付方式
    inputChange: '',//输入框数值
    isScore: '',//积分输入
    isAmount: '',//余额输入
    isCoffers: '',//小金库输入
    isGoldBean: '',//金豆输入
    // pagFangshi: '',//账户支付方式
    couponMess:[],//优惠券信息
    couponSell: 0,//优惠券价值
    isCoupon: '',//弹框显示
    couponsNum:0,//优惠券数量
    couponIds:'',//优惠券ids
    // whichCoupon: '',
    deleTitle: '',
    deleNum: '',
    memo: [],//订单备注
    lastMoney: '',//最后支付金额
    adressID: '',//地址id
    isPassword: '',//支付密码
    isPasswordShow: false,//支付密码弹框
    isPayAnother: 0,//是否代付
    allNum:0,//总件数
    ids:'',//购物车ids
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.adressID) {
      this.setData({
        adressID: options.adressID
      })
    }
    this.getOrderList(options)
  },
  //获取收货地址
  getaddressMess(id) {
    let _self = this
    let data = {
      url: '/mobile/address/getAddress',
      data: {
        addressId: id
      },
      callback: function (res) {
        const adre = res.data.result
        if (adre.mobile) {
          let arrnum = adre.mobile.split('')
          arrnum.splice(3, 4, '****')
          adre.mobile = arrnum.join('')
        }
        _self.setData({
          addressMess: adre
        })
      }
    }
    common.methods.mothod1(data)
  },
  //确认订单信息
  getOrderList(options) {
    console.log(options)
    // this.setData({
    //   allNum:options.num
    // })
    let _self = this
    let data = {
      url: '/mobile/order/carToOrderConfirmOrder',
      data: {
        carIds: options.ids,
        memberId: app.userId,
        uutype: app.uutype
      },
      callback: function (res) {
        console.log(res)
        // if(){}判断有无地址
        if (!res.data.result.receiveAddress) {
          wx.redirectTo({
            url: '../detial/addNewAdress/addNewAdress?backType=' + 2 + '&ids=' + options.ids,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          return
        }
        if (_self.data.adressID) {
          _self.getaddressMess(_self.data.adressID)
        } else {
          _self.getaddressMess(res.data.result.receiveAddress.id)
        }
        let arr = res.data.result
        arr.totalFee = Math.floor(arr.totalFee * 100) / 100
        arr.sellers.map(function(item,index){
          item.memo=''
          item.productDetails.map(function(val,key){
            val.normal = val.normal.split(' ')
          })
        })
        if (arr.coupons){
          let cList=arr.coupons
          let cNum=0
          cList.map(function(item,index){
            item.coupons.map(function(val,key){
              val['choseOr']=0
              cNum+=1
            })
          })
          _self.setData({
            couponMess: cList,
            couponsNum: cNum
          })
        }
        _self.setData({
          OrderList: arr,
          lastMoney: arr.totalFee,
          productPrice: arr.totalFee,
          ids: options.ids,
          allNum:arr.totalNum
        })
      }
    }
    common.methods.mothod1(data)
  },
  //计算价格
  getLastPrice(num) {
    let isGoldBean = this.data.isGoldBean ? this.data.isGoldBean : 0//金豆
    let isScore = this.data.isScore ? this.data.isScore : 0//积分
    let isCoffers = this.data.isCoffers ? this.data.isCoffers : 0//小金库
    let isAmount = this.data.isAmount ? this.data.isAmount : 0//余额
    let couponPrice = this.data.couponSell ? this.data.couponSell : 0//优惠券价格
    let lastPrice
    if (num === 0) {
      lastPrice = parseFloat(parseFloat(this.data.productPrice) - parseFloat(isGoldBean / 10) - parseFloat(isScore / 100) - parseFloat(isCoffers) - parseFloat(isAmount) - parseFloat(couponPrice)).toFixed(2)
    } else if (num === 1) lastPrice = parseFloat(parseFloat(this.data.productPrice) - parseFloat(isScore / 100) - parseFloat(isCoffers) - parseFloat(isAmount) - parseFloat(couponPrice)).toFixed(2)
    else if (num === 2) lastPrice = parseFloat(this.data.productPrice - parseFloat(isGoldBean / 10) - isCoffers - isAmount - couponPrice).toFixed(2)
    else if (num === 3) lastPrice = parseFloat(this.data.productPrice - parseFloat(isGoldBean / 10) - parseFloat(isScore / 100) - isAmount - couponPrice).toFixed(2)
    else lastPrice = parseFloat(this.data.productPrice - parseFloat(isGoldBean / 10) - parseFloat(isScore / 100) - isCoffers - couponPrice).toFixed(2)
    return lastPrice
  },
  //选择某个支付
  checkedThis(e) {
    let _self = this
    let data = this.data.moneyClass
    let oldLastPrice = this.data.lastMoney
    let choseNum = this.data.OrderList[e.currentTarget.dataset.item.mean]
    let valuePrice = ''
    data[e.currentTarget.dataset.index].showOrhidden = !data[e.currentTarget.dataset.index].showOrhidden
    data.map(function (val, index) {
      if (!val.showOrhidden) {
        if (val.mean === 'score') {
          _self.setData({
            isScore: ''
          })
        } else if (val.mean === 'goldBean') {
          _self.setData({
            isGoldBean: ''
          })
        } else if (val.mean === 'amount') {
          _self.setData({
            isAmount: ''
          })
        } else {
          _self.setData({
            isCoffers: ''
          })
        }
      } else {
        // if (val.mean === 'score') {
        //   _self.setData({
        //     isScore: ''
        //   })
        // } else
        if (e.currentTarget.dataset.item.mean === 'goldBean') {
          if (parseFloat(oldLastPrice) >= parseFloat(choseNum / 10)) valuePrice = choseNum
          else valuePrice = parseInt(oldLastPrice * 10)
          _self.setData({
            isGoldBean: valuePrice
          })
        } else if (e.currentTarget.dataset.item.mean === 'amount') {
          if (parseFloat(oldLastPrice) >= parseFloat(choseNum)) valuePrice = choseNum
          else valuePrice = parseFloat(oldLastPrice)
          _self.setData({
            isAmount: valuePrice
          })
        } else {
          if (parseFloat(oldLastPrice) >= parseFloat(choseNum)) valuePrice = choseNum
          else valuePrice = parseFloat(oldLastPrice)
          _self.setData({
            isCoffers: valuePrice
          })
        }
      }
    })
    let lsatPrice = this.getLastPrice(0)
    this.setData({
      moneyClass: data,
      lastMoney: lsatPrice
    })

  },
  //输入金额
  putinMoney(e) {
    console.log(e)
    let valueNum = e.detail.value;
    //清除"数字"和"."以外的字符
    if (e.currentTarget.dataset.item.mean == "goldBean") {
      valueNum = valueNum.replace(/[^\d]/g, "");
    } else {
      valueNum = valueNum.replace(/[^\d.]/g, "");
    }
    // valueNum = valueNum.replace(/[^\d.]/g, "");
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
    // console.log(price)
    if (e.currentTarget.dataset.item.mean === "amount") {
      let price = this.getLastPrice(4)
      if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        console.log(valueNum, price)
        this.setData({
          // muchNum: Math.floor(price * 100) / 100,
          isAmount: Math.floor(price * 100) / 100,
          lastMoney: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        if (parseFloat(price) > parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
          this.setData({
            // muchNum: this.data.OrderList[e.currentTarget.dataset.item.mean],
            isAmount: this.data.OrderList[e.currentTarget.dataset.item.mean],
            lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])).toFixed(2)
          })
        } else {
          this.setData({
            // muchNum: Math.floor(price * 100) / 100,
            isAmount: Math.floor(price * 100) / 100,
            lastMoney: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        this.setData({
          // muchNum: this.data.OrderList[e.currentTarget.dataset.item.mean],
          isAmount: this.data.OrderList[e.currentTarget.dataset.item.mean],
          lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])).toFixed(2)
        })
      } else {
        console.log(valueNum, price, 222222222222222222)
        this.setData({
          // muchNum: parseFloat(valueNum),
          isAmount: valueNum,
          lastMoney: valueNum ? (price - parseFloat(valueNum)).toFixed(2) : price
        })
      }
    } else if (e.currentTarget.dataset.item.mean === "coffers") {
      let price = this.getLastPrice(3)
      if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        console.log(valueNum, price)
        this.setData({
          // muchNum: Math.floor(price * 100) / 100,
          isCoffers: Math.floor(price * 100) / 100,
          lastMoney: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        if (parseFloat(price) > parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
          this.setData({
            // muchNum: this.data.OrderList[e.currentTarget.dataset.item.mean],
            isCoffers: this.data.OrderList[e.currentTarget.dataset.item.mean],
            lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])).toFixed(2)
          })
        } else {
          this.setData({
            // muchNum: Math.floor(price * 100) / 100,
            isCoffers: Math.floor(price * 100) / 100,
            lastMoney: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        this.setData({
          // muchNum: this.data.OrderList[e.currentTarget.dataset.item.mean],
          isCoffers: this.data.OrderList[e.currentTarget.dataset.item.mean],
          lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])).toFixed(2)
        })
      } else {
        console.log(valueNum, price, 222222222222222222)
        this.setData({
          // muchNum: parseFloat(valueNum),
          isCoffers: valueNum,
          lastMoney: valueNum ? (price - parseFloat(valueNum)).toFixed(2) : price
        })
      }
    } else if (e.currentTarget.dataset.item.mean === "score") {
      let price = this.getLastPrice(2)
      if (parseFloat(valueNum / 100) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        console.log(valueNum, price)
        this.setData({
          // muchNum: Math.floor(price * 100) / 100,
          isScore: Math.floor(price * 100),
          lastMoney: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum / 100) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        if (parseFloat(price) > parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 100)) {
          this.setData({
            // muchNum: parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 100),
            isScore: this.data.OrderList[e.currentTarget.dataset.item.mean],
            lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 100)).toFixed(2)
          })
        } else {
          this.setData({
            // muchNum: Math.floor(price * 100) / 100,
            isScore: Math.floor(price * 100),
            lastMoney: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum / 100) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        this.setData({
          // muchNum: parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 100),
          isScore: this.data.OrderList[e.currentTarget.dataset.item.mean],
          lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 100)).toFixed(2)
        })
      } else {
        this.setData({
          // muchNum: parseFloat(valueNum / 100),
          isScore: valueNum,
          lastMoney: valueNum ? (price - parseFloat(valueNum / 100)).toFixed(2) : price
        })
      }
    } else {
      let price = this.getLastPrice(1)
      if (parseFloat(valueNum / 10) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        console.log(valueNum, price)
        this.setData({
          // muchNum: Math.floor(price * 100) / 100,
          isGoldBean: parseInt(price * 10),
          lastMoney: parseFloat(price - parseInt(price * 10) / 10).toFixed(2)
        })
      } else if (parseFloat(valueNum / 10) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        if (parseFloat(price) > parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10)) {
          this.setData({
            // muchNum: parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10),
            isGoldBean: this.data.OrderList[e.currentTarget.dataset.item.mean],
            lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10)).toFixed(2)
          })
        } else {
          this.setData({
            // muchNum: Math.floor(price * 100) / 100,
            isGoldBean: parseInt(price * 10),
            lastMoney: parseFloat(price - parseInt(price * 10) / 10).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum / 10) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        this.setData({
          // muchNum: parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10),
          isGoldBean: this.data.OrderList[e.currentTarget.dataset.item.mean],
          lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10)).toFixed(2)
        })
      } else {
        this.setData({
          // muchNum: parseFloat(valueNum / 10),
          isGoldBean: valueNum,
          lastMoney: valueNum ? (price - parseFloat(valueNum / 10)).toFixed(2) : price
        })
      }
    }
  },
  //打开优惠券弹框
  openCoupon() {
    this.setData({
      isCoupon: true
    })
  },
  closeCoupon() {
    this.setData({
      isCoupon: false
    })
  },
  //选择优惠券
  choseCoupon(e) {
    let index = e.currentTarget.dataset.index
    let indexson = e.currentTarget.dataset.indexson
    let item = e.currentTarget.dataset.item
    let couponMess = this.data.couponMess
    let money22 = this.data.couponSell    
    couponMess[index].coupons.map(function(val,key){
      if (key != indexson){
        val.choseOr = 0
      }
    })
    if (couponMess[index].coupons[indexson].choseOr == 1){
      couponMess[index].coupons[indexson].choseOr = 0
    }else{
      couponMess[index].coupons[indexson].choseOr = 1
    }
    this.setData({
      couponMess: couponMess,
      couponSell: this.jisuanCoupon(couponMess).price,//优惠券价值
      couponIds: this.jisuanCoupon(couponMess).couponIds
    })
    if ((parseFloat(this.data.lastMoney) + money22) < this.data.couponSell) {
      // console.log(this.data.lastMoney+ money22, this.data.couponSell)
      this.setData({
        isAmount: '',
        isCoffers: '',
        isScore: '',
        isGoldBean: '',
        lastMoney: parseFloat(this.data.OrderList.totalFee - this.data.couponSell).toFixed(2)
      })
    } else {
      this.setData({
        lastMoney: (parseFloat(this.data.lastMoney) + parseFloat(money22) - parseFloat(this.data.couponSell)).toFixed(2)
      })
    }
    // if (e.currentTarget.dataset.index === this.data.whichCoupon) {
    // let moneyy = (parseFloat(this.data.lastMoney) + parseFloat(this.data.couponSell)).toFixed(2)
    //   this.setData({
    //     lastMoney: moneyy,
    //   })
    // this.setData({
    //   // whichCoupon: e.currentTarget.dataset.index,
    //   couponSell: e.currentTarget.dataset.item.price,
    // })
      // if (this.data.pagFangshi) {
      //   if ((parseFloat(this.data.lastMoney) + parseFloat(money22) - parseFloat(this.data.couponSell)) < 0) {
      //     let firstMoney = parseFloat(this.data.productPrice - this.data.couponSell).toFixed(2)
      //     if (this.data.pagFangshi === 'amount') {
      //       this.setData({
      //         muchNum: Math.floor(firstMoney * 100) / 100,
      //         isAmount: Math.floor(firstMoney * 100) / 100,
      //         lastMoney: (0).toFixed(2)
      //       })
      //     } else if (this.data.pagFangshi === 'coffers') {
      //       this.setData({
      //         muchNum: Math.floor(firstMoney * 100) / 100,
      //         isCoffers: Math.floor(firstMoney * 100) / 100,
      //         lastMoney: (0).toFixed(2)
      //       })
      //     } else if (this.data.pagFangshi === 'score') {
      //       this.setData({
      //         muchNum: Math.floor(firstMoney * 100) / 100,
      //         isScore: Math.floor(firstMoney * 100),
      //         lastMoney: (0).toFixed(2)
      //       })
      //     } else {
      //       this.setData({
      //         muchNum: Math.floor(firstMoney * 100) / 100,
      //         isGoldBean: Math.floor(firstMoney * 10),
      //         lastMoney: (parseFloat(firstMoney) - parseFloat(firstMoney).toFixed(1)).toFixed(2)
      //       })
      //     }
      //   } else {
      //     // console.log(this.data.lastMoney, money22, this.data.couponSell)
      //     this.setData({
      //       lastMoney: (parseFloat(this.data.lastMoney) + parseFloat(money22) - parseFloat(this.data.couponSell)).toFixed(2)
      //     })
      //     // console.log(this.data.lastMoney)
      //   }
      //   // }
      // } else {
      //   this.setData({
      //     lastMoney: (parseFloat(this.data.lastMoney) + parseFloat(money22) - parseFloat(this.data.couponSell)).toFixed(2)
      //   })
      // }
  },
  //计算优惠券价值
  jisuanCoupon(value){
    let price=0
    let couponIds=[]
    value.map(function(item,index){
      item.coupons.map(function(val,key){
        if(val.choseOr==1){
          price = price + parseFloat(val.price)
          couponIds.push(val.id)
        }
      })
    })
    return { price: price, couponIds: couponIds.join(',')}
  },
  // //计算应支付多少钱
  // lastMoneySet(){
  //   let totalPrice = this.data.productPrice//商品总价
  //   let deletePrice = this.data.muchNum//四中支付方式实际扣除价格
  //   let couponPrice = this.data.couponSell//优惠券扣除价格

  // },
  //选择支付方式
  chosePay(e) {

  },
  //跳转地址页面
  toAdress() {
    wx.redirectTo({
      url: '../detial/addAdress/addAdress?backType=' + 2 + '&ids=' + this.data.ids + '&isCrossBorderProduct=' + this.data.OrderList.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + this.data.OrderList.isOverseasDirectMailProduct,
    })
  },
  //获取密码
  getparssword(e) {
    this.setData({
      isPassword: e.detail.value
    })
  },
  getmemo(e) {
    console.log(e)
    let arr = []
    let index = e.currentTarget.dataset.index
    // let item = e.currentTarget.dataset.item
    let OrderList = this.data.OrderList
    OrderList.sellers[index].memo = e.detail.value
    OrderList.sellers.map(function(val,key){
      if(val.memo){
        arr.push(val.sellerId+'@@@'+val.memo)
      }else{
        arr.push(val.sellerId + '@@@')
      }
    })
    // let str = e.currentTarget.dataset.item.sellerId + '@@@' + e.detail.value
    // arr.push(str)
    this.setData({
      memo: arr
    })
  },
  //提交订单
  upDataList() {
    // if (this.data.pagFangshi === 'score' && this.data.isScore < 100) {
    //   wx.showToast({ title: '积分数不得低于100', icon: 'none' })
    //   return
    // } else if (this.data.pagFangshi === 'goldBean' && this.data.isGoldBean < 10) {
    //   wx.showToast({ title: '金豆数不得低于10', icon: 'none' })
    //   return
    // }
    let _self = this
    if (this.data.isScore && this.data.isScore < 100) {
      wx.showToast({ title: '积分数不得低于100', icon: 'none' })
      return
    }
    if (this.data.isGoldBean && this.data.isGoldBean < 10) {
      wx.showToast({ title: '金豆数不得低于10', icon: 'none' })
      return
    }
    if (this.data.OrderList.isCrossBorderProduct == 1) {
      if (!this.data.addressMess.identityNo) {
        //  wx.showToast({ title: '跨境商品收货地址需填写身份证号,请去管理收货地址确保拥有身份证号', icon: 'none' })
        wx.showModal({
          title: '提示',
          content: '跨境商品收货地址需填写身份证号',
          confirmText: '去完善',
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../detial/addNewAdress/addNewAdress?backType=' + 2 + '&isCrossBorderProduct=' + _self.data.OrderList.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + _self.data.OrderList.isOverseasDirectMailProduct + '&id=' + _self.data.addressMess.id + '&addType=updata' + '&ids=' + _self.data.ids
              })
            } else if (res.cancel) {
              wx.showToast({ title: '已取消', icon: 'none' })
            }
          }
        })
        return
      }
    }
    if (this.data.OrderList.isCrossBorderProduct == 1) {
      if (!this.data.addressMess.identityNo || !this.data.addressMess.identityFrontImage || !this.data.addressMess.identityOppImage) {
        //  wx.showToast({ title: '跨境商品收货地址需填写身份证号,请去管理收货地址确保拥有身份证号', icon: 'none' })
        wx.showModal({
          title: '提示',
          content: '海外直邮商品需要身份证号,身份证正反面照片等信息',
          confirmText: '去完善',
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../detial/addNewAdress/addNewAdress?backType=' + 2 + '&isCrossBorderProduct=' + _self.data.OrderList.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + _self.data.OrderList.isOverseasDirectMailProduct + '&id=' + _self.data.addressMess.id + '&addType=updata' + '&ids=' + _self.data.ids
              })
            } else if (res.cancel) {
              wx.showToast({ title: '已取消', icon: 'none' })
            }
          }
        })
        return
      }
    }
    //判断地址结束
    //判断是否需要输入支付密码
    let isPayFasngshi = [this.data.isScore, this.data.isAmount, this.data.isCoffers, this.data.isGoldBean].some(function (val, index) {
      return val
    })
    if (this.data.OrderList.enabledPayPassword == 1 && isPayFasngshi) {
      this.setData({
        isPasswordShow: true,
        isPassword: ''
      })
    } else {
      this.setData({
        isPasswordShow: false
      })
      this.surePay()
    }
  },
  //确定
  surePay() {
    // console.log(this.data.pagFangshi)
    wx.showLoading({
      mask: true
    })
    let data = {
      // productId: this.data.productData.productId,
      // num: this.data.productData.num,
      carIds:this.data.ids,//购物车id
      memberId: app.userId,
      addressId: this.data.addressMess.id,//地址id
      payMethod: 6,//支付方式小程序
      memos: this.data.memo.join(','),//留言备注
      uutype: app.uutype,//终端类型
      // type: this.data.productType,
      isPayAnother: this.data.isPayAnother,//是否代付
    }
    // if (this.data.productData.recId) {//发现关联id
    //   data.recId = this.data.productData.recId
    // }
    // if (this.data.productData.normalId) {//规格信息
    //   data.normalId = this.data.productData.normalId
    // }
    if (this.data.couponSell > 0) {
      data.couponIds = this.data.couponIds
    }
    if (this.data.isScore) data.score = this.data.isScore
    if (this.data.isCoffers) data.coffers = this.data.isCoffers
    if (this.data.isAmount) data.amount = this.data.isAmount
    if (this.data.isGoldBean) data.goldBean = this.data.isGoldBean
    let isPayFasngshi = [this.data.isScore, this.data.isAmount, this.data.isCoffers, this.data.isGoldBean].some(function (val, index) {
      return val
    })
    if (this.data.OrderList.enabledPayPassword == 1 && isPayFasngshi) {//是否需要支付密码
      data.payPassword = md5.hexMD5(this.data.isPassword)
    }
    // console.log(data.payPassword)
    if (this.data.OrderList.enabledPayPassword == 1 && !this.data.isPassword && isPayFasngshi) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }
    let dingdan = {
      url: '/mobile/order/carToOrder',
      data: data,
      callback: function (res) {
        // if (res.data.code == 1) wx.showToast({ title: '库存不足', icon: 'none' })
        // else if (res.data.code == 1) wx.showToast({ title: '库存不足', icon: 'none' })
        // console.log(res)
        // if (res.data.code == 0) {
          wx.hideLoading({})
          if (res.data.result.payInfo) {
            wx.requestPayment({
              timeStamp: res.data.result.payInfo.timeStamp,
              nonceStr: res.data.result.payInfo.nonceStr,
              package: res.data.result.payInfo.package_,
              signType: res.data.result.payInfo.signType,
              paySign: res.data.result.payInfo.paySign,
              success(res1) {
                // wx.showToast({ title: '支付成功', icon: 'none' })
                wx.reLaunch({
                  url: '../detial/paySuccess/paySuccess?orderMess=' + res.data.result.orderPayRecordNo
                })
              },
              fail(res) {
                // wx.showToast({ title: '支付失败', icon: 'none' })
              }
            })
          } else {
            wx.showToast({ title: '支付成功', icon: 'none' })
            wx.reLaunch({
              url: '../detial/paySuccess/paySuccess?orderMess=' + res.data.result.orderPayRecordNo
            })
          }
        // } else {
        //   wx.showToast({ title: res.data.message, icon: 'none' })
        // }

      }
    }
    common.methods.mothod1(dingdan)
  },
  concalPay() {
    this.setData({
      isPasswordShow: false
    })
  },
  // preventD() {
  //   return
  // },
  //确认订单

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