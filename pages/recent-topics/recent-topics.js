Page({
  data: {},
  onLoad(options) {
    const app = getApp()
    this.setData({
      topics: app.globalData.recent_topics
    })
  },
})
