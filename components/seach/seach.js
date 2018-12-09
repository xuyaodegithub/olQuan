// components/seach/seach.js
var common = require('../../utils/common.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    seachValue:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      value:''
  },
  created() {//在组件实例刚刚被创建时执行
  
  },
  attached() {//在组件实例进入页面节点树时执行
    let _self = this
   
  },
  ready() {//在组件在视图层布局完成后执行
   
  },
  moved() {//在组件实例被移动到节点树另一个位置时执行

  },
  detached() {//在组件实例被从页面节点树移除时执行

  },
  error() {//每当组件方法抛出错误时执行

  },
  /**
   * 组件的方法列表
   */
  methods: {
    toseach() {
      wx.navigateTo({
        url: '/views/seachSome/seachsome?value=' + this.data.seachValue//跳转详情页，用options接受参数
      })
    },
  }
})
