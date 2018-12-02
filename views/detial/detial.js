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
    isShow:true,
    isCoupon:false,
    propverImg:'',//购买弹框图片
    isStore:'',//购买弹框库存
    isbuyMinCount:'',//购买售数量
    itemKey: '',//选择那个大分类规格
    item_sonOne: '',//选择规格active
    item_sonTwo: '',//选择规格active
    item_sonThree:'',//选择规格active
    normalMess:'',//规格信息
    couponList:[],//优惠券列表
    page:1,
    rows:10,
    canvasImg:'',//canvas图片
    ewmImg:'',
    recId:'',//发现关联id
    isSaveAlow:false,//授权弹框
    isCollect:0,//是否收藏
    addOrBuy:1//1add2buy
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productId: options.id,
      productType: options.type ? options.type : '',
      levelCode: app.memberData.levelCode,
      recId: options.recId ? options.recId : ''
    })
    console.log(options, options.id, options.type,'---------------------')    
    common.methods.getLoginMess(this.getProductDetial, this, options)
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
              type: this.data.productType
            },
            callback:res => {
              let resData = res.data.result
              // console.log(typeof res.data.result.detail)
              if (res.data.result.detail) {
                res.data.result.detail = res.data.result.detail.replace(/\<img/g, "<img style='display:block;width:100%;'")
               }
              _self.setData({
                isCollect: res.data.result.isCollect,
                productData: res.data.result,
                propverImg: res.data.result.image,
                isbuyMinCount: res.data.result.buyMinCount > 1 ? res.data.result.buyMinCount : 1,
                productType: (res.data.result.type).toString()
              })
              if ((_self.data.productType === '4') || (_self.data.productType === '9' && resData.status !== 5)) { 
                if (res.data.result.time) {
                  let time = res.data.result.time
                  _self.setData({
                    timer: _self.overTime(time, resData.freeUseSubType),
                    overtimer: setInterval(function () {
                      time -= 1000
                      _self.setData({
                        timer: _self.overTime(time, resData.freeUseSubType)
                      })
                    }, 1000)
                  })
                }
              }
              // _self.setData({
              //   productData: res.data.result,
              //   propverImg: res.data.result.image,
              //   isbuyMinCount: res.data.result.buyMinCount > 1 ? res.data.result.buyMinCount : 1,
              //   productType: (res.data.result.type).toString()
              // })
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
  //产看全部评价
  goCommonent(){
    wx.navigateTo({
      url: './allComment/allComment?id=' + this.data.productId,
    })
  },
  //倒计时方法
  overTime(val,num) {
    if(val<0){
      return {
        hours: 0,
        mint: 0,
        sec: 0
      }
    }
    let day = Math.floor(val / 1000 / 60 / 60/24)
    let hoursD = Math.floor(val / 1000 / 60 / 60 % 24)
    let hours = Math.floor(val / 1000 / 60 / 60)
    let mint = Math.floor(val / 1000 / 60 % 60)
    let sec = Math.floor(val / 1000 % 60)
    if (day < 10) day = '0' + day
    if (hoursD < 10) hoursD = '0' + hoursD
    if (hours < 10) hours = '0' + hours
    if (mint < 10) mint = '0' + mint
    if (sec < 10) sec = '0' + sec
    if ((this.data.productType == 4 && num == 1) || (this.data.productType == 4 && num == 5)){
      return {
        day:day,
        hoursD: hoursD,
        mint: mint,
        sec: sec
      }
    }else{
      return {
        hours: hours,
        mint: mint,
        sec: sec
      }
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
    if (this.data.productData.normals.length === 1) {
      if (this.data.item_sonOne !== '') {
        let id = this.data.productData.normals[0].normses[0].valueId
        this.getNormal([id].join(','))
        }
    } else if (this.data.productData.normals.length === 2) {
      if (this.data.item_sonOne !== '' && this.data.item_sonTwo !== '') {
        let id = this.data.productData.normals[0].normses[this.data.item_sonOne].valueId
        let id2 = this.data.productData.normals[1].normses[this.data.item_sonTwo].valueId
        this.getNormal([id,id2].join(','))
      }
    } else if (this.data.productData.normals.length === 3){
      if (this.data.item_sonOne !== '' && this.data.item_sonTwo !== '' && this.data.item_sonThree !== '') {
        let id = this.data.productData.normals[0].normses[this.data.item_sonOne].valueId
        let id2 = this.data.productData.normals[1].normses[this.data.item_sonTwo].valueId
        let id3 = this.data.productData.normals[2].normses[this.data.item_sonThree].valueId
        this.getNormal([id, id2, id3].join(','))
      }
    }
  },
  //打开购买弹框
  closeBuy(){
    this.setData({
      isShow:true
    })
  },
  openBuy() {
    // if (this.data.productType === '1' || this.data.productType === '9'){
    //   this.setData({
    //     // normalPrice: this.data.productData.,
    //   })
    // }
    this.setData({
      isShow: false,
      isStore: this.data.normalMess ? this.data.normalMess.store : this.data.productData.store,
      addOrBuy:2//购买
    })
  },
  //加入购物车按钮
  addStore(){
    this.setData({
      isShow: false,
      isStore: this.data.normalMess ? this.data.normalMess.store : this.data.productData.store,
      addOrBuy:1//加入购物车
    })
  },
  //弹框确认按钮
  toSureBuy(){
    if (!app.memberData.mobile && this.data.productType==4){
      wx.showModal({
        title: '提示',
        content: '完成试用下单,请先绑定手机号码,是否前往绑定',
        cancelText:'否',
        confirmText:'去绑定',
        // confirmColor:'#e50f72',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/views/bindPhone/bindPhone',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if (this.data.productData.status == 5) {
      wx.showToast({ title: '商品已下架', icon: 'none' })
      return
    }
    if (this.data.productData.normals.length>0){
      if (this.data.normalMess){
        if (this.data.isStore){
          if (this.data.addOrBuy==2){
            this.saveProductMess()
          }else{
            this.addShopStore()
          }
        }else{
          wx.showToast({ title: '库存不足请选择其他规格', icon: 'none' })
        }
      }else{
        wx.showToast({ title:'请选择规格',icon:'none'})
      }
    }else{
      if (this.data.isStore) {
        if (this.data.addOrBuy == 2) {
          this.saveProductMess()
        } else {
          this.addShopStore()
        }
      } else {
        wx.showToast({ title: '库存不足', icon: 'none' })
      }
    }
  },
  //加入购物车
  addShopStore(){
    let _self=this
    let data={
      url:'/mobile/carItem/addProduct',
      data:{
        productId: this.data.productId,
        memberId:app.userId,
        normalId: this.data.normalMess ? this.data.normalMess.id : '',
        num: this.data.isbuyMinCount
      },
      callback:function(res){
        wx.showToast({ title: '添加成功', icon: 'none' })
        _self.setData({
          isShow:true
        })
      }
    }
    common.methods.mothod1(data)
  },
  //跳转确认订单页储存信息
  saveProductMess(){
     let productMess={
       productId: this.data.productId,
       num: this.data.isbuyMinCount,
       normalId: this.data.normalMess ? this.data.normalMess.id : '',
       type: this.data.productType,
       recId: this.data.recId
     }
    wx.setStorageSync('productMess', productMess)
    wx.navigateTo({
      url: '/views/detial/toSureBuy/toSureBuy',
    })
  },
  //改变数量
  changeNum(e){
    if (e.currentTarget.dataset.key==="1"){
      if (this.data.productData.buyMinCount<1){
        if (this.data.isbuyMinCount>1){
          this.setData({
            isbuyMinCount: this.data.isbuyMinCount - 1
          })
        }else{
          this.setData({
            isbuyMinCount: 1
          })
        }
      }else{
        if (this.data.isbuyMinCount - 1 < this.data.productData.buyMinCount) {
          this.setData({
            isbuyMinCount: this.data.productData.buyMinCount
          })
        } else {
          this.setData({
            isbuyMinCount: this.data.isbuyMinCount - 1
          })
        }
      }
    }
    if (e.currentTarget.dataset.key === "2"){
      if (this.data.productType==="4"){
        this.setData({
          isbuyMinCount:1
        })
        wx.showToast({
          title:'该商品最多购买一件',
          icon:'none',
          duration: 2000
        })
      }else{
        if (!this.data.productData.limitCount || this.data.isbuyMinCount + 1 < this.data.productData.limitCount) {
            this.setData({
              isbuyMinCount: this.data.isbuyMinCount+1
            })
        }else{
            wx.showToast({
              title: '该商品最多购买' + this.data.productData.limitCount+'件',
              icon: 'none',
              duration: 2000
            })
        }
      }
    }
  },
  //获取规格信息接口
  getNormal(str){
    let _self=this
    let data={
      url:'/mobile/product/getNormal',
      data:{
        productId: this.data.productId,
        valueIds: str,
        memberId: app.userId,
        type: this.data.productType,
        uutype: app.uutype
      },
      callback:function(res){
          _self.setData({
            normalMess:res.data.result,
            isStore: res.data.result.store
          })
      }
    }
    common.methods.mothod1(data)
  },
  //打开优惠券领券
  openCoupon(){
    let _self=this
      this.setData({
        isCoupon:true
      })
      let data={
        url:'/mobile/coupon/conponsByProduct',
        data:{
          page:this.data.page,
          rows:this.data.rows,
          memberId:app.userId,
          productId: this.data.productId
        },
        callback:function(res){
          _self.setData({
            couponList:res.data.result
          })
        }
      }
    common.methods.mothod1(data)  
  },
  //关闭弹框
  closeCoupon(){
    this.setData({
      isCoupon: false
    })
  },
  //领券优惠券
  getcoupom(e){
    let _self=this
    let data={
      url:'/mobile/coupon/receiveCoupon',
      data:{
        memberId:app.userId,
        couponId: e.currentTarget.dataset.id
      },
      callback:function(res){
        wx.showToast({title:'领取成功!',icon:'none'})
        let couponData = _self.data.couponList
        if (couponData[e.currentTarget.dataset.index].isCanUse===1){
          couponData[e.currentTarget.dataset.index].receivedStatus=3
        }else{
          couponData[e.currentTarget.dataset.index].receivedStatus = 2
        }
        couponData[e.currentTarget.dataset.index].vaildNum--        
        _self.setData({
          couponList: couponData
        })
      }
    }
    common.methods.mothod1(data)  
  },
  //请求二维码接口
  drawImage(){
    let _self = this    
    _self.setData({
      canvasImg: true
    })
    let obj={
      url:'/mobile/product/getLocalCodePath',
      data:{
        productId: this.data.productId,
        memberId:app.userId,
        type: this.data.productType
      },
      callback:function(res){
        _self.getErweima(res.data.result)
      }
    }
    if (this.data.ewmImg!=='have'){
      wx.showLoading({
        title: '图片生成中...',
      })
      common.methods.mothod1(obj)  
    }
  },
  //canvas画图
  getErweima(erweima){
    var resd = wx.getSystemInfoSync();
    var radio = resd.screenWidth / 750;//屏幕宽度比例
    let _self=this
    const ctx = wx.createCanvasContext('mycanvas');
    // ctx.drawImage(app.memberData.logo, 15, 20, 50, 50);    //绘制背景图
    //ctx.setTextAlign('center')    // 文字居中
    var R = 25;
    var d = 2 * R;
    var cx = 15 + R;
    var cy = 15 + R;
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, 650, 1000)
    ctx.draw()
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.save();    
    ctx.clip();
    wx.getImageInfo({////////////////////////
      src: app.memberData.logo,
      success(res) {
        // console.log(res)
        ctx.drawImage(res.path, 15, 15, d, d);
        ctx.restore();
        ctx.setFillStyle('#777777')  // 文字颜色：黑色
        ctx.setFontSize(12)         // 文字字号：22px
        ctx.fillText(app.memberData.nickName, 72, 33) //开始绘制文本的 x/y 坐标位置（相对于画布） 
        // ctx.stroke();//stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色
        // ctx.fillText('ENJOY', 770, 35)
        // ctx.rotate(90 * Math.PI / 180)
        ctx.setFillStyle('#333333')
        ctx.fillText('发现好物，与您分享!', 72, 57)
        ctx.save();
        ctx.translate(radio * 600, 20);//设置画布上的(0,0)位置，也就是旋转的中心点
        ctx.rotate(90 * Math.PI / 180);
        ctx.setFillStyle('#777777');
        ctx.setFontSize(12);
        ctx.fillText('E N J O Y', 0, 0)
        ctx.restore();
        wx.getImageInfo({//////////////////////////////
          src: _self.data.productData.image,
          success(res) {
            ctx.drawImage(res.path, 0, 80, radio * 650, radio*650);
            //商品名称
            var str = _self.data.productData.productName;
            //绘制简单的文字
            ctx.setFillStyle("#333"); // black color
            // ctx.setFontSize (12);
            ctx.lineWidth = 1;
            var lineWidth = 0;
            var canvasWidth = 220;//计算canvas的宽度
            var initHeight = (radio * 650)+100;//绘制字体距离canvas顶部初始的高度
            var lastSubStrIndex = 0; //每次开始截取的字符串的索引
            for (let i = 0; i < str.length; i++) {
              lineWidth += ctx.measureText(str[i]).width;
              if (lineWidth > canvasWidth) {
                ctx.fillText(str.substring(lastSubStrIndex, i), 16, initHeight, 250);//绘制截取部分
                initHeight += 12;//20为字体的高度
                lineWidth = 0;
                lastSubStrIndex = i;
              }
              if (i == str.length - 1) {//绘制剩余部分
                ctx.fillText(str.substring(lastSubStrIndex, i + 1), 16, initHeight, 250);
              }
            }
            //价格
            ctx.setFillStyle('#ed0276')  // 文字颜色：黑色
            ctx.setFontSize(14)         // 文字字号：22px
            ctx.fillText('￥' + _self.data.productData.salePrice, 16, (radio * 650) + 140)
            ctx.setFillStyle('#777777')  // 文字颜色：黑色
            ctx.setFontSize(12)         // 文字字号：22px
            ctx.fillText('长按保存分享给好友哟！', 16, (radio * 650) + 160)
            wx.getImageInfo({////////////////////////
              src: erweima,
              success(res) {
                ctx.drawImage(res.path, radio * 650 * 0.75, (radio * 650) + 90,80,80);                
                ctx.draw(true,function(){
                  _self.setData({
                    ewmImg:'have'
                  })
                })
                wx.hideLoading()    
              }
              })
          }
        });
      }
    });
  },
  saveImg(){
    // this.closeEwm=null
    let _self=this
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
                  canvasImg: false,
                  isSaveAlow:true
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
   afterCanSaveImg(){
     let _self=this
     wx.showModal({
       title: '提示',
       content: '确认保存图片么？',
       success: function (res) {
         if (res.confirm) {
           // console.log('用户点击确定')
           wx.canvasToTempFilePath({ //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
             x: 0,
             y: 0,
             width: 650,
             height: 1000,
             destWidth: 800,  //输出的图片的宽度
             destHeight: 1225,
             canvasId: 'mycanvas',
             success: function (res) {
              //  console.log(res);
               if (res.errMsg === "canvasToTempFilePath:ok") {
                 wx.saveImageToPhotosAlbum({
                   filePath: res.tempFilePath,
                   success() {
                     wx.showToast({
                       title: '保存成功'
                     })
                     _self.setData({
                       canvasImg:false
                     })
                   },
                   fail() {
                     wx.showToast({
                       title: '保存失败',
                       icon: 'none'
                     })
                   }
                 })
               } else {
                 console.log(res)
               }
             },
           })
         }
       }
     })
   },
  //关闭二维码
  closeEwm(){
    this.setData({
      canvasImg: false
    })
    wx.hideLoading()    
  },
  preventD(){
    return
  },
  //进店逛逛
  goStore(){
    wx.navigateTo({
      url: '../personal/sellerShop/sellerShop?id=' + this.data.productData.sellerId
       + '&logo=' + this.data.productData.sellerLogo + '&sellername=' + this.data.productData.sellerName 
    })
  },
  calconShou(){
    this.setData({
      isSaveAlow:false
    })
  },
  //收藏产品
  collect(){
    let _self=this
    let data={
      url:'/mobile/collect/doCollect',
      data:{
        objId: this.data.productId,
        memberId:app.userId,
        type:1
      },
      callback:function(res){
        if (_self.data.isCollect==0){
          wx.showToast({ title: '收藏成功', icon: 'none' }) 
          _self.setData({
            isCollect:1
          })  
        }else{
          wx.showToast({ title: '取消收藏成功', icon: 'none' })
          _self.setData({
            isCollect: 0
          })  
        }
      }
    }
    common.methods.mothod1(data)      
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
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮、、menu
      console.log(ops.target)
    }
    return {
      title: this.data.productData.productName,
      path: '/views/detial/detial?id=' + this.data.productId + '&type=' + this.data.productType,//当前页面 path ，必须是以 / 开头的完整路径
      imageUrl: this.data.productData.image,//转发图标
      desc: this.data.productData.summary,
      success: function (res) {
        //成功
        console.log(999)
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  }
})