// views/detial/addNewAdress/addNewAdress.js
var common = require('../../../utils/common.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backType: '',//上个页面type
    isCrossBorderProduct: 1,//跨境商品需要身份证号
    isOverseasDirectMailProduct: 1,//海外直邮需要身份证号，身份证正反面照片
    name:'',
    phone:'',
    region: ['请选择', '请选择', '请选择'],
    regionID: [],
    trueOrFalse:true,
    customItem: '全部',
    adressmsg:'',
    cardNum:'',
    cardImgzhen:'',
    cardImgfan:'',
    AllAdressList:[],//全部省市区
    updataId:'',
    addType:'',
    isShowCard:true,
    isShowPhoto:true,
    ids:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      updataId: options.id ? options.id :'',
      addType: options.addType ? options.addType : '',
      backType: options.backType ? options.backType : '',
      ids: options.ids ? options.ids : '',
    })
    if (options.backType) {
      this.setData({
        isCrossBorderProduct: options.isCrossBorderProduct ? options.isCrossBorderProduct : 0,
        isOverseasDirectMailProduct: options.isOverseasDirectMailProduct ? options.isOverseasDirectMailProduct : 0
      })
      if (this.data.isCrossBorderProduct == 0) {
        this.setData({
          isShowCard: false
        })
      }
      if (this.data.isOverseasDirectMailProduct == 0) {
        this.setData({
          isShowPhoto: false
        })
      }
    }
    console.log(options)
    this.getAllAdress()
    if (options.addType=='updata'){
      this.getOneDetail()
    }
  },
//获取手机号  收货人
  getDetial(e) {
      //event.detail
      console.log(e)
    if(e.currentTarget.dataset.num==1){
      this.setData({
        name: e.detail.value
      })
      // console.log(this.data.name)
    } else if (e.currentTarget.dataset.num == 2) {
      this.setData({
        phone: e.detail.value
      })
    } else if (e.currentTarget.dataset.num == 3) {
      this.setData({
        adressmsg: e.detail.value
      })
    } else if (e.currentTarget.dataset.num == 4) {
      this.setData({
        cardNum: e.detail.value
      })
    }
   },
   //编辑进入获取详情
   getOneDetail(){
     let _self=this
     let data={
       url:'/mobile/address/getAddress',
       data:{
         addressId: this.data.updataId
       },
       callback:function(res){
         _self.setData({
           name: res.data.result.name,
           phone: res.data.result.mobile,
           region: [res.data.result.provinceName ? res.data.result.provinceName : '请选择', res.data.result.cityName ? res.data.result.cityName : '请选择', res.data.result.districtName ? res.data.result.districtName : '请选择'],
           adressmsg: res.data.result.address,
           cardNum: res.data.result.identityNo,
           cardImgzhen: res.data.result.identityFrontImage,
           cardImgfan: res.data.result.identityOppImage,
         })
       }
     }
     common.methods.mothod1(data)
   },
  //地区选择器
  bindRegionChange (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //uploadImg
  uploadImg(e){
    let _self=this
      //e.currentTarget.dataset.index
      ///mobile/imageUpload/saveImage
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showToast({
          title: '正在上传...',
          icon: 'loading'
        })  
        wx.uploadFile({
          header: {
            "Content-Type": "multipart/form-data"
          },  
          url: app.baseUrl+'/mobile/imageUpload/saveImage', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'image',
          // formData: {
          //   'user': 'test'
          // },
          success(res) {
            const result=JSON.parse(res.data)
            if (res.statusCode == 200 && result.code === 0){
              if (e.currentTarget.dataset.index==1){
                _self.setData({
                  cardImgzhen: result.result.savePath
                })
              }else{
                _self.setData({
                  cardImgfan: result.result.savePath
                })
              }
              wx.hideToast();  
            }
          },
          fail(err){
            wx.showToast({
              title: '图片上传失败',
              icon: 'fail'
            })  
          }
        })
      }
    })
  },
  //获取省市区
  getAllAdress(){
      let _self=this
      let data={
        url:'/mobile/city/getAllCity',
        data:{},
        callback:function(res){
              _self.setData({
                AllAdressList:res.data.result
              })
        }
      }
    common.methods.mothod1(data)
  },
  //保存地址
  saveAdress(){
    let _self=this
    // this.getAdressId()
    // console.log(this.data.name)
    if (!this.data.name){
      wx.showToast({ title: '收货人不可为空', icon: 'none' })
      return
    }
    if (this.data.phone.length !== 11) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }
//获取id
    let allId = []
    const choseAdres = this.data.region
    const allAdres = this.data.AllAdressList
    choseAdres.forEach(function (item, index) {
      if (item === '请选择' || item === '全部') {
        _self.setData({
          trueOrFalse: false
        })
        return
      } else {
        _self.setData({
          trueOrFalse: true
        })
      }
    })
    if (choseAdres[0] === '北京市' || choseAdres[0] === '天津市' || choseAdres[0] === '上海市' || choseAdres[0] === '重庆市') {
      choseAdres[0] = choseAdres[0].substring(0, 2)
    }
    console.log(choseAdres)
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
//获取id结束
    if (!this.data.trueOrFalse) {
      wx.showToast({ title: '省市区选择不完善', icon: 'none' })
      return
    }
    if (!this.data.adressmsg) {
      wx.showToast({ title: '详细地址不可为空', icon: 'none' })
      return
    }
    let data = {
      provinceId: this.data.regionID[0],
      cityId: this.data.regionID[1],
      districtId: this.data.regionID[2],
      address: this.data.adressmsg,
      identityNo: this.data.cardNum,
      name: this.data.name,
      mobile: this.data.phone,
      memberId: app.userId,
      frontServerId: this.data.cardImgzhen,
      oppServerId: this.data.cardImgfan,
      uutype: app.uutype,
    }
    if (this.data.isCrossBorderProduct==1){
      if (this.data.cardNum){
        // data.identityNo = this.data.cardNum
        console.log(data.identityNo.length)
        if (data.identityNo.length !== 18 && data.identityNo.length !== 15) {
          wx.showToast({ title: '身份证号格式不正确', icon: 'none' })
          return
        }
      } else {
        wx.showToast({ title: '跨境商品需填写身份证号', icon: 'none' })
        return
      }
    }
    if (this.data.isOverseasDirectMailProduct==1) {
      if (this.data.cardNum && this.data.cardImgzhen && this.data.cardImgfan){
        // data.identityNo = this.data.cardNum
        // data.frontServerId = this.data.cardImgzhen
        // data.oppServerId = this.data.cardImgfan
        if (data.identityNo.length !== 18 || data.identityNo.length !== 15) {
          wx.showToast({ title: '身份证号格式不正确', icon: 'none' })
          return
        }
      } else {
        wx.showToast({ title: '海外直邮商品需填写身份证号及上传身份证正反面照片', icon: 'none' })
        return
      }
    }
    let adress={
      url:'/mobile/address/addAddress',
      data: data,
      callback:function(res){
        wx.showToast({ title: _self.data.addType=='updata' ? '修改成功' : '添加成功', icon: 'none' })
        if (_self.data.backType==1){
          wx.redirectTo({
            url: '../toSureBuy/toSureBuy?adressID='+res.data.result
          })
        } else if (_self.data.backType ==2){
          wx.redirectTo({
            url: '../../carToBuy/carToBuy?adressID=' + res.data.result+'&ids=' + _self.data.ids
          })
        }else{
          // ? backType = ' + _self.data.backType + ' & isCrossBorderProduct=' + _self.data.isCrossBorderProduct + '& isOverseasDirectMailProduct=' + _self.data.isOverseasDirectMailProduct
          wx.navigateTo({
            url: '../addAdress/addAdress'
          })
        }
       
      }
    }
    if (this.data.addType=='updata'){
      adress.data.addressId = this.data.updataId
    }
    common.methods.mothod1(adress)
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