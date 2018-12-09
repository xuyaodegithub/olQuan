// views/personal/applyManger/applyManager.js
var common = require("../../../utils/common.js")
var utilMd5 = require('../../../utils/md5.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityDetail: '请选择收货地区',
    region: [],
    regionID: [],
    AllAdressList:[],
    isAppleSure: true,
    isClickSure:true,
    inviteMemberId:'',//邀请人ID
    inviteId:'',//邀请人邀请码
    graphicCode:false,
    isDisabled:true,
    cangetCode: false,
    currentTime:60,
    mobile:'',
    codeSure:'',//验证码
    realName:'',//真实姓名
    address:'',//详细地址
    zhezhaoSure:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      inviteMemberId: options.inviteMemberId,
      inviteId: options.inviteId
    })
    common.methods.getLoginMess(this.getFirst, this);
    
  },
  getFirst(){
    this.setData({
      memberList: app.memberData
    })
    let _self=this;
    let banners = {
      url: '/mobile/memberInvite/canSubmitApply',
      data: {
        memberId: app.userId ,
        inviteMemberId:_self.data.inviteMemberId
      },
      callback: function (res) {
        if(res.data.code==0){
          _self.getMember();
        }else if(res.data.code==1){
          _self.setData({
            zhezhaoSure:false,
            isAppleSure:false,
          })
        }else{
          wx.redirectTo({
            url: '/views/personal/inviteSuper/inviteSuper?inviteId=' + _self.data.inviteId
          })
        }
      }
    }
    common.methods.mothod3(banners)
  },
  getMember(){
    
    let _self = this;
    let banners = {
      url:'/mobile/member/getMember',
      data: {
        memberId: _self.data.inviteMemberId,
      },
      callback: function (res) {
        if (res.data.result.inviteSupervisorCount==0){
          wx.redirectTo({
            url: '/views/personal/inviteSuper/inviteSuper?inviteId=' + _self.data.inviteId
          })
        }else{
          _self.getAllcity();
          _self.setData({
            zhezhaoSure: false,
            memList: res.data.result,
          })
          
        }
      }
    }
    common.methods.mothod1(banners)
  },
  //获取全部城市
  getAllcity() {
    let _self = this;
    let banners = {
      url: '/mobile/city/getAllCity',
      data: {},
      callback: function (res) {
        _self.setData({
          AllAdressList: res.data.result
        })
      }
    }
    common.methods.mothod1(banners)
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
    })
    let _self = this;
    let allId = []
    const choseAdres = this.data.region
    const allAdres = this.data.AllAdressList
    if (choseAdres[0] === '北京市' || choseAdres[0] === '天津市' || choseAdres[0] === '上海市' || choseAdres[0] === '重庆市') {
      choseAdres[0] = choseAdres[0].substring(0, 2)
    }
    // console.log(choseAdres)
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
    console.log(this.data.regionID)
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
  getWxGraphCode() {
    // this.setData({
    //   isDisabled: false
    // })
    // this.getCode();
    if (this.data.mobile.length!=11){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
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
      mobile: _self.data.mobile,
      graphCode: _self.data.graphCode
    }
    console.log(dataList)
    wx.request({
      url: app.baseUrl + '/mobile/code/sendCode2',
      data: {
        memberId: app.userId,
        mobile: _self.data.mobile,
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
  getCode() {
    var that = this;
    var interval
    var currentTime = that.data.currentTime;
    that.setData({
      time: '重新发送(' + currentTime +'s)'
    })
    interval = setInterval(function () {
      that.setData({
        time: '重新发送(' + (currentTime - 1) + 's)'
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
  //获取手机号
  getMobile(e){
    this.setData({
      mobile: e.detail.value
    })
  },
  //获取验证码结果
  getSureCode(e){
    this.setData({
      codeSure: e.detail.value
    })
  },
  //真实姓名
  getRealName(e) {
    this.setData({
      realName: e.detail.value
    })
  },
  //详细地址
  getAddress(e){
    this.setData({
      address: e.detail.value
    })
  },
  //提交申请
  applyManager(){
    if(this.data.mobile=='' || this.data.mobile.length!=11){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return
    }
    if(this.data.codeSure==''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      });
      return
    }
    if (this.data.realName == '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none',
        duration: 2000
      });
      return
    } 
    if (this.data.regionID.length==0 || this.data.address==''){
      wx.showToast({
        title: '请确认省市区县详情地址是否输入',
        icon: 'none',
        duration: 2000
      });
      return
    }
    let data={
      memberId:app.userId,
      inviteMemberId:this.data.inviteMemberId,
      mobile:this.data.mobile,
      code:this.data.codeSure,
      realName:this.data.realName,
      nickName: this.data.memberList.nickName,
      provinceId:this.data.regionID[0],
      cityId: this.data.regionID[1],
      districtId: this.data.regionID[2],
      address:this.data.address,
    }
    this.setData({
      isClickSure:false
    })
    console.log(data)
    let _self = this;
    let banners = {
      url: '/mobile/memberInvite/submitApply',
      data: data,
      callback: function (res) {
        _self.setData({
          isClickSure: true
        })
        if(res.data.code==0){
          _self.setData({
            isAppleSure: false
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