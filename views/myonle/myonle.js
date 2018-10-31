// myonle/myonle.js
//生成的组件实例可以在组件的方法、生命周期函数和属性 observer 中通过 this 访问。组件包含一些通用属性和方法。
// 注意：在 properties 定义段中，属性名采用驼峰写法（propertyName）；在 wxml 中，指定属性值时则对应使用连字符写法（component - tag - name property- name="attr value"），应用于数据绑定时采用驼峰写法（attr = "{{propertyName}}"）。
Component({
  /**
   * 组件的属性列表
   */
  relations: {
    './custom-li': {
      type: 'child', // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
      },
      linkChanged: function (target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean,          Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），         也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String // 简化的定义方式
  },

  /**
   * 组件的初始数据
   */
  data: {
// 私有数据，可用于模版渲染
    line:'',
    upline:''
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { },// 组件生命周期函数，在组件实例进入页面节点树时执行
  moved: function () { },//组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  ready: function () { },//组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
  detached: function () { },//组件生命周期函数，在组件实例被从页面节点树移除时执行
  /**
   * 组件的方法列表
   */
  methods: {
    onMyButtonTap: function () {
      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
      })
    },
    _myPrivateMethod: function () {
      // 内部方法建议以下划线开头
      this.replaceDataOnPath(['A', 0, 'B'], 'myPrivateData') // 这里将 data.A[0].B 设为 'myPrivateData'
      this.applyDataUpdates()
    },
    getLoca: function (newVal, oldVal) {
      let that=this
      wx.showActionSheet({
        itemList: ['A', 'B', 'C'],
        success: function (res) {
          console.log(res.tapIndex)
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          that.setData({
            line: longitude,
            upline: latitude
          })
        }
      })
    }
  }
})
