'use strict';

/**
 * API module
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
var wechat = require('./utils/wechat');

App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  data: {
    name: 'member-wxapp',
    version: '0.0.1',
    userInfo: null,
    isIphonex: false
  },

  // 不是只能定义`data`，别的也可以
  other: 'other variables',

  /**
   * 获取用户信息
   * @return {Promise} 包含获取用户信息的`Promise`
   */
  getUserInfo() {
    var _this = this;
    return new Promise(function (resolve, reject) {
      _this.httpRequest('/h5/member/search-member-info', {}).then((res) => {
        if (res.data.success) {
          _this.data.userInfo = res.data.data;
        }
        resolve(res.data);
      }, (err) => {
        reject(err);
      })
    });
  },

  /**
   * 封装request请求
   */
  httpRequest(url ,data = {}, method = 'POST') {
    wx.showLoading({
      title: '加载中...'
    })
    var _extConf = this.getExtConfig();
    var _url = '';
    if (_extConf) {
      _url = _extConf.host + url;
    }
    var _baseinfo = wx.getStorageSync('baseinfo');
    var _openid = _baseinfo ? _baseinfo.openid : '';
    return new Promise(function (resolve, reject) {
      wx.request({
        url: _url,
        data,
        header: {
          'openid': _openid, // openid作为token
          'mbr-applet': '1'
        },
        method,
        fail: function(err) {
          wx.hideLoading({})
          reject(err);
        },
        success: function(res) {
          wx.hideLoading({})
          if (!res.data.success){
            if(res.err_msg && res.err_msg.indexOf('request:ok') > -1){
                res.err_msg = '网络请求超时';
            }
            if(res.errMsg && res.errMsg.indexOf('request:ok') > -1){
                res.errMsg = '网络请求超时';
            }
            resolve(res)
          }
          resolve(res);
        },
        complete: function(result) {
          wx.hideLoading({});
          console.log('-----request complete!-------');
        }
      })
    });
  },

  /**
   * 获取当前城市
   */
  getCurrentCity() {
    return new Promise(function (resolve, reject) {
      wx.getLocation({
        type: 'wgs84',   // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
        altitude: true,  // 返回高度信息
        success: function (res) {
          var longitude = res.longitude
          var latitude = res.latitude
          resolve({ longitude: longitude, latitude: latitude})
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },

  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function onLaunch() {
    console.log(' ========== Application is onLaunch ========== ');
    wx.clearStorageSync();
  },

  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function onShow() {
    console.log(' ========== Application is showed ========== ');
    var _self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.setStorageSync('jscode', res.code);
          // 根据jscode获取openid
          _self.toJscode2session(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function onHide() {
    console.log(' ========== Application is hid ========== ');
  },

  /**
   * 根据jscode获取openid
   */
  toJscode2session(jscode) {
    var _self = this;
    var _merchantId = 0;
    var _extconf = _self.getExtConfig();
    if (_extconf) {
      _merchantId = _extconf.merchantId;
    }
    
    var _baseinfo = {
      jscode: jscode,
      openid: '',
      ismember: false,
      haveFace: false,
      session_key: '',
      expires_in: 0,
      isneedWxUserInfo: true
    }
    
    // 请求接口
    _self.httpRequest('/h5/getOpenId', {
      jscode: jscode,
      merchantId: _merchantId
    }).then((res) => {
      if (res && res.data && res.data.success) {
        _baseinfo.openid = res.data.data.openid;
        _baseinfo.ismember = res.data.data.ismember;
        _baseinfo.haveFace = res.data.data.haveFace;
        _baseinfo.session_key = res.data.data.session_key;
        _baseinfo.expires_in = res.data.data.expires_in;
        _baseinfo.isneedWxUserInfo = res.data.data.isneedWxUserInfo;
        // 将jscode、openid存储到本地缓存中
        wx.setStorageSync('baseinfo', _baseinfo);
        if (_baseinfo.ismember) { // 如果是会员
          if (!_baseinfo.haveFace) { // 是否获取人脸信息
            wx.redirectTo({
              url: '/pages/ai_face/index?flag=add_face'
            })
          } else { // 如果是会员并且已经采集人脸则自动进入会员中心
            if (!wx.getStorageSync('entryMember')) {
              wx.setStorageSync('entryMember', '1');
              wx.redirectTo({
                url: '/pages/memberCenter/index'
              })
            } else {
              wx.redirectTo({
                url: '/pages/memberCenter/index'
              })
            }
          }
        } else {
          wx.removeStorageSync('entryMember');
          wx.redirectTo({ // 非会员进入会员领卡页面
            url: '/pages/home/index'
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '初始化失败'
        })
      }
    }, (err) => {
      wx.showToast({
        icon: 'none',
        title: '初始化失败'
      })
    });
  },
  // 获取配置文件
  getExtConfig() {
    var _extConf = wx.getExtConfigSync();
    if (_extConf.host != undefined && _extConf.h5Host != undefined && _extConf.merchantId != undefined && _extConf.wssHost != undefined) {
      return _extConf;
    } else {
      var _conf = {
        // 创匠正式
        // host: "https://member.h5.chuangjiangx.com",
        // h5Host: "https://member.h5.chuangjiangx.com/app/index.html",
        // wssHost: "https://customer.h5.chuangjiangx.com/10815",
        // merchantId: "161"
        // 创匠测试
        wssHost: "wss://yufabu.member.h5.chuangjiangx.com",
        host: "https://yufabu.member.h5.chuangjiangx.com",
        h5Host: "https://member.h5.chuangjiangx.com/app/index.html",
        merchantId: "1308"
      }
      return _conf;
    }
  }
});