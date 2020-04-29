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
    baseUrl: "https://api.mdshijie.com/",
    // baseUrl: "http://127.0.0.1:8080/",
    userInfo: {},
    session_id: '',
    noPhone: true
  },

  showToast: function showToast(text) {
    wx.showToast({
      title: text,
      duration: 2000,
      icon: 'none'
    });
  },
  setSessionId: function setSessionId(sid) {
    try {
      this.globalData.session_id = sid;
      return wx.setStorageSync("session_id", sid);
    } catch (e) {
      return;
    }
  },
  getSessionId: function getSessionId() {
    return wx.getStorageSync("session_id") ? wx.getStorageSync("session_id") : this.globalData.session_id;
  },
  setUserInfo: function setUserInfo(user) {
    try {
      this.globalData.userInfo = user;
      return wx.setStorageSync("user_info", user);
    } catch (e) {}
  },
  getUserInfo: function getUserInfo() {
    var user = wx.getStorageSync("user_info") ? wx.getStorageSync("user_info") : this.globalData.userInfo;
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
          token: self.getSessionId()
        },
        url: self.globalData.baseUrl + url,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC53eGEiXSwibmFtZXMiOlsid3giLCJtZXNzYWdlIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJvbk5ldHdvcmtTdGF0dXNDaGFuZ2UiLCJyZXMiLCJzdGF0dXMiLCJpc0Nvbm5lY3RlZCIsImNhbGxUZWwiLCJ0ZWxlcGhvbmUiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJjb3B5VGV4dCIsImRhdGEiLCJzZXRDbGlwYm9hcmREYXRhIiwic3VjY2VzcyIsImdldENsaXBib2FyZERhdGEiLCJnbG9iYWxEYXRhIiwiYmFzZVVybCIsInVzZXJJbmZvIiwic2Vzc2lvbl9pZCIsIm5vUGhvbmUiLCJ0ZXh0Iiwic2V0U2Vzc2lvbklkIiwic2lkIiwic2V0U3RvcmFnZVN5bmMiLCJlIiwiZ2V0U2Vzc2lvbklkIiwiZ2V0U3RvcmFnZVN5bmMiLCJzZXRVc2VySW5mbyIsInVzZXIiLCJnZXRVc2VySW5mbyIsInRvTG9naW4iLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZ29Mb2dpbiIsInNlbGYiLCJzaG93IiwiYXV0aG9yaXplIiwic2hvd01vZGFsIiwiY29udGVudCIsImNvbmZpcm0iLCJwYWdlcyIsImdldEN1cnJlbnRQYWdlcyIsImNvbnNvbGUiLCJsb2ciLCJsZW5ndGgiLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsImNvbXBsZXRlIiwic3dpdGNoVGFiIiwibG9naW4iLCJQcm9taXNlIiwicmVqIiwiZ2V0IiwiY29kZSIsInRoZW4iLCJjYXRjaCIsImZhaWwiLCJvbkxhdW5jaCIsIm9uU2hvdyIsIm9uSGlkZSIsImFza05vdGljZSIsImdldFNldHRpbmciLCJ3aXRoU3Vic2NyaXB0aW9ucyIsInNldHRpbmciLCJzdWJzY3JpcHRpb25zU2V0dGluZyIsImFsbG93U3VjY2Vzc05vdGljZSIsImFsbG93Q2FuY2VsTm90aWNlIiwidG1wbElkcyIsIml0ZW1TZXR0aW5ncyIsInB1c2giLCJyZXF1ZXN0U3Vic2NyaWJlTWVzc2FnZSIsInNldFRpbWVvdXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwic2hvd0xvYWRpbmciLCJoZWFkZXIiLCJ0b2tlbiIsInJlc3VsdCIsImVycm9yIiwiaGlkZUxvYWRpbmciLCJwb3N0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBQSxHQUFHQyxPQUFILEdBQWEsVUFBVUEsT0FBVixFQUFtQjtBQUM1QkQsS0FBR0UsU0FBSCxDQUFhO0FBQ1hDLFdBQU9GLFdBQVcsT0FEUDtBQUVYRyxVQUFNLE1BRks7QUFHWEMsY0FBVTtBQUhDLEdBQWI7QUFLRCxDQU5IOztBQVFFTCxHQUFHTSxxQkFBSCxDQUF5QixVQUFVQyxHQUFWLEVBQWU7QUFDdEMsTUFBTUMsU0FBU0QsSUFBSUUsV0FBbkI7QUFDQSxNQUFJLENBQUNELE1BQUwsRUFBYTtBQUNYUixPQUFHQyxPQUFILENBQVcsaUJBQVg7QUFDRDtBQUNGLENBTEQ7O0FBT0FELEdBQUdVLE9BQUgsR0FBYSxVQUFVQyxTQUFWLEVBQXFCO0FBQ2hDWCxLQUFHWSxhQUFILENBQWlCO0FBQ2ZDLGlCQUFhRjtBQURFLEdBQWpCO0FBR0QsQ0FKRDs7QUFNQVgsR0FBR2MsUUFBSCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDNUJmLEtBQUdnQixnQkFBSCxDQUFvQjtBQUNsQkQsVUFBTUEsSUFEWTtBQUVsQkUsYUFBUyxpQkFBVVYsR0FBVixFQUFlO0FBQ3RCUCxTQUFHa0IsZ0JBQUgsQ0FBb0I7QUFDbEJELGlCQUFTLGlCQUFVVixHQUFWLEVBQWU7QUFDdEJQLGFBQUdDLE9BQUgsQ0FBVyxNQUFYO0FBQ0Q7QUFIaUIsT0FBcEI7QUFLRDtBQVJpQixHQUFwQjtBQVVELENBWEQ7OztBQXdFQWtCLGNBQVk7QUFDVkMsYUFBUywyQkFEQztBQUVWO0FBQ0FDLGNBQVUsRUFIQTtBQUlWQyxnQkFBWSxFQUpGO0FBS1ZDLGFBQVM7QUFMQyxHOztBQVFackIsVyxxQkFBVXNCLEksRUFBTTtBQUNaeEIsT0FBR0UsU0FBSCxDQUFhO0FBQ1hDLGFBQU9xQixJQURJO0FBRVhuQixnQkFBVSxJQUZD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aUJBQVMseUJBQVU7QUFDakIsY0FBSUYsT0FBT2tFLE9BQU9sRSxJQUFsQjtBQUNBLGNBQUlBLEtBQUtQLE1BQUwsSUFBZSxDQUFuQixFQUFzQkQsSUFBSTBFLE9BQU9sRSxJQUFYLEVBQXRCLEtBQ0ssSUFBSUEsS0FBS1AsTUFBTCxJQUFlLENBQUMsR0FBcEIsRUFBeUI7QUFDNUI4QixpQkFBS2IsWUFBTCxDQUFrQixFQUFsQjtBQUNBYSxpQkFBS1AsV0FBTCxDQUFpQixFQUFqQjs7QUFFQTtBQUNBTyxpQkFBS0QsT0FBTDtBQUNELFdBTkksTUFNRTtBQUNMa0IsZ0JBQUl4QyxJQUFKO0FBQ0Q7QUFDRixTQXRCUTtBQXVCVDZDLGNBQU07QUFBQSxpQkFBU0wsSUFBSTJCLEtBQUosQ0FBVDtBQUFBLFNBdkJHO0FBd0JUL0Isa0JBQVUsb0JBQU07QUFDZHdCLHFCQUFXO0FBQUEsbUJBQU0zRSxHQUFHbUYsV0FBSCxFQUFOO0FBQUEsV0FBWCxFQUFtQyxHQUFuQztBQUNEO0FBMUJRLE9BQVg7QUE0QkQsS0FsQ00sQ0FBUDtBQW1DRCxHO0FBQ0QzQixPQUFLLGFBQVNwQixHQUFULEVBQTZDO0FBQUEsUUFBL0JyQixJQUErQix1RUFBeEIsRUFBd0I7QUFBQSxRQUFwQitELFdBQW9CLHVFQUFOLElBQU07O0FBQ2hELFdBQU8sS0FBS0YsT0FBTCxDQUFhLEtBQWIsRUFBb0J4QyxHQUFwQixFQUF5QnJCLElBQXpCLEVBQStCK0QsV0FBL0IsQ0FBUDtBQUNELEc7QUFDRE0sUUFBTSxjQUFTaEQsR0FBVCxFQUE2QztBQUFBLFFBQS9CckIsSUFBK0IsdUVBQXhCLEVBQXdCO0FBQUEsUUFBcEIrRCxXQUFvQix1RUFBTixJQUFNOztBQUNqRCxXQUFPLEtBQUtGLE9BQUwsQ0FBYSxNQUFiLEVBQXFCeEMsR0FBckIsRUFBMEJyQixJQUExQixFQUFnQytELFdBQWhDLENBQVA7QUFDRCIsImZpbGUiOiJhcHAud3hhIiwic291cmNlc0NvbnRlbnQiOlsid3gubWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgIHRpdGxlOiBtZXNzYWdlIHx8ICflj5HnlJ/plJnor6/kuoYnLFxuICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgZHVyYXRpb246IDE1MDBcbiAgICB9KVxuICB9XG5cbiAgd3gub25OZXR3b3JrU3RhdHVzQ2hhbmdlKGZ1bmN0aW9uIChyZXMpIHtcbiAgICBjb25zdCBzdGF0dXMgPSByZXMuaXNDb25uZWN0ZWRcbiAgICBpZiAoIXN0YXR1cykge1xuICAgICAgd3gubWVzc2FnZSgn572R57uc6L+e5o6l5aSx6LSl77yM6K+35qOA5p+l572R57ucLi4uJylcbiAgICB9XG4gIH0pXG5cbiAgd3guY2FsbFRlbCA9IGZ1bmN0aW9uICh0ZWxlcGhvbmUpIHtcbiAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgIHBob25lTnVtYmVyOiB0ZWxlcGhvbmUsXG4gICAgfSlcbiAgfVxuXG4gIHd4LmNvcHlUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB3eC5zZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHd4LmdldENsaXBib2FyZERhdGEoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHd4Lm1lc3NhZ2UoJ+WkjeWItuaIkOWKnycpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHBlcm1pc3Npb246IHtcbiAgICAgIC8vIFwic2NvcGUudXNlckluZm9cIjoge1xuICAgICAgLy8gICBkZXNjOiBcIuiOt+WPluaCqOeahOWfuuacrOS/oeaBr1wiXG4gICAgICAvLyB9LFxuICAgICAgXCJzY29wZS51c2VyTG9jYXRpb25cIjoge1xuICAgICAgICBkZXNjOiBcIuS9oOeahOS9jee9ruS/oeaBr+WwhueUqOS6juiuoeeul+S4jumXqOW6l+eahOi3neemu1wiXG4gICAgICB9XG4gICAgfSxcbiAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgIFwibGF5b3V0LWhlYWRcIjogXCJsYXlvdXQvaGVhZFwiXG4gICAgICAvLyAnbGF5b3V0LWZvb3QnOiAnbGF5b3V0L2Zvb3QnXG4gICAgfSxcbiAgICBwYWdlczogW10sXG4gICAgd2luZG93OiB7XG4gICAgICBiYWNrZ3JvdW5kVGV4dFN0eWxlOiBcImxpZ2h0XCIsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIueMq+eahOS4lueVjFwiLFxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogXCJ3aGl0ZVwiXG4gICAgfSxcbiAgICB0YWJCYXI6IHtcbiAgICAgIGNvbG9yOiBcIiM4YThhOGFcIixcbiAgICAgIHNlbGVjdGVkQ29sb3I6IFwiI0UwM0I1OFwiLFxuICAgICAgYm9yZGVyU3R5bGU6IFwiYmxhY2tcIixcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICBsaXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9hcnRpY2xlL2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDEucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMTEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLlk4HniYxcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvYXBwb2ludG1lbnQvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMi5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAyMS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIumihOe6plwiXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICBwYWdlUGF0aDogXCJwYWdlcy9wYXkvaW5kZXhcIixcbiAgICAgICAgLy8gICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMy5wbmdcIixcbiAgICAgICAgLy8gICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAzMS5wbmdcIixcbiAgICAgICAgLy8gICB0ZXh0OiBcIuS5sOWNlVwiXG4gICAgICAgIC8vIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9jZW50ZXIvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wNC5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzA0MS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIuaIkeeahFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIG5ldHdvcmtUaW1lb3V0OiB7XG4gICAgICByZXF1ZXN0OiAxMDAwMFxuICAgIH1cbiAgfSxcbiAgZ2xvYmFsRGF0YToge1xuICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkubWRzaGlqaWUuY29tL1wiLFxuICAgIC8vIGJhc2VVcmw6IFwiaHR0cDovLzEyNy4wLjAuMTo4MDgwL1wiLFxuICAgIHVzZXJJbmZvOiB7fSxcbiAgICBzZXNzaW9uX2lkOiAnJyxcbiAgICBub1Bob25lOiB0cnVlLFxuICB9LFxuXG4gIHNob3dUb2FzdCh0ZXh0KSB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogdGV4dCxcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgIGljb246ICdub25lJ1xuICAgIH0pXG4gIH0sXG5cbiAgc2V0U2Vzc2lvbklkKHNpZCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmdsb2JhbERhdGEuc2Vzc2lvbl9pZCA9IHNpZFxuICAgICAgcmV0dXJuIHd4LnNldFN0b3JhZ2VTeW5jKFwic2Vzc2lvbl9pZFwiLCBzaWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfSxcblxuICBnZXRTZXNzaW9uSWQoKSB7XG4gICAgcmV0dXJuIHd4LmdldFN0b3JhZ2VTeW5jKFwic2Vzc2lvbl9pZFwiKSA/IHd4LmdldFN0b3JhZ2VTeW5jKFwic2Vzc2lvbl9pZFwiKSA6IHRoaXMuZ2xvYmFsRGF0YS5zZXNzaW9uX2lkO1xuICB9LFxuXG4gIHNldFVzZXJJbmZvKHVzZXIpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gdXNlclxuICAgICAgcmV0dXJuIHd4LnNldFN0b3JhZ2VTeW5jKFwidXNlcl9pbmZvXCIsIHVzZXIpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG5cbiAgZ2V0VXNlckluZm8oKSB7XG4gICAgY29uc3QgdXNlciA9IHd4LmdldFN0b3JhZ2VTeW5jKFwidXNlcl9pbmZvXCIpID8gd3guZ2V0U3RvcmFnZVN5bmMoXCJ1c2VyX2luZm9cIikgOiB0aGlzLmdsb2JhbERhdGEudXNlckluZm87XG4gICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gdXNlclxuXG4gICAgcmV0dXJuIHVzZXJcbiAgfSxcblxuICB0b0xvZ2luKCkge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnL3BhZ2VzL2JpbmQvaW5kZXgnLFxuICAgIH0pXG5cbiAgfSxcblxuICBnb0xvZ2luKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgaWYgKHNlbGYuZ29Mb2dpbi5zaG93KVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBhdXRob3JpemUgPSBzZWxmLmdldFNlc3Npb25JZCgpXG4gICAgY29uc3Qgbm9QaG9uZSA9IHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mby5ub1Bob25lXG4gICAgaWYgKGF1dGhvcml6ZSAmJiAhbm9QaG9uZSlcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBpZiAoIWF1dGhvcml6ZSB8fCBub1Bob25lKSB7XG4gICAgICBzZWxmLmdvTG9naW4uc2hvdyA9IHRydWVcbiAgICAgIC8vIGxvZ2luVG9vbC5zZXRHb0xvZ2luKClcbiAgICAgIGxldCBtZXNzYWdlID0gJ+aCqOi/mOacqueZu+W9le+8jOaYr+WQpueZu+W9le+8nydcblxuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgY29udGVudDogbWVzc2FnZSxcbiAgICAgICAgc3VjY2VzcyhlKSB7XG4gICAgICAgICAgaWYgKGUuY29uZmlybSkge1xuICAgICAgICAgICAgc2VsZi50b0xvZ2luKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGFnZXMgPSBnZXRDdXJyZW50UGFnZXMoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocGFnZXMubGVuZ3RoKVxuICAgICAgICAgICAgaWYgKHBhZ2VzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgICAgICAgICAgZGVsdGE6IDIsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IChyZXMpID0+IHt9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvYXBwb2ludG1lbnQvaW5kZXgnLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGUoZSkge1xuICAgICAgICAgIHNlbGYuZ29Mb2dpbi5zaG93ID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgbG9naW46IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICB3eC5sb2dpbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBzZWxmLmdldChcInhjeExvZ2luL2F1dGhvcml6ZVwiLCB7IGNvZGU6IGRhdGEuY29kZSB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgc2VsZi5zZXRTZXNzaW9uSWQoZGF0YS5kYXRhLnNlc3Npb25faWQpXG4gICAgICAgICAgICByZXMoZGF0YS5kYXRhKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gcmVqKGUpKVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgcmVqKGUpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pXG4gICBcbiAgfSxcbiAgb25MYXVuY2goKSB7XG4gICAgLy8gdGhpcy5sb2dpbigpO1xuICB9LFxuICBvblNob3coKSB7fSxcbiAgb25IaWRlKCkge30sXG5cbiAgYXNrTm90aWNlKCkge1xuICAgIHd4LmdldFNldHRpbmcoe1xuICAgICAgd2l0aFN1YnNjcmlwdGlvbnM6IHRydWUsXG4gICAgICBzdWNjZXNzIChyZXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLmF1dGhTZXR0aW5nKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuc3Vic2NyaXB0aW9uc1NldHRpbmcpXG4gICAgICAgIGNvbnN0IHNldHRpbmcgPSByZXMuc3Vic2NyaXB0aW9uc1NldHRpbmdcbiAgICAgICAgY29uc3QgYWxsb3dTdWNjZXNzTm90aWNlID0gJ2pHS2p2TTE2TXhybVVIMjR3NFhacTdCMzBjSDh3SXlxV3hGUVBmMXlwY2MnXG4gICAgICAgIGNvbnN0IGFsbG93Q2FuY2VsTm90aWNlID0gJ0pldjl5SGdpMXhsMDhXZDgwUHBEZnNpZlFlVDgtZV9fYnNzYkZGMDBqOUEnXG4gICAgICAgIGxldCB0bXBsSWRzID0gW11cbiAgICAgICAgLy8gaWYgKHNldHRpbmcubWFpblN3aXRjaCA9PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1TZXR0aW5ncyA9IHNldHRpbmcuaXRlbVNldHRpbmdzIHx8IHt9XG4gICAgICAgIGNvbnNvbGUubG9nKHNldHRpbmcpXG4gICAgICAgIGNvbnNvbGUubG9nKGl0ZW1TZXR0aW5ncylcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtU2V0dGluZ3NbYWxsb3dTdWNjZXNzTm90aWNlXSA9PT0gJ3VuZGVmaW5lZCcgfHwgaXRlbVNldHRpbmdzW2FsbG93U3VjY2Vzc05vdGljZV0gIT09ICdhY2NlcHQnKXtcbiAgICAgICAgICB0bXBsSWRzLnB1c2goYWxsb3dTdWNjZXNzTm90aWNlKVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodHlwZW9mIGl0ZW1TZXR0aW5nc1thbGxvd0NhbmNlbE5vdGljZV0gPT09ICd1bmRlZmluZWQnIHx8IGl0ZW1TZXR0aW5nc1thbGxvd0NhbmNlbE5vdGljZV0gIT09ICdhY2NlcHQnKXtcbiAgICAgICAgICB0bXBsSWRzLnB1c2goYWxsb3dDYW5jZWxOb3RpY2UpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyh0bXBsSWRzKVxuXG4gICAgICAgIGlmICh0bXBsSWRzLmxlbmd0aCkge1xuICAgICAgICAgIHd4LnJlcXVlc3RTdWJzY3JpYmVNZXNzYWdlKHtcbiAgICAgICAgICAgIHRtcGxJZHMsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWwoZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfor7flnKjlsI/nqIvluo/orr7nva7ph4zmiZPlvIDorqLpmIXmtojmga/mgLvlvIDlhbMnLCBcbiAgICAgICAgICAgICAgICAgIGljb246ICdub25lJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0sIDMwMDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICB9LFxuICAgICAgZmFpbChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgc2hvd0xvYWRpbmcgPSB0cnVlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBpZiAoc2hvd0xvYWRpbmcpXG4gICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICB0aXRsZTogXCLliqDovb3kuK0uLi5cIlxuICAgICAgICB9KTtcbiAgICAgIFxuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICBcIngtcmVxdWVzdGVkLXdpdGhcIjogXCJ4bWxodHRwcmVxdWVzdFwiLFxuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgICAgICAgXCJ4LXhjeFwiOiBcInhjeFwiLFxuICAgICAgICAgIHRva2VuOiBzZWxmLmdldFNlc3Npb25JZCgpXG4gICAgICAgIH0sXG4gICAgICAgIHVybDogc2VsZi5nbG9iYWxEYXRhLmJhc2VVcmwgKyB1cmwsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHN1Y2Nlc3M6IHJlc3VsdCA9PiB7XG4gICAgICAgICAgbGV0IGRhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gMSkgcmVzKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICBlbHNlIGlmIChkYXRhLnN0YXR1cyA9PSAtOTk5KSB7XG4gICAgICAgICAgICBzZWxmLnNldFNlc3Npb25JZCgnJylcbiAgICAgICAgICAgIHNlbGYuc2V0VXNlckluZm8oe30pXG5cbiAgICAgICAgICAgIC8vIOi3s+i9rOWIsOe7keWumumhtVxuICAgICAgICAgICAgc2VsZi5nb0xvZ2luKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqKGRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZXJyb3IgPT4gcmVqKGVycm9yKSxcbiAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHd4LmhpZGVMb2FkaW5nKCksIDUwMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uKHVybCwgZGF0YSA9IHt9LCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFwiR0VUXCIsIHVybCwgZGF0YSwgc2hvd0xvYWRpbmcpO1xuICB9LFxuICBwb3N0OiBmdW5jdGlvbih1cmwsIGRhdGEgPSB7fSwgc2hvd0xvYWRpbmcgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcIlBPU1RcIiwgdXJsLCBkYXRhLCBzaG93TG9hZGluZyk7XG4gIH1cbn07Il19