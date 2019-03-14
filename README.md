# vue-desktop-app

> An electron-vue project（window系统）

#### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn dev

# build electron application for production
yarn build

```

---

#### 跳坑过程

##### 全屏方案主要通过`electron`配置api`BrowserWindow`参数实现
```js
mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    kiosk: true, // kiosk模式
    closable: false, // 不可关闭
    frame: false, // 设置无边框
    webPreferences: {
      devTools: true // 是否F12开启调试模式
    }
  })
```
##### 开机自动启动原理是通过打包时添加注册表到window上
```js
var WinReg = require('winreg')
var startOnBoot = {
  enableAutoStart: function (name, file, callback) {
    var key = getKey()
    key.set(name, WinReg.REG_SZ, file, callback || noop)
  },
  disableAutoStart: function (name, callback) {
    var key = getKey()
    key.remove(name, callback || noop)
  },
  getAutoStartValue: function (name, callback) {
    var key = getKey()
    key.get(name, function (error, result) {
      if (result) {
        callback(null, result.value)
      } else {
        callback(error)
      }
    })
  }
}

var RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'

function getKey() {
  return new WinReg({
    hive: WinReg.HKCU, // CurrentUser,
    key: RUN_LOCATION
  })
}

function noop() {}
```

##### 检测更新是通过`electron-updater`，具体代码看demo，需要注意的点是：
- 为`package.json`添加
```json
"build": {
    "publish": {
      "provider": "generic",
      "url": "http://****/download/" // 放置更新包的地址
    },
}
```
- 修改`package.json`的`version`号
- 最好保持`electron`、`electron-updater`为同一版本，demo都采用`4.0.8`版本
- 将打包好的文件放置到文件服务器![20190314103834.png](https://i.loli.net/2019/03/14/5c89beaaa8dbf.png)


This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
