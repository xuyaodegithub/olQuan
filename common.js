//公共方法js//模块化
//可以将一些公共的代码抽离成为一个单独的 js 文件，作为一个模块。模块只有通过 module.exports 或者 exports 才能对外暴露接口。
//在需要使用这些模块的文件中，使用 require(path) 将公共代码引入:var a=require(path) require 暂时不支持绝对路径

function mothod1(data) {
  wx.request({
    url: data.url,
    data: data.data,
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: 'POST',
    success: function (res) {
      if(res.data.code=0){
        data.thisData=res.data
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'fail',
          duration: 2000
        });
      }
    }
  })
}
function mothod2() {
  console.log(2)
}
function mothod3() {
  console.log(3)
}
function mothod4() {
  console.log(4)
}

module.exports.methods={
  "mothod1": mothod1,
  "mothod2": mothod2,
  "mothod3": mothod3,
  "mothod4": mothod4
}