import { wxParse } from '../../bower_components/wxParse/wxParse/wxParse.js'
import { formatTime } from '../../utils'

Page({
  data: {
    topic: null,
    end: true,
  },
  onLoad(options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${options.id}`,
      success: (res) => {
        const json = res.data.data
        this.setData({
          topic: json,
          create_at: formatTime(json.create_at),
          reply_create_at: json.replies.map(reply => {
            return formatTime(reply.create_at)
          }),
          replies: json.replies.slice(0, 10),
          end: json.replies.length <= 10,
        })
        // Render HTML
        wxParse('content', 'html', json.content, this, 5)
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
      ],
      end: count + 10 >= this.data.topic.replies.length,
    })
    moreReplies.forEach((reply, i) => {
      wxParse(`replies_html[${i + count}]`, 'html', reply.content, this, 5)
    })
  }
})
