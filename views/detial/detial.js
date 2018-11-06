// detial/detial.js
var common=require('../../utils/common.js')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId:'',
    productType:'',
    uutype:1,
    productData:{},
    levelCode:'',//等级
    timer:'',//倒计时
    overtimer:'',
    isShow:false,
    propverImg:'',//购买弹框图片
    isStore:'请选择规格',//购买弹框库存
    isbuyMinCount:'',//最低起售数量
    itemKey: '',//选择那个大分类规格
    item_sonOne: '',//选择规格active
    item_sonTwo: '',//选择规格active
    item_sonThree:'',//选择规格active
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productId: options.id,
      productType: options.type,
      levelCode: app.memberData.levelCode
    })
    console.log(options, options.id, options.type,'---------------------')    
    this.getProductDetial()
  },
//firstin
    getProductDetial(){
      let _self=this
      let data={
            url:'/mobile/product/productDetail',
            data:{
              productId: this.data.productId,
              memberId: app.userId,
              uutype: app.uutype,
              type: this.data.productType,
              viewType: this.data.viewType ? 1 : ''
            },
            callback:res => {
              let resData = res.data.result
              // console.log(typeof res.data.result.detail)
              if (res.data.result.detail) {
                res.data.result.detail = res.data.result.detail.replace(/\<img/g, "<img style='display:block;width:100%;'")
               }
              if ((_self.data.productType === '4' && resData.freeUseSubType === 3) || (_self.data.productType === '9' && resData.status !== 5)) { 
                if (res.data.result.time) {
                  let time = res.data.result.time
                  _self.setData({
                    timer: _self.overTime(time),
                    overtimer: setInterval(function () {
                      time -= 1000
                      _self.setData({
                        timer: _self.overTime(time)
                      })
                    }, 1000)
                  })
                }
              }
              _self.setData({
                productData: res.data.result,
                propverImg: res.data.result.image,
                isbuyMinCount: res.data.result.buyMinCount > 1 ? res.data.result.buyMinCount : 1
              })
            }
      }
      common.methods.mothod1(data)      
    },
    //图片预览
  previewImage(e) {//点击图片大图预览
    // var current = e.target.dataset.src;
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.item[e.currentTarget.dataset.index], // 当前显示图片的http链接  
      urls: e.currentTarget.dataset.item // 需要预览的图片http链接列表  
    })
  },
  //倒计时方法
  overTime(val) {
    if(val<0){
      return {
        hours: 0,
        mint: 0,
        sec: 0
      }
    }
    let hours = Math.floor(val / 1000 / 60 / 60)
    let mint = Math.floor(val / 1000 / 60 % 60)
    let sec = Math.floor(val / 1000 % 60)
    if (hours < 10) hours = '0' + hours
    if (mint < 10) mint = '0' + mint
    if (sec < 10) sec = '0' + sec
    return {
      hours: hours,
      mint: mint,
      sec: sec
    }
  },
  //改变规格
  changenormal(e){
    // if (e.currentTarget.dataset.index === this.data.itemKey){
    //   if (e.currentTarget.dataset.indexson === this.data.item_sonOne || e.currentTarget.dataset.indexson === this.data.item_sonTwo || e.currentTarget.dataset.indexson === this.data.item_sonThree ){
    //     return
    //   }
    // }
    this.setData({
      itemKey: e.currentTarget.dataset.index,
      item_sonOne: e.currentTarget.dataset.index === 0 ? e.currentTarget.dataset.indexson : this.data.item_sonOne,
      item_sonTwo: e.currentTarget.dataset.index === 1 ? e.currentTarget.dataset.indexson : this.data.item_sonTwo,
      item_sonThree: e.currentTarget.dataset.index === 2 ? e.currentTarget.dataset.indexson : this.data.item_sonThree
    })
  },
  //打开购买弹框
  closeBuy(){
    this.setData({
      isShow:false
    })
  },
  openBuy() {
    this.setData({
      isShow: true
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
    if (this.data.overtimer){
      clearInterval(this.data.overtimer)
    }
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