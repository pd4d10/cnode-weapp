import { wxParse } from '../../bower_components/wxParse/wxParse/wxParse.js'
import { formatTime, getToken } from '../../utils'

Page({
  data: {
    topic: undefined,
    end: true,
    isDialogVisible: false,
    replyId: undefined,
    replyContent: '',
    isSubmitting: false,
  },
  onLoad(options) {
    wx.showNavigationBarLoading()
    this.fetchTopic(options.id)
  },
  fetchTopic(id) {
    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${id}`,
      success: (res) => {
        const json = res.data.data
        wx.setNavigationBarTitle({
          title: json.title,
        })
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
        wxParse('content', 'html', json.content, this, 20)
        this.data.replies.forEach((reply, i) => {
          wxParse(`replies_html[${i}]`, 'html', reply.content, this, 20)
        })
        wx.hideNavigationBarLoading()
      },
      fail(res) {
        wx.showToast({
          title: '加载失败'
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
      wxParse(`replies_html[${i + count}]`, 'html', reply.content, this, 20)
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.topic.title,
      path: `/pages/detail/detail?id=${this.data.topic.id}`,
    }
  },
  showDialog(e) {
    this.setData({
      isDialogVisible: true,
      replyContent: `@${e.target.dataset.name} `,
      replyId: e.target.dataset.id,
    })
  },
  hideDialog() {
    this.setData({
      isDialogVisible: false,
    })
  },
  submit() {
    this.setData({
      isSubmitting: true,
    })

    getToken(token => {
      const tail = '\n来自 [CNodeJS 小程序](https://github.com/pd4d10/cnode-weapp)'
      const app = getApp()
      const content = this.data.replyContent + (app.globalData.hasTail ? tail : '')

      wx.requestCNode({
        url: `/topic/${this.topic.id}/replies`,
        method: 'POST',
        data: {
          accesstoken: token,
          content: this.data.replyContent,
          reply_id: this.data.replyId,
        },
        success: res => {
        // setTimeout(() => {
          this.setData({
            isSubmitting: false,
            isDialogVisible: false,
          })
          wx.showToast({
            title: '回复成功',
          })
          if (this.data.end) {
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/detail/detail?id=${this.topic.id}`,
              })
            }, 500)
          }
        // }, 2000)
        }
      })
    })
  }
})
