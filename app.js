//app.js
// created by Yan on 2018/11/1
App({
  memberData:{
    levelCode:'store'
  },
  dataNum:0,
  scene:'',//场景值
  uutype:1,//终端类型
  // baseUrl: 'https://test-mobile.olquan.cn',
  baseUrl: 'https://ol-site.olquan.cn',
  userId: '',//openId
  openId:'',
  isGetStoreCommission:'',//店主权益
  unionid: '',//unionid
  wx_code:'',
  wx_appid:'wx5ba80d28096963a2',
  wx_secret:'0caf9c1c8982bdbe9f2d87ec262fb047',
  getLogin() {
    let _self = this
    return new Promise(function (resolve, reject) {
      // 登录
      wx.login({
        timeout: 10000,
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // console.log(res)
          if (res.code) {
            _self.wx_code = res.code
            // 获取用户信息
            wx.getSetting({
              success: res => {
                // console.log(res)
                // if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // console.log(res)
                      // 可以将 res 发送给后台解码出 unionId
                      wx.request({
                        url: _self.baseUrl + '/mobile/member/getOpenid',
                        data: {
                          appid: _self.wx_appid,
                          secret: _self.wx_secret,
                          code: _self.wx_code,
                          nickName: res.userInfo.nickName,//用户呢城
                          headimgurl: res.userInfo.avatarUrl,//用户头像
                          sex: res.userInfo.gender//用户性别
                        },
                        dataType: 'json',
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: function (res2) {
                          // console.log(res)
                          wx.setStorageSync("sessionid", res2.header["Set-Cookie"])
                          if (res2.data.code === 0) {
                            _self.userId = res2.data.result.id
                            _self.openId = res2.data.result.openid
                            _self.isGetStoreCommission = res2.data.result.isGetStoreCommission
                            _self.unionid = res2.data.result.unionid
                            _self.memberData = res2.data.result
                            resolve(res2)
                          } else {
                            // console.log('获取用户信息失败')
                            wx.showToast({
                              title: '获取用户信息失败',
                              icon: 'none',
                              duration: 2000
                            })
                            reject(res2)
                          }
                        },
                        fail: function (err) {
                          console.log(err)
                        }
                      })
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      // if (this.userInfoReadyCallback) {
                      //   this.userInfoReadyCallback(res)
                      // }
                    },fail: function (err) {
                      wx.showModal({
                        title:  '警告',
                        content:  '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                        success:  function  (res)  {
                          if  (res.confirm)  {
                            // console.log('用户点击确定')
                            wx.navigateTo({
                              url: '/views/getLogin/getLogin',
                            })
                          }
                        }
                      })
                    }
                  })
                // }
              },
              fail:function(err){
                console.log(err)
              }
            })
          } else {
            console.log('登录失败，请重新登录')
            wx.showToast({
              title: '登录失败，请重新登录',
              icon: 'error',
              duration: 2000
            });
            reject(err)
          }
        }
      })

    })
  },
  onLaunch: function (options) {
    // this.scene = options.scene
    // console.log('场景值'+options.scene)
    //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）//可以在 App 的 onlaunch 和 onshow 中获取场景值，
    // console.log(options)
    // console.log(options.scene)//获取场景值
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)


  },
  onShow(options) {//当小程序启动，或从后台进入前台显示，会触发 onShow
    // this.getLogin()
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
