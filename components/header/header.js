// components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    numkey: {
      type: Number
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    topBtm: ['试用', '欢乐送', '发现'],
    num:'',
    trueOrFalse:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeType(e) {
      if (e.currentTarget.dataset.key === this.data.numkey){
        return
      }
      if (e.currentTarget.dataset.key === 0){
        wx.navigateTo({
          url: '../../views/tryPage/tryPage',
        })
      } else if (e.currentTarget.dataset.key === 1){
        wx.switchTab({
          url: '../../views/firstIndex/firstIndex',
        })
      }else{
        wx.navigateTo({
          url: '../../views/find/find',
        })
      }
    },
  }
})
