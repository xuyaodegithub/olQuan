// views/personal/wllletList/walletList.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtm:['可用积分','待定积分'],
    typeNum:'',
    amountList:[],
    page:1,
    numDetail:'',
    status:0,
    scoreSure:false,
    memberList:'',
    first:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    if (options.type==2){
      _self.setData({
        status: 0,
      })
    }
    if (options.type == 4) {
      _self.setData({
        status: 1,
      })
    }
    
    if (options.type==1){
      _self.setData({
        mername: '账户余额',
        typeNum: options.type,
        // numDetail: options.number,
      })
    } else if (options.type == 5){
      _self.setData({
        mername: '待定余额',
        typeNum: options.type,
        // numDetail: options.number,
      })
    } else if (options.type == 3) {
      _self.setData({
        mername: '小金库',
        typeNum: options.type,
        // numDetail: options.number,
      })
    } else if (options.type == 6) {
      _self.setData({
        mername: '金豆',
        typeNum: options.type,
        // numDetail: options.number,
      })
    } else if (options.type == 7) {
      _self.setData({
        mername: '金豆',
        typeNum: options.type,
        // numDetail: options.number,
      })
    } else if (options.type == 4 || options.type == 2) {
      _self.setData({
        mername: '积分',
        typeNum: options.type,
        scoreSure: true,
      })
      common.methods.getLoginMess(_self.getScoresDetail,this)
      
    }
    wx.setNavigationBarTitle({
      title: _self.data.mername
    })
    common.methods.getLoginMess(this.getAmountDetail)
    // this.getMember()
  },
  //获取钱包明细
  getAmountDetail(isMore){
    let _self = this
    let banners = {
      url: '/mobile/member/amountDetail',
      data: {
        memberId: app.userId,
        type: _self.data.typeNum,
        page: _self.data.page,
        rows:10,
      },
      callback: function (res) {
        if (res.data.code == 0) {
          if (res.data.result.length < 10) {
            _self.setData({
              isMoreNone: true
            })
          }
          if(isMore===2){
            _self.setData({
              amountList: _self.data.amountList.concat(res.data.result)
            })
          }else{
            _self.setData({
              amountList: res.data.result,
            })
          }
          
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        
      }
    }
    common.methods.mothod1(banners)
  },
  //进入加载
  getMember() {
    let _self = this;
    let banners = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          memberList: res.data.result,
        }, _self.getDetialnumM)
      }
    }
    common.methods.mothod1(banners)
  },
  //获取值
  getDetialnumM(){
    let detailaNum=''
    if (this.data.typeNum==1){
      detailaNum=this.data.memberList.amount
    } else if (this.data.typeNum == 5) detailaNum = this.data.memberList.waitAmount
    else if (this.data.typeNum == 3) detailaNum = this.data.memberList.coffers
    else if (this.data.typeNum == 6) detailaNum = this.data.memberList.goldBean
    else if (this.data.typeNum == 7) detailaNum = this.data.memberList.waitGoldBean
    this.setData({
      numDetail: detailaNum
    })
  },
  //金豆兑换
  goexchange(){
    wx.navigateTo({
      url: './gbexchange/gbexchange',
    })
  },
  //获取积分明细
  getScoresDetail(){
    
    let _self = this
    let banners = {
      url: '/mobile/member/totalAmount',
      data: {
        memberId: app.userId,
        type: 4,
        
      },
      callback: function (res) {
        if (res.data.code == 0) {
          _self.setData({
            shouruList: res.data.result,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }

      }
    }
    common.methods.mothod1(banners)
  },
  //跳转金豆多笔转正
  getDetailList(e){
    // console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.daytype==2){
      wx.navigateTo({
        url: '/views/personal/wllletList/beanDetail/beanDetail?id=' + e.currentTarget.dataset.id + '&day=' + e.currentTarget.dataset.day + '&dayamount=' + e.currentTarget.dataset.dayamount + '&pushday=' + e.currentTarget.dataset.pushday,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //积分切换
  changeType(e){
    if (e.currentTarget.dataset.key==0){
      this.setData({
        typeNum: 2,
      })
    } else if (e.currentTarget.dataset.key == 1){
      this.setData({
        typeNum: 4,
      })
    }
    this.setData({
      status: e.currentTarget.dataset.key,
      isMoreNone: false,
      page: 1,
    })
    this.getAmountDetail();
  },
  //转账页面
  goTrans(){
    wx.navigateTo({
      url: './Transfer/Transfer',
    })
  },
  //我的二维码
  toMyErm(){
    wx.navigateTo({
      url: './myerm/myerm',
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
    this.getMember()
    common.methods.getLoginMess(this.getAmountDetail)
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
    if (!this.data.isMoreNone) {
      this.setData({
        page: this.data.page + 1
      })
      this.getAmountDetail(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})