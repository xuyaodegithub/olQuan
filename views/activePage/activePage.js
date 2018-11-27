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
    this.getossID(options.id)
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
  getossID(id){
      let _self=this
      let data={
        url:'/mobile/buildblocks/getById',
        data:{
          id: id
        },
        callback:function(res){
            _self.setData({
              activeDetail : res.data.result
            })
          wx.setNavigationBarTitle({//动态设置页面标题
            title: res.data.result.name
          })
          _self.getFirstData(res.data.result.ossDataId)
            setTimeout(function () {
              _self.setScrollTop()
              _self.setTop('#classBtn')
              },1000)
        }
      }
    common.methods.mothod1(data)
  },
  //进详情
  goDetial(e){
    let id = e.currentTarget.dataset.item.productId ? e.currentTarget.dataset.item.productId :''
    let typeP = e.currentTarget.dataset.item.productType ? e.currentTarget.dataset.item.productType : ''
    if (id){
      wx.navigateTo({
        url: '../detial/detial?id=' + id + '&type=' + typeP,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
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
                })
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
    wx.pageScrollTo({
      scrollTop: this.data.bannerList[e.currentTarget.dataset.index],
      duration: 200
    })
    console.log(this.data.scrollTopNum)
  },
  upper(e) {
    console.log(e)
   },
  lower(e) { 
    console.log(e)
  },
  scroll(e){
    console.log(e.detail.scrollTop )//classPIndex2
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
    if (scrollTop > this.data.timeTopNum){
      this.setData({
        isFixed: true
      })
    }else{
      this.setData({
        isFixed: false
      })
    }
    let oLiDom= this.data.bannerList
    for (let i = 0; i < oLiDom.length; i++) {
      if (scrollTop < oLiDom[0] || scrollTop == oLiDom[0]) {
        this.setData({
          classBtnIndex: 0
        })
        break
      }//				console.log(oLiDom[i].offsetTop,i,scrollTop)
      else if (scrollTop > oLiDom[oLiDom.length - 1] || scrollTop == oLiDom[oLiDom.length - 1] ) {
        this.setData({
          classBtnIndex: oLiDom.length - 1
        })
        break
      } else  if (scrollTop > oLiDom[i]-5 && scrollTop < oLiDom[i + 1]-5) {
        this.setData({
          classBtnIndex:i
        })
        break
      } 
    }
    // // console.log(this.data.classBtnIndex, this.data.classPIndex2)
    if (this.data.classBtnIndex% 4 ===0) { 
      this.setData({
        toView2: this.data.classPIndex2[this.data.classBtnIndex]
      })
    } else if (this.data.classBtnIndex<4){
      this.setData({
        toView2: this.data.classPIndex2[0]
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
  onShareAppMessage: function () {

  }
})