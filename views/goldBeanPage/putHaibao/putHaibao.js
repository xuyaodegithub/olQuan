// views/goldBeanPage/putHaibao/putHaibao.js
var common = require("../../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrl:'',
    isSaveAlow:false,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        id: options.id
      })
    }
    this.putHaibao()
  },
  //推广海报
  putHaibao() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _self=this
    let data = {
      url: '/mobile/member/getShareCodeUrl',
      data: {
        memberId: this.data.id ? this.data.id : app.userId
      },
      callback: function (res) {
        _self.setData({
          imgUrl:res.data.result
        },function(){
          wx.hideLoading()    
        })
      }
    }
    common.methods.mothod1(data)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  saveImg() {
    // this.closeEwm=null
    let _self = this
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              _self.afterCanSaveImg()
            },
            fail() {
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              // wx.showToast({
              //   title: '授权失败无法保存',
              //   icon: 'none'
              // })
              _self.setData({
                isSaveAlow: true
              })
            }
          })
        } else {
          // 有则直接保存
          _self.afterCanSaveImg()
        }
      }
    })
  },
  //保存图片
  afterCanSaveImg() {
    let _self = this
    wx.showModal({
      title: '提示',
      content: '确认保存图片么？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
              //  console.log(res);
          wx.getImageInfo({////////////////////////
            src: _self.data.imgUrl,
            success(res1) {
                wx.saveImageToPhotosAlbum({
                  filePath: res1.path,
                  success() {
                    wx.showToast({
                      title: '保存成功'
                    })
                  },
                  fail() {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
            }
          })
        }
      }
    })
  },
  calconShou() {
    this.setData({
      isSaveAlow: false
    })
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
  onShareAppMessage: function () {
    return {
      title: 'OL圈，带你搜罗全球好货',
      desc: '快来看看吧',
      imageUrl: this.data.imgUrl,
      path: "/views/goldBeanPage/putHaibao/putHaibao?id="+app.userId,//当前页面 path ，必须是以 / 开头的完整路径
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