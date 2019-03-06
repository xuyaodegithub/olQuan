// shopcar/shopcar.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopCarMess:[],
    num:0,//总数
    setAll:false,//编辑全部
    choseAll:false,//全选
    allprice:'0.00',//全部价格
    allnum:0,//产品总数
    setAllNocha:true,//编辑全部去掉×
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  // firstIn
  getShopCarMess(){
    let _self=this
    let data={
      url:'/mobile/carItem/getMemberCars',
      data:{
        memberId:app.userId
      },
      callback:function(res){
        let resData = res.data.result
        resData.map(function(val,index){
          val.choseOr=0//商店全选
          val.setAll=0//商店编辑
          val.detailDtos.map(function(item,key){
            item.choseOr=0//单个商品选中
          })
        })
        _self.setData({
          shopCarMess: resData
        })
      }
    }
    common.methods.mothod1(data)
  },
  //编辑全部
  setAll(){
    let item = this.data.shopCarMess     
    if (!this.data.setAll){
      item.map(function (val, index) {
        val.setAll = 1
      })
      this.setData({
        setAllNocha: false,
        shopCarMess: item,
        setAll: !this.data.setAll
      })
    }else{
      item.map(function (val, index) {
        val.setAll = 0
      })
      this.setData({
        setAllNocha: true,
        shopCarMess: item,
        setAll: !this.data.setAll
      })
    }
  },
  //编辑某个商店
  setSelfchose(e){
    //e.currentTarget.dataset.index
    let item = this.data.shopCarMess 
    if (e.currentTarget.dataset.item.setAll==0){
      item[e.currentTarget.dataset.index].setAll = 1    
    }else{
      item[e.currentTarget.dataset.index].setAll =0  
    }
    this.setData({
      shopCarMess:item
    })
  },
  //选中商店
  choseStore(e){
    let item = this.data.shopCarMess 
    item[e.currentTarget.dataset.index].choseOr=1
    item[e.currentTarget.dataset.index].detailDtos.map(function(val,key){
      val.choseOr=1
    })
    let choseAllS2 = this.askAllChose(item)
    if (choseAllS2) {
      this.setData({
        choseAll: true
      })
    } else {
      this.setData({
        choseAll: false
      })
    }
    this.setData({
      shopCarMess: item
    }, this.makeallNum)
  },
  //取消商店
  concalStore(e) {
    let item = this.data.shopCarMess
    item[e.currentTarget.dataset.index].choseOr = 0
    item[e.currentTarget.dataset.index].detailDtos.map(function (val, key) {
      val.choseOr = 0
    })
    this.setData({
      shopCarMess: item,
      choseAll: false
    }, this.makeallNum)
  },
  //选中一个商品
  choseOneProduct(e) {
    let item = this.data.shopCarMess
    console.log(item, e.currentTarget.dataset.index, e.currentTarget.dataset.indexson)
    item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].choseOr=1
    let choseAllS = this.toAsk(item[e.currentTarget.dataset.index].detailDtos)
    if (choseAllS){
      item[e.currentTarget.dataset.index].choseOr=1
    }else{
      item[e.currentTarget.dataset.index].choseOr = 0
    }
    let choseAllS2 = this.askAllChose(item)    
    if (choseAllS2){
      this.setData({
        choseAll: true
      })
    }else{
      this.setData({
        choseAll: false
      })
    }
    this.setData({
      shopCarMess: item
    }, this.makeallNum)
   },
  //取消一个商品
  cancalOneProduct(e){
    let item = this.data.shopCarMess
    item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].choseOr = 0
    // let choseAllS = this.toAsk(item[e.currentTarget.dataset.index].detailDtos)
    // if (choseAllS) {
    //   item[e.currentTarget.dataset.index].choseOr = 1
    // } else {
      item[e.currentTarget.dataset.index].choseOr = 0
    // }
    this.setData({
      shopCarMess: item,
      choseAll:false
    }, this.makeallNum)
  },
//数量接口调用
  addOrdown(data){
    let item={
      url:'/mobile/carItem/updateNum',
      data:{
        carId:data.id,
        num:data.num
      },
      callback:function(res){
        data.callback()
      }
    }
    common.methods.mothod1(item)
  },
  //增加数量
  addNum(e) { 
    let item = this.data.shopCarMess    
    let _self=this
    let data={
      id: item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].carId,
      num:1,
      callback:function(){
        item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].num += 1
        _self.setData({
          shopCarMess: item
        }, _self.makeallNum)
      }
    }
    this.addOrdown(data)
  },
  //减少数量
  downNum(e){
    let item = this.data.shopCarMess
    let _self = this    
    let data={
      id: item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].carId,
      num: item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].num - 1 < 1 ? 0 : -1,
      callback:function(){
        if (item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].num > 1) {
          item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].num -= 1
        } else {
          item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].num = 1
        }
        _self.setData({
          shopCarMess: item
        }, _self.makeallNum)
      }
    }
    this.addOrdown(data)
  },
  // 删除商品
  deleteThis(e){
    let _self=this
    let item = this.data.shopCarMess
    let data={
      url:'/mobile/carItem/delete',
      data:{
        carIds: item[e.currentTarget.dataset.index].detailDtos[e.currentTarget.dataset.indexson].carId.toString()
      },
      callback:function(res){
        wx.showToast({ title: '删除成功', icon: 'none' })
        item[e.currentTarget.dataset.index].detailDtos.splice(e.currentTarget.dataset.indexson, 1)
        if (item[e.currentTarget.dataset.index].detailDtos.length < 1) {
          item.splice(e.currentTarget.dataset.index, 1)
        }
        _self.setData({
          shopCarMess: item
        }, _self.makeallNum)
      }
    }
    wx.showModal({
      title: '提示',
      content: '你确定要删除该商品么?',
      cancelColor:'#333333',
      confirmColor:'#40AFFE',
      success(res) {
        if (res.confirm) {
          common.methods.mothod1(data)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //批量删除
  setAllDelete(){
    let _self = this
    let ids=[]
    let item = this.data.shopCarMess
    item.map(function(items,index){
      items.detailDtos.map(function(val,key){
          if(val.choseOr==1){
            ids.push(val.carId)
          }
      })
    })
    if(ids.length<1){
      wx.showToast({ title: '请选择需要删除的商品', icon: 'none' })
      return
    }
    let data = {
      url: '/mobile/carItem/delete',
      data: {
        carIds: ids.join(',')
      },
      callback: function (res) {
        item.map(function (items, index) {
          items.detailDtos.map(function (val, key) {
            if (val.choseOr == 1) {
              items.detailDtos.splice(key,1)
            }
          })
        })
        _self.setData({
          shopCarMess: item
        }, _self.makeallNum)
      }
    }
    wx.showModal({
      title: '提示',
      content: '你确定要删除这些商品么?',
      cancelColor: '#333333',
      confirmColor: '#40AFFE',
      success(res) {
        if (res.confirm) {
          common.methods.mothod1(data)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //判断全选择，商店也选中
  toAsk(item){
    let trueOrfalse=true
    item.map(function(val,key){
      if (val.choseOr==0){
        trueOrfalse=false
        return
      }
    })
    return trueOrfalse
  },
  //判断全选按钮是否选中
  askAllChose(item){
    let trueOrFalse=true
    item.map(function(val,index){
      if (val.choseOr==0){
        trueOrFalse=false
        return
      }
    })
    return trueOrFalse
  },
  //全选
  choseAllProduct() { 
    let item = this.data.shopCarMess    
    if (!this.data.choseAll){
      item.map(function (items, index) {
        items.choseOr = 1
        items.detailDtos.map(function (val, key) {
          val.choseOr = 1
        })
      })
    }else{
      item.map(function (items, index) {
        items.choseOr = 0
        items.detailDtos.map(function (val, key) {
          val.choseOr = 0
        })
      })
    }
    this.setData({
      shopCarMess: item,
      choseAll: !this.data.choseAll
    }, this.makeallNum)
  },
  //取消全选
  // cancalAllProduct(){
  //   let item = this.data.shopCarMess
    
  //   this.setData({
  //     shopCarMess: item,
  //     choseAll: false
  //   }, this.makeallNum)
  // },
  //计算总件数和总价格
  makeallNum(){
    let item = this.data.shopCarMess
    let num = 0
    let price = 0
    item.map(function(item,index){
      item.detailDtos.map(function(val,key){
        if(val.choseOr==1){
          num += val.num
          price = price + (val.num * val.appPrice)
        }
      })
    })
    this.setData({
      allnum:num,
      allprice: parseFloat(price).toFixed(2)
    })
  },
  //转订单
  toOrder(){
    if (this.data.allnum<1){
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    let ids=[]
    let item = this.data.shopCarMess
    item.map(function (item, index) {
      item.detailDtos.map(function (val, key) {
        if (val.choseOr == 1) {
          ids.push(val.carId)
        }
      })
    })
    wx:wx.navigateTo({
      url: '../carToBuy/carToBuy?ids=' + ids.join(',') + '&num=' + this.data.allnum,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //进详情
  goDetial(e){
    wx.navigateTo({
      url: '/views/detial/detial?id=' + e.currentTarget.dataset.id+'&type=1',
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
    this.getShopCarMess()
    this.setData({
      choseAll:false,
      allnum:0,
      allprice:'0.00'
    })
    wx.removeTabBarBadge({
      index: 1,
      success: function (res) {
      },
      fail: function (err) {
        console.log(err)
      }
    })
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
  // onShareAppMessage: function () {
  
  // }
})