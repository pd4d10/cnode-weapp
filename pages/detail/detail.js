import { wxParse } from "../../bower_components/wxParse/wxParse/wxParse.js";
import {
  formatTime,
  getToken,
  request,
  showSuccessToast,
  showFailToast
} from "../../utils";

Page({
  data: {
    topic: undefined,
    end: true,
    isDialogVisible: false,
    replyId: undefined,
    replyContent: "",
    isSubmitting: false
  },
  onLoad(options) {
    wx.showNavigationBarLoading();
    this.fetchTopic(options.id);
  },
  fetchTopic(id) {
    const app = getApp();
    const { token } = app.globalData;
    const query = token ? `?accesstoken=${token}` : "";

    request({
      url: `/topic/${id}${query}`,
      success: json => {
        const { data } = json;
        wx.setNavigationBarTitle({
          title: data.title
        });
        this.setData({
          topic: data,
          create_at: formatTime(data.create_at),
          reply_create_at: data.replies.map(reply => {
            return formatTime(reply.create_at);
          }),
          replies: data.replies.slice(0, 10),
          end: data.replies.length <= 10
        });
        // Render HTML
        wxParse("content", "html", data.content, this, 20);
        this.data.replies.forEach((reply, i) => {
          wxParse(`replies_html[${i}]`, "html", reply.content, this, 20);
        });
        wx.hideNavigationBarLoading();
      }
    });
  },
  onReachBottom() {
    const count = this.data.replies.length;
    const moreReplies = this.data.topic.replies.slice(count, count + 10);
    this.setData({
      replies: [...this.data.replies, ...moreReplies],
      end: count + 10 >= this.data.topic.replies.length
    });
    moreReplies.forEach((reply, i) => {
      wxParse(`replies_html[${i + count}]`, "html", reply.content, this, 20);
    });
  },
  onShareAppMessage() {
    return {
      title: this.data.topic.title,
      path: `/pages/detail/detail?id=${this.data.topic.id}`
    };
  },
  showDialog(e) {
    this.setData({
      isDialogVisible: true,
      // replyContent: `@${e.currentTarget.dataset.name} `,
      replyId: e.currentTarget.dataset.id,
      replyName: e.currentTarget.dataset.name
    });
  },
  hideDialog() {
    this.setData({
      isDialogVisible: false
    });
  },
  changeInput(e) {
    this.setData({
      replyContent: e.detail.value
    });
  },
  submit() {
    this.setData({
      isSubmitting: true
    });

    getToken(token => {
      const app = getApp();
      const tail = app.globalData.hasTail
        ? "\n\n来自 [CNode weapp](https://github.com/pd4d10/cnode-weapp)"
        : "";
      const replyName = this.data.replyName ? `@${this.data.replyName} ` : "";
      const content = `${replyName}${this.data.replyContent}${tail}`;

      request({
        url: `/topic/${this.data.topic.id}/replies`,
        method: "POST",
        data: {
          accesstoken: token,
          content,
          reply_id: this.data.replyId
        },
        success: res => {
          this.setData({
            isSubmitting: false,
            isDialogVisible: false
          });
          showSuccessToast("回复成功");
          if (this.data.end) {
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/detail/detail?id=${this.data.topic.id}`
              });
            }, 500);
          }
        }
      });
    });
  },
  thumb(e) {
    const { id, index } = e.currentTarget.dataset;
    getToken(token => {
      request({
        url: `/reply/${id}/ups`,
        method: "POST",
        data: {
          accesstoken: token
        },
        success: json => {
          const isUp = json.action === "up";
          const ups = this.data.replies[index].ups.slice();
          // Can't get reply id
          if (isUp) {
            ups.push("me");
          } else {
            ups.pop();
          }
          this.setData({
            [`replies[${index}].is_uped`]: isUp,
            [`replies[${index}].ups`]: ups
          });
        }
      });
    });
  },
  star(e) {
    const { id } = e.currentTarget.dataset;
    const { is_collect } = this.data.topic;
    const url = `/topic_collect/${is_collect ? "de_collect" : "collect"}`;
    getToken(token => {
      request({
        url,
        method: "POST",
        data: {
          accesstoken: token,
          topic_id: id
        },
        success: () => {
          this.setData({
            "topic.is_collect": !is_collect
          });
          showSuccessToast(is_collect ? "已取消收藏" : "已收藏");
        }
      });
    });
  }
});
