// components/swiper.js
var common = require("../../utils/common.js")
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banner: {
      type: Array
    },
    advers:{
      type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //活动
    goType(e) {
      common.methods.goMoreType(e.currentTarget.dataset.item)
      // wx.navigateTo({
      //   url: '../find/find?url=' + e.target.dataset.url//跳转详情页，用options接受参数
      // })
    },
  }
})
