//app.js
App({
  dataNum:0,
  baseUrl: 'https://test-mobile.olquan.cn',
  // baseUrl: 'https://ol-site.olquan.cn',
  userId: 894559,
  wx_appid:'wx5ba80d28096963a2',
  wx_secret:'0caf9c1c8982bdbe9f2d87ec262fb047',
  onLaunch: function (options) {//当小程序初始化完成时，会触发 onLaunch（全局只触发一次）//可以在 App 的 onlaunch 和 onshow 中获取场景值，
    console.log(options)
    console.log(options.scene)//获取场景值
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      timeout:10000,
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
       
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // console.log(Base64_Decode(res.encryptedData))
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow(options) {//当小程序启动，或从后台进入前台显示，会触发 onShow
    // let str = options.scene.toString()
    // wx.showToast({
    //   title: str,
    //   icon: 'success',
    //   duration: 2000
    // });
  },
  onHide() {//当小程序从前台进入后台，会触发 onHide
    
  },
  onError() {//当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息

  },
  onPageNotFound() {//当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数，

  },
  globalData: {
    userInfo: null
  }
})