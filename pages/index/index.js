import Tab from '../../bower_components/zanui-weapp/dist/tab/index'
import {
  formatTime,
  onShareAppMessage,
  request,
  showLoadingToast,
  showUpdateSuccessToast,
} from '../../utils'

Page(
  Object.assign({}, Tab, {
    data: {
      isLoading: false,
      page: 1,
      topics: [],
      tab: {
        list: [
          {
            id: 'all',
            title: '全部',
          },
          {
            id: 'good',
            title: '精华',
          },
          {
            id: 'share',
            title: '分享',
          },
          {
            id: 'ask',
            title: '问答',
          },
          {
            id: 'job',
            title: '招聘',
          },
        ],
        selectedId: 'all',
        scroll: false,
      },
    },
    onShareAppMessage,
    getTag(topic) {
      if (topic.top) {
        return { highlight: true, text: '置顶' }
      }
      if (topic.good) {
        return { highlight: true, text: '精华' }
      }
      const tagMap = {
        share: '分享',
        ask: '问答',
        job: '招聘',
      }
      return {
        highlight: false,
        text: tagMap[topic.tab],
      }
    },
    format(topics) {
      return topics.map(topic => {
        // Get display tag
        topic.tag = this.getTag(topic)
        // Format time
        topic.time = formatTime(topic.last_reply_at)
        return topic
      })
    },
    handleZanTabChange(e) {
      // For zanui tab
      var componentId = e.componentId
      var selectedId = e.selectedId

      if (selectedId === this.data.tab.selectedId) {
        return
      }

      this.setData({
        [`${componentId}.selectedId`]: selectedId,
        isLoading: true,
      })
      showLoadingToast()
      this.requestTopics({
        success: json => {
          this.setData({
            isLoading: false,
            page: 1,
            topics: this.format(json.data),
          })
          wx.hideToast()
        },
      })
    },
    requestTopics({ page = 1, success, fail, complete }) {
      const tab = this.data.tab.selectedId
      const queryTab = tab === 'all' ? '' : `&tab=${tab}`
      request({
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
        success: json => {
          showUpdateSuccessToast()
          this.setData({
            isLoading: false,
            topics: this.format(json.data),
          })
        },
        complete() {
          wx.stopPullDownRefresh()
        },
      })
    },
    onLoad() {
      this.setData({
        isLoading: true,
      })

      this.requestTopics({
        success: json => {
          this.setData({
            isLoading: false,
            topics: this.format(json.data),
          })
        },
      })
    },
    onReachBottom() {
      if (this.data.isLoading) {
        return
      }

      this.setData({
        isLoading: true,
      })

      this.requestTopics({
        page: this.data.page + 1,
        success: json => {
          this.setData({
            isLoading: false,
            page: this.data.page + 1,
            topics: [...this.data.topics, ...this.format(json.data)],
          })
        },
      })
    },
  })
)
