
var common = require("../../utils/common.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    advers:{
      type:Array,
    },
    dataList:{
      type: Array,
    }
    
  },
  attached: function () {
   
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
  
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upTo(e) {
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
    previewImage(e) {//点击图片大图预览
      var current = e.target.dataset.src;
      console.log(e)
      wx.previewImage({
        current: this.data.sameImg[e.target.dataset.num], // 当前显示图片的http链接  
        urls: this.data.sameImg // 需要预览的图片http链接列表  
      })
    },
    showMsg() {
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
