import { formatTime } from '../../utils'

Page({
  data: {},
  onLoad(options) {
    const app = getApp()
    const { loginname } = app.globalData
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    })
    wx.requestCNode({
      url: `/user/${loginname}`,
      success: (res) => {
        const json = res.data.data
        this.setData({
          user: json,
          time: formatTime(json.create_at)
        })
        wx.hideToast()
      }
    })
  }
})
