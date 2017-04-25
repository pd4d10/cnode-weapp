import Tab from '../../bower_components/zanui-weapp/dist/tab/index'

Page(Object.assign({}, Tab, {
  data: {
    isLoading: false,
    page: 1,
    topics: [],
    tab: {
      list: [
        {
          id: 'all',
          title: '全部'
        }, {
          id: 'good',
          title: '精华'
        }, {
          id: 'share',
          title: '分享'
        }, {
          id: 'ask',
          title: '问答'
        }, {
          id: 'job',
          title: '招聘'
        }
      ],
      selectedId: 'all',
      scroll: false
    }
  },
  handleZanTabChange(e) { // For zanui tab
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    if (selectedId === this.data.tab.selectedId) {
      return
    }

    this.setData({
      [`${componentId}.selectedId`]: selectedId,
      isLoading: true,
      topics: [],
    })
    this.requestTopics({
      success: res => {
        this.setData({
          isLoading: false,
          page: 1,
          topics: res.data.data
        })
      }
    })
  },
  requestTopics({ page = 1, success, fail, complete }) {
    const tab = this.data.tab.selectedId
    const queryTab = tab === 'all' ? '' : `&tab=${tab}`
    wx.requestCNode({
      url: `/topics?limit=15&page=${page}${queryTab}`,
      success,
      fail,
      complete,
    })
  },
  onPullDownRefresh() {
    this.setData({
      isLoading: true,
    })
    this.requestTopics({
      page: 1,
      success: (res) => {
        wx.showToast({
          title: '已更新'
        })
        this.setData({
          isLoading: false,
          topics: res.data.data
        })
      },
      fail() {
        wx.showToast({
          title: '刷新失败'
        })
      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
      .then(topics => {
        this.setData({
          isLoading: false,
          topics,
          page: 1,
        })
        wx.stopPullDownRefresh()
      })
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
  onReachBottom(e) {
    console.log(e)
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
}))
