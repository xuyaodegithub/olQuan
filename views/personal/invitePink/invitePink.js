// views/personal/invitePink/invitePink.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList:[],
    memberList:[],
    isShowSuper: '',
    inviteId:'',
    bagId:'',
    status:0,
    bagGifImg:'',
    isShow:false,
    isPinkSure:false,
    isPinkSureGet:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getListDetail, this, options)
    if (options.inviteId != undefined) {
      this.setData({
        inviteId: options.inviteId
      })
    }
    if (options.isShare == 1) {
      if (this.data.memberList.isGetStoreCommission == 1 && this.data.memberList.isShowRenewButton == 0) {
        this.setData({
          isPinkSure: true
        })
      } else {
        this.setData({
          isPinkSure: false
        })
      }
    }
  },
  //关闭礼包弹窗
  colseIsShow(){
    this.setData({
      isShow:false
    })
  },
  //打开礼包弹窗
  openIsShow(){
    this.setData({
      isShow: true
    })
  },
  //开通粉领
  buyPink(){
    let data={
      inviteId:this.data.inviteId,
      bagId: this.data.detailList.gifts[this.data.status].bagId,
     
    }
    
    wx.setStorageSync('buyPink', data)
    wx.navigateTo({
      url: '/views/personal/buyPink/buyPink',
    })
  },
  getIndex(){
    console.log(1)
    wx.switchTab({
      url: '/views/firstIndex/firstIndex',
    })
  },
  //选择礼包
  chooseBagDetail(e){
    this.setData({
      status: e.currentTarget.dataset.index,
      bagGifImg: this.data.detailList.gifts[e.currentTarget.dataset.index].bagImage
    })
  },
  //获取邀请粉领信息
  getListDetail(){
    let _self = this
    let member = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId,
      },
      callback: function (res) {
        _self.setData({
          memberList: app.memberData,
        })
        console.log(_self.data.memberList)
        if (_self.data.memberList.isShowRenewButton != 0) {
          _self.setData({
            isPinkSureGet: true
          })
        } else {
          _self.setData({
            isPinkSureGet: false
          })
        }
        if (_self.data.memberList.isGetStoreCommission == 1) {
          wx.setNavigationBarTitle({
            title: '邀请店主'
          })
          _self.setData({
            isShowSuper: true,
          })

        } else {
          wx.setNavigationBarTitle({
            title: '申请店主'
          })
          _self.setData({
            isShowSuper: false,
          })
        }
      }
    }
    common.methods.mothod1(member)
    
    
    let banners = {
      url: '/mobile/store/newGiftbags',
      data: {
        memberId: app.userId,
      },
      callback: function (res) {
        res.data.result.inviteContent = res.data.result.inviteContent.replace(/\<img/g, "<img style='display:block;max-width:100%;'")
        res.data.result.content = res.data.result.content.replace(/\<img/g, "<img style='display:block;max-width:100%;'")
        _self.setData({
          detailList: res.data.result,
          bagGifImg: res.data.result.gifts[0].bagImage,
          bagId: res.data.result.gifts[0].bagId
        })
      }
    }
    common.methods.mothod1(banners)
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
    let _self = this
    // wx.startPullDownRefresh()
    wx.showNavigationBarLoading()
    this.getListDetail()
    wx.hideNavigationBarLoading()
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
  onShareAppMessage: function () {
    
    return {
      title: '您的好友' + this.data.memberList.nickName + '邀请您开通OL圈店主',
      desc: this.data.detailList.shareDesc, 
      imageUrl: this.data.detailList.shareLogo,
      path: '/views/personal/invitePink/invitePink?isShare=1&inviteId=' + this.data.memberList.accountNo,//当前页面 path ，必须是以 / 开头的完整路径
      success: function (res) {
        //成功
        console.log(999)
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  }
})