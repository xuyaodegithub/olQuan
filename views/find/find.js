// find/find.js
var common = require('../../utils/common.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    seachDteail:'',
    isShowCancel:false,
    searchCode:'',
    searchCodeStr:'',
    memberList:[],
    isFollowId:'',
    isHasNewFollow:false,
    isMoreNone:true,
    isVideo:false,
    page:1,
    findList:[],
    videoDetail:'',
    isFixed:false,
    timeTopNum:0,
    topTrue:false,
    isGetFollow:true,
    findListShow:false,
    isAddGoods:true,//点赞
    appLinkShow:false,
    showShare:false,
    canvasImg: '',//canvas图片
    isSaveAlow: false,//授权弹框
    isShanglu: 0,
    shangluList:[],
    isbuyMinCount:1,
    chooseNor: false,
    normalList: [],
    addSelect: '',
    getVlaueOne: '',
    getVlaueTwo: '',
    addSelectTwo: '',
    productId: '',
    productPrice: '',
    normalDetail: [],
    normalImg: '',
    showNoNormal: false,
    showNum: false,
    limitBuyCount:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.methods.getLoginMess(this.getListDetail, this);
    this.setTop();
  },
  inputSearchCode(e){
    this.setData({
      searchCode: e.detail.value
    })
  },
  //点击关注
  getFollow(e){
    if (this.data.isGetFollow){
      this.setData({
        isGetFollow:false,
      })
      let accountId = e.currentTarget.dataset.accountid;
      let _self=this;
      let hasFollow = {
        url: '/mobile/find/follow',
        data: {
          memberId: app.userId,
          accountId: accountId
        },
        callback: function (res) {
          _self.setData({
            isGetFollow: true,
          })
          for (let i = 0; i < _self.data.findList.length; i++) {
            if (_self.data.findList[i].accountId==accountId){
              let str = "findList[" + i + "].isFollow";
              _self.setData({
                [str]: 1,
              })
            }
          }
          wx.showToast({
          title: '关注成功',
          icon: 'success',
          duration: 2000
        })
        }
      }
      common.methods.mothod1(hasFollow)
    }
  },
  copy(e){
    let that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.detail,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  //素材提示
  showAppLink(e){
    // console.log(e.currentTarget.dataset.item)
    // let list = e.currentTarget.dataset.item
    // for (let i = 0; i < list.length;i++){
    //   if(list[i].type==1){
    //     this.saveIamge(list[i].linkUrl)
    //   }
    // }
    this.setData({
      appLinkShow:true,
    })
  },
  //保存图片
  saveIamge(ulr){
    wx.getImageInfo({
      src: ulr,
      success(res) {
        wx.saveImageToPhotosAlbum({
        filePath: res.path,
        success(res) {}
        
        })  
      }
    })
  },
  colseAppLink() {
    this.setData({
      appLinkShow: false,
    })
  },
  getHowShareNew(){
    this.setData({
      showShare: true,
    })
  },
  colseShare(){
    this.setData({
      showShare: false,
    })
  },
  //点赞
  addGoodsNum(e){
    console.log(e.currentTarget.dataset)
    if (this.data.isAddGoods){
      this.setData({
        isAddGoods: false,
      })
      let findId = e.currentTarget.dataset.findid;
      let indexId = e.currentTarget.dataset.index;
      let num = e.currentTarget.dataset.num;
      let _self = this;
      let hasFollow = {
        url: '/mobile/find/doGood',
        data: {
          memberId: app.userId,
          findId: findId
        },
        callback: function (res) {
          _self.setData({
            isAddGoods: true,
          })
          if (num==0) {
            let str = "findList[" + indexId + "].isDoGood";
            let strMore = "findList[" + indexId + "].goodCount";
            _self.setData({
              [str]: 1,
              [strMore]: _self.data.findList[indexId].goodCount+1
            })
          }else{
            let str = "findList[" + indexId + "].isDoGood";
            let strMore = "findList[" + indexId + "].goodCount";
            _self.setData({
              [str]: 0,
              [strMore]: _self.data.findList[indexId].goodCount - 1
            })
          }
          
        }
      }
      common.methods.mothod1(hasFollow)
    }
  },
  //搜索
  onSerach(){
    if(this.data.isShanglu==1){
      wx.showToast({
        title: '好物暂不支持搜索',
        icon: 'none',
        duration: 2000
      });
      return
    }
    this.setData({
      isShowCancel : true,
      page: 1,
      isMoreNone: true,
    })
    if (this.data.searchCode==''){
      this.setData({
        searchCode: this.data.searchCodeStr,
      })
    }
    this.getFindList();
  },
  //取消搜索
  cancelSearch(){
    this.setData({
      isShowCancel: false,
      searchCode:'',
      page: 1,
      isMoreNone: true,
    })
    this.getFindList();
  },
  //点击好物
  getShanglu(){
    this.setData({
      isFollowId: 0,
      page: 1,
      isMoreNone: true,
      isShanglu: 1,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
    this.getShangLuList()
  },
  //点击关注
  changeFollowList(){
    this.setData({
      isFollowId:1,
      page:1,
      isMoreNone:true,
      isShanglu:0,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
    this.getFindList();
  },
  //点击精选
  changeNormalList(){
    this.setData({
      isFollowId: '',
      page: 1,
      isMoreNone: true,
      isShanglu:0,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
    this.getFindList();
  },
  //获取搜索关键字
  getListDetail(){
    this.setData({
      memberList: app.memberData,
    })
    let _self = this
    let banners = {
      url: '/mobile/find/getSearchRemind',
      data: {
        memberId: app.userId,
        type:1,
      },
      callback: function (res) {
        _self.setData({
          searchCodeStr: res.data.result,
        })
        if (res.data.result != '无' && res.data.result != '') {
          _self.setData({
            seachDteail: '大家都在搜“' + res.data.result + '”',
          })

        } else {
          _self.setData({
            seachDteail: '',
          })
        }
      }
    }
    let hasFollow = {
      url: '/mobile/find/waitReadCount',
      data: {
        memberId: app.userId,
        
      },
      callback: function (res) {
        if(res.data.result>0){
          _self.setData({
            isHasNewFollow: true,
          })
        }else{
          _self.setData({
            isHasNewFollow: false,
          })
        }
        
        
      }
    }
    common.methods.mothod1(hasFollow)
    common.methods.mothod1(banners)
    // this.getShangLuList();
    this.getFindList();
  },
  //
  getShangLuList(isMore){
    let _self = this;
    let find = {
      url: '/mobile/shanglu/store/productList',
      data: {
        memberId: app.userId,
        page: _self.data.page,
        rows: 10,
      },
      callback: function (res) {
        if (res.data.result.length < 10) {
          _self.setData({
            isMoreNone: false
          })
        }
        if (isMore === 2) {

          _self.setData({
            shangluList: _self.data.shangluList.concat(res.data.result)
          })
        } else {
          _self.setData({
            shangluList: res.data.result
          })
        }
        console.log(_self.data.shangluList)
      }
     
    }
    common.methods.mothod1(find)
  },
  //发现列表
  getFindList(isMore){
    let _self = this;
    let find={
      url: '/mobile/find/finds',
      data: {
        memberId: app.userId,
        keyword: _self.data.searchCode,
        isFollow: _self.data.isFollowId,
        page:_self.data.page,
        rows:10,
      },
      callback: function (res) {
        if (res.data.result.length == 0 && isMore!=2){
          _self.setData({
            findListShow: true
          })
        }else{
          _self.setData({
            findListShow: false
          })
        }
        if (res.data.result.length < 10) {
          _self.setData({
            isMoreNone: false
          })
        }
        if (isMore === 2) {

          _self.setData({
            findList: _self.data.findList.concat(res.data.result)
          })
        } else {
          _self.setData({
            findList: res.data.result
          })
        }
        for (let i = 0; i < _self.data.findList.length; i++) {
          let str = "findList[" + i + "].isShow";
          _self.setData({
            [str]: false,
          })
        }
      }
    }
    common.methods.mothod1(find)
  },
  //查看全文
  lookAllMessage(e){
    let str = "findList[" + e.currentTarget.dataset.index + "].isShow";
    this.setData({
      [str]: true,
    })
  },
  //收起全文
  colseAllMessage(e){
    let str = "findList[" + e.currentTarget.dataset.index + "].isShow";
    this.setData({
      [str]: false,
    })
  },
  //商陆好物放大图片
  seeNewIamg(e){
    // console.log(e.currentTarget.dataset)
    let list = e.currentTarget.dataset.list;
    let urlList=[];
    let url = e.currentTarget.dataset.url;
    let index;
    for (let i = 0; i < list.length;i++){
      if (list[i].type==1){
        urlList.push(list[i].linkUrl)
      }
    }
    for (let y = 0; y < urlList.length; y++){
      if (urlList[y] == url){
        index=y
      }
    }
    wx.previewImage({
      current: urlList[index], // 当前显示图片的http链接  
      urls: urlList // 需要预览的图片http链接列表  
    })
  },
  previewImage(e) {//点击图片大图预览
    // console.log(e.target.dataset)
    var current = e.target.dataset;
    let urlsList=[];
    for (let i = 0; i < e.currentTarget.dataset.item.length;i++){
      urlsList.push(e.currentTarget.dataset.item[i].linkUrl)
    }
    wx.previewImage({
      current: urlsList[e.currentTarget.dataset.index], // 当前显示图片的http链接  
      urls: urlsList // 需要预览的图片http链接列表  
    })
  },
  //视频播放
  getVideo(e){
    console.log(e.currentTarget.dataset.item)
    this.videoContext = wx.createVideoContext('myVideo')
    this.setData({
      videoDetail: e.currentTarget.dataset.item,
    })
    this.setData({
      isVideo: true,
    })
    this.videoContext.play()
  },
  colseVideo(){
    this.setData({
      isVideo: false,
    })
    this.videoContext.pause()
  },
  //跳转个人发现页面
  getAccountDetail(e){
    wx: wx.navigateTo({
      url: '../findPage/findPsge?id=' + e.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //跳转详情
  getDetailUrl(e){
    // console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.type==12){
      wx: wx.navigateTo({
        url: '/views/activePage/activePage?id=' + e.currentTarget.dataset.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (e.currentTarget.dataset.type == 13){
      wx: wx.navigateTo({
        url: '/views/personal/getCoupon/getCoupon?id=' + e.currentTarget.dataset.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx: wx.navigateTo({
        url: '../detial/detial?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type + '&recId=' + e.currentTarget.dataset.recid,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //获取高度
  setTop(){
    let _self = this
    let query = wx.createSelectorQuery()
    query.select('#chooseIsFollow').boundingClientRect((rect) => {
      //console.log(rect.top)
      _self.setData({
        timeTopNum: rect.top
      })
     // console.log(_self.data.timeTopNum)
    }).exec()
    
  },
  //滚轮
  onPageScroll: function (e) { // 页面滚动触发事件的处理函数
    // console.log(e.scrollTop)
    if (e.scrollTop > 200) {
      this.setData({
        topTrue: true
      })
    } else {
      this.setData({
        topTrue: false
      })
    }
    if (e.scrollTop > 85) {
      this.setData({
        isFixed: true
      })
    }
    if (e.scrollTop <= 85){
      this.setData({
        isFixed: false
      })
    
    }
  },
  toScrollTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
  },
  //canvas画图
  getShareImg(e){
    // console.log(e.currentTarget.dataset)
    let _self = this;
    let productPrice = e.currentTarget.dataset.price;
    let productImage = e.currentTarget.dataset.productimage;
    let productName = e.currentTarget.dataset.productname;
    _self.setData({
      canvasImg: true
    })
    let obj = {
      url: '/mobile/product/getLocalCodePath',
      data: {
        productId: e.currentTarget.dataset.id,
        memberId: app.userId,
        type: e.currentTarget.dataset.type
      },
      callback: function (res) {
        _self.getErweima(res.data.result, productPrice, productImage, productName)
      }
    }
    wx.showLoading({
      title: '图片生成中...',
    })
    common.methods.mothod1(obj)
    
  },
  //canvas画图
  getErweima(erweima, productPrice, productImage, productName) {
    var resd = wx.getSystemInfoSync();
    var radio = resd.screenWidth / 750;//屏幕宽度比例
    let _self = this
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
          src: productImage,
          success(res) {
            ctx.drawImage(res.path, 0, 80, radio * 650, radio * 650);
            //商品名称
            var str = productName;
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
            ctx.setFillStyle('#ed0276')  // 文字颜色：黑色
            ctx.setFontSize(14)         // 文字字号：22px
            ctx.fillText('￥' + productPrice, 16, (radio * 650) + 140)
            ctx.setFillStyle('#777777')  // 文字颜色：黑色
            ctx.setFontSize(12)         // 文字字号：22px
            ctx.fillText('长按保存分享给好友哟！', 16, (radio * 650) + 160)
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
  //关闭二维码
  closeEwm() {
    this.setData({
      canvasImg: false
    })
    wx.hideLoading()
  },
  calconShou() {
    this.setData({
      isSaveAlow: false
    })
  },
  changenormal(e){
    this.setData({
      addSelect: e.currentTarget.dataset.index,
      getVlaueOne: e.currentTarget.dataset.id
    })
    if (this.data.getVlaueOne != '' && this.data.getVlaueTwo != '') {
      this.getNormalDetail();
    }
  },
  changenormalTwo(e){
    this.setData({
      addSelectTwo: e.currentTarget.dataset.index,
      getVlaueTwo: e.currentTarget.dataset.id
    })
    if (this.data.getVlaueOne != '' && this.data.getVlaueTwo!=''){
      this.getNormalDetail();
    }
  },
  //获取规格详情
  getNormalDetail(){
    let _self = this;
    let obj = {
      url: '/mobile/shanglu/store/getNorms',
      data: {
        productId: _self.data.productId,
        memberId: app.userId,
        spec1Id:_self.data.getVlaueTwo,
        spec2Id:_self.data.getVlaueOne
      },
      callback: function (res) {
        if (res.data.result.normal){
          _self.setData({
            normalDetail: res.data.result.normal,
            normalImg: res.data.result.productMainImg,
            limitBuyCount: res.data.result.normal.num,
            showNum:true,
          })
        }else{
          _self.setData({
            limitBuyCount:0,
            showNoNormal:true,
          })
        }
        
      }
    }

    common.methods.mothod1(obj)
  },
  //点击好物购买
  sureBuyChoose(e){
    this.setData({
      productPrice: e.currentTarget.dataset.price,
      productId: e.currentTarget.dataset.productid
    })
    let _self=this;
    let obj = {
      url: '/mobile/shanglu/store/getNorms',
      data: {
        productId: e.currentTarget.dataset.productid,
        memberId: app.userId,
      },
      callback: function (res) {
        _self.setData({
          normalList:res.data.result,
          chooseNor:true,
        })
      }
    }
   
    common.methods.mothod1(obj)
  },
  //改变数量
  changeNum(e){
    if (e.currentTarget.dataset.key === "1"){
      this.setData({
        isbuyMinCount: this.data.isbuyMinCount - 1
      })
      if (this.data.isbuyMinCount<=1){
        this.setData({
          isbuyMinCount: 1
        })
      }
    }
    if (e.currentTarget.dataset.key === "2") {
      this.setData({
        isbuyMinCount: this.data.isbuyMinCount + 1
      })
      if (this.data.limitBuyCount!==''){
        if (this.data.isbuyMinCount > this.data.limitBuyCount){
          this.setData({
            isbuyMinCount: this.data.limitBuyCount
          })
          wx.showToast({
            title: '该产品最多购买' + this.data.limitBuyCount+'件',
            icon: 'none',
            duration: 2000
          });
        }
      }
    }
  },
  //关闭购买弹窗
  closeBuy(){
    this.setData({
      chooseNor: false,
      addSelectTwo: '',
      getVlaueTwo:'',
      addSelect:'',
      isbuyMinCount:1,
      getVlaueOne:'',
      productPrice:'',
      productId:'',
      normalDetail:[],
      limitBuyCount:'',
      normalImg:'',
      showNoNormal:false,
      showNum:false
    })
  },
  //购买好物
  toSureBuy(){
    if (this.data.getVlaueTwo == '' || this.data.getVlaueOne==''){
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 2000
      });
      return
    }
    if(this.data.limitBuyCount==0){
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      });
      return
    }
    let productMess = {
      productId: this.data.productId,
      num: this.data.isbuyMinCount,
      normalId: this.data.normalDetail.skuId,
      type: 12,
    }
    wx.setStorageSync('productMess', productMess)
    wx.navigateTo({
      url: '/views/detial/toSureBuy/toSureBuy',
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
    wx.showNavigationBarLoading()
    this.setData({
      page: 1,
      isMoreNone: true,
    })
    if(this.data.isShanglu==1){
      this.getShangLuList();
    }else{
      this.getFindList();
    }
    
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isMoreNone) {
      this.setData({
        page: this.data.page + 1
      })
      if(this.data.isShanglu==1){
        this.getShangLuList(2)
      }else{
        this.getFindList(2);
      }
     
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '您的好友' + this.data.memberList.nickName + '在OL圈发布了一篇达人日记，快去看看吧！',
      desc: '发现好物 分享赚钱',
      imageUrl: 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/aaa.png',
      path: "/views/find/find",//当前页面 path ，必须是以 / 开头的完整路径
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