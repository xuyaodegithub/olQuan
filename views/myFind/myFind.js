// find/find.js
var common = require('../../utils/common.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    seachDteail: '',
    isShowCancel: false,
    searchCode: '',
    searchCodeStr: '',
    memberList: [],
    isFollowId: 1,
    isHasNewFollow: false,
    isMoreNone: true,
    isVideo: false,
    page: 1,
    findList: [],
    accountList: [],
    videoDetail: '',
    isFixed: false,
    timeTopNum: 0,
    topTrue: false,
    isGetFollow: true,
    findListShow: false,
    isAddGoods: true,//点赞
    appLinkShow: false,
    showShare: false,
    accountId: '',
    canvasImg: '',//canvas图片
    isSaveAlow: false,//授权弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    common.methods.getLoginMess(this.getAccountList, this);

  },
  inputSearchCode(e) {
    this.setData({
      searchCode: e.detail.value
    })
  },
  //获取发现账号详情
  getAccountList() {
    this.setData({
      memberList: app.memberData,
    })
    let _self = this;
    let find = {
      url: '/mobile/find/accountDetail',
      data: {
        memberId: app.userId,
      },
      callback: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.result.name
        })
        _self.setData({
          accountList: res.data.result,
        })
      }
    }
    common.methods.mothod1(find)
    this.getFindList()
  },
  //点击我关注
  getFollowAccount(){
    this.setData({
      page:1,
      isMoreNone:true,
      isFollowId:1,
      accountId:'',
    })
    this.getFindList()
  },
  //点击我发布
  getMyAccount(){
    this.setData({
      page: 1,
      isMoreNone: true,
      isFollowId: '',
      accountId: this.data.accountList.accountId,
    })
    this.getFindList()
  },
  copy(e) {
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
  showAppLink() {
    this.setData({
      appLinkShow: true,
    })
  },
  colseAppLink() {
    this.setData({
      appLinkShow: false,
    })
  },
  getHowShareNew() {
    this.setData({
      showShare: true,
    })
  },
  colseShare() {
    this.setData({
      showShare: false,
    })
  },
  //跳转个人发现页面
  getDetailAccount(e) {
    wx: wx.navigateTo({
      url: '../findPage/findPsge?id=' + e.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点赞
  addGoodsNum(e) {
    console.log(e.currentTarget.dataset)
    if (this.data.isAddGoods) {
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
          if (num == 0) {
            let str = "findList[" + indexId + "].isDoGood";
            let strMore = "findList[" + indexId + "].goodCount";
            _self.setData({
              [str]: 1,
              [strMore]: _self.data.findList[indexId].goodCount + 1
            })
          } else {
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
  //发现列表
  getFindList(isMore) {
    let _self = this;
    let find = {
      url: '/mobile/find/finds',
      data: {
        memberId: app.userId,
        accountId: _self.data.accountId,
        isFollow: _self.data.isFollowId,
        page: _self.data.page,
        rows: 10,
      },
      callback: function (res) {
        if (res.data.result.length == 0) {
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
  lookAllMessage(e) {
    let str = "findList[" + e.currentTarget.dataset.index + "].isShow";
    this.setData({
      [str]: true,
    })
  },
  //收起全文
  colseAllMessage(e) {
    let str = "findList[" + e.currentTarget.dataset.index + "].isShow";
    this.setData({
      [str]: false,
    })
  },
  previewImage(e) {//点击图片大图预览
    // console.log(e.target.dataset)
    var current = e.target.dataset;
    let urlsList = [];
    for (let i = 0; i < e.currentTarget.dataset.item.length; i++) {
      urlsList.push(e.currentTarget.dataset.item[i].linkUrl)
    }
    wx.previewImage({
      current: urlsList[e.currentTarget.dataset.index], // 当前显示图片的http链接  
      urls: urlsList // 需要预览的图片http链接列表  
    })
  },
  //视频播放
  getVideo(e) {
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
  colseVideo() {
    this.setData({
      isVideo: false,
    })
    this.videoContext.pause()
  },
  //跳转详情
  getDetailUrl(e) {
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.type == 12) {
      wx: wx.navigateTo({
        url: '/views/activePage/activePage?id=' + e.currentTarget.dataset.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (e.currentTarget.dataset.type == 13) {
      wx: wx.navigateTo({
        url: '/views/personal/getCoupon/getCoupon?id=' + e.currentTarget.dataset.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx: wx.navigateTo({
        url: '../detial/detial?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type + '&recId=' + e.currentTarget.dataset.recid,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
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
  },
  toScrollTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
  },
  //canvas画图
  getShareImg(e) {
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
                ctx.drawImage(res.path, radio * 650 * 0.75, (radio * 650) + 90, 80, 80);
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
  //加载图片
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
    this.getFindList();
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
      this.getFindList(2);
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
      path: "/pages/findPage/findPsge?id=" + this.data.accountId,//当前页面 path ，必须是以 / 开头的完整路径
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