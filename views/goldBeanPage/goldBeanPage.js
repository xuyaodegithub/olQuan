// views/detial/goldBeanPage/goldBeanPage.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isGoldBean:0,
    dataMess:[
      { title: '首次关注公众号', goldBean: 10, btn: '去关注', allow: 0, which: 1, frequency:0},
      { title: '首次兑换SNRC', goldBean: 100, btn: '去兑换', allow: 0, which: 2, frequency: 0},
      { title: '新人首次下单', goldBean: 20, btn: '去完成', allow: 0, which: 3, frequency: 0},
      { title: '开通店主', goldBean: 50, btn: '去开通', allow: 0, which: 4, frequency: 0},
      { title: '每日发布发现', goldBean: 2, btn: '去发布', allow: 0, which: 5, frequency: 2},
      { title: '每日分享(产品链接或二维码)', goldBean: 2, btn: '去分享', allow: 0, which: 6, frequency: 5},
      { title: '每日推荐新人', goldBean: 10, btn: '去完成', allow: 0, which: 7, frequency: 5},      
      { title: '每日下单(除试用)', goldBean: 10, btn: '去完成', allow: 0, which: 8, frequency: 0},
      { title: '邀请好友试用', goldBean: '见详情页', btn: '去完成', allow: 0, which: 9, frequency: 0},
    ],
    // taskMess:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isGoldBean: app.memberData.goldBean
    })
    this.plusTask()
  },
//会员任务
  plusTask(){
    let _self=this
    let data={
      url:'/mobile/task/list',
      data:{
        memberId: app.userId
      },
      callback:function(res){
        let taskMess = _self.data.dataMess
        let dataResult=res.data.result
        taskMess.map(function(item,index){
          if (item.which == 1) {
            item.allow = dataResult.firstFollowPublicAccount
            item.goldBean = dataResult.firstFollowPublicAccountGoldBean
            }
          else if (item.which == 2) {
            item.allow = dataResult.firstExchangeSNRC 
            item.goldBean = dataResult.firstExchangeSNRCGoldBean 
             } 
          else if (item.which == 3) { 
            item.allow = dataResult.firstOrder 
            item.goldBean = dataResult.firstOrderGoldBean 
            } 
          else if (item.which == 4) {
            item.allow = dataResult.openStore 
            item.goldBean = dataResult.openStoreGoldBean 
             } 
          else if (item.which == 5) { 
            item.allow = dataResult.publicFindCount 
            item.goldBean = dataResult.publicFindGoldBean 
            } 
          else if (item.which == 6) { 
            item.allow = dataResult.shareCount 
            item.goldBean = dataResult.shareGoldBean 
            } 
          else if (item.which == 7) { 
            item.allow = dataResult.newMemberCount 
            item.goldBean = dataResult.newMemberGoldBean 
            } 
          else if (item.which == 8) { 
            item.allow = dataResult.orderCount 
            item.goldBean = dataResult.orderGoldBean 
            } 
          // else if (item.which == 9) { 
          //   item.allow = dataResult.firstExchangeSNRC 
          //   item.goldBean = dataResult.firstExchangeSNRC 
          //   } 
        })
        _self.setData({
          dataMess: taskMess
        })
      }
    }
    common.methods.mothod1(data)
  },
  //查看明细
  watchDetial(){
    wx.navigateTo({url: '/views/personal/wllletList/walletList?type=6&number=' + app.memberData.goldBean,})
  },
  //toGetDold去完成
  toGetDold(e){
    let index = e.currentTarget.dataset.item.which
    if (index == 1) this.showWatch('请前往公众号号搜索OL圈进行关注')
    else if (index == 2) wx.navigateTo({ url: '/views/personal/changeSnrc/changeSnrc' })
    else if (index == 3) wx.switchTab({ url: '/views/firstIndex/firstIndex' })
    else if (index == 4) this.showWatch('请联系OL圈店主,获取邀请链接或联系客服:400-900-0008')
    else if (index == 5) this.showWatch('请前往OL圈app端发布发现')
    else if (index == 6) wx.switchTab({ url: '/views/firstIndex/firstIndex' })
    else if (index == 7) wx.navigateTo({ url: './putHaibao/putHaibao' })
    else if (index == 8) wx.switchTab({ url: '/views/firstIndex/firstIndex' })
    else if (index == 9) wx.navigateTo({ url: '/views/tryPage/tryPage' })
    
  },
  //提示语句
  showWatch(content){
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#e50f72',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
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