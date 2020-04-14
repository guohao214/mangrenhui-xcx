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
  askNotice: function askNotice() {
    wx.getSetting({
      withSubscriptions: true,
      success: function success(res) {
        // console.log(res.authSetting)
        // console.log(res.subscriptionsSetting)
        var setting = res.subscriptionsSetting;
        var allowSuccessNotice = 'jGKjvM16MxrmUH24w4XZq7B30cH8wIyqWxFQPf1ypcc';
        var allowCancelNotice = 'Jev9yHgi1xl08Wd80PpDfsifQeT8-e__bssbFF00j9A';
        var tmplIds = [];
        // if (setting.mainSwitch == true) {
        var itemSettings = setting.itemSettings || {};
        console.log(setting);
        console.log(itemSettings);
        if (typeof itemSettings[allowSuccessNotice] === 'undefined' || itemSettings[allowSuccessNotice] !== 'accept') {
          tmplIds.push(allowSuccessNotice);
        }

        if (typeof itemSettings[allowCancelNotice] === 'undefined' || itemSettings[allowCancelNotice] !== 'accept') {
          tmplIds.push(allowCancelNotice);
        }

        console.log(tmplIds);

        if (tmplIds.length) {
          wx.requestSubscribeMessage({
            tmplIds: tmplIds,
            success: function success(res) {
              console.log(res);
            },
            fail: function fail(e) {
              console.log(e);
              setTimeout(function () {
                wx.showToast({
                  title: '请在小程序设置里打开订阅消息总开关',
                  icon: 'none'
                });
              }, 3000);
            }
          });
        }
        // }
      },
      fail: function fail(e) {
        console.log(e);
      }
    });
  },


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
            self.setSessionId('');
            self.setUserInfo({});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC53eGEiXSwibmFtZXMiOlsid3giLCJtZXNzYWdlIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJvbk5ldHdvcmtTdGF0dXNDaGFuZ2UiLCJyZXMiLCJzdGF0dXMiLCJpc0Nvbm5lY3RlZCIsImNhbGxUZWwiLCJ0ZWxlcGhvbmUiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJjb3B5VGV4dCIsImRhdGEiLCJzZXRDbGlwYm9hcmREYXRhIiwic3VjY2VzcyIsImdldENsaXBib2FyZERhdGEiLCJnbG9iYWxEYXRhIiwiYmFzZVVybCIsInVzZXJJbmZvIiwibm9QaG9uZSIsInNldFNlc3Npb25JZCIsInNpZCIsInNldFN0b3JhZ2VTeW5jIiwiZ2V0U2Vzc2lvbklkIiwiZ2V0U3RvcmFnZVN5bmMiLCJzZXRVc2VySW5mbyIsInVzZXIiLCJnZXRVc2VySW5mbyIsInRvTG9naW4iLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZ29Mb2dpbiIsInNlbGYiLCJzaG93IiwiYXV0aG9yaXplIiwic2hvd01vZGFsIiwiY29udGVudCIsImUiLCJjb25maXJtIiwicGFnZXMiLCJnZXRDdXJyZW50UGFnZXMiLCJjb25zb2xlIiwibG9nIiwibGVuZ3RoIiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJjb21wbGV0ZSIsInN3aXRjaFRhYiIsImxvZ2luIiwiUHJvbWlzZSIsInJlaiIsImdldCIsImNvZGUiLCJ0aGVuIiwic2Vzc2lvbl9pZCIsImNhdGNoIiwiZmFpbCIsIm9uTGF1bmNoIiwib25TaG93Iiwib25IaWRlIiwiYXNrTm90aWNlIiwiZ2V0U2V0dGluZyIsIndpdGhTdWJzY3JpcHRpb25zIiwic2V0dGluZyIsInN1YnNjcmlwdGlvbnNTZXR0aW5nIiwiYWxsb3dTdWNjZXNzTm90aWNlIiwiYWxsb3dDYW5jZWxOb3RpY2UiLCJ0bXBsSWRzIiwiaXRlbVNldHRpbmdzIiwicHVzaCIsInJlcXVlc3RTdWJzY3JpYmVNZXNzYWdlIiwic2V0VGltZW91dCIsInJlcXVlc3QiLCJtZXRob2QiLCJzaG93TG9hZGluZyIsImhlYWRlciIsInRva2VuIiwicmVzdWx0IiwiZXJyb3IiLCJoaWRlTG9hZGluZyIsInBvc3QiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUFBLEdBQUdDLE9BQUgsR0FBYSxVQUFVQSxPQUFWLEVBQW1CO0FBQzVCRCxLQUFHRSxTQUFILENBQWE7QUFDWEMsV0FBT0YsV0FBVyxPQURQO0FBRVhHLFVBQU0sTUFGSztBQUdYQyxjQUFVO0FBSEMsR0FBYjtBQUtELENBTkg7O0FBUUVMLEdBQUdNLHFCQUFILENBQXlCLFVBQVVDLEdBQVYsRUFBZTtBQUN0QyxNQUFNQyxTQUFTRCxJQUFJRSxXQUFuQjtBQUNBLE1BQUksQ0FBQ0QsTUFBTCxFQUFhO0FBQ1hSLE9BQUdDLE9BQUgsQ0FBVyxpQkFBWDtBQUNEO0FBQ0YsQ0FMRDs7QUFPQUQsR0FBR1UsT0FBSCxHQUFhLFVBQVVDLFNBQVYsRUFBcUI7QUFDaENYLEtBQUdZLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQWFGO0FBREUsR0FBakI7QUFHRCxDQUpEOztBQU1BWCxHQUFHYyxRQUFILEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUM1QmYsS0FBR2dCLGdCQUFILENBQW9CO0FBQ2xCRCxVQUFNQSxJQURZO0FBRWxCRSxhQUFTLGlCQUFVVixHQUFWLEVBQWU7QUFDdEJQLFNBQUdrQixnQkFBSCxDQUFvQjtBQUNsQkQsaUJBQVMsaUJBQVVWLEdBQVYsRUFBZTtBQUN0QlAsYUFBR0MsT0FBSCxDQUFXLE1BQVg7QUFDRDtBQUhpQixPQUFwQjtBQUtEO0FBUmlCLEdBQXBCO0FBVUQsQ0FYRDs7O0FBd0VBa0IsY0FBWTtBQUNWQyxhQUFTLDRCQURDO0FBRVY7QUFDQUMsY0FBVSxFQUhBO0FBSVZDLGFBQVM7QUFKQyxHOztBQU9aQyxjLHdCQUFhQyxHLEVBQUs7QUFDaEIsV0FBT3hCLEdBQUd5QixjQUFILENBQWtCLFlBQWxCLEVBQWdDRCxHQUFoQyxDQUFQO0FBQ0QsRztBQUVERSxjLDBCQUFlO0FBQ2IsV0FB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R2tGLFdBQUgsRUFBTjtBQUFBLFdBQVgsRUFBbUMsR0FBbkM7QUFDRDtBQTFCUSxPQUFYO0FBNEJELEtBbENNLENBQVA7QUFtQ0QsRztBQUNENUIsT0FBSyxhQUFTckIsR0FBVCxFQUE2QztBQUFBLFFBQS9CbEIsSUFBK0IsdUVBQXhCLEVBQXdCO0FBQUEsUUFBcEI4RCxXQUFvQix1RUFBTixJQUFNOztBQUNoRCxXQUFPLEtBQUtGLE9BQUwsQ0FBYSxLQUFiLEVBQW9CMUMsR0FBcEIsRUFBeUJsQixJQUF6QixFQUErQjhELFdBQS9CLENBQVA7QUFDRCxHO0FBQ0RNLFFBQU0sY0FBU2xELEdBQVQsRUFBNkM7QUFBQSxRQUEvQmxCLElBQStCLHVFQUF4QixFQUF3QjtBQUFBLFFBQXBCOEQsV0FBb0IsdUVBQU4sSUFBTTs7QUFDakQsV0FBTyxLQUFLRixPQUFMLENBQWEsTUFBYixFQUFxQjFDLEdBQXJCLEVBQTBCbEIsSUFBMUIsRUFBZ0M4RCxXQUFoQyxDQUFQO0FBQ0QiLCJmaWxlIjoiYXBwLnd4YSIsInNvdXJjZXNDb250ZW50IjpbInd4Lm1lc3NhZ2UgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICB0aXRsZTogbWVzc2FnZSB8fCAn5Y+R55Sf6ZSZ6K+v5LqGJyxcbiAgICAgIGljb246ICdub25lJyxcbiAgICAgIGR1cmF0aW9uOiAxNTAwXG4gICAgfSlcbiAgfVxuXG4gIHd4Lm9uTmV0d29ya1N0YXR1c0NoYW5nZShmdW5jdGlvbiAocmVzKSB7XG4gICAgY29uc3Qgc3RhdHVzID0gcmVzLmlzQ29ubmVjdGVkXG4gICAgaWYgKCFzdGF0dXMpIHtcbiAgICAgIHd4Lm1lc3NhZ2UoJ+e9kee7nOi/nuaOpeWksei0pe+8jOivt+ajgOafpee9kee7nC4uLicpXG4gICAgfVxuICB9KVxuXG4gIHd4LmNhbGxUZWwgPSBmdW5jdGlvbiAodGVsZXBob25lKSB7XG4gICAgd3gubWFrZVBob25lQ2FsbCh7XG4gICAgICBwaG9uZU51bWJlcjogdGVsZXBob25lLFxuICAgIH0pXG4gIH1cblxuICB3eC5jb3B5VGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgd3guc2V0Q2xpcGJvYXJkRGF0YSh7XG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB3eC5nZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICB3eC5tZXNzYWdlKCflpI3liLbmiJDlip8nKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBwZXJtaXNzaW9uOiB7XG4gICAgICAvLyBcInNjb3BlLnVzZXJJbmZvXCI6IHtcbiAgICAgIC8vICAgZGVzYzogXCLojrflj5bmgqjnmoTln7rmnKzkv6Hmga9cIlxuICAgICAgLy8gfSxcbiAgICAgIFwic2NvcGUudXNlckxvY2F0aW9uXCI6IHtcbiAgICAgICAgZGVzYzogXCLkvaDnmoTkvY3nva7kv6Hmga/lsIbnlKjkuo7orqHnrpfkuI7pl6jlupfnmoTot53nprtcIlxuICAgICAgfVxuICAgIH0sXG4gICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICBcImxheW91dC1oZWFkXCI6IFwibGF5b3V0L2hlYWRcIlxuICAgICAgLy8gJ2xheW91dC1mb290JzogJ2xheW91dC9mb290J1xuICAgIH0sXG4gICAgcGFnZXM6IFtdLFxuICAgIHdpbmRvdzoge1xuICAgICAgYmFja2dyb3VuZFRleHRTdHlsZTogXCJsaWdodFwiLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCLnjKvnmoTkuJbnlYxcIixcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6IFwid2hpdGVcIlxuICAgIH0sXG4gICAgdGFiQmFyOiB7XG4gICAgICBjb2xvcjogXCIjOGE4YThhXCIsXG4gICAgICBzZWxlY3RlZENvbG9yOiBcIiNFMDQxNTZcIixcbiAgICAgIGJvcmRlclN0eWxlOiBcImJsYWNrXCIsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgbGlzdDogW1xuICAgICAgICB7XG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvYXJ0aWNsZS9pbmRleFwiLFxuICAgICAgICAgIGljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAxLnBuZ1wiLFxuICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDExLnBuZ1wiLFxuICAgICAgICAgIHRleHQ6IFwi5ZOB54mMXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL2FwcG9pbnRtZW50L2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDIucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMjEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLpooTnuqZcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvcGF5L2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDMucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMzEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLkubDljZVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvY2VudGVyL2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDQucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wNDEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLmiJHnmoRcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICBuZXR3b3JrVGltZW91dDoge1xuICAgICAgcmVxdWVzdDogMTAwMDBcbiAgICB9XG4gIH0sXG4gIGdsb2JhbERhdGE6IHtcbiAgICBiYXNlVXJsOiBcImh0dHBzOi8vYXBpLm1hbmdyZW5odWkuY24vXCIsXG4gICAgLy8gYmFzZVVybDogXCJodHRwOi8vMTI3LjAuMC4xOjgwODAvXCIsXG4gICAgdXNlckluZm86IHt9LFxuICAgIG5vUGhvbmU6IHRydWUsXG4gIH0sXG5cbiAgc2V0U2Vzc2lvbklkKHNpZCkge1xuICAgIHJldHVybiB3eC5zZXRTdG9yYWdlU3luYyhcInNlc3Npb25faWRcIiwgc2lkKTtcbiAgfSxcblxuICBnZXRTZXNzaW9uSWQoKSB7XG4gICAgcmV0dXJuIHd4LmdldFN0b3JhZ2VTeW5jKFwic2Vzc2lvbl9pZFwiKTtcbiAgfSxcblxuICBzZXRVc2VySW5mbyh1c2VyKSB7XG4gICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gdXNlclxuICAgIHJldHVybiB3eC5zZXRTdG9yYWdlU3luYyhcInVzZXJfaW5mb1wiLCB1c2VyKTtcbiAgfSxcblxuICBnZXRVc2VySW5mbygpIHtcbiAgICBjb25zdCB1c2VyID0gd3guZ2V0U3RvcmFnZVN5bmMoXCJ1c2VyX2luZm9cIik7XG4gICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gdXNlclxuXG4gICAgcmV0dXJuIHVzZXJcbiAgfSxcblxuICB0b0xvZ2luKCkge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnL3BhZ2VzL2JpbmQvaW5kZXgnLFxuICAgIH0pXG5cbiAgfSxcblxuICBnb0xvZ2luKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgaWYgKHNlbGYuZ29Mb2dpbi5zaG93KVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBhdXRob3JpemUgPSBzZWxmLmdldFNlc3Npb25JZCgpXG4gICAgY29uc3Qgbm9QaG9uZSA9IHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mby5ub1Bob25lXG4gICAgaWYgKGF1dGhvcml6ZSAmJiAhbm9QaG9uZSlcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBpZiAoIWF1dGhvcml6ZSB8fCBub1Bob25lKSB7XG4gICAgICBzZWxmLmdvTG9naW4uc2hvdyA9IHRydWVcbiAgICAgIC8vIGxvZ2luVG9vbC5zZXRHb0xvZ2luKClcbiAgICAgIGxldCBtZXNzYWdlID0gJ+aCqOi/mOacqueZu+W9le+8jOaYr+WQpueZu+W9le+8nydcblxuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgY29udGVudDogbWVzc2FnZSxcbiAgICAgICAgc3VjY2VzcyhlKSB7XG4gICAgICAgICAgaWYgKGUuY29uZmlybSkge1xuICAgICAgICAgICAgc2VsZi50b0xvZ2luKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGFnZXMgPSBnZXRDdXJyZW50UGFnZXMoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocGFnZXMubGVuZ3RoKVxuICAgICAgICAgICAgaWYgKHBhZ2VzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgICAgICAgICAgZGVsdGE6IDIsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IChyZXMpID0+IHt9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvYXBwb2ludG1lbnQvaW5kZXgnLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGUoZSkge1xuICAgICAgICAgIHNlbGYuZ29Mb2dpbi5zaG93ID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgbG9naW46IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICB3eC5sb2dpbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBzZWxmLmdldChcInhjeExvZ2luL2F1dGhvcml6ZVwiLCB7IGNvZGU6IGRhdGEuY29kZSB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgc2VsZi5zZXRTZXNzaW9uSWQoZGF0YS5kYXRhLnNlc3Npb25faWQpXG4gICAgICAgICAgICByZXMoZGF0YS5kYXRhKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gcmVqKGUpKVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgcmVqKGUpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pXG4gICBcbiAgfSxcbiAgb25MYXVuY2goKSB7XG4gICAgLy8gdGhpcy5sb2dpbigpO1xuICB9LFxuICBvblNob3coKSB7fSxcbiAgb25IaWRlKCkge30sXG5cbiAgYXNrTm90aWNlKCkge1xuICAgIHd4LmdldFNldHRpbmcoe1xuICAgICAgd2l0aFN1YnNjcmlwdGlvbnM6IHRydWUsXG4gICAgICBzdWNjZXNzIChyZXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLmF1dGhTZXR0aW5nKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuc3Vic2NyaXB0aW9uc1NldHRpbmcpXG4gICAgICAgIGNvbnN0IHNldHRpbmcgPSByZXMuc3Vic2NyaXB0aW9uc1NldHRpbmdcbiAgICAgICAgY29uc3QgYWxsb3dTdWNjZXNzTm90aWNlID0gJ2pHS2p2TTE2TXhybVVIMjR3NFhacTdCMzBjSDh3SXlxV3hGUVBmMXlwY2MnXG4gICAgICAgIGNvbnN0IGFsbG93Q2FuY2VsTm90aWNlID0gJ0pldjl5SGdpMXhsMDhXZDgwUHBEZnNpZlFlVDgtZV9fYnNzYkZGMDBqOUEnXG4gICAgICAgIGxldCB0bXBsSWRzID0gW11cbiAgICAgICAgLy8gaWYgKHNldHRpbmcubWFpblN3aXRjaCA9PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1TZXR0aW5ncyA9IHNldHRpbmcuaXRlbVNldHRpbmdzIHx8IHt9XG4gICAgICAgIGNvbnNvbGUubG9nKHNldHRpbmcpXG4gICAgICAgIGNvbnNvbGUubG9nKGl0ZW1TZXR0aW5ncylcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtU2V0dGluZ3NbYWxsb3dTdWNjZXNzTm90aWNlXSA9PT0gJ3VuZGVmaW5lZCcgfHwgaXRlbVNldHRpbmdzW2FsbG93U3VjY2Vzc05vdGljZV0gIT09ICdhY2NlcHQnKXtcbiAgICAgICAgICB0bXBsSWRzLnB1c2goYWxsb3dTdWNjZXNzTm90aWNlKVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodHlwZW9mIGl0ZW1TZXR0aW5nc1thbGxvd0NhbmNlbE5vdGljZV0gPT09ICd1bmRlZmluZWQnIHx8IGl0ZW1TZXR0aW5nc1thbGxvd0NhbmNlbE5vdGljZV0gIT09ICdhY2NlcHQnKXtcbiAgICAgICAgICB0bXBsSWRzLnB1c2goYWxsb3dDYW5jZWxOb3RpY2UpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyh0bXBsSWRzKVxuXG4gICAgICAgIGlmICh0bXBsSWRzLmxlbmd0aCkge1xuICAgICAgICAgIHd4LnJlcXVlc3RTdWJzY3JpYmVNZXNzYWdlKHtcbiAgICAgICAgICAgIHRtcGxJZHMsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWwoZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfor7flnKjlsI/nqIvluo/orr7nva7ph4zmiZPlvIDorqLpmIXmtojmga/mgLvlvIDlhbMnLCBcbiAgICAgICAgICAgICAgICAgIGljb246ICdub25lJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0sIDMwMDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICB9LFxuICAgICAgZmFpbChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgc2hvd0xvYWRpbmcgPSB0cnVlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBpZiAoc2hvd0xvYWRpbmcpXG4gICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICB0aXRsZTogXCLliqDovb3kuK0uLi5cIlxuICAgICAgICB9KTtcbiAgICAgIFxuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICBcIngtcmVxdWVzdGVkLXdpdGhcIjogXCJ4bWxodHRwcmVxdWVzdFwiLFxuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgICAgICAgXCJ4LXhjeFwiOiBcInhjeFwiLFxuICAgICAgICAgIHRva2VuOiB3eC5nZXRTdG9yYWdlU3luYyhcInNlc3Npb25faWRcIilcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiB0aGlzLmdsb2JhbERhdGEuYmFzZVVybCArIHVybCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgc3VjY2VzczogcmVzdWx0ID0+IHtcbiAgICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSAxKSByZXMocmVzdWx0LmRhdGEpO1xuICAgICAgICAgIGVsc2UgaWYgKGRhdGEuc3RhdHVzID09IC05OTkpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0U2Vzc2lvbklkKCcnKVxuICAgICAgICAgICAgc2VsZi5zZXRVc2VySW5mbyh7fSlcblxuICAgICAgICAgICAgLy8g6Lez6L2s5Yiw57uR5a6a6aG1XG4gICAgICAgICAgICBzZWxmLmdvTG9naW4oKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWooZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBlcnJvciA9PiByZWooZXJyb3IpLFxuICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd3guaGlkZUxvYWRpbmcoKSwgNTAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24odXJsLCBkYXRhID0ge30sIHNob3dMb2FkaW5nID0gdHJ1ZSkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXCJHRVRcIiwgdXJsLCBkYXRhLCBzaG93TG9hZGluZyk7XG4gIH0sXG4gIHBvc3Q6IGZ1bmN0aW9uKHVybCwgZGF0YSA9IHt9LCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFwiUE9TVFwiLCB1cmwsIGRhdGEsIHNob3dMb2FkaW5nKTtcbiAgfVxufTsiXX0=