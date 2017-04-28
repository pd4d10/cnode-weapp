import timeago from "./bower_components/timeago.js/dist/timeago";
const timeagoInstance = timeago();
const URL_PREFIX = "https://cnodejs.org/api/v1";

// Simple wrapper for request
export function request(options) {
  options.url = `${URL_PREFIX}${options.url}`;
  return wx.request(options);
}

export function formatTime(time) {
  return timeagoInstance.format(time, "zh_CN");
}

export function onShareAppMessage() {
  return {
    title: "CNodeJS社区",
    path: `/pages/index/index`,
  };
}

// Try to get access token
// If token already exists, use it
// If no token, call QRCode scan to get token
export function getToken(cb) {
  const app = getApp();

  // Has token and already checked
  if (app.globalData.token) {
    cb(app.globalData.token);
    return;
  }

  // No token, request user to scan QRCode
  wx.showModal({
    content: "请先在 PC 版 CNodeJS 社区登录，Access Token 的二维码位于“设置”页面左下角",
    showCancel: false,
    confirmText: "我知道了",
    complete() {
      wx.scanCode({
        success(res) {
          const accesstoken = res.result;
          request({
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
