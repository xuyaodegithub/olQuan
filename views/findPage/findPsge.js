// firstIndex/findPage/findPsge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:2,
    buleTe:[]
  },
  //打开蓝牙
  openbuleTe(){
    if (!wx.openBluetoothAdapter) {
      // this.showError("");
      wx.showToast({
        title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    wx.openBluetoothAdapter({//初始化小程序蓝牙模块
      success: function (res) {
        console.log(res)
      },
      fail:function(res){
        wx.showToast({
          title: '请确保蓝牙处于打开状态',
          icon: 'none',
          duration: 2000
        });
      },
      complete:function(res){
        wx.onBluetoothAdapterStateChange(function (res) {//监听蓝牙适配器状态变化事件
          if (res.available) {
            setTimeout(function () {
              wx.showToast({
                  title: '蓝牙已开启',
                  icon: 'none',
                  duration: 2000
                });
            }, 1500);
          }else{
            setTimeout(function () {
              wx.showToast({
                title: '请先打开蓝牙',
                icon: 'error',
                duration: 2000
              });
            }, 1500);
          }
        })
      }
    })
    // wx.closeBluetoothAdapter({//关闭蓝牙模块，使其进入未初始化状态
    //   success:function(res){
    //     console.log(res)
    //   }
    // // })
    // wx.getBluetoothAdapterState({//获取本机蓝牙适配器状态
    //   success: function (res) {
    //     console.log(res)
    //     wx.showToast({
    //       title: res.errMsg,
    //       icon: 'none',
    //       duration: 2000
    //     });
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //     // wx.showToast({
    //     //   title: res.errMsg,
    //     //   icon: 'none',
    //     //   duration: 2000
    //     // });
    //   }
    // })
  },
  // 搜索可以连接的设备
  startSeach(){
    wx.startBluetoothDevicesDiscovery({//搜索蓝牙
      success:function(res){
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
    // wx.stopBluetoothDevicesDiscovery({//停止搜索
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
  },
  //获取已搜索的
  getSeach(){
    let _self=this
    wx.getBluetoothDevices({
      success:function(res){
        console.log(res)
        _self.setData({
          buleTe:res.devices
        })
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  //获取已连接的蓝牙
  getblueOld(){
    wx.getConnectedBluetoothDevices({
      success: function (res) {
        console.log(res)
      }
    })
  },
  //连接某个蓝牙
  choseBlue(e){
    console.log(e)
    wx.createBLEConnection({
      deviceId: e.currentTarget.dataset.id,
      timeout:10000,
      success:function(res){
        console.log(res)
        wx.getBLEDeviceServices({//获取蓝牙设备所有 service（服务）
          deviceId: e.currentTarget.dataset.id,
          success: function (res) {
            console.log(res)
            wx.getBLEDeviceCharacteristics({//获取蓝牙设备某个服务中的所有 characteristic（特征值）
              deviceId: e.currentTarget.dataset.id,
              serviceId: res.services[0].uuid,//每个服务的唯一id
              success:function(res){
                console.log(res)
              }
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '链接超时，请重试！',
          icon: 'error',
          duration: 2000
        });
      },
    })
  
  },
  bindgetuserinfo(detial){
    console.log(detial)
  },
  bindgetphonenumber(val){
    console.log(val)
  },
  getAccess(){
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/token',
    //   method:'GET',
    //   data:{
    //     grant_type:'client_credential',
    //     appid:'wx15bd6a9eff9e1780',
    //     secret:'50aa59c5ebf1e0bd94982f7559fde6c1'
    //   },
    //   success:function(res){
    //     console.log(res)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.onBluetoothAdapterStateChange(function(res){
      console.log(res,'------------------')
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
  
  }
})