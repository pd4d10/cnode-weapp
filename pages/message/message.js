import { getToken, request, showUpdateSuccessToast } from "../../utils";

Page({
  data: {
    messages: [],
    verified: false
  },
  onReady(options) {
    this.getMessage()
  },
  onPullDownRefresh() {
    this.getMessage(true)
  },
  getMessage(isRefresh = false) {
    getToken(token => {
      this.setData({
        verified: true
      });

      request({
        url: `/messages?accesstoken=${token}`,
        success: res => {
          const { data } = res.data;
          this.setData({
            messages: [...data.hasnot_read_messages, ...data.has_read_messages]
          });
          if (isRefresh) {
            showUpdateSuccessToast()
          }
        },
        complete() {
          wx.stopPullDownRefresh()
        }
      });
    });
  },
});
