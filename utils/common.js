//公共方法js//模块化
//可以将一些公共的代码抽离成为一个单独的 js 文件，作为一个模块。模块只有通过 module.exports 或者 exports 才能对外暴露接口。
//在需要使用这些模块的文件中，使用 require(path) 将公共代码引入:var a=require(path) require 暂时不支持绝对路径
// header: {
//   'content-type': 'application/x-www-form-urlencoded' // 默认值
// },
const app = getApp()
function mothod1(data) {
  wx.request({
    url: app.baseUrl+data.url,
    data: data.data,
    dataType: 'json',
    method: 'POST',
    header: {
  'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      if (res.data.code == 0) {
        data.callback(res)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'fail',
          duration: 2000
        });
      }
    },
    fail:function(res){
      wx.showToast({
        title: '请求错误',
        icon: 'fail',
        duration: 2000
      });
    }
  })
}
function httpRequest(url, data = {}, method = 'POST') {
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
      fail: function (err) {
        wx.hideLoading({})
        reject(err);
      },
      success: function (res) {
        wx.hideLoading({})
        if (!res.data.success) {
          if (res.err_msg && res.err_msg.indexOf('request:ok') > -1) {
            res.err_msg = '网络请求超时';
          }
          if (res.errMsg && res.errMsg.indexOf('request:ok') > -1) {
            res.errMsg = '网络请求超时';
          }
          resolve(res)
        }
        resolve(res);
      },
      complete: function (result) {
        wx.hideLoading({});
        console.log('-----request complete!-------');
      }
    })
  });
}
// 获取配置文件
function getExtConfig() {
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
function mothod4() {
  console.log(4)
}

module.exports.methods = {
  "mothod1": mothod1,
  "mothod2": httpRequest,
  "mothod4": mothod4
}