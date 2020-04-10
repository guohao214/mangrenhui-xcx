'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
wx.message = function (message) {
  wx.showToast({
    title: message || '发生错误了',
    icon: 'none',
    duration: 1500
  });
};

wx.onNetworkStatusChange(function (res) {
  var status = res.isConnected;
  if (!status) {
    wx.message('网络连接失败，请检查网络...');
  }
});

wx.callTel = function (telephone) {
  wx.makePhoneCall({
    phoneNumber: telephone
  });
};

wx.copyText = function (data) {
  wx.setClipboardData({
    data: data,
    success: function success(res) {
      wx.getClipboardData({
        success: function success(res) {
          wx.message('复制成功');
        }
      });
    }
  });
};

exports.default = App({
  globalData: {
    baseUrl: "https://api.mangrenhui.cn/",
    // baseUrl: "http://127.0.0.1:8080/",
    userInfo: {},
    noPhone: true
  },

  setSessionId: function setSessionId(sid) {
    return wx.setStorageSync("session_id", sid);
  },
  getSessionId: function getSessionId() {
    return wx.getStorageSync("session_id");
  },
  setUserInfo: function setUserInfo(user) {
    this.globalData.userInfo = user;
    return wx.setStorageSync("user_info", user);
  },
  getUserInfo: function getUserInfo() {
    var user = wx.getStorageSync("user_info");
    this.globalData.userInfo = user;

    return user;
  },
  toLogin: function toLogin() {
    wx.navigateTo({
      url: '/pages/bind/index'
    });
  },
  goLogin: function goLogin() {
    var self = this;
    if (self.goLogin.show) return;

    var authorize = self.getSessionId();
    var noPhone = this.globalData.userInfo.noPhone;
    if (authorize && !noPhone) return true;

    if (!authorize || noPhone) {
      self.goLogin.show = true;
      // loginTool.setGoLogin()
      var message = '您还未登录，是否登录？';

      wx.showModal({
        content: message,
        success: function success(e) {
          if (e.confirm) {
            self.toLogin();
          } else {
            var pages = getCurrentPages();
            console.log(pages.length);
            if (pages.length >= 2) {
              wx.navigateBack({
                delta: 2,
                complete: function complete(res) {}
              });
            } else {
              wx.switchTab({
                url: '/pages/appointment/index'
              });
            }
          }
        },
        complete: function complete(e) {
          self.goLogin.show = false;
        }
      });
    }
  },


  login: function login() {
    var self = this;
    return new Promise(function (res, rej) {
      wx.login({
        success: function success(data) {
          self.get("xcxLogin/authorize", { code: data.code }).then(function (data) {
            self.setSessionId(data.data.session_id);
            res(data.data);
          }).catch(function (e) {
            return rej(e);
          });
        },
        fail: function fail(e) {
          rej(e);
        }
      });
    });
  },
  onLaunch: function onLaunch() {
    // this.login();
  },
  onShow: function onShow() {},
  onHide: function onHide() {},

  request: function request(method, url, data) {
    var _this = this;

    var showLoading = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var self = this;
    return new Promise(function (res, rej) {
      if (showLoading) wx.showLoading({
        title: "加载中..."
      });

      wx.request({
        method: method,
        header: {
          "x-requested-with": "xmlhttprequest",
          "Content-Type": "application/x-www-form-urlencoded",
          "x-xcx": "xcx",
          token: wx.getStorageSync("session_id")
        },
        url: _this.globalData.baseUrl + url,
        data: data,
        success: function success(result) {
          var data = result.data;
          if (data.status == 1) res(result.data);else if (data.status == -999) {
            // 跳转到绑定页
            self.goLogin();
          } else {
            rej(data);
          }
        },
        fail: function fail(error) {
          return rej(error);
        },
        complete: function complete() {
          setTimeout(function () {
            return wx.hideLoading();
          }, 500);
        }
      });
    });
  },
  get: function get(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var showLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    return this.request("GET", url, data, showLoading);
  },
  post: function post(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var showLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    return this.request("POST", url, data, showLoading);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC53eGEiXSwibmFtZXMiOlsid3giLCJtZXNzYWdlIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJvbk5ldHdvcmtTdGF0dXNDaGFuZ2UiLCJyZXMiLCJzdGF0dXMiLCJpc0Nvbm5lY3RlZCIsImNhbGxUZWwiLCJ0ZWxlcGhvbmUiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJjb3B5VGV4dCIsImRhdGEiLCJzZXRDbGlwYm9hcmREYXRhIiwic3VjY2VzcyIsImdldENsaXBib2FyZERhdGEiLCJnbG9iYWxEYXRhIiwiYmFzZVVybCIsInVzZXJJbmZvIiwibm9QaG9uZSIsInNldFNlc3Npb25JZCIsInNpZCIsInNldFN0b3JhZ2VTeW5jIiwiZ2V0U2Vzc2lvbklkIiwiZ2V0U3RvcmFnZVN5bmMiLCJzZXRVc2VySW5mbyIsInVzZXIiLCJnZXRVc2VySW5mbyIsInRvTG9naW4iLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZ29Mb2dpbiIsInNlbGYiLCJzaG93IiwiYXV0aG9yaXplIiwic2hvd01vZGFsIiwiY29udGVudCIsImUiLCJjb25maXJtIiwicGFnZXMiLCJnZXRDdXJyZW50UGFnZXMiLCJjb25zb2xlIiwibG9nIiwibGVuZ3RoIiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJjb21wbGV0ZSIsInN3aXRjaFRhYiIsImxvZ2luIiwiUHJvbWlzZSIsInJlaiIsImdldCIsImNvZGUiLCJ0aGVuIiwic2Vzc2lvbl9pZCIsImNhdGNoIiwiZmFpbCIsIm9uTGF1bmNoIiwib25TaG93Iiwib25IaWRlIiwicmVxdWVzdCIsIm1ldGhvZCIsInNob3dMb2FkaW5nIiwiaGVhZGVyIiwidG9rZW4iLCJyZXN1bHQiLCJlcnJvciIsInNldFRpbWVvdXQiLCJoaWRlTG9hZGluZyIsInBvc3QiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUFBLEdBQUdDLE9BQUgsR0FBYSxVQUFVQSxPQUFWLEVBQW1CO0FBQzVCRCxLQUFHRSxTQUFILENBQWE7QUFD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QUFPLEtBQUtGLE9BQUwsQ0FBYSxNQUFiLEVBQXFCOUIsR0FBckIsRUFBMEJsQixJQUExQixFQUFnQ2tELFdBQWhDLENBQVA7QUFDRCIsImZpbGUiOiJhcHAud3hhIiwic291cmNlc0NvbnRlbnQiOlsid3gubWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgIHRpdGxlOiBtZXNzYWdlIHx8ICflj5HnlJ/plJnor6/kuoYnLFxuICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgZHVyYXRpb246IDE1MDBcbiAgICB9KVxuICB9XG5cbiAgd3gub25OZXR3b3JrU3RhdHVzQ2hhbmdlKGZ1bmN0aW9uIChyZXMpIHtcbiAgICBjb25zdCBzdGF0dXMgPSByZXMuaXNDb25uZWN0ZWRcbiAgICBpZiAoIXN0YXR1cykge1xuICAgICAgd3gubWVzc2FnZSgn572R57uc6L+e5o6l5aSx6LSl77yM6K+35qOA5p+l572R57ucLi4uJylcbiAgICB9XG4gIH0pXG5cbiAgd3guY2FsbFRlbCA9IGZ1bmN0aW9uICh0ZWxlcGhvbmUpIHtcbiAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgIHBob25lTnVtYmVyOiB0ZWxlcGhvbmUsXG4gICAgfSlcbiAgfVxuXG4gIHd4LmNvcHlUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB3eC5zZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHd4LmdldENsaXBib2FyZERhdGEoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHd4Lm1lc3NhZ2UoJ+WkjeWItuaIkOWKnycpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHBlcm1pc3Npb246IHtcbiAgICAgIC8vIFwic2NvcGUudXNlckluZm9cIjoge1xuICAgICAgLy8gICBkZXNjOiBcIuiOt+WPluaCqOeahOWfuuacrOS/oeaBr1wiXG4gICAgICAvLyB9LFxuICAgICAgXCJzY29wZS51c2VyTG9jYXRpb25cIjoge1xuICAgICAgICBkZXNjOiBcIuS9oOeahOS9jee9ruS/oeaBr+WwhueUqOS6juiuoeeul+S4jumXqOW6l+eahOi3neemu1wiXG4gICAgICB9XG4gICAgfSxcbiAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgIFwibGF5b3V0LWhlYWRcIjogXCJsYXlvdXQvaGVhZFwiXG4gICAgICAvLyAnbGF5b3V0LWZvb3QnOiAnbGF5b3V0L2Zvb3QnXG4gICAgfSxcbiAgICBwYWdlczogW10sXG4gICAgd2luZG93OiB7XG4gICAgICBiYWNrZ3JvdW5kVGV4dFN0eWxlOiBcImRhcmtcIixcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjMDAwMDAwXCIsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi54yr55qE5LiW55WMXCIsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiBcImJsYWNrXCJcbiAgICB9LFxuICAgIHRhYkJhcjoge1xuICAgICAgY29sb3I6IFwiIzhhOGE4YVwiLFxuICAgICAgc2VsZWN0ZWRDb2xvcjogXCIjMDAwMDAwXCIsXG4gICAgICBib3JkZXJTdHlsZTogXCJibGFja1wiLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAgIGxpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL2FydGljbGUvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMi5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAyMS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIuWTgeeJjFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9hcHBvaW50bWVudC9pbmRleFwiLFxuICAgICAgICAgIGljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAzLnBuZ1wiLFxuICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDMxLnBuZ1wiLFxuICAgICAgICAgIHRleHQ6IFwi6aKE57qmXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL3BheS9pbmRleFwiLFxuICAgICAgICAgIGljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAxLnBuZ1wiLFxuICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDExLnBuZ1wiLFxuICAgICAgICAgIHRleHQ6IFwi5Lmw5Y2VXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL2NlbnRlci9pbmRleFwiLFxuICAgICAgICAgIGljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzA0LnBuZ1wiLFxuICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDQxLnBuZ1wiLFxuICAgICAgICAgIHRleHQ6IFwi5oiR55qEXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAgbmV0d29ya1RpbWVvdXQ6IHtcbiAgICAgIHJlcXVlc3Q6IDEwMDAwXG4gICAgfVxuICB9LFxuICBnbG9iYWxEYXRhOiB7XG4gICAgYmFzZVVybDogXCJodHRwczovL2FwaS5tYW5ncmVuaHVpLmNuL1wiLFxuICAgIC8vIGJhc2VVcmw6IFwiaHR0cDovLzEyNy4wLjAuMTo4MDgwL1wiLFxuICAgIHVzZXJJbmZvOiB7fSxcbiAgICBub1Bob25lOiB0cnVlLFxuICB9LFxuXG4gIHNldFNlc3Npb25JZChzaWQpIHtcbiAgICByZXR1cm4gd3guc2V0U3RvcmFnZVN5bmMoXCJzZXNzaW9uX2lkXCIsIHNpZCk7XG4gIH0sXG5cbiAgZ2V0U2Vzc2lvbklkKCkge1xuICAgIHJldHVybiB3eC5nZXRTdG9yYWdlU3luYyhcInNlc3Npb25faWRcIik7XG4gIH0sXG5cbiAgc2V0VXNlckluZm8odXNlcikge1xuICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHVzZXJcbiAgICByZXR1cm4gd3guc2V0U3RvcmFnZVN5bmMoXCJ1c2VyX2luZm9cIiwgdXNlcik7XG4gIH0sXG5cbiAgZ2V0VXNlckluZm8oKSB7XG4gICAgY29uc3QgdXNlciA9IHd4LmdldFN0b3JhZ2VTeW5jKFwidXNlcl9pbmZvXCIpO1xuICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHVzZXJcblxuICAgIHJldHVybiB1c2VyXG4gIH0sXG5cbiAgdG9Mb2dpbigpIHtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIHVybDogJy9wYWdlcy9iaW5kL2luZGV4JyxcbiAgICB9KVxuXG4gIH0sXG5cbiAgZ29Mb2dpbigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIGlmIChzZWxmLmdvTG9naW4uc2hvdylcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgYXV0aG9yaXplID0gc2VsZi5nZXRTZXNzaW9uSWQoKVxuICAgIGNvbnN0IG5vUGhvbmUgPSB0aGlzLmdsb2JhbERhdGEudXNlckluZm8ubm9QaG9uZVxuICAgIGlmIChhdXRob3JpemUgJiYgIW5vUGhvbmUpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgaWYgKCFhdXRob3JpemUgfHwgbm9QaG9uZSkge1xuICAgICAgc2VsZi5nb0xvZ2luLnNob3cgPSB0cnVlXG4gICAgICAvLyBsb2dpblRvb2wuc2V0R29Mb2dpbigpXG4gICAgICBsZXQgbWVzc2FnZSA9ICfmgqjov5jmnKrnmbvlvZXvvIzmmK/lkKbnmbvlvZXvvJ8nXG5cbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIGNvbnRlbnQ6IG1lc3NhZ2UsXG4gICAgICAgIHN1Y2Nlc3MoZSkge1xuICAgICAgICAgIGlmIChlLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIHNlbGYudG9Mb2dpbigpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzID0gZ2V0Q3VycmVudFBhZ2VzKClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBhZ2VzLmxlbmd0aClcbiAgICAgICAgICAgIGlmIChwYWdlcy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgICAgIGRlbHRhOiAyLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAocmVzKSA9PiB7fSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2FwcG9pbnRtZW50L2luZGV4JyxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlKGUpIHtcbiAgICAgICAgICBzZWxmLmdvTG9naW4uc2hvdyA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIGxvZ2luOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgd3gubG9naW4oe1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgc2VsZi5nZXQoXCJ4Y3hMb2dpbi9hdXRob3JpemVcIiwgeyBjb2RlOiBkYXRhLmNvZGUgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIHNlbGYuc2V0U2Vzc2lvbklkKGRhdGEuZGF0YS5zZXNzaW9uX2lkKVxuICAgICAgICAgICAgcmVzKGRhdGEuZGF0YSlcbiAgICAgICAgICB9KS5jYXRjaChlID0+IHJlaihlKSlcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHJlaihlKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KVxuICAgXG4gIH0sXG4gIG9uTGF1bmNoKCkge1xuICAgIC8vIHRoaXMubG9naW4oKTtcbiAgfSxcbiAgb25TaG93KCkge30sXG4gIG9uSGlkZSgpIHt9LFxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgc2hvd0xvYWRpbmcgPSB0cnVlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBpZiAoc2hvd0xvYWRpbmcpXG4gICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICB0aXRsZTogXCLliqDovb3kuK0uLi5cIlxuICAgICAgICB9KTtcbiAgICAgIFxuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICBcIngtcmVxdWVzdGVkLXdpdGhcIjogXCJ4bWxodHRwcmVxdWVzdFwiLFxuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgICAgICAgXCJ4LXhjeFwiOiBcInhjeFwiLFxuICAgICAgICAgIHRva2VuOiB3eC5nZXRTdG9yYWdlU3luYyhcInNlc3Npb25faWRcIilcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiB0aGlzLmdsb2JhbERhdGEuYmFzZVVybCArIHVybCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgc3VjY2VzczogcmVzdWx0ID0+IHtcbiAgICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSAxKSByZXMocmVzdWx0LmRhdGEpO1xuICAgICAgICAgIGVsc2UgaWYgKGRhdGEuc3RhdHVzID09IC05OTkpIHtcbiAgICAgICAgICAgIC8vIOi3s+i9rOWIsOe7keWumumhtVxuICAgICAgICAgICAgc2VsZi5nb0xvZ2luKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqKGRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZXJyb3IgPT4gcmVqKGVycm9yKSxcbiAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHd4LmhpZGVMb2FkaW5nKCksIDUwMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uKHVybCwgZGF0YSA9IHt9LCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFwiR0VUXCIsIHVybCwgZGF0YSwgc2hvd0xvYWRpbmcpO1xuICB9LFxuICBwb3N0OiBmdW5jdGlvbih1cmwsIGRhdGEgPSB7fSwgc2hvd0xvYWRpbmcgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcIlBPU1RcIiwgdXJsLCBkYXRhLCBzaG93TG9hZGluZyk7XG4gIH1cbn07Il19