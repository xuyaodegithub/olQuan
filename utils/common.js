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
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    },
    success: function (res) {
      if (res.data.code == 0) {
        data.callback(res)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        });
      }
    },
    fail:function(res){
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 2000
      });
    }
  })
}
function mothod3(data) {
  wx.request({
    url: app.baseUrl + data.url,
    data: data.data,
    dataType: 'json',
    method: 'POST',
    header: {
      'cookie': wx.getStorageSync("sessionid"),//读取cookie
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      data.callback(res)
    },
    fail: function (res) {
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 2000
      });
    }
  })
}
function mothod4(data) {
  wx.request({
    url: app.snrcUrl + data.url,
    data: data.data,
    dataType: 'json',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      data.callback(res)
    },
    fail: function (res) {
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 2000
      });
    }
  })
}
function getGraphCode(data) {
  wx.request({
    url: app.baseUrl + '/mobile/code/wxGraphCode',
    data: {},
    responseType: 'arraybuffer',
    method: 'GET',
    header: {
      'cookie': wx.getStorageSync("sessionid"),//读取cookie
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      if (res.statusCode == 200) {
        data.callback(res)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        });
      }
    },
    fail: function (res) {
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 2000
      });
    }
  })
}
function getLoginMess(callback,_self,options){
    if (app.userId) {
      callback()
    } else {
      console.log(_self.route+'-----------------------------------')
      let callBackUrl={
        url: _self.route,
        id: options ? options.id : "",
        type: options ? options.type : "",
        // recId: options ? options.recId : ''
        // inviteId: options.inviteId ? options.inviteId : '',
        // inviteMemberId: options.inviteMemberId ? options.inviteMemberId : '',
        // isShare: options.isShare ? options.isShare : '',
      }
      if (options){
        callBackUrl.recId = options.recId ? options.recId : ''
        callBackUrl.isMore = options.isMore ? options.isMore : ''
        callBackUrl.inviteId = options.inviteId ? options.inviteId : ''
        callBackUrl.inviteMemberId = options.inviteMemberId ? options.inviteMemberId : ''
        callBackUrl.isShare = options.isShare ? options.isShare : ''
        callBackUrl.ordeNo = options.ordeNo ? options.ordeNo : ''
      }
      wx.setStorageSync('callBackUrl', callBackUrl)
      app.getLogin().then(function (res) {
        callback()
      }).catch(function (err) {
        console.log(err)
      })
    }
  }

function setTabBarBadge(data){
  wx.setTabBarBadge({
    index:data.index,
    text:data.num,
    success:function(res){

    },
    fail:function(err){
      console.log(err)
    }
  })
}
function uploadImg(data){//上传图片接口
  let that = this;
  wx.uploadFile({
    url: 图片上传接口, //线上接口
    filePath: data.url,
    name: 'img',
    success: function (res) {
     if(res.data.code===0){
       data.callback(res)
     }else{
       wx.showToast({
         title: '图片上传失败',
         icon: 'none'
       });
     }
    },
  })
}
function goMoreType(val){
  let item = val
  if (item.linkType == 9) {
    if (!item.url.split('id=')[1]){return}
    wx.navigateTo({
      url: '/views/activePage/activePage?id=' + item.url.split('id=')[1],
    })
  } else if (item.linkType == 10) {
    wx.navigateTo({
      url: '/views/plusPage/plusPage',
    })
  } else if (item.linkType == 13) {
    wx.navigateTo({
      url: '/views/tryPage/tryPage',
    })
  } else if (item.linkType == 19) {
    wx.navigateTo({
      url: '/views/findPage/findPage',
    })
  } else if (item.linkType == 18 || item.linkType == 15 || item.linkType == 16 || item.linkType == 17) {
    let url=item.url.split('id/')
    let url2=url[1].split('?')
    let id=url2[0]
    let typeP = item.url.split('type=')[1]
    wx.navigateTo({
      url: '/views/detial/detial?id=' + id + '&type=' + typeP,
    })
  } else {
    return
  }
}
module.exports.methods = {
  "mothod1": mothod1,
  "getLoginMess": getLoginMess,
  "setTabBarBadge": setTabBarBadge,
  "getGraphCode": getGraphCode,
  "uploadImg": uploadImg,
  "mothod3": mothod3,
  "mothod4": mothod4,
  "goMoreType": goMoreType
} 
