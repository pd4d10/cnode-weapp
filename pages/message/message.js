import { getToken } from '../../utils'

Page({
  data: {
    messages: [],
    verified: false,
  },
  onReady(options) {
    this.login()
  },
  login() {
    getToken((token) => {
      wx.requestCNode({
        url: `/messages?accesstoken=${token}`,
        success: (res) => {
          const { data } = res.data
          this.setData({
            verified: true,
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
    })
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
