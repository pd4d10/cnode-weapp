const app = getApp()

Page({
  data: {
    unread: [],
    read: [],
  },
  onLoad(options) {
    const { token } = app.globalData
    if (!token) {
      wx.scanCode({
        success: function(res){
          app.globalData.token = res.data

          wx.request({
            url: `https://cnodejs.org/api/v1/messages?accesstoken=${token}`,
            success: (res) => {
              const { data } = res
              this.setData({
                 read: data.has_read_messages,
                 unread: data.hasnot_read_messages,
              })
            },
            fail(err) {
              wx.showToast({
                title: '获取消息失败'
              })
            }
          })
        },
        fail: function(res) {
          wx.showToast({
            title: '扫码失败，请重试'
          })
        },
        complete(res) {
          // console.log(res)
        },
      })
    }
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
