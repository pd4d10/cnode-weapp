# CNode weapp

CNode weapp 是为 CNode 社区开发的微信小程序客户端。

## 安装

目前对于个人开发者，社区/论坛 类目的小程序无法通过审核，可以按照以下步骤安装体验：

### 在 PC 上体验

1. 克隆代码并安装依赖库：

  ```sh
  git clone https://github.com/pd4d10/cnode-weapp.git
  cd cnode-weapp
  bower install
  ```

2. [下载微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)，打开项目即可

### 在微信上体验

除了上述步骤之外，还需要以下额外步骤才能在微信上体验。

1. 访问[注册页面](https://mp.weixin.qq.com/wxopen/waregister?action=step1)注册一个小程序
2. 在管理后台找到 AppID（首次可能需要手动生成一个）
3. 在开发者工具中将此 AppID 与项目关联起来
4. 在开发者工具中，点击左侧“项目”，点击“预览”，代码上传成功后会弹出一个二维码，打开微信扫码即可

## License

MIT
