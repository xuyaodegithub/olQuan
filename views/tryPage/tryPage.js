// trypage/trypage.js
var common = require("../../utils/common.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType:4,
    banners:[],
    advers:[],
    classNum:0,
    page:1,
    rows:10,
    classBtn: [
      { title: '限时试用', imgChose: '../../image/dianNew.png', imgNoChose: '../../image/dianNot.png'},    
      { title: '|', imgChose: '', imgNoChose: '' },
      // { title: '付邮试用', imgChose: '../../image/youPay.png', imgNoChose: '../../image/youNoPay.png'},
      // { title: '|', imgChose: '', imgNoChose: '' },
      { title: '整点抢试', imgChose: '../../image/chooseClock.png', imgNoChose:'../../image/noChooseClock.png'}
      ],
    isGetStoreCommission:'',
    productType:1,
    dataList:[],
    time:'',
    timeList:[],
    timeActive:'',
    topTrue:false,
    fixedNav:false,
    fixedNavTop:'',
    timeTop: false,
    timeTopNum:'',
    isStartOrClose:true,
    GetscrollTop:0,
    isShow:true,
    normalMess: '',
    allNormalMess:'',
    propverImg:'',
    isStore:'',
    isbuyMinCount:1,
    chonseMess:'',
    itemKey: '',//选择那个大分类规格
    item_sonOne: '',//选择规格active
    item_sonTwo: '',//选择规格active
    item_sonThree: '',//选择规格active
    personalMess:'',
    canvasImg:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getAdvers,this)
    this.setTop('#classBtnTop',1)
  },
  setTop(str,num){
      let _self = this  
      let query = wx.createSelectorQuery()
      query.select(str).boundingClientRect((rect) => {
        console.log(rect.top)
        if(num===1){
          _self.setData({
            fixedNavTop: rect.top
          })
        }else{
          _self.setData({
            timeTopNum: rect.top
          })
        }
      }).exec()
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //首次进入
  getAdvers(){
    let _self = this
    // console.log(app.isGetStoreCommission)
    this.setData({
      isGetStoreCommission: app.isGetStoreCommission
    })
    let banners = {
      url: '/mobile/plus/advers',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        _self.setData({
          banners: res.data.result.banners,
          advers: res.data.result.advers
        })
      }
    }
    common.methods.mothod1(banners)
    this.getDataList('/mobile/freeUse/getFreeUseProducts',1)
    this.getmemberMess()
  },
  //获取产品
  getDataList(url,num){
    let _self=this
    let List = {
      url: url,
      data: {
        page: _self.data.page,
        rows: _self.data.rows
      },
      callback: function (res) {
        let resArr=res.data.result
        if (_self.data.productType==1){
          resArr.map(function(val,index){
            let oneP = val.listEndDate.split('?')
            let day = oneP[0].substring(1)
            let danwei = oneP[1]
            resArr[index].alone={
              day: day, danwei: danwei
            }
          })
        }
        if(num===1){
          _self.setData({
            dataList: resArr
          })
        }else{
          _self.setData({
            dataList: _self.data.dataList.concat(resArr)
          })
        }
        console.log(_self.data.dataList)
      }
    }
    if (_self.data.productType){
      List.data.type = _self.data.productType
    }
    if (_self.data.time){
      List.data.time = _self.data.time
    }
    common.methods.mothod1(List)
  },
  //分类切换
  changeClass(e){
    // console.log(e.currentTarget.dataset.index)
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
    let _self=this
    if (e.currentTarget.dataset.index === 1 || e.currentTarget.dataset.index===this.data.classNum){
      return
    }
    let url = '/mobile/freeUse/getFreeUseProducts'
    this.setData({
      classNum: e.currentTarget.dataset.index,
      time: '',
      page:1,
      rows:10
    })
    if (e.currentTarget.dataset.index===0){
      this.setData({
        productType: 1
      })}
    // } else if (e.currentTarget.dataset.index === 2){
    //   this.setData({
    //     productType: 5,
    //   })
    // }
    else{
      this.setData({
        productType: '',
      })
      url = '/mobile/freeUse/getWholePointFreeUseProducts'
      let timer={
        url:'/mobile/freeUse/getWholePointFreeUseTimes',
        data:{},
        callback:function(res){
          _self.setData({
            timeList: res.data.result,
          })
          res.data.result.forEach(function(val,index){
            if (val.isCurrentActivity===1){
              _self.setData({
                timeActive:index
              })
              return
            }
          })
         
        }
      }
      common.methods.mothod1(timer)
    }
    this.getDataList(url,1)
  },
  //进详情
  goDetial(e){
    wx.showLoading({
      mask: true
    })
    wx.navigateTo({
      url: '../detial/detial?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
//时间段
  gettimeDataList(e){
    if (e.currentTarget.dataset.index === this.data.timeActive){
      return
    }
    this.setData({
      timeActive: e.currentTarget.dataset.index,
      time: e.currentTarget.dataset.time,
      page:1,
      rows:10
    })
    this.getDataList('/mobile/freeUse/getWholePointFreeUseProducts',1)
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
    let _self=this
    wx.showNavigationBarLoading()
      this.setData({
        // classNum:0,
        page: 1,
        rows: 10,
        // productType:1,
        // time: '',
        // timeList: [],
        // timeActive: '',
      })
      let data={
        url: this.data.classNum == 4 ? '/mobile/freeUse/getWholePointFreeUseProducts' : '/mobile/freeUse/getFreeUseProducts',
        data: this.data.classNum == 4 ? { time: this.data.time} : {
          page:this.data.page,
          rows:this.data.rows,
          type: this.data.productType
        },
        callback:function(res){
          // if (_self.data.classNum==4){
          //   _self.data.timeList.forEach(function (val, index) {
          //     if (val.isCurrentActivity === 1) {
          //       _self.setData({
          //         timeActive: index
          //       })
          //       return
          //     }
          //   })
          // }
          _self.setData({
            dataList: res.data.result
          })
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }
      }
    common.methods.mothod1(data)
  },
  onPageScroll: function (e) { // 页面滚动触发事件的处理函数
    if (!this.data.isStartOrClose){return}
    let _self=this
    this.setData({
      isStartOrClose: false,
      GetscrollTop: e.scrollTop
    }, () => {
      setTimeout(() => {
        _self.setData({
          isStartOrClose:true
        })
      }, 50)
    })
    console.log(e.scrollTop)
    // if (e.scrollTop > 250) {
    //   this.setData({
    //     topTrue: true
    //   })
    // } else {
    //   this.setData({
    //     topTrue: false
    //   })
    // }
    // if (e.scrollTop > this.data.fixedNavTop){
    //   this.setData({
    //     fixedNav: true
    //   })
    // }else{
    //   this.setData({
    //     fixedNav: false
    //   })
    // }
    // if (e.scrollTop > 277){
    //   this.setData({
    //     timeTop: true
    //   })
    // }else{
    //   this.setData({
    //     timeTop: false
    //   })
    // }
  },
  //图片展示
  showimg(e){
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: item.images[index], // 当前显示图片的http链接
      urls: item.images // 需要预览的图片http链接列表
    })
  },
  //保存素材
  saveImg(e) {
    // this.closeEwm=null
    let _self = this
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              _self.afterCanSaveImg(e)
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
          _self.afterCanSaveImg(e)
        }
      }
    })
  },
  afterCanSaveImg(e){
    wx.showLoading({
      title: '保存中...',
      icon:'none'
    })
    let item = e.currentTarget.dataset.item
    let num=0
    item.map((val,index)=>{
      wx.getImageInfo({
        src: val,
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success() {
            num++
              if (num == item.length){
                wx.hideLoading()
                wx.showToast({
                  title: '保存成功',
                  icon: 'none'
                })
              }
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

    })
  },
  calconShou() {
    this.setData({
      isSaveAlow: false
    })
  },
  dramimg(){
    console.log(1)
  },
  toScrollTop() {//回到顶部方法
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
  },
  //规格弹框
  openBuy(e){
    wx.showLoading({
      icon:'none'
    })
    let item = e.currentTarget.dataset.item
    console.log(item)
    let _self=this
      let data={
        url:'/mobile/product/getProductNormals',
        data:{
          productId: item.productId,
          memberId:app.userId,
          uutype: app.uutype,
          type: this.data.dataType
        },
        callback:function(res){
          _self.setData({
            propverImg: item.image,
            allNormalMess:res.data.result,
            isShow:false,
            isStore: _self.data.normalMess ? _self.data.normalMess.store : res.data.result.store,
            chonseMess:item
            // isbuyMinCount: res.data.result.buyMinCount > 1 ? res.data.result.buyMinCount : 1,
          })
          wx.hideLoading()
        }
      }
      common.methods.mothod1(data)
  },
  //打开购买弹框
  closeBuy() {
    this.setData({
      isShow: true,
      itemKey: '',
      item_sonOne: '',
      item_sonTwo: '',
      item_sonThree:'',
    })
  },
  //改变规格
  changenormal(e) {
    this.setData({
      itemKey: e.currentTarget.dataset.index,
      item_sonOne: e.currentTarget.dataset.index === 0 ? e.currentTarget.dataset.indexson : this.data.item_sonOne,
      item_sonTwo: e.currentTarget.dataset.index === 1 ? e.currentTarget.dataset.indexson : this.data.item_sonTwo,
      item_sonThree: e.currentTarget.dataset.index === 2 ? e.currentTarget.dataset.indexson : this.data.item_sonThree
    })
    if (this.data.allNormalMess.normals.length === 1) {
      if (this.data.item_sonOne !== '') {
        let id = this.data.allNormalMess.normals[0].normses[0].valueId
        this.getNormal([id].join(','))
      }
    } else if (this.data.allNormalMess.normals.length === 2) {
      if (this.data.item_sonOne !== '' && this.data.item_sonTwo !== '') {
        let id = this.data.allNormalMess.normals[0].normses[this.data.item_sonOne].valueId
        let id2 = this.data.allNormalMess.normals[1].normses[this.data.item_sonTwo].valueId
        this.getNormal([id, id2].join(','))
      }
    } else if (this.data.allNormalMess.normals.length === 3) {
      if (this.data.item_sonOne !== '' && this.data.item_sonTwo !== '' && this.data.item_sonThree !== '') {
        let id = this.data.allNormalMess.normals[0].normses[this.data.item_sonOne].valueId
        let id2 = this.data.allNormalMess.normals[1].normses[this.data.item_sonTwo].valueId
        let id3 = this.data.allNormalMess.normals[2].normses[this.data.item_sonThree].valueId
        this.getNormal([id, id2, id3].join(','))
      }
    }
  },
  //获取规格信息接口
  getNormal(str) {
    let _self = this
    let data = {
      url: '/mobile/product/getNormal',
      data: {
        productId: this.data.chonseMess.productId,
        valueIds: str,
        memberId: app.userId,
        type: this.data.dataType,
        uutype: app.uutype
      },
      callback: function (res) {
        _self.setData({
          normalMess: res.data.result,
          isStore: res.data.result.store
        })
      }
    }
    common.methods.mothod1(data)
  },
  //改变数量
  changeNum(e) {
    wx.showToast({
      title: '该产品只能试用一次',
      icon:'none'
    })
  },
  //弹框确认按钮
  tosureActive() {
    if (this.data.personalMess.goldBean < this.data.chonseMess.goldBean){
      wx.showToast({ title: '金豆不足，无法试用该产品', icon: 'none' })
      return
    }
    if(this.data.allNormalMess.isApply!=0){
      wx.showToast({ title: '已试用过该产品', icon: 'none' })
      return
    }
    if (this.data.allNormalMess.status == 5) {
      wx.showToast({ title: '商品已下架', icon: 'none' })
      return
    }
    if (this.data.allNormalMess.status == 1) {
      wx.showToast({ title: '活动尚未开始，敬请期待', icon: 'none' })
      return
    }
    if (this.data.allNormalMess.status == 3) {
      wx.showToast({ title: '活动已结束', icon: 'none' })
      return
    }
    if (this.data.allNormalMess.normals.length > 0) {
      if (this.data.normalMess) {
        if (this.data.isStore>0) {
            this.saveProductMess()
        } else {
          wx.showToast({ title: '库存不足请选择其他规格', icon: 'none' })
        }
      } else {
        wx.showToast({ title: '请选择规格', icon: 'none' })
      }
    } else {
      if (this.data.isStore) {
        // if (this.data.addOrBuy == 2) {
          this.saveProductMess()
        // } else {
        //   this.addShopStore()
        // }
      } else {
        wx.showToast({ title: '库存不足', icon: 'none' })
      }
    }
  },
  //跳转确认订单页储存信息
  saveProductMess() {
    let productMess = {
      productId: this.data.chonseMess.productId,
      num: this.data.isbuyMinCount,
      normalId: this.data.normalMess ? this.data.normalMess.id : '',
      type: this.data.dataType,
      // recId: this.data.recId
    }
    wx.setStorageSync('productMess', productMess)
    wx.navigateTo({
      url: '/views/detial/toSureBuy/toSureBuy',
    })
  },
  //请求二维码接口
  drawImage(e) {
    let _self = this
    let item = e.currentTarget.dataset.item
    _self.setData({
      canvasImg: true
    })
    wx.showLoading({
      title: '图片生成中...',
    })
    let obj = {
      url: '/mobile/product/getLocalCodePath',
      data: {
        productId: item.productId,
        memberId: app.userId,
        type: this.data.dataType
      },
      callback: function (res) {
        _self.getErweima(res.data.result,item)
      }
    }
      common.methods.mothod1(obj)
  },
  //canvas画图
  getErweima(erweima,item) {
    var resd = wx.getSystemInfoSync();
    var radio = resd.screenWidth / 750;//屏幕宽度比例
    // let len = String(item.price).length * 14
    let str ='保证金: '
    console.log(len)
    let _self = this
    const ctx = wx.createCanvasContext('mycanvas');
    // const ctx = wx.createCanvasContext('mycanvas');
    let len = ctx.measureText(item.price).width+23
    let len0 = ctx.measureText(str).width+5
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
          src: item.image,
          success(res) {
            ctx.drawImage(res.path, 0, 80, radio * 650, radio * 650);
            //商品名称
            var str = item.productName;
            //绘制简单的文字
            ctx.setFillStyle("#333"); // black color
            // ctx.setFontSize (12);
            ctx.lineWidth = 1;
            var lineWidth = 0;
            var canvasWidth = 220;//计算canvas的宽度
            var initHeight = (radio * 650) + 100;//绘制字体距离canvas顶部初始的高度
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
            ctx.setFillStyle('#777777')  // 文字颜色：黑色
            ctx.setFontSize(14)         // 文字字号：22px
            ctx.fillText('保证金: ' , 16, (radio * 650) + 140)
            ctx.setFillStyle('#ed0276')  // 文字颜色：黑色
            ctx.setFontSize(14)         // 文字字号：22px
            ctx.fillText('￥' + item.price, 16 + len0, (radio * 650) + 140)
            ctx.setFillStyle('#AAAAAA')  // 文字颜色：黑色
            ctx.setFontSize(12)         // 文字字号：22px
            ctx.fillText('(试用结束退还)', 16 + len0 + len, (radio * 650) + 140)///
            ctx.setFillStyle('#777777')  // 文字颜色：黑色
            ctx.setFontSize(12)         // 文字字号：22px
            ctx.fillText('长按识别二维码查看详情', 16, (radio * 650) + 160)
            wx.getImageInfo({////////////////////////
              src: erweima,
              success(res) {
                ctx.drawImage(res.path, radio * 650 * 0.75, (radio * 650) + 84, 80, 80);
                ctx.draw(true, function () {
                })
                wx.hideLoading()
              }
            })
          }
        });
      }
    });
  },
  //用户信息
  getmemberMess(){
    let _self=this
    let banners = {
      url: '/mobile/member/getMember',
      data: {
        memberId: app.userId
      },
      callback: function (res) {
        app.memberData = res.data.result
        _self.setData({
          personalMess: res.data.result,
        })
      }
    }
    common.methods.mothod1(banners)
  },
  preventD() {
    return
  },
  //关闭二维码
  closeEwm() {
    this.setData({
      canvasImg: false
    })
    wx.hideLoading()
  },
  saveImgTolocal() {
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
                canvasImg: false,
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
                      canvasImg: false
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
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    if (this.data.productType === 1 || this.data.productType === 5){
      this.getDataList('/mobile/freeUse/getFreeUseProducts', 2)
    }else{
      this.getDataList('/mobile/freeUse/getWholePointFreeUseProducts', 2)
    }
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
      title: '试用',
      path: '/views/tryPage/tryPage',//当前页面 path ，必须是以 / 开头的完整路径
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