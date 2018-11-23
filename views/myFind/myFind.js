// find/find.js
var common = require('../../utils/common.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    seachDteail: '',
    isShowCancel: false,
    searchCode: '',
    searchCodeStr: '',
    memberList: [],
    isFollowId: 1,
    isHasNewFollow: false,
    isMoreNone: true,
    isVideo: false,
    page: 1,
    findList: [],
    accountList: [],
    videoDetail: '',
    isFixed: false,
    timeTopNum: 0,
    topTrue: false,
    isGetFollow: true,
    findListShow: false,
    isAddGoods: true,//点赞
    appLinkShow: false,
    showShare: false,
    accountId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    common.methods.getLoginMess(this.getAccountList, this);

  },
  inputSearchCode(e) {
    this.setData({
      searchCode: e.detail.value
    })
  },
  //获取发现账号详情
  getAccountList() {
    this.setData({
      memberList: app.memberData,
    })
    let _self = this;
    let find = {
      url: '/mobile/find/accountDetail',
      data: {
        memberId: app.userId,
      },
      callback: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.result.name
        })
        _self.setData({
          accountList: res.data.result,
        })
      }
    }
    common.methods.mothod1(find)
    this.getFindList()
  },
  //点击我关注
  getFollowAccount(){
    this.setData({
      page:1,
      isMoreNone:true,
      isFollowId:1,
      accountId:'',
    })
    this.getFindList()
  },
  //点击我发布
  getMyAccount(){
    this.setData({
      page: 1,
      isMoreNone: true,
      isFollowId: '',
      accountId: this.data.accountList.accountId,
    })
    this.getFindList()
  },
  copy(e) {
    let that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.detail,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  //素材提示
  showAppLink() {
    this.setData({
      appLinkShow: true,
    })
  },
  colseAppLink() {
    this.setData({
      appLinkShow: false,
    })
  },
  getHowShareNew() {
    this.setData({
      showShare: true,
    })
  },
  colseShare() {
    this.setData({
      showShare: false,
    })
  },
  //跳转个人发现页面
  getDetailAccount(e) {
    wx: wx.navigateTo({
      url: '../findPage/findPsge?id=' + e.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点赞
  addGoodsNum(e) {
    console.log(e.currentTarget.dataset)
    if (this.data.isAddGoods) {
      this.setData({
        isAddGoods: false,
      })
      let findId = e.currentTarget.dataset.findid;
      let indexId = e.currentTarget.dataset.index;
      let num = e.currentTarget.dataset.num;
      let _self = this;
      let hasFollow = {
        url: '/mobile/find/doGood',
        data: {
          memberId: app.userId,
          findId: findId
        },
        callback: function (res) {
          _self.setData({
            isAddGoods: true,
          })
          if (num == 0) {
            let str = "findList[" + indexId + "].isDoGood";
            let strMore = "findList[" + indexId + "].goodCount";
            _self.setData({
              [str]: 1,
              [strMore]: _self.data.findList[indexId].goodCount + 1
            })
          } else {
            let str = "findList[" + indexId + "].isDoGood";
            let strMore = "findList[" + indexId + "].goodCount";
            _self.setData({
              [str]: 0,
              [strMore]: _self.data.findList[indexId].goodCount - 1
            })
          }

        }
      }
      common.methods.mothod1(hasFollow)
    }
  },
  //发现列表
  getFindList(isMore) {
    let _self = this;
    let find = {
      url: '/mobile/find/finds',
      data: {
        memberId: app.userId,
        accountId: _self.data.accountId,
        isFollow: _self.data.isFollowId,
        page: _self.data.page,
        rows: 10,
      },
      callback: function (res) {
        if (res.data.result.length == 0) {
          _self.setData({
            findListShow: true
          })
        }else{
          _self.setData({
            findListShow: false
          })
        }
        if (res.data.result.length < 10) {
          _self.setData({
            isMoreNone: false
          })
        }
        if (isMore === 2) {

          _self.setData({
            findList: _self.data.findList.concat(res.data.result)
          })
        } else {
          _self.setData({
            findList: res.data.result
          })
        }
        for (let i = 0; i < _self.data.findList.length; i++) {
          let str = "findList[" + i + "].isShow";
          _self.setData({
            [str]: false,
          })
        }
      }
    }
    common.methods.mothod1(find)
  },
  //查看全文
  lookAllMessage(e) {
    let str = "findList[" + e.currentTarget.dataset.index + "].isShow";
    this.setData({
      [str]: true,
    })
  },
  //收起全文
  colseAllMessage(e) {
    let str = "findList[" + e.currentTarget.dataset.index + "].isShow";
    this.setData({
      [str]: false,
    })
  },
  previewImage(e) {//点击图片大图预览
    // console.log(e.target.dataset)
    var current = e.target.dataset;
    let urlsList = [];
    for (let i = 0; i < e.currentTarget.dataset.item.length; i++) {
      urlsList.push(e.currentTarget.dataset.item[i].linkUrl)
    }
    wx.previewImage({
      current: urlsList[e.currentTarget.dataset.index], // 当前显示图片的http链接  
      urls: urlsList // 需要预览的图片http链接列表  
    })
  },
  //视频播放
  getVideo(e) {
    console.log(e.currentTarget.dataset.item)
    this.videoContext = wx.createVideoContext('myVideo')
    this.setData({
      videoDetail: e.currentTarget.dataset.item,
    })
    this.setData({
      isVideo: true,
    })
    this.videoContext.play()
  },
  colseVideo() {
    this.setData({
      isVideo: false,
    })
    this.videoContext.pause()
  },
  //跳转详情
  getDetailUrl(e) {
    // console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.type == 12) {

    } else if (e.currentTarget.dataset.type == 13) {

    } else {
      wx: wx.navigateTo({
        url: '../detial/detial?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type + '&recId=' + e.currentTarget.dataset.recid,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },

  //滚轮
  onPageScroll: function (e) { // 页面滚动触发事件的处理函数
    // console.log(e.scrollTop)
    if (e.scrollTop > 200) {
      this.setData({
        topTrue: true
      })
    } else {
      this.setData({
        topTrue: false
      })
    }
  },
  toScrollTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
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
    wx.showNavigationBarLoading()
    this.setData({
      page: 1,
      isMoreNone: true,
    })
    this.getFindList();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isMoreNone) {
      this.setData({
        page: this.data.page + 1
      })
      this.getFindList(2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '您的好友' + this.data.memberList.nickName + '在OL圈发布了一篇达人日记，快去看看吧！',
      desc: '发现好物 分享赚钱',
      imageUrl: 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/aaa.png',
      path: "/pages/findPage/findPsge?id=" + this.data.accountId,//当前页面 path ，必须是以 / 开头的完整路径
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})