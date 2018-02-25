import timeago from './bower_components/timeago.js/dist/timeago'
const timeagoInstance = timeago()
const URL_PREFIX = 'https://cnodejs.org/api/v1'

// Simple wrapper for request
export function request(options) {
  wx.request(
    Object.assign({}, options, {
      // Add prefix to URL
      url: `${URL_PREFIX}${options.url}`,
      success(res) {
        const json = res.data
        // If return success: false, show error message and exit
        if (!json.success) {
          showErrorToast(json.error_msg)
          // Add extra handler
          if (options.errorExtraHandle) {
            options.errorExtraHandle(res)
          }
          return
        }
        if (options.success) {
          options.success(json)
        }
      },
      fail(res) {
        showErrorToast(res.errMsg)
        if (options.fail) {
          options.fail(res)
        }
      },
    })
  )
}

export function formatTime(time) {
  return timeagoInstance.format(time, 'zh_CN')
}

// Toasts
export function showLoadingToast(title = '加载中') {
  wx.showToast({
    title,
    icon: 'loading',
    mask: true,
    duration: 10000,
  })
}

export function showSuccessToast(title = '加载成功') {
  wx.showToast({ title })
}

export function showUpdateSuccessToast(title = '已更新') {
  wx.showToast({ title })
}

function showErrorToast(title = '操作失败') {
  wx.showToast({
    title,
    image: '/icons/error.svg',
  })
}

export function showMessageToast(title = '有新消息') {
  wx.showToast({
    title,
    image: '/icons/new-message.svg',
  })
}

export function onShareAppMessage() {
  return {
    title: 'CNodeJS社区',
    path: `/pages/index/index`,
  }
}

// Try to get access token
// If token already exists, use it
// If no token, call QRCode scan to get token
export function getToken(cb) {
  const app = getApp()

  // Has token and already checked
  if (app.globalData.token) {
    cb(app.globalData.token)
    return
  }

  // No token, request user to scan QRCode
  wx.showModal({
    content:
      '请先在 PC 版 CNodeJS 社区登录，Access Token 的二维码位于“设置”页面左下角',
    showCancel: false,
    confirmText: '我知道了',
    complete() {
      wx.scanCode({
        success(res) {
          const accesstoken = res.result
          request({
            url: '/accesstoken',
            method: 'POST',
            data: { accesstoken },
            success(json) {
              // Valid token, save user info
              app.globalData.token = accesstoken
              app.globalData.loginname = json.loginname
              app.globalData.avatar_url = json.avatar_url
              cb(accesstoken)
              wx.setStorage({
                key: 'token',
                data: accesstoken,
              })
            },
            errorExtraHandle(res) {
              // Invalid token
              wx.removeStorage({
                key: 'token',
              })
            },
          })
        },
        fail(res) {
          showErrorToast('扫码失败')
        },
      })
    },
  })
}
