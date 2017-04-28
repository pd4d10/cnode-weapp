import { getToken, request, showUpdateSuccessToast } from '../../utils'

Page({
  data: {
    messages: [],
    verified: false,
  },
  onReady(options) {
    this.getMessage()
  },
  onPullDownRefresh() {
    this.getMessage(true)
  },
  getMessage(isRefresh = false) {
    getToken(token => {
      this.setData({
        verified: true,
      })

      request({
        url: `/messages?accesstoken=${token}`,
        success: json => {
          const { data } = json
          this.setData({
            messages: [...data.hasnot_read_messages, ...data.has_read_messages],
          })
          if (isRefresh) {
            showUpdateSuccessToast()
          }

          // Mask all messages as read
          request({
            url: '/message/mark_all',
            method: 'POST',
            data: {
              accesstoken: token,
            },
          })
        },
        complete() {
          wx.stopPullDownRefresh()
        },
      })
    })
  },
})
