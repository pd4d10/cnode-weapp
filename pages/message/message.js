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
      this.setData({
        verified: true,
      })

      wx.requestCNode({
        url: `/messages?accesstoken=${token}`,
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
    })
  },
})
