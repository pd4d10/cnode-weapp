Page({
  data: {},
  onLoad(options) {
    const app = getApp()
    const { loginname } = app.globalData
    wx.requestCNode({
      url: `/topic_collect/${loginname}`,
      success: res => {
        const json = res.data
        this.setData({
          topics: json.data,
        })
      }
    })
  },
})
