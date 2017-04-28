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
    const app = getApp()
    const { token } = app.globalData
    const query = token ? `?accesstoken=${token}` : ''

    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${id}${query}`,
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
      // replyContent: `@${e.currentTarget.dataset.name} `,
      replyId: e.currentTarget.dataset.id,
      replyName: e.currentTarget.dataset.name,
    })
  },
  hideDialog() {
    this.setData({
      isDialogVisible: false,
    })
  },
  changeInput(e) {
    this.setData({
      replyContent: e.detail.value
    })
  },
  submit() {
    this.setData({
      isSubmitting: true,
    })

    getToken(token => {
      const tail = '\n\n来自 [CNode weapp](https://github.com/pd4d10/cnode-weapp)'
      const app = getApp()
      const content = `@${this.data.replyName} ${this.data.replyContent} ${app.globalData.hasTail ? tail : ''}`
      console.log(content)

      wx.requestCNode({
        url: `/topic/${this.data.topic.id}/replies`,
        method: 'POST',
        data: {
          accesstoken: token,
          content,
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
                url: `/pages/detail/detail?id=${this.data.topic.id}`,
              })
            }, 500)
          }
        // }, 2000)
        }
      })
    })
  },
  thumb(e) {
    const { id, index } = e.currentTarget.dataset
    getToken(token => {
      wx.requestCNode({
        url: `/reply/${id}/ups`,
        method: 'POST',
        data: {
          accesstoken: token,
        },
        success: res => {
          const json = res.data
          if (!json.success) {
            wx.showToast({
              title: json.error_msg
            })
            return
          }

          const isUp = json.action === 'up'
          const ups = this.data.replies[index].ups.slice()
          // Can't get reply id
          if (isUp) {
            ups.push('me')
          } else {
            ups.pop()
          }
          this.setData({
            [`replies[${index}].is_uped`]: isUp,
            [`replies[${index}].ups`]: ups,
          })
        }
      })
    })
  },
  star(e) {
    const { id } = e.currentTarget.dataset
    const { is_collect } = this.data.topic
    const url = `/topic_collect/${is_collect ? 'de_collect' : 'collect'}`
    getToken(token => {
      wx.requestCNode({
        url,
        method: 'POST',
        data: {
          accesstoken: token,
          topic_id: id,
        },
        success: res => {
          const json = res.data
          if (!json.success) {
            wx.showToast({
              title: json.error_msg
            })
            return
          }
          this.setData({
            'topic.is_collect': !is_collect
          })
        }
      })
    })
  }
})
