const app = getApp()

Page({
  data: {
    messages: []
  },
  onReady(options) {
    const { token } = app.globalData
    if (!token) {
      wx.scanCode({
        success: (res) => {
          app.globalData.token = res.result

          wx.request({
            url: `https://cnodejs.org/api/v1/messages?accesstoken=${app.globalData.token}`,
            success: (res) => {
              const { data } = res.data
              this.setData({
                 messages: [
                   ...data.hasnot_read_messages,
                   ...data.has_read_messages,
                 ]
              })
            },
            fail(err) {
              wx.showToast({
                title: '获取消息失败'
              })
            }
          })
        },
        fail(res) {
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
