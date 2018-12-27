// views/detial/toSureBuy/toSureBuy.js
var common = require('../../../utils/common.js')
var md5 = require('../../../utils/md5.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    OrderList:'',
    // addressId: '',
    productData:{},//商品信息
    addressMess:'',//地址信息
    productPrice:'',
    productType:'',
    phoneNum:'',
    moneyClass: [{ title: '积分', mean: 'score' }, { title: '余额', mean: 'amount' }, { title: '小金库', mean: 'coffers' }, { title: '金豆', mean:'goldBean'}],
    moneyNum:'',//分类num
    muchNum:'',//实际减多少
    inputChange:'',//输入框数值
    isScore: '',//积分输入
    isAmount: '',//余额输入
    isCoffers: '',//小金库输入
    isGoldBean:'',//金豆输入
    pagFangshi:'',//账户支付方式
    couponSell:0,//优惠券价值
    isCoupon:'',//弹框显示
    whichCoupon:'',
    deleTitle:'',
    deleNum:'',
    memo:'',//订单备注
    lastMoney:'',//最后支付金额
    adressID:'',//地址id
    isPassword:'',//支付密码
    isPasswordShow:false,//支付密码弹框
    isPayAnother:0,//是否代付
    openOrClose:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.adressID){
      this.setData({
        adressID: options.adressID
      })
    }
    this.getOrderList(options)
  },
  //获取收货地址
  getaddressMess(id){
    let _self = this
    let data = {
      url: '/mobile/address/getAddress',
      data: {
        addressId:id
      },
      callback: function (res) {
        const adre=res.data.result
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
  getOrderList(options){
    wx.showLoading({
      mask: true
    })
    let _self=this
    let callBackMess = wx.getStorageSync('productMess')
    console.log(callBackMess)
    this.setData({
      productType: callBackMess.type,
      productData: callBackMess
    })
    let data={
      url:'/mobile/order/buyNowConfirmOrder',
      data:{
        productId: callBackMess.productId,
        num: callBackMess.num,
        memberId: app.userId,
        uutype: app.uutype,
        type: callBackMess.type
        },
        callback:function(res){
          // if(){}判断有无地址
          if (!res.data.result.receiveAddress) {
            wx.redirectTo({
              url: '../addNewAdress/addNewAdress?backType=' + 1 + '&isCrossBorderProduct=' + res.data.result.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + res.data.result.isOverseasDirectMailProduct,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            return
          }
          if (_self.data.adressID){
            _self.getaddressMess(_self.data.adressID)
          }else{
            _self.getaddressMess(res.data.result.receiveAddress.id)
          }
          let arr = res.data.result
          // console.log(arr.totalFee)
          arr.totalFee = parseFloat(arr.totalFee).toFixed(2)
          // console.log(arr.totalFee)
          
          if (arr.sellers[0].productDetails[0].normal){
            let normalArr = arr.sellers[0].productDetails[0].normal.split(' ')
            arr.sellers[0].productDetails[0].normal = normalArr
          }
          _self.setData({
            OrderList: arr,
            lastMoney: arr.totalFee,
            productPrice: arr.totalFee
          })
          wx.hideLoading()    
        }
    }
    if (callBackMess.normalId){
      data.data.normalId = callBackMess.normalId
    }
    common.methods.mothod1(data)
  },
  //选择某个支付
  checkedThis(e){
    this.setData({
      lastMoney: this.data.couponSell ? (parseFloat(this.data.OrderList.totalFee) - parseFloat(this.data.couponSell)).toFixed(2) : parseFloat(this.data.OrderList.totalFee).toFixed(2)
    })
    if (e.currentTarget.dataset.index ===this.data.moneyNum){
      this.setData({
        moneyNum:'',
        pagFangshi:'',
        isScore: '',//积分输入
        isAmount: '',//余额输入
        isCoffers: '',//小金库输入
        isGoldBean:''
      })
      return
    }else{
      this.setData({
        moneyNum: e.currentTarget.dataset.index,
        pagFangshi: e.currentTarget.dataset.item.mean,
      })
    }
    let price = this.data.couponSell ? this.data.productPrice - this.data.couponSell : this.data.productPrice
    let choseNum = this.data.OrderList[e.currentTarget.dataset.item.mean]
    if (e.currentTarget.dataset.item.mean === "amount") {//余额
      if (price > choseNum){
        this.setData({
          muchNum:choseNum,
          isAmount:choseNum,
          lastMoney: (parseFloat(this.data.lastMoney) - parseFloat(choseNum)).toFixed(2)
        })
      }else{
        this.setData({
          muchNum: parseFloat(price).toFixed(2),
          isAmount: parseFloat(price).toFixed(2),
          lastMoney: (parseFloat(this.data.lastMoney) - parseFloat(price)).toFixed(2)
        })
      }
      this.setData({
        deleTitle: '余额',
        deleNum: this.data.isAmount         
      })
    } else if (e.currentTarget.dataset.item.mean === "coffers") {//小金库
      if (price > choseNum) {
        this.setData({
          muchNum: choseNum,
          isCoffers: choseNum,
          lastMoney: (parseFloat(this.data.lastMoney) - parseFloat(choseNum)).toFixed(2)
        })
      } else {
        this.setData({
          muchNum: parseFloat(price).toFixed(2),
          isCoffers: parseFloat(price).toFixed(2),
          lastMoney: (parseFloat(this.data.lastMoney) - parseFloat(price)).toFixed(2)
        })
      }
      this.setData({
        deleTitle:'小金库',
        deleNum: this.data.isCoffers
      })
    }else if (e.currentTarget.dataset.item.mean === "score"){//积分
      if (price > choseNum/100){
        this.setData({
          muchNum: choseNum/100,
          isScore: choseNum,
          lastMoney: (parseFloat(this.data.lastMoney) - parseFloat(choseNum / 100)).toFixed(2)
        })
      }else{
        this.setData({
          muchNum: parseFloat(price).toFixed(2),
          isScore: parseFloat(price * 100).toFixed(0) ,
          lastMoney: (parseFloat(this.data.lastMoney) - parseFloat(price)).toFixed(2)
        })
      }
      this.setData({
        deleTitle: '积分',
        deleNum: (this.data.isScore/100)
      })
    }else{//金豆
      if (price > choseNum / 10) {
        this.setData({
          muchNum:choseNum / 10,
          isGoldBean: choseNum,
          lastMoney: (parseFloat(this.data.lastMoney) - parseFloat(choseNum / 10)).toFixed(2)
        })
      } else {
        this.setData({
          muchNum: parseFloat(price).toFixed(2),
          isGoldBean: parseFloat(price * 100) / 10,
          lastMoney: (parseFloat(this.data.lastMoney) - parseFloat(price)).toFixed(2)
        })
      }
      this.setData({
        deleTitle: '金豆',
        deleNum: this.data.isGoldBean / 10
      })
    }

  },
  //输入金额
  putinMoney(e){
    console.log(e)
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
    // console.log(valueNum, typeof valueNum)
    let price = this.data.couponSell ? this.data.productPrice - this.data.couponSell : this.data.productPrice
    console.log(price)
    if (e.currentTarget.dataset.item.mean === "amount"){
      if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])){
        console.log(valueNum,price)
        this.setData({
          muchNum: parseFloat(price*100)/100,
          isAmount: parseFloat(price*100)/100,
          lastMoney:(0).toFixed(2)
        })
      } else if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])){
        if (parseFloat(price) > parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])){
          this.setData({
            muchNum: this.data.OrderList[e.currentTarget.dataset.item.mean],
            isAmount: this.data.OrderList[e.currentTarget.dataset.item.mean],
            lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])).toFixed(2)
          })
        }else{
          this.setData({
            muchNum: parseFloat(price * 100) / 100,
            isAmount: parseFloat(price * 100) / 100,
            lastMoney: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])){
        this.setData({
          muchNum: this.data.OrderList[e.currentTarget.dataset.item.mean],
          isAmount: this.data.OrderList[e.currentTarget.dataset.item.mean],
          lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])).toFixed(2)
        })
      }else{
        console.log(valueNum, price,222222222222222222)
        this.setData({
          muchNum: parseFloat(valueNum),
          isAmount: valueNum,
          lastMoney: valueNum ? (price - parseFloat(valueNum)).toFixed(2) : price
        })
      }
    } else if (e.currentTarget.dataset.item.mean === "coffers"){
      if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        console.log(valueNum, price)
        this.setData({
          muchNum: parseFloat(price * 100) / 100,
          isCoffers: parseFloat(price * 100) / 100,
          lastMoney: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        if (parseFloat(price) > parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
          this.setData({
            muchNum: this.data.OrderList[e.currentTarget.dataset.item.mean],
            isCoffers: this.data.OrderList[e.currentTarget.dataset.item.mean],
            lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])).toFixed(2)
          })
        } else {
          this.setData({
            muchNum: parseFloat(price * 100) / 100,
            isCoffers: parseFloat(price * 100) / 100,
            lastMoney: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        this.setData({
          muchNum: this.data.OrderList[e.currentTarget.dataset.item.mean],
          isCoffers: this.data.OrderList[e.currentTarget.dataset.item.mean],
          lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])).toFixed(2)
        })
      } else {
        console.log(valueNum, price, 222222222222222222)
        this.setData({
          muchNum: parseFloat(valueNum),
          isCoffers: valueNum,
          lastMoney: valueNum ? (price - parseFloat(valueNum)).toFixed(2) : price
        })
      }
    } else if (e.currentTarget.dataset.item.mean === "score"){
      if (parseFloat(valueNum/100) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        console.log(valueNum, price)
        this.setData({
          muchNum: parseFloat(price * 100) / 100,
          isScore: parseFloat(price * 100),
          lastMoney: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum/100) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        if (parseFloat(price) > parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean]/100)) {
          this.setData({
            muchNum: parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean]/100),
            isScore: this.data.OrderList[e.currentTarget.dataset.item.mean],
            lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean]/100)).toFixed(2)
          })
        } else {
          this.setData({
            muchNum: parseFloat(price * 100) / 100,
            isScore: parseFloat(price * 100),
            lastMoney: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum/100) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        this.setData({
          muchNum: parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean]/100),
          isScore: this.data.OrderList[e.currentTarget.dataset.item.mean],
          lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean]/100)).toFixed(2)
        })
      } else {
        this.setData({
          muchNum: parseFloat(valueNum/100),
          isScore: valueNum,
          lastMoney: valueNum ? (price - parseFloat(valueNum/100)).toFixed(2) : price
        })
      }
    }else{
      if (parseFloat(valueNum / 10) >= parseFloat(price) && parseFloat(valueNum) <= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        console.log(valueNum, price)
        this.setData({
          muchNum: parseFloat(price * 100) / 100,
          isGoldBean: parseFloat(price * 100) / 10,
          lastMoney: (0).toFixed(2)
        })
      } else if (parseFloat(valueNum / 10) >= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        if (parseFloat(price) > parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10)) {
          this.setData({
            muchNum: parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10),
            isGoldBean: this.data.OrderList[e.currentTarget.dataset.item.mean],
            lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10)).toFixed(2)
          })
        } else {
          this.setData({
            muchNum: parseFloat(price * 100) / 100,
            isGoldBean: parseFloat(price * 100) / 10,
            lastMoney: (0).toFixed(2)
          })
        }
      } else if (parseFloat(valueNum / 10) <= parseFloat(price) && parseFloat(valueNum) >= parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean])) {
        this.setData({
          muchNum: parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean]/10),
          isGoldBean: this.data.OrderList[e.currentTarget.dataset.item.mean],
          lastMoney: (price - parseFloat(this.data.OrderList[e.currentTarget.dataset.item.mean] / 10)).toFixed(2)
        })
      } else {
        this.setData({
          muchNum: parseFloat(valueNum/10),
          isGoldBean: valueNum,
          lastMoney: valueNum ? (price - parseFloat(valueNum/10)).toFixed(2) : price
        })
      }
    }
  },
  //打开优惠券弹框
  openCoupon(){
      this.setData({
        isCoupon:true
      })
  },
  closeCoupon() {
    this.setData({
      isCoupon: false
    })
  },
  //选择优惠券
  choseCoupon(e){
    if (e.currentTarget.dataset.index === this.data.whichCoupon) {
      let moneyy = (parseFloat(this.data.lastMoney) + parseFloat(e.currentTarget.dataset.item.price)).toFixed(2)
      this.setData({
        whichCoupon: '',
        couponSell:0,
        lastMoney: moneyy,
      })
      return
    } else {
      let money22 = this.data.couponSell
      this.setData({
        whichCoupon: e.currentTarget.dataset.index,
        couponSell: e.currentTarget.dataset.item.price,
      })
      if (this.data.pagFangshi){
        if ((parseFloat(this.data.lastMoney) + parseFloat(money22)- parseFloat(this.data.couponSell))<0){
            let firstMoney = parseFloat(this.data.OrderList.totalFee - this.data.couponSell).toFixed(2)
            if (this.data.pagFangshi === 'amount'){
              this.setData({
                muchNum: Math.floor(firstMoney * 100) / 100,
                isAmount: Math.floor(firstMoney * 100) / 100,
                lastMoney: (0).toFixed(2)
              })
            } else if (this.data.pagFangshi === 'coffers'){
              this.setData({
                muchNum: Math.floor(firstMoney * 100) / 100,
                isCoffers: Math.floor(firstMoney * 100) / 100,
                lastMoney: (0).toFixed(2)
              })
            }else if (this.data.pagFangshi === 'score'){
              this.setData({
                muchNum: Math.floor(firstMoney * 100) / 100,
                isScore: Math.floor(firstMoney * 100),
                lastMoney: (0).toFixed(2)
              })
            }else{
              this.setData({
                muchNum: Math.floor(firstMoney * 100) / 100,
                isGoldBean: Math.floor(firstMoney*10),
                lastMoney: (parseFloat(firstMoney) - parseFloat(firstMoney).toFixed(1)).toFixed(2)
              })
            }
          }else{
          console.log(this.data.lastMoney, money22, this.data.couponSell)
            this.setData({
              lastMoney:(parseFloat(this.data.lastMoney) + parseFloat(money22) - parseFloat(this.data.couponSell)).toFixed(2)
            })
          console.log(this.data.lastMoney)
          }
        // }
      }else{
         this.setData({
           lastMoney: (parseFloat(this.data.lastMoney) + parseFloat(money22)- parseFloat(e.currentTarget.dataset.item.price)).toFixed(2)
      })
      }
    }
  },
  //选择支付方式
  chosePay(e){

  },
  //跳转地址页面
  toAdress(){
    wx.navigateTo({
      url: '../addAdress/addAdress?backType=' + 1 + '&isCrossBorderProduct=' + this.data.OrderList.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + this.data.OrderList.isOverseasDirectMailProduct,
    })
  },
  //获取密码
  getparssword(e){
    this.setData({
      isPassword: e.detail.value
    })
  },
  getmemo(e){
    this.setData({
      memo: e.detail.value
    })
  },
  //提交订单
  upDataList(){
    if (this.data.pagFangshi === 'score' && this.data.isScore<100){
      wx.showToast({ title: '积分数不得低于100', icon: 'none' })
      return
    } else if (this.data.pagFangshi === 'goldBean' && this.data.isGoldBean < 10){
      wx.showToast({ title: '金豆数不得低于10', icon: 'none' })
      return
    }
    let _self=this
    if (this.data.OrderList.isCrossBorderProduct == 1){
      if (!this.data.addressMess.identityNo){
    //  wx.showToast({ title: '跨境商品收货地址需填写身份证号,请去管理收货地址确保拥有身份证号', icon: 'none' })
        wx.showModal({
          title: '提示',
          content: '跨境商品收货地址需填写身份证号',
          confirmText:'去完善',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../addNewAdress/addNewAdress?backType=' + 1 + '&isCrossBorderProduct=' + _self.data.OrderList.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + _self.data.OrderList.isOverseasDirectMailProduct +'&id=' + _self.data.addressMess.id + '&addType=updata'
              })
            } else if (res.cancel) {
              wx.showToast({ title: '已取消', icon: 'none' })
            }
          }
        })
        return
      }
    }
    if (this.data.OrderList.isOverseasDirectMailProduct == 1) {
      if (!this.data.addressMess.identityNo || !this.data.addressMess.identityFrontImage || !this.data.addressMess.identityOppImage) {
        //  wx.showToast({ title: '跨境商品收货地址需填写身份证号,请去管理收货地址确保拥有身份证号', icon: 'none' })
        wx.showModal({
          title: '提示',
          content: '海外直邮商品需要身份证号,身份证正反面照片等信息',
          confirmText: '去完善',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../addNewAdress/addNewAdress?backType=' + 1 + '&isCrossBorderProduct=' + _self.data.OrderList.isCrossBorderProduct + '&isOverseasDirectMailProduct=' + _self.data.OrderList.isOverseasDirectMailProduct + '&id=' + _self.data.addressMess.id + '&addType=updata'
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
    if (this.data.OrderList.enabledPayPassword == 1 && this.data.pagFangshi){
        this.setData({
          isPasswordShow:true,
          isPassword:''
        })
    }else{
      this.setData({
        isPasswordShow: false
      })
      this.surePay()
    }
  },
  //确定
  surePay() {
    wx.showLoading({
      mask:true
      })
    console.log(this.data.pagFangshi)
        let data={
          productId: this.data.productData.productId,
          num: this.data.productData.num,
          memberId:app.userId,
          addressId: this.data.addressMess.id,
          payMethod:6,//支付方式小程序
          memo: this.data.memo,
          uutype:app.uutype,
          type: this.data.productType,
          isPayAnother: this.data.isPayAnother,//是否代付
        }
    if (this.data.productData.recId){//发现关联id
      data.recId = this.data.productData.recId
    }
    if (this.data.productData.normalId) {//规格信息
      data.normalId = this.data.productData.normalId
    }
    if (this.data.couponSell > 0 && this.data.whichCoupon !== '') {
      data.couponRecordId = this.data.OrderList.coupons[0].coupons[this.data.whichCoupon].id
    }
    if (this.data.pagFangshi == 'score') data.score = this.data.isScore
    else if (this.data.pagFangshi == 'coffers') data.coffers = this.data.isCoffers
    else if (this.data.pagFangshi == 'amount') data.amount = this.data.isAmount
    else if (this.data.pagFangshi == 'goldBean') data.goldBean = this.data.isGoldBean

    if (this.data.OrderList.enabledPayPassword == 1 && this.data.pagFangshi){//是否需要支付密码
      data.payPassword = md5.hexMD5(this.data.isPassword)
    }
    let dingdan={
      url:'/mobile/order/buyNowCreateOrder',
      data:data,
      callback:function(res){
        // if (res.data.code == 1) wx.showToast({ title: '库存不足', icon: 'none' })
        // else if (res.data.code == 1) wx.showToast({ title: '库存不足', icon: 'none' })
        console.log(res)
        // if(res.data.code==0){
          wx.hideLoading({})
          // _self.setData({
          //   GoShouQuan:false
          // })
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
                  url: '../paySuccess/paySuccess?orderMess=' + res.data.result.orderPayRecordNo
                })
              },
              fail(res) {
                // wx.showToast({ title: '支付失败', icon: 'none' })
              }
            })
          }else{
            wx.showToast({ title: '支付成功', icon: 'none' })
            wx.reLaunch({
              url: '../paySuccess/paySuccess?orderMess=' + res.data.result.orderPayRecordNo
            })
          }
        // }else{
        //   wx.showToast({ title:res.data.message , icon: 'none' })
        // }
        
      }
    }
    common.methods.mothod1(dingdan)
   },
  concalPay(){
    this.setData({
      isPasswordShow: false
    })
  },
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