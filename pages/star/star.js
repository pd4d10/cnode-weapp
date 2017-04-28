import { request } from '../../utils'

Page({
  data: {},
  onLoad(options) {
    const app = getApp()
    const { loginname } = app.globalData
    request({
      url: `/topic_collect/${loginname}`,
      success: json => {
        this.setData({
          topics: json.data,
        })
      },
    })
  },
})
