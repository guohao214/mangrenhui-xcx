module.exports = function (app) {
	return new Promise((resolve, reject) => {
		const authorize =  app.getSessionId()

		wx.chooseImage({
			count: 1,
			success: function (res) {
				console.log(res)

				setTimeout(() => {
					wx.showLoading({
						title: '上传中...',
					})
				}, 0)

				wx.uploadFile({
					url: `${app.globalData.baseUrl }upload/up`,
					header: {
            token: authorize,
            "x-xcx": "xcx",
					},
					filePath: res.tempFilePaths[0],
					name: 'file',
					success(res) {
						wx.hideLoading({
							complete: (res) => {},
						})
						resolve(JSON.parse(res.data));
					},
					fail(err) {
						wx.hideLoading({
							complete: (res) => {},
						})
						reject(err)
					}
				})
			}
		})
	})
}