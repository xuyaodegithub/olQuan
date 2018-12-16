// views/activePage/activePage.js
var common = require('../../utils/common.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeID:'',//活动id
    activeData:{},//活动数据
    backData:{},//背景数据
    activeDetail:{},//活动基础数据
    classBtnIndex:0,
    productList:[],//产品列表
    classPIndex: [],//产品列表banner下标
    classPIndex2:[],//btnid集合
    timeTopNum:'',//scrollTop
    isFixed:false,
    bannerList:[],//产品李彪分类banner高度集合
    toView:'banner0',//某个子元素id
    toView2:'Btn0',//btnid
    scrollTopNum:'',
    topTrue:false,
    // isStartOrClose:false
    // windowHeight:''//设备高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        activeID:options.id
      })
    // var resd = wx.getSystemInfoSync();
    // this.setData({
    //   windowHeight: resd.windowHeight
    // })
    // this.getossID(options.id)
    common.methods.getLoginMess(this.getossID, this,options)
  },
  //监听
  setBindDiv(){
    this._observer = wx.createIntersectionObserver(this, {observeAll:true})
    this._observer
      .relativeToViewport()
      .observe('.banner', (res) => {
        console.log(res);
        console.log(res.id.split('er')[1]);
        // if (res.boundingClientRect.top<0){
          this.setData({
            classBtnIndex: res.id.split('er')[1]
          })
        // }else{
        //   this.setData({
        //     classBtnIndex: res.id.split('er')[1] - 1 < 0 ? 0 : res.id.split('er')[1] - 1
        //   })
        // }
        
      })
  },
  //点击滚动
  setScrollTop(){
    let _self = this
    let query = wx.createSelectorQuery()
    query.selectAll('.banner').boundingClientRect()//(rect) => {
    // query.selectViewport().scrollOffset()
    query.exec(function (rect) {
      console.log(rect)
      let arr=[]
      for (let i = 0; i < rect[0].length;i++){
        arr.push(rect[0][i].top)
      }
      _self.setData({
        bannerList: arr
      })
    })
  },
  //标题悬浮
  setTop(str) {
    let _self = this
    let query = wx.createSelectorQuery()
    query.select(str).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // res[0].top       // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
      console.log(res[0].top, res[1].scrollTop)
      _self.setData({
        timeTopNum: res[0].top
        })
    })
  },
//第一次进入请求活动ossid
  getossID(){
      let _self=this
      let data={
        url:'/mobile/buildblocks/getById',
        data:{
          id: this.data.activeID
        },
        callback:function(res){
            _self.setData({
              activeDetail : res.data.result
            })
          wx.setNavigationBarTitle({//动态设置页面标题
            title: res.data.result.name
          })
          _self.getFirstData(res.data.result.ossDataId)
        }
      }
    common.methods.mothod1(data)
  },
  //进详情
  goDetial(e){//这里可以跳type
    let item = e.currentTarget.dataset.item
    // let id = e.currentTarget.dataset.item.productId ? e.currentTarget.dataset.item.productId :''
    // let typeP = e.currentTarget.dataset.item.productType ? e.currentTarget.dataset.item.productType : ''
    // if (id){
    //   wx.navigateTo({
    //     url: '../detial/detial?id=' + id + '&type=' + typeP,
    //     success: function (res) { },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   })
    // }
    if (item.type == 2 || item.type == 21 ){
      let id = e.currentTarget.dataset.item.productId ? e.currentTarget.dataset.item.productId : ''
      let typeP = e.currentTarget.dataset.item.productType ? e.currentTarget.dataset.item.productType : ''
      wx.navigateTo({
        url: '../detial/detial?id=' + id + '&type=' + typeP,
      })
    } else if (item.type == 19) {
      wx.navigateTo({
        url: '../personal/renewPink/renewPink'
      })
    } else if (item.type == 11) {
      wx.navigateTo({
        url: '../personal/invitePink/invitePink'
      })
    } else if (item.type == 1) {
      wx.navigateTo({
        url: '/views/tryPage/tryPage'
      })
    } else if (item.type == 18) {
      wx.navigateTo({
        url: '/views/activePage/activePage?id=' + item.url.split('id=')[1],
      })
    } else if (item.type == 20) {
      wx.navigateTo({
        url: '/views/plusPage/plusPage',
      })
    } else if (item.type == 22) {
      wx.navigateTo({
        url: '/views/personal/getCoupon/getCoupon?id=' + item.url.split('/id/')[1],
      })
    } else if (item.type == 0){
        return
    }


  },
  //ossid获取详细数据
  getFirstData(ossid){
    let _self = this    
    return new Promise(function (resolve, reject){
      wx.request({
        url: 'https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/buildblocks_data/' + ossid,
        data: {},
        dataType: 'json',
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.statusCode == 200) {
            _self.setData({
              activeData: res.data.subassembly,
              backData: res.data.background
            })
            res.data.subassembly.map(function (val, index) {
              if (val.modelSampleCode === 'catlist1') {
                wx.showLoading({
                  title: '加载中...',
                  mask: true
                })
                let productList = []//产品
                let classBanner = []//下标id
                let classBanner2 = []//btnid
                val.contents.map(function (item, key) {
                  item['id'] = 'Btn' + key
                  classBanner2.push('Btn' + key)
                  if (item.classBannerImg) {
                    let itemOne = item.classBannerImg
                    itemOne['id'] = 'banner' + key
                    classBanner.push(itemOne.id)
                    productList.push(itemOne)
                  } else {
                    let obj = {
                      classMore: "classBanner",
                      height: '',
                      id: "banner" + key,
                      image: "",
                      width: ''
                    }
                    classBanner.push(obj.id)
                    productList.push(obj)
                  }
                  productList = productList.concat(item.dataList)
                })
                console.log()
                _self.setData({
                  productList: productList,
                  classPIndex: classBanner,
                  classPIndex2: classBanner2
                })//, _self.setBindDiv
                setTimeout(function () {
                  // _self.setScrollTop()
                  _self.setTop('#classBtn')
                  wx.hideLoading()    
                }, 1300)
                return
              }
            })
            resolve(res)    
          } else {
            reject(res)
            wx.showToast({
              title: '请求错误',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function (res) {
          reject(res)
          wx.showToast({
            title: '请求错误',
            icon: 'none',
            duration: 2000
          });
        }
      })

    })
  },
  //回到顶部
  toScrollTop() {//回到顶部方法
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 400
    // })
    this.setData({
      scrollTopNum:0
    })
  },
  //滚轮
  // onPageScroll: function (e) { // 页面滚动触发事件的处理函数
  //   let scrollTop = e.scrollTop
  //   let _self = this
  //   if (scrollTop > 300) {
  //     this.setData({
  //       topTrue: true
  //     })
  //   } else {
  //     this.setData({
  //       topTrue: false
  //     })
  //   }
  //   if (scrollTop > this.data.timeTopNum) {
  //     this.setData({
  //       isFixed: true
  //     })
  //   } else {
  //     this.setData({
  //       isFixed: false
  //     })
  //   }
  //   let oLiDom = this.data.bannerList
  //   for (let i = 0; i < oLiDom.length; i++) {
  //     if (scrollTop < oLiDom[0]) {
  //       this.setData({
  //         classBtnIndex: 0
  //       })
  //       break
  //     }//				console.log(oLiDom[i].offsetTop,i,scrollTop)
  //     else if (scrollTop > oLiDom[oLiDom.length - 1]) {
  //       this.setData({
  //         classBtnIndex: oLiDom[oLiDom.length - 1]
  //       })
  //       break
  //     } else if (scrollTop > oLiDom[i] && scrollTop < oLiDom[i + 1]) {
  //       this.setData({
  //         classBtnIndex: i
  //       })
  //       break
  //     }
  //   }
  //   // console.log(this.data.classBtnIndex, this.data.classPIndex2)
  //   if (this.data.classBtnIndex % 4 === 0) {
  //     this.setData({
  //       toView2: this.data.classPIndex2[this.data.classBtnIndex]
  //     })
  //   } else if (this.data.classBtnIndex < 4) {
  //     this.setData({
  //       toView2: this.data.classPIndex2[0]
  //     })
  //   }
  // },
  changeTtle(e){
    if (e.currentTarget.dataset.index==this.data.classBtnIndex){
      return
    }
    console.log(e.currentTarget.dataset.item)
    this.setData({
      classBtnIndex: e.currentTarget.dataset.index,
      toView: this.data.classPIndex[e.currentTarget.dataset.index]
    })
    console.log(this.data.toView)
    // wx.pageScrollTo({
    //   scrollTop: this.data.bannerList[e.currentTarget.dataset.index],
    //   duration: 200
    // })
    // console.log(this.data.scrollTopNum)
  },
  upper(e) {
    // console.log(e)
   },
  lower(e) { 
    // console.log(e)
  },
  scroll(e){
    // console.log(e.detail)//classPIndex2
    let scrollTop = e.detail.scrollTop    
    // let _self=this
    // _self.setScrollTop()
    // _self.setTop('#classBtn') 
    if (scrollTop > 300) {
      this.setData({
        topTrue: true
      })
    } else {
      this.setData({
        topTrue: false
      })
    }
    if (this.data.timeTopNum && scrollTop > this.data.timeTopNum){
      this.setData({
        isFixed: true
      })
    }else{
      this.setData({
        isFixed: false
      })
    }
    // let oLiDom= this.data.bannerList
    // for (let i = 0; i < oLiDom.length; i++) {
    //   if (scrollTop < oLiDom[0] || scrollTop == oLiDom[0]) {
    //     this.setData({
    //       classBtnIndex: 0
    //     })
    //     break
    //   }//				console.log(oLiDom[i].offsetTop,i,scrollTop)
    //   else if (scrollTop > oLiDom[oLiDom.length - 1] || scrollTop == oLiDom[oLiDom.length - 1] ) {
    //     this.setData({
    //       classBtnIndex: oLiDom.length - 1
    //     })
    //     break
    //   } else  if (scrollTop > oLiDom[i]-15 && scrollTop < oLiDom[i + 1]-15) {
    //     this.setData({
    //       classBtnIndex:i
    //     })
    //     break
    //   } 
    // }
    // // console.log(this.data.classBtnIndex, this.data.classPIndex2)
    if (this.data.classBtnIndex% 4 ===0) { 
      this.setData({
        toView2: this.data.classPIndex2[this.data.classBtnIndex] ? this.data.classPIndex2[this.data.classBtnIndex] :'Btn0'
      })
    } else if (this.data.classBtnIndex<4){
      this.setData({
        toView2: this.data.classPIndex2[0] ? this.data.classPIndex2[0] : 'Btn0'
      })
    }
    // console.log(this.data.toView, this.data.toView2)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //  let _self=this
    // setTimeout(function(){
    //   _self.setScrollTop()
    //   _self.setTop('#classBtn')          
    // },1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setScrollTop()
    // this.setTop('#classBtn')        
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
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮、、menu
      console.log(ops.target)
    }
    return {
      title: this.data.activeDetail.name,
      path: '/views/activePage/activePage?id=' + this.data.activeDetail.id,//当前页面 path ，必须是以 / 开头的完整路径
      desc: this.data.activeDetail.memo, 
      imageUrl: "https://ol-quan2017.oss-cn-shanghai.aliyuncs.com/"+this.data.activeDetail.shareImg,
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