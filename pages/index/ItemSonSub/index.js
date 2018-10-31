
// pages/index/ItemSonSub/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataText:{
      type:String,
      value:"000"
    }
  },
  attached: function () { 
    console.log(123)
  },// 组件生命周期函数，在组件实例进入页面节点树时执行
  moved: function () { },//组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  ready: function () { },//组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
  detached: function () {
    console.log("undown")
   },//组件生命周期函数，在组件实例被从页面节点树移除时执行
  /**
   * 组件的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    ids: 10,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    arr: ["首页", "母婴", "美妆", "食品", "家电", "保健", "服饰", "数码", "户外", "鞋靴", "箱包", "珠宝",],
    indicatorDots: true,
    imgUrls: ['https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/17dd5cfdaae90e5884885290b1f1e237740772f7', 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/a3fa9b86b6ebe86bcd696f35a5e394fbfff5da6a', 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/a3fa9b86b6ebe86bcd696f35a5e394fbfff5da6a', 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/66b01e6aa2c20c95ec68e0cf6275df9e8d3709bb',],
    autoplay: true,
    interval: 2000,
    duration: 500,
    arrbanner: [{ name: "全球购", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/94dc38a42e213d7c4dac9262242bc7d2cd0717b6" }, { name: "进口超市", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/a90467dac1d5d050da8142b39d021bc40121f351" }, { name: "悦选", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/b5f0cd1054831e7ae938b83d5726408cb8f635ad" }, { name: "保险", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/e9b0717d8718ace75b1d390ebe2002ce42fa29fe" }, { name: "粉领会员", iconImg: "http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/7dea761752401ff6b06933d39d434262fcd6ef2d" }],
    imgURL: 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/imgs/e16b2cec9d348df7f9ec05990e0fab9ac2792842',
    sameImg: ['https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1520933553&di=254a6b1e15dddc7c1649362c088e7651&src=http://img3.redocn.com/20130427/Redocn_2013042710570485.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520943639094&di=806749ff1516c0c614469ce7ef9aadf3&imgtype=0&src=http%3A%2F%2Fimg3.redocn.com%2F20130724%2FRedocn_2013072414380462.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520943639093&di=2b65309d7a046b4bf8f1926f0fc6567b&imgtype=0&src=http%3A%2F%2Fimg3.redocn.com%2Ftupian%2F20151028%2Flitifangxingzuhehuawen_5129652.jpg', 'http://ol-quan2017.oss-cn-shanghai.aliyuncs.com/94dc38a42e213d7c4dac9262242bc7d2cd0717b6'
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upTo(e){
      wx.navigateTo({
        url: '../../detial/detial?id=' + this.data.ids//跳转详情页，用options接受参数
      })
      //路由切换的几种方式
      //打开新页面 : 调用 API wx.navigateTo 或使用组件 <navigator open-type="navigateTo"/>
      //页面重定向 : 调用 API wx.redirectTo 或使用组件 <navigator open-type="redirectTo"/>
      //页面返回 : 调用 API wx.navigateBack 或使用组件<navigator open-type="navigateBack">或用户按左上角返回按钮
      //Tab 切换 : 调用 API wx.switchTab 或使用组件 <navigator open-type="switchTab"/> 或用户切换 Tab
      //重启动 : 调用 API wx.reLaunch 或使用组件 <navigator open-type="reLaunch"/>
      //navigateTo, redirectTo 只能打开非 tabBar 页面。switchTab 只能打开 tabBar 页面。reLaunch 可以打开任意页面。页面底部的 tabBar 由页面决定，即只要是定义为 tabBar 的页面，底部都有 tabBar。调用页面路由带的参数可以在目标页面的onLoad中获取。
      console.log(e.currentTarget.dataset.key)
      var myEventDetail = { num: e.currentTarget.dataset.key }
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    previewImage(e){//点击图片大图预览
      var current = e.target.dataset.src;
      console.log(e)
      wx.previewImage({
        current: this.data.sameImg[e.target.dataset.num], // 当前显示图片的http链接  
        urls: this.data.sameImg // 需要预览的图片http链接列表  
      })
    },
    showMsg(){
      // wx.setNavigationBarTitle({//动态设置标题
      //   title:'hehehehe'
      // })
      wx.showToast({
        title: '购买成功',
        icon: 'success',
        duration: 2000
      });
    }
  }
})
