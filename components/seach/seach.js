// components/seach/seach.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    toseach() {
      wx.navigateTo({
        url: '../seachSome/seachsome'//跳转详情页，用options接受参数
      })
    },
  }
})
