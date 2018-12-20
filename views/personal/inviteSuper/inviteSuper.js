// views/personal/invitePink/invitePink.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [],
    memberList: [],
    isShowSuper: '',
    inviteId: '',
    bagId: '',
    status: 0,
    bagGifImg: '',
    isShow: false,
    isPinkSure: false,
    isPinkSureGet: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getListDetail, this)
    console.log(options.inviteId)
    if (options.inviteId != undefined) {
      this.setData({
        inviteId: options.inviteId
      })
    }
    
  },
  //关闭礼包弹窗
  colseIsShow() {
    this.setData({
      isShow: false
    })
  },
  //打开礼包弹窗
  openIsShow() {
    this.setData({
      isShow: true
    })
  },
  //开通粉领
  buyPink() {
    if (this.data.detailList.gifts[this.data.status].bagCanBuy==0){
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      });
      return
    }
    if (this.data.memberList.isGetStoreCommission == 0){
      wx.showToast({
        title: '您还不是店主，请先升级店主',
        icon: 'none',
        duration: 2000
      });
      return
    }
    let data = {
      inviteId: this.data.inviteId,
      bagId: this.data.detailList.gifts[this.data.status].bagId,

    }

    wx.setStorageSync('buyPink', data)
    wx.navigateTo({
      url: '/views/personal/buyPink/buyPink?isSuper=1',
    })
  },
  //选择礼包
  chooseBagDetail(e) {
    this.setData({
      status: e.currentTarget.dataset.index,
      bagGifImg: this.data.detailList.gifts[e.currentTarget.dataset.index].bagImage
    })
  },
  //获取邀请粉领信息
  getListDetail() {
    this.setData({
      memberList: app.memberData,
    })
    if (this.data.memberList.levelCode == 'supervisor' || this.data.memberList.levelCode == 'starSupervisor' || this.data.memberList.levelCode == 'highSupervisor') {
      wx.setNavigationBarTitle({
        title: '邀请经理'
      })
      this.setData({
        isShowSuper: true,
      })

    } else {
      wx.setNavigationBarTitle({
        title: '申请经理'
      })
      this.setData({
        isShowSuper: false,
      })
    }
    let _self = this
    let banners = {
      url: '/mobile/buySupervisor/getGiftBag',
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
      title: this.data.detailList.shareTitle,
      desc: this.data.detailList.shareDesc,
      imageUrl: this.data.detailList.shareLogo,
      path: '/views/personal/applyManger/applyManager?inviteId=' + this.data.memberList.accountNo + '&inviteMemberId=' + this.data.memberList.id,//当前页面 path ，必须是以 / 开头的完整路径
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