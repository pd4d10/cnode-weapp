import timeago from "./bower_components/timeago.js/dist/timeago";
const timeagoInstance = timeago();

export function formatTime(time) {
  return timeagoInstance.format(time, "zh_CN");
}

export function onShareAppMessage() {
  return {
    title: "CNodeJS社区",
    path: `/pages/index/index`,
  };
}

export function getToken(cb) {
  const app = getApp();

  // Has token and already checked
  if (app.globalData.token) {
    cb(app.globalData.token);
    return;
  }

  // No token, request user to scan QRCode
  wx.showModal({
    content: "在 PC 上打开 CNodeJS 论坛，点击右上角“设置”，Access Token 二维码在页面最下方",
    showCancel: false,
    confirmText: "我知道了",
    complete() {
      wx.scanCode({
        success(res) {
          const accesstoken = res.result;
          wx.requestCNode({
            url: "/accesstoken",
            method: "POST",
            data: { accesstoken },
            success(res) {
              // Invalid token
              if (!res.data.success) {
                wx.showToast({
                  title: "token 不正确"
                });
                wx.removeStorage({
                  key: "token"
                });
                return;
              }

              // Valid token, save user info
              app.globalData.token = accesstoken;
              app.globalData.loginname = res.data.loginname;
              app.globalData.avatar_url = res.data.avatar_url;
              cb(accesstoken);
              wx.setStorage({
                key: "token",
                data: accesstoken
              });
            },
            fail(res) {
              wx.showToast({
                title: res.errMsg
              });
            },
            complete(res) {
              // complete
            }
          });
        },
        fail(res) {
          wx.showToast({
            title: "扫码失败"
          });
        },
        complete(res) {
          // console.log(res)
        }
      });
    }
  });
}
