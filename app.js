import { request, showMessageToast } from './utils'

// Storage keys
// token - access token
// hasTail - 发贴小尾巴
// messagePushEnabled - 是否开启消息推送

App({
  globalData: {},
  onLaunch() {
    this.checkToken()
    this.loadSettings()

    const fetchMessagePeriodically = () => {
      this.fetchMessage()
      setTimeout(fetchMessagePeriodically, 60 * 1000)
    }
    fetchMessagePeriodically()
  },
  loadSettings() {
    wx.getStorage({
      key: 'hasTail',
      success: res => {
        this.globalData.hasTail = res.data
      },
      fail: () => {
        this.globalData.hasTail = true
        wx.setStorage({
          key: 'hasTail',
          data: true,
        })
      },
    })
    wx.getStorage({
      key: 'messagePushEnabled',
      success: res => {
        this.globalData.messagePushEnabled = res.data
      },
      fail: () => {
        this.globalData.messagePushEnabled = true
        wx.setStorage({
          key: 'messagePushEnabled',
          data: true,
        })
      },
    })
  },
  checkToken() {
    // Try to get token from storage
    wx.getStorage({
      key: 'token',
      success: res => {
        const accesstoken = res.data
        // Check if token is valid
        request({
          url: '/accesstoken',
          method: 'POST',
          data: { accesstoken },
          success: json => {
            // Valid token, save user info
            this.globalData.token = accesstoken
            this.globalData.loginname = json.loginname
          },
          errorExtraHandle(res) {
            // Invalid token
            wx.removeStorage({
              key: 'token',
            })
          },
        })
      },
      fail: res => {
        // No token in storage, do nothing
      },
    })
  },
  fetchMessage(cb = () => {}) {
    // Send request only if token exsists and message push is enabled
    const { token, messagePushEnabled } = this.globalData
    if (!(token && messagePushEnabled)) {
      cb()
      return
    }

    request({
      url: `/message/count?accesstoken=${token}`,
      success: json => {
        if (json.data > 0) {
          showMessageToast()
        }
        cb()
      },
    })
  },
})
