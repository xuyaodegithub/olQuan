// views/personal/mySet/mySet.js
var common = require("../../../utils/common.js");
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList:[],
    ownLogo:'',
    ownLogoSrc:'',
    array:['未填写','男','女'],
    index:0,
    date:'',
    endDete:'',
    changeNick:false,
    changeReal:false,
    changeIdCard:false,
    nickNameStr:'',
    nickName:'',
    realName:'',
    idCard:'',
    checkedSure:true,
    openPayPasswordSure:false,
    passWord:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMember();
    this.setData({
      endDete: new Date().toLocaleDateString().replace(/\//g, "-")
    })
    
  },
  getMember(){
    let _self=this
    let banners = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          memberList: res.data.result,
          ownLogo: res.data.result.logo
        })
        if (res.data.result.sex==1){
          _self.setData({
            index:1
          })
        } else if (res.data.result.sex == 2){
          _self.setData({
            index: 2
          })
        }else{
          _self.setData({
            index: 0
          })
        }
        if (res.data.result.birthday!=null){
          _self.setData({
            date: res.data.result.birthday
          })
        }else{
          _self.setData({
            date: '未填写'
          })
        }
        if (res.data.result.enabledPayPassword==1){
          _self.setData({
            checkedSure: true
          })
        }else{
          _self.setData({
            checkedSure: false
          })
        }
        console.log(_self.data.checkedSure)
      }
    }
    common.methods.mothod1(banners)
  },
  //改变头像
  changeLogo(){
    let _self=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        
        const tempFilePaths = res.tempFilePaths
        wx.showToast({
          title: '正在上传...',
          icon: 'loading'
        })
        wx.uploadFile({
          header: {
            "Content-Type": "multipart/form-data"
          },
          url: app.baseUrl + '/mobile/imageUpload/saveImage', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'image',
          // formData: {
          //   'user': 'test'
          // },
          success(res) {
            const result = JSON.parse(res.data)
            if (res.statusCode == 200 && result.code === 0) {
              _self.setData({
                ownLogoSrc: result.result.savePath

              })
              _self.changeRelLogo(result.result.savePath)
              wx.hideToast();
            }
          },
          fail(err) {
            wx.showToast({
              title: '图片上传失败',
              icon: 'fail'
            })
          }
        })
      }
    })
  },
  changeRelLogo(logo){
    let _self = this
    let banners = {
      url: '/mobile/member/update',
      data: {
        memberId: app.userId,
        logo: logo
      },
      callback: function (res) {
        if (res.data.code == 0){
          _self.setData({
            ownLogo: _self.data.ownLogoSrc
          })
        }else{
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
  //修改性别
  bindPickerChange(e){
    if (e.detail.value==0){
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let _self = this
    let banners = {
      url: '/mobile/member/update',
      data: {
        memberId: app.userId,
        sex: e.detail.value
      },
      callback: function (res) {
        if (res.data.code == 0) {
          _self.setData({
            index: e.detail.value
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
    common.methods.mothod3(banners)
  },
  //改变生日
  bindDateChange(e){
    let _self = this
    let banners = {
      url: '/mobile/member/update',
      data: {
        memberId: app.userId,
        birthday: e.detail.value
      },
      callback: function (res) {
        if (res.data.code == 0) {
          _self.setData({
            date: e.detail.value
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
    common.methods.mothod3(banners)
  },
  //改变昵称
  changeNickName(){
    this.setData({
      changeNick:true,
    })
  },
  changeNickNameSure(e){
    this.setData({
      nickNameStr: e.detail.value
    })
  },
  changeNickNameS(){
    let _self = this
    let banners = {
      url: '/mobile/member/update',
      data: {
        memberId: app.userId,
        nickName: _self.data.nickNameStr
      },
      callback: function (res) {
        if (res.data.code == 0) {
          let memList=_self.data.memberList;
          memList.nickName = _self.data.nickNameStr
          _self.setData({
            memberList: memList,
            changeNick: false,
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
    common.methods.mothod3(banners)
  },
  //改变姓名
  changeRealName() {
    this.setData({
      changeReal: true,
    })
  },
  changerealNameSure(e){
    this.setData({
      realName: e.detail.value
    })
  },
  changerealNameS(){
    let _self = this
    let banners = {
      url: '/mobile/member/update',
      data: {
        memberId: app.userId,
        realName: _self.data.realName
      },
      callback: function (res) {
        if (res.data.code == 0) {
          let memList = _self.data.memberList;
          memList.realName = _self.data.realName
          _self.setData({
            memberList: memList,
            changeReal: false,
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
    common.methods.mothod3(banners)
  },
  //改成身份证号
  changeIdCard() {
    this.setData({
      changeIdCard: true,
    })
  },
  changerealIdCard(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  changerealIdCardS() {
    let _self = this
    let banners = {
      url: '/mobile/member/update',
      data: {
        memberId: app.userId,
        identityNo: _self.data.idCard
      },
      callback: function (res) {
        if (res.data.code == 0) {
          let memList = _self.data.memberList;
          memList.identityNo = _self.data.idCard
          _self.setData({
            memberList: memList,
            changeIdCard: false,
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
    common.methods.mothod3(banners)
  },
  //取消
  delChange(){
    this.setData({
      changeNick: false,
      changeReal:false,
      changeIdCard:false,
    })
  },
  //是否开启账号保护
  switch1Change(e){
    this.setData({
      openPayPasswordSure:true,
      passWord:'',
    })
    if (this.data.memberList.enabledPayPassword == 1) {
      this.setData({
        checkedSure: true
      })
    } else {
      this.setData({
        checkedSure: false
      })
    }
    console.log(this.data.checkedSure)
  },
  openPayPasswordValue(e){
    this.setData({
      passWord: e.detail.value
    })
  },
  openPayPassword(){
    let _self = this
    let banners = {
      url: '/mobile/member/openPayPassword',
      data: {
        memberId: app.userId,
        payPassword: utilMd5.hexMD5(_self.data.passWord)
      },
      callback: function (res) {
        if (res.data.code == 0) {
          let memList = _self.data.memberList;
          if (memList.enabledPayPassword==1){
            memList.enabledPayPassword =0
            _self.setData({
              checkedSure:false
            })
          }else{
            memList.enabledPayPassword = 1
            _self.setData({
              checkedSure: true
            })
          }
           _self.setData({
            memberList: memList,
            openPayPasswordSure: false,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
          _self.setData({
            openPayPasswordSure: false,
          })
        }
      }
    }
    common.methods.mothod3(banners)
  },
  delChangeWord(){
    this.setData({
      openPayPasswordSure: false,
    })
    
    // console.log(this.data.checkedSure)
  },
  //跳转地址页面
  getAdress(){
    wx: wx.navigateTo({
      url: '/views/detial/addAdress/addAdress',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  boundMobile(){
    if (this.data.memberList.mobile==''){
      wx: wx.navigateTo({
        url: '/views/bindPhone/bindPhone',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx: wx.navigateTo({
        url: '/views/personal/boundMobile/boundMobile?phone=' + this.data.memberList.mobile,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  changePassword(){
    if (this.data.memberList.mobile == ''){
      wx.showToast({
        title: '请先绑定手机号',
        icon: 'none',
        duration: 2000
      });
    }else{
      wx: wx.navigateTo({
        url: '/views/personal/updatepayPassword/updatepayPassword?phone=' + this.data.memberList.mobile,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
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