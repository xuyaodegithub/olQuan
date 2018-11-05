// views/personal/withDraw/withDraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //input正则
  bindKeyInput(e){
    console.log(e.detail.value)
    //清除"数字"和"."以外的字符
    e.detail.value = e.detail.value.replace(/[^\d.]/g, "");

    //验证第一个字符是数字而不是
    e.detail.value = e.detail.value.replace(/^\./g, "");

    //只保留第一个. 清除多余的
    // console.log(this.addObj.totalFee)

    e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
    e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    //只能输入两个小数
    e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
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