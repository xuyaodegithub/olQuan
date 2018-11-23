// views/personal/myCollect/myCollect.js
var common = require("../../../utils/common.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtm:['产品','店铺'],
    status:0,
    collectList:[],
    page:1,
    isMore:true,
    isOneGoods: true,
    objIds:[],
    chooseAll:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getDetailList(isMoreSure){
    let _self = this
    let banners = {
      url: '/mobile/collect/collects',
      data: {
        memberId: app.userId,
        type: this.data.status + 1
      },
      callback: function (res) {
        if (res.data.result.length < 10) {
          _self.setData({
            isMore: false,
          })
        }
        
        if (isMoreSure === 2) {
          _self.setData({
            collectList: _self.data.collectList.concat(res.data.result),
          })
        } else {

          _self.setData({
            collectList: res.data.result,
          })
        }
        for(let i=0;i<_self.data.collectList.length;i++){
          let str = "collectList[" + i + "].isCollect";
          let strSon = "collectList[" + i + "].isCollectSon";
          _self.setData({
            [str]:false,
            [strSon]:false,
          })
        }
      }
    }
    common.methods.mothod1(banners)
  },
  changeType(e) {
    if(!this.data.isOneGoods){
      wx.showToast({
        title: '请先完成当前的操作',
        icon: 'none',
        duration: 2000
      });
    }else{
      this.setData({
        status: e.currentTarget.dataset.key,
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 400
      })
      this.getDetailList()
    }
  },
  //点击编辑
  deitGoods(){
    this.setData({
      isOneGoods:false,
    })
    for (let i = 0; i < this.data.collectList.length; i++) {
      let strSon = "collectList[" + i + "].isCollectSon";
      this.setData({
        [strSon]: true,
        chooseAll:false,
      })
    }
  },
  wanchengGoods(){
    this.setData({
      isOneGoods: true,
      objIds:[],
    })
    for (let i = 0; i < this.data.collectList.length; i++) {
      let str = "collectList[" + i + "].isCollect";
      let strSon = "collectList[" + i + "].isCollectSon";
      this.setData({
        [str]:false,
        [strSon]: false,
        chooseAll: false,
      })
    }
  },
  //选择产品
  addGoods(e){
    let str = "collectList[" + e.currentTarget.dataset.index + "].isCollect";
    let strSon = "collectList[" + e.currentTarget.dataset.index + "].isCollectSon";
    this.setData({
      [str]: true,
      [strSon]: false,
    })
    this.data.objIds.push(e.currentTarget.dataset.addid);
    // console.log(this.data.objIds)
    if (this.data.objIds.length==this.data.collectList.length){
      this.setData({
        chooseAll:true,
      })
    }else{
      this.setData({
        chooseAll: false,
      })
    }
  },
  removeGoods(e){
    let str = "collectList[" + e.currentTarget.dataset.index + "].isCollect";
    let strSon = "collectList[" + e.currentTarget.dataset.index + "].isCollectSon";
    this.setData({
      [str]: false,
      [strSon]: true,
    })
    for(let i=0;i<this.data.objIds.length;i++){
      if (this.data.objIds[i] === e.currentTarget.dataset.addid){
        this.data.objIds.splice(i,1);
      }
    }
    // console.log(this.data.objIds)
    if (this.data.objIds.length == this.data.collectList.length) {
      this.setData({
        chooseAll: true,
      })
    } else {
      this.setData({
        chooseAll: false,
      })
    }
  },
  //点击全选
  chooseAllThings(){
    this.setData({
      chooseAll:!this.data.chooseAll,
    })
    if(this.data.chooseAll){
      for (let i = 0; i < this.data.collectList.length; i++) {
        let str = "collectList[" + i + "].isCollect";
        let strSon = "collectList[" + i + "].isCollectSon";
        this.setData({
          [str]: true,
          [strSon]: false,
        })
        if(this.data.status==0){
          this.data.objIds.push(this.data.collectList[i].productId)
        }else{
          this.data.objIds.push(this.data.collectList[i].sellerId)
        }
      }
      this.setData({
        objIds: Array.from(new Set(this.data.objIds)) 
      })
      // console.log(this.data.objIds)
    }else{
      for (let i = 0; i < this.data.collectList.length; i++) {
        let str = "collectList[" + i + "].isCollect";
        let strSon = "collectList[" + i + "].isCollectSon";
        this.setData({
          [str]: false,
          [strSon]: true,
          objIds:[],
        })
      }
      // console.log(this.data.objIds)
    }
  },
  removeAllThings(){
    console.log(this.data.objIds)
    if(this.data.objIds.length<=0){
      wx.showToast({
        title: '请选择需要删除的选项',
        icon: 'none',
        duration: 2000
      });
    }else{
      let _self = this;
      let collect= this.data.collectList;
      let dataDetail = {
        url: '/mobile/collect/delete',
        data: {
          memberId: app.userId,
          objIds: this.data.objIds,
          type: this.data.status + 1
        },
        callback: function (res){
          for(let i=0;i<_self.data.objIds.length;i++){
            for(let j=0;j<collect.length;j++){
              if(_self.data.status==0){
                if (_self.data.objIds[i] == collect[j].productId){
                  collect.splice(j, 1);
                }
              }else{
                if (_self.data.objIds[i] == collect[j].sellerId) {
                  collect.splice(j, 1);
                }
              }
              
            }
          }
          _self.setData({
            objIds:[],
            collectList: collect
          })
          
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000
          })
        }
      }
      common.methods.mothod1(dataDetail)
    }
    
  },
  //跳转店铺
  goSellerShop(e) {   
   
    wx: wx.navigateTo({
      url: '../sellerShop/sellerShop?id=' + e.currentTarget.dataset.sellerid + '&logo=' + e.currentTarget.dataset.logo + '&sellername=' + e.currentTarget.dataset.sellername + '&iCollect=1',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //跳转产品详情
  getGoodsDetail(e){
    console.log(e.currentTarget.dataset.productid)
    wx: wx.navigateTo({
      url: '../../detial/detial?id=' + e.currentTarget.dataset.productid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    common.methods.getLoginMess(this.getDetailList, this)
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
    wx.stopPullDownRefresh()
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