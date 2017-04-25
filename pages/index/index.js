Page({
  data: {
    isLoading: false,
    page: 1,
    topics: []
  },
  requestTopics({ page = 1, success, fail }) {
    wx.requestCNode({
      url: `/topics?tab=all&limit=20&page=${page}`,
      success,
      fail,
    })
  },
  onPullDownRefresh() {
    // this.setData({
    //   isLoading: true,
    // })
    // requestTopics(1)
    //   .then(topics => {
    //     this.setData({
    //       isLoading: false,
    //       topics,
    //       page: 1,
    //     })
    //     wx.stopPullDownRefresh()
    //   })
  },
  onLoad() {
    const { windowHeight } = getApp().globalData

    this.setData({
      isLoading: true,
      windowHeight,
    })

    wx.showToast({
      title: '加载中',
      icon: 'loading',
    })

    this.requestTopics({
      success: (res) => {
        wx.hideToast()
        this.setData({
          isLoading: false,
          topics: res.data.data
        })
      }
    })
  },
  loadMore(e) {
    if (this.data.isLoading) {
      return
    }

    this.setData({
      isLoading: true
    })

    this.requestTopics({
      page: this.data.page + 1,
      success: (res) => {
        this.setData({
          isLoading: false,
          page: this.data.page + 1,
          topics: [
            ...this.data.topics,
            ...res.data.data,
          ]
        })
      }
    })
  },
})
