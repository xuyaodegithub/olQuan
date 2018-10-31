
//index.js
//获取应用实例
const app = getApp()//全局的 getApp() 函数可以用来获取到小程序实例。
// var conmon=require("../../common.js")

Page({//Page() 函数用来注册一个页面。接受一个 object 参数，其指定页面的初始数据、生命周期函数、事件处理函数等。
  data: {
    motto: 'Hello World',
    userInfo: {},
    topshow:false,
    num:0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    arr: ["首页", "母婴", "美妆", "食品", "家电", "保健", "服饰", "数码", "户外", "鞋靴", "箱包", "珠宝",],
    indicatorDots:true,
    imgUrls: ['https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/17dd5cfdaae90e5884885290b1f1e237740772f7', 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/a3fa9b86b6ebe86bcd696f35a5e394fbfff5da6a', 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/a3fa9b86b6ebe86bcd696f35a5e394fbfff5da6a', 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/66b01e6aa2c20c95ec68e0cf6275df9e8d3709bb',],
    autoplay:true,
    interval:2000,
    duration:500,
    arrbanner: [{ name: "全球购", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/94dc38a42e213d7c4dac9262242bc7d2cd0717b6" }, { name: "进口超市", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/a90467dac1d5d050da8142b39d021bc40121f351" }, { name: "悦选", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/b5f0cd1054831e7ae938b83d5726408cb8f635ad" }, { name: "保险", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/e9b0717d8718ace75b1d390ebe2002ce42fa29fe" }, { name: "粉领会员", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/7dea761752401ff6b06933d39d434262fcd6ef2d" }],
imgURL:'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/e16b2cec9d348df7f9ec05990e0fab9ac2792842',
    sameImg: ['https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1520933553&di=254a6b1e15dddc7c1649362c088e7651&src=http://img3.redocn.com/20130427/Redocn_2013042710570485.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520943639094&di=806749ff1516c0c614469ce7ef9aadf3&imgtype=0&src=http%3A%2F%2Fimg3.redocn.com%2F20130724%2FRedocn_2013072414380462.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520943639093&di=2b65309d7a046b4bf8f1926f0fc6567b&imgtype=0&src=http%3A%2F%2Fimg3.redocn.com%2Ftupian%2F20151028%2Flitifangxingzuhehuawen_5129652.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520943639093&di=2b65309d7a046b4bf8f1926f0fc6567b&imgtype=0&src=http%3A%2F%2Fimg3.redocn.com%2Ftupian%2F20151028%2Flitifangxingzuhehuawen_5129652.jpg'
],
    SonData: {
      topSub: [{ name: "居家日用", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/bb51dad276c4681618064acba5ce3234874c6c38", typeId: 1 }, { name: "厨房烹饪", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/f8149de1ff0c8d03e2bd207d5a636d58d4f5ebcf", typeId: 2 }, { name: "家务清洁", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/b05bccd14f70a7ec94cd6ed5e5d584b3eb6534ea", typeId: 3 }, { name: "收纳整理", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/ca9bb2aa8167add006808090a4085c6c17d79ef4", typeId: 4 }, { name: "个人护理", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/530bf3008fa1993d88585d9caac8952ffa1513eb", typeId: 5 }],
    bottomSub:[]}
  },
  changeClass(e){
 console.log(e)
this.setData({
  num:e.target.dataset.num
})
    if (e.target.dataset.num==1){
      this.setData({
        SonData: {
          topSub: [{ name: "居家日用", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/bb51dad276c4681618064acba5ce3234874c6c38", typeId: 1 }, { name: "厨房烹饪", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/f8149de1ff0c8d03e2bd207d5a636d58d4f5ebcf", typeId: 2 }, { name: "家务清洁", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/b05bccd14f70a7ec94cd6ed5e5d584b3eb6534ea", typeId: 3 }, { name: "收纳整理", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/ca9bb2aa8167add006808090a4085c6c17d79ef4", typeId: 4 }, { name: "个人护理", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/530bf3008fa1993d88585d9caac8952ffa1513eb", typeId: 5}],
          bottomSub: []
        }
      })
    } else if (e.target.dataset.num == 2){
      this.setData({
        SonData: {
          topSub: [{ name: "美容护肤", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/bb51dad276c4681618064acba5ce3234874c6c38", typeId: 6 }, { name: "彩妆/香水", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/f8149de1ff0c8d03e2bd207d5a636d58d4f5ebcf", typeId: 7 }, { name: "个人洗护", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/b05bccd14f70a7ec94cd6ed5e5d584b3eb6534ea", typeId: 8 }, { name: "男士护理", imgurl: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/ca9bb2aa8167add006808090a4085c6c17d79ef4", typeId: 9}],
          bottomSub: []
        }
      })
    }
  },
  onchangeNum(e){
    console.log(e.detail)    
    this.setData({
     // num: e.detail.num
    })  
  },
  ///
  changeType(e){
    console.log(this.data.SonData.topSub[e.currentTarget.dataset.key].typeId)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (opations) {//生命周期函数--监听页面加载//一个页面只会调用一次，可以在 onLoad 中获取打开当前页面所调用的 query 参数。
    console.log(opations)
    wx.request({
      url:'https://ol-h5-preview.olquan.cn/mobile/plus/recommendProduct',
      data: { memberId: 745628 },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:'POST',
      success:function(res){

      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  onReady() {//生命周期函数--监听页面初次渲染完成//一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。

  },
  onShow() {//生命周期函数--监听页面显示
    console.log(this.route)//route 字段可以获取到当前页面的路径。
  },
  onHide() {//生命周期函数--监听页面隐藏//当navigateTo或底部tab切换时调用。
    
  },
  onUnload() {//生命周期函数--监听页面卸载//当redirectTo或navigateBack的时候调用。

  },

  onPullDownRefresh() {//页面下拉//页面相关事件处理函数--监听用户下拉动作
    console.log(1)
   // wx.reLaunch()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function (e) {//页面上拉触底事件的处理函数
    console.log(this.route)
  },
  onShareAppMessage: function (ops) {//用户点击右上角转发//只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮//此事件需要 return 一个 Object，用于自定义转发内容
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '自己的小程序',
      path: "/pages/index/index",//当前页面 path ，必须是以 / 开头的完整路径
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  //滚轮
  onPageScroll: function (e) { // 页面滚动触发事件的处理函数
    // console.log(e.scrollTop)
    // console.log(localtion.href)
    if (e.scrollTop>300){
      this.setData({
        topshow:true
      })
    }else{
      this.setData({
        topshow: false
      })
    }
  },
  onTabItemTap() {//当前是 tab 页时，点击 tab 时触发

  },
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration:500
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  changeNum:function(){
    if(this.data.num>20){
    wx.navigateTo({
      url: '../logs/logs',
    })
    }else{
      conmon.methods.mothod1()
      var app = getApp()
      app.dataNum++
      this.setData({
        num: getApp().dataNum
      })
    }
   
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
