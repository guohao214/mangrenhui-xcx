Component({
  data: {
    selected: 0,
    color: "#8a8a8a",
    selectedColor: "#E03B58",
    borderStyle: "black",
    backgroundColor: "#ffffff",
    list: [
        {
        pagePath: "pages/article/index",
        iconPath: "common/assets/tab/01.png",
        selectedIconPath: "common/assets/tab/011.png",
        text: "商品订阅"
      },
        {
        pagePath: "pages/appointment/index",
        iconPath: "common/assets/tab/02.png",
        selectedIconPath: "common/assets/tab/021.png",
        text: "预约"
      },
 
      {
        pagePath: "pages/pay/index",
        iconPath: "common/assets/tab/03.png",
        selectedIconPath: "common/assets/tab/031.png",
        text: "买单"
      },
      {
        pagePath: "pages/center/index",
        iconPath: "common/assets/tab/04.png",
        selectedIconPath: "common/assets/tab/041.png",
        text: "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})