import { wxParse } from '../../bower_components/wxParse/wxParse/wxParse.js'
import timeago from '../../bower_components/timeago.js/dist/timeago'
const timeagoInstance = timeago()

Page({
  data: {
    topic: null,
  },
  onLoad(options) {
    wx.request({
      url: `https://cnodejs.org/api/v1/topic/${options.id}`,
      success: (res) => {
        this.setData({
          topic: res.data.data,
          create_at: timeagoInstance.format(res.data.data.create_at, 'zh_CN'),
          reply_create_at: res.data.data.replies.map(reply => {
            return timeagoInstance.format(reply.create_at)
          })
        })
        // Render HTML
        wxParse('content', 'html', res.data.data.content, this, 5)
        res.data.data.replies.forEach((reply, i) => {
          wxParse(`replies[${i}]`, 'html', reply.content, this, 5)
        })
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
})
