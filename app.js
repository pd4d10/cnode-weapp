const PREFIX = 'https://cnodejs.org/api/v1'

// Simple wrapper for request
wx.requestCNode = (options) => {
    options.url = `${PREFIX}${options.url}`
    return wx.request(options)
}

App({
    globalData: {},
    onLaunch() {
        this.checkToken()
        this.saveWindowHeight()
    },
    checkToken() {
        // Try to get token from storage
        wx.getStorage({
            key: 'token',
            success: res => {
                const accesstoken = res.data
                // Check if token is valid
                wx.requestCNode({
                    url: '/accesstoken',
                    method: 'POST',
                    data: { accesstoken },
                    success: (res) => {
                        // Valid token, save user info
                        this.globalData.token = accesstoken
                        this.globalData.loginname = res.data.loginname
                        this.globalData.avatar_url = res.data.avatar_url
                    },
                    fail: res => {
                        // Invalid token, delete it from storage
                        wx.removeStorage({
                            key: 'token'
                        })
                    }
                })
            },
            fail: res => {
                // No token in storage, do nothing
            }
        })
    },
    saveWindowHeight() {
        // For scroll view height
        const { windowHeight } = wx.getSystemInfoSync()
        this.globalData.windowHeight = windowHeight
    },
})
