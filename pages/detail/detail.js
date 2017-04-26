import { wxParse } from '../../bower_components/wxParse/wxParse/wxParse.js'
import timeago from '../../bower_components/timeago.js/dist/timeago'
const timeagoInstance = timeago()

Page({
  data: {
    topic: null,
  },
  onLoad(options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${options.id}`,
      success: (res) => {
        this.setData({
          topic: res.data.data,
          create_at: timeagoInstance.format(res.data.data.create_at, 'zh_CN'),
          reply_create_at: res.data.data.replies.map(reply => {
            return timeagoInstance.format(reply.create_at)
          }),
          replies: res.data.data.replies.slice(0, 10),
        })
        // Render HTML
        wxParse('content', 'html', res.data.data.content, this, 5)
        this.data.replies.forEach((reply, i) => {
          wxParse(`replies_html[${i}]`, 'html', reply.content, this, 5)
        })
        wx.hideToast()
      },
      fail(res) {
        wx.showToast({
          title: '错误'
        })
      },
      complete(res) {
        // complete
      }
    })
  },
  onReachBottom() {
    const count = this.data.replies.length
    const moreReplies = this.data.topic.replies.slice(count, count + 10)
    this.setData({
      replies: [
        ...this.data.replies,
        ...moreReplies
      ]
    })
    moreReplies.forEach((reply, i) => {
      wxParse(`replies_html[${i + count}]`, 'html', reply.content, this, 5)
    })
  }
})
