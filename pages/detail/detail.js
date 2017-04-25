var WxParse = require('../../wxParse/wxParse.js')

// pages/detail/detail.js
Page({
  data: {
    topic: null,
  },
  onLoad(options) {
    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${options.id}`,
      success: (res) => {
        this.setData({
          topic: res.data.data,
        })
        WxParse.wxParse('content', 'html', res.data.data.content, this, 5)
      },
      fail: function(res) {
        wx.showToast({
          title: '错误'
        })
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
