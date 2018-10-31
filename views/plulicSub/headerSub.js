// firstIndex/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    topBtm: [
      '特卖',
      '试用',
      '发现'
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeType(e) {
      // console.log(this.data.type)
      if (e.target.dataset.key !== this.data.type) {
        if (e.target.dataset.key === 0) {
          console.log(1)
          wx.switchTab({
            url: '../firstIndex',//这个路由在tabbar里  不能用navigateTo
          })
        } else if (e.target.dataset.key === 1 && this.data.type===0) {
          wx.navigateTo({
            url: './tryPage/tryPage',
          })
        } else if (e.target.dataset.key === 1 && this.data.type === 2){
          wx.navigateTo({
            url: '../tryPage/tryPage',
          })
        } else if (e.target.dataset.key === 2 && this.data.type === 0) {
          wx.navigateTo({
            url: './findPage/findPsge',
          })
        }else{
          wx.navigateTo({
            url: '../findPage/findPsge',
          })
        }
      }
    }
  }
})
