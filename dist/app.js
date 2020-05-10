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
    // baseUrl: "http://127.0.0.1/",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC53eGEiXSwibmFtZXMiOlsid3giLCJtZXNzYWdlIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJvbk5ldHdvcmtTdGF0dXNDaGFuZ2UiLCJyZXMiLCJzdGF0dXMiLCJpc0Nvbm5lY3RlZCIsImNhbGxUZWwiLCJ0ZWxlcGhvbmUiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJjb3B5VGV4dCIsImRhdGEiLCJzZXRDbGlwYm9hcmREYXRhIiwic3VjY2VzcyIsImdldENsaXBib2FyZERhdGEiLCJnbG9iYWxEYXRhIiwiYmFzZVVybCIsInVzZXJJbmZvIiwic2Vzc2lvbl9pZCIsIm5vUGhvbmUiLCJ0ZXh0Iiwic2V0U2Vzc2lvbklkIiwic2lkIiwic2V0U3RvcmFnZVN5bmMiLCJlIiwiZ2V0U2Vzc2lvbklkIiwiZ2V0U3RvcmFnZVN5bmMiLCJzZXRVc2VySW5mbyIsInVzZXIiLCJnZXRVc2VySW5mbyIsInRvTG9naW4iLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZ29Mb2dpbiIsInNlbGYiLCJzaG93IiwiYXV0aG9yaXplIiwic2hvd01vZGFsIiwiY29udGVudCIsImNvbmZpcm0iLCJwYWdlcyIsImdldEN1cnJlbnRQYWdlcyIsImNvbnNvbGUiLCJsb2ciLCJsZW5ndGgiLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsImNvbXBsZXRlIiwic3dpdGNoVGFiIiwibG9naW4iLCJQcm9taXNlIiwicmVqIiwiZ2V0IiwiY29kZSIsInRoZW4iLCJjYXRjaCIsImZhaWwiLCJvbkxhdW5jaCIsIm9uU2hvdyIsIm9uSGlkZSIsImFza05vdGljZSIsImdldFNldHRpbmciLCJ3aXRoU3Vic2NyaXB0aW9ucyIsInNldHRpbmciLCJzdWJzY3JpcHRpb25zU2V0dGluZyIsImFsbG93U3VjY2Vzc05vdGljZSIsImFsbG93Q2FuY2VsTm90aWNlIiwidG1wbElkcyIsIml0ZW1TZXR0aW5ncyIsInB1c2giLCJyZXF1ZXN0U3Vic2NyaWJlTWVzc2FnZSIsInNldFRpbWVvdXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwic2hvd0xvYWRpbmciLCJoZWFkZXIiLCJ0b2tlbiIsInJlc3VsdCIsImVycm9yIiwiaGlkZUxvYWRpbmciLCJwb3N0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBQSxHQUFHQyxPQUFILEdBQWEsVUFBVUEsT0FBVixFQUFtQjtBQUM1QkQsS0FBR0UsU0FBSCxDQUFhO0FBQ1hDLFdBQU9GLFdBQVcsT0FEUDtBQUVYRyxVQUFNLE1BRks7QUFHWEMsY0FBVTtBQUhDLEdBQWI7QUFLRCxDQU5IOztBQVFFTCxHQUFHTSxxQkFBSCxDQUF5QixVQUFVQyxHQUFWLEVBQWU7QUFDdEMsTUFBTUMsU0FBU0QsSUFBSUUsV0FBbkI7QUFDQSxNQUFJLENBQUNELE1BQUwsRUFBYTtBQUNYUixPQUFHQyxPQUFILENBQVcsaUJBQVg7QUFDRDtBQUNGLENBTEQ7O0FBT0FELEdBQUdVLE9BQUgsR0FBYSxVQUFVQyxTQUFWLEVBQXFCO0FBQ2hDWCxLQUFHWSxhQUFILENBQWlCO0FBQ2ZDLGlCQUFhRjtBQURFLEdBQWpCO0FBR0QsQ0FKRDs7QUFNQVgsR0FBR2MsUUFBSCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDNUJmLEtBQUdnQixnQkFBSCxDQUFvQjtBQUNsQkQsVUFBTUEsSUFEWTtBQUVsQkUsYUFBUyxpQkFBVVYsR0FBVixFQUFlO0FBQ3RCUCxTQUFHa0IsZ0JBQUgsQ0FBb0I7QUFDbEJELGlCQUFTLGlCQUFVVixHQUFWLEVBQWU7QUFDdEJQLGFBQUdDLE9BQUgsQ0FBVyxNQUFYO0FBQ0Q7QUFIaUIsT0FBcEI7QUFLRDtBQVJpQixHQUFwQjtBQVVELENBWEQ7OztBQXlFQWtCLGNBQVk7QUFDVkMsYUFBUywyQkFEQztBQUVWO0FBQ0FDLGNBQVUsRUFIQTtBQUlWQyxnQkFBWSxFQUpGO0FBS1ZDLGFBQVM7QUFMQyxHOztBQVFackIsVyxxQkFBVXNCLEksRUFBTTtBQUNaeEIsT0FBR0UsU0FBSCxDQUFhO0FBQ1hDLGFBQU9xQixJQURJO0FBRVhuQixnQkFBVSxJQUZD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aUJBQVMseUJBQVU7QUFDakIsY0FBSUYsT0FBT2tFLE9BQU9sRSxJQUFsQjtBQUNBLGNBQUlBLEtBQUtQLE1BQUwsSUFBZSxDQUFuQixFQUFzQkQsSUFBSTBFLE9BQU9sRSxJQUFYLEVBQXRCLEtBQ0ssSUFBSUEsS0FBS1AsTUFBTCxJQUFlLENBQUMsR0FBcEIsRUFBeUI7QUFDNUI4QixpQkFBS2IsWUFBTCxDQUFrQixFQUFsQjtBQUNBYSxpQkFBS1AsV0FBTCxDQUFpQixFQUFqQjs7QUFFQTtBQUNBTyxpQkFBS0QsT0FBTDtBQUNELFdBTkksTUFNRTtBQUNMa0IsZ0JBQUl4QyxJQUFKO0FBQ0Q7QUFDRixTQXRCUTtBQXVCVDZDLGNBQU07QUFBQSxpQkFBU0wsSUFBSTJCLEtBQUosQ0FBVDtBQUFBLFNBdkJHO0FBd0JUL0Isa0JBQVUsb0JBQU07QUFDZHdCLHFCQUFXO0FBQUEsbUJBQU0zRSxHQUFHbUYsV0FBSCxFQUFOO0FBQUEsV0FBWCxFQUFtQyxHQUFuQztBQUNEO0FBMUJRLE9BQVg7QUE0QkQsS0FsQ00sQ0FBUDtBQW1DRCxHO0FBQ0QzQixPQUFLLGFBQVNwQixHQUFULEVBQTZDO0FBQUEsUUFBL0JyQixJQUErQix1RUFBeEIsRUFBd0I7QUFBQSxRQUFwQitELFdBQW9CLHVFQUFOLElBQU07O0FBQ2hELFdBQU8sS0FBS0YsT0FBTCxDQUFhLEtBQWIsRUFBb0J4QyxHQUFwQixFQUF5QnJCLElBQXpCLEVBQStCK0QsV0FBL0IsQ0FBUDtBQUNELEc7QUFDRE0sUUFBTSxjQUFTaEQsR0FBVCxFQUE2QztBQUFBLFFBQS9CckIsSUFBK0IsdUVBQXhCLEVBQXdCO0FBQUEsUUFBcEIrRCxXQUFvQix1RUFBTixJQUFNOztBQUNqRCxXQUFPLEtBQUtGLE9BQUwsQ0FBYSxNQUFiLEVBQXFCeEMsR0FBckIsRUFBMEJyQixJQUExQixFQUFnQytELFdBQWhDLENBQVA7QUFDRCIsImZpbGUiOiJhcHAud3hhIiwic291cmNlc0NvbnRlbnQiOlsid3gubWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgIHRpdGxlOiBtZXNzYWdlIHx8ICflj5HnlJ/plJnor6/kuoYnLFxuICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgZHVyYXRpb246IDE1MDBcbiAgICB9KVxuICB9XG5cbiAgd3gub25OZXR3b3JrU3RhdHVzQ2hhbmdlKGZ1bmN0aW9uIChyZXMpIHtcbiAgICBjb25zdCBzdGF0dXMgPSByZXMuaXNDb25uZWN0ZWRcbiAgICBpZiAoIXN0YXR1cykge1xuICAgICAgd3gubWVzc2FnZSgn572R57uc6L+e5o6l5aSx6LSl77yM6K+35qOA5p+l572R57ucLi4uJylcbiAgICB9XG4gIH0pXG5cbiAgd3guY2FsbFRlbCA9IGZ1bmN0aW9uICh0ZWxlcGhvbmUpIHtcbiAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgIHBob25lTnVtYmVyOiB0ZWxlcGhvbmUsXG4gICAgfSlcbiAgfVxuXG4gIHd4LmNvcHlUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB3eC5zZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHd4LmdldENsaXBib2FyZERhdGEoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHd4Lm1lc3NhZ2UoJ+WkjeWItuaIkOWKnycpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHBlcm1pc3Npb246IHtcbiAgICAgIC8vIFwic2NvcGUudXNlckluZm9cIjoge1xuICAgICAgLy8gICBkZXNjOiBcIuiOt+WPluaCqOeahOWfuuacrOS/oeaBr1wiXG4gICAgICAvLyB9LFxuICAgICAgXCJzY29wZS51c2VyTG9jYXRpb25cIjoge1xuICAgICAgICBkZXNjOiBcIuS9oOeahOS9jee9ruS/oeaBr+WwhueUqOS6juiuoeeul+S4jumXqOW6l+eahOi3neemu1wiXG4gICAgICB9XG4gICAgfSxcbiAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgIFwibGF5b3V0LWhlYWRcIjogXCJsYXlvdXQvaGVhZFwiXG4gICAgICAvLyAnbGF5b3V0LWZvb3QnOiAnbGF5b3V0L2Zvb3QnXG4gICAgfSxcbiAgICBwYWdlczogW10sXG4gICAgd2luZG93OiB7XG4gICAgICBiYWNrZ3JvdW5kVGV4dFN0eWxlOiBcImxpZ2h0XCIsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIueMq+eahOS4lueVjFwiLFxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogXCJ3aGl0ZVwiXG4gICAgfSxcbiAgICB0YWJCYXI6IHtcbiAgICAgIGNvbG9yOiBcIiM4YThhOGFcIixcbiAgICAgIHNlbGVjdGVkQ29sb3I6IFwiI0UwM0I1OFwiLFxuICAgICAgYm9yZGVyU3R5bGU6IFwiYmxhY2tcIixcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICBsaXN0OiBbXG4gICAgIFxuICAgICAgICB7XG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvYXBwb2ludG1lbnQvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMi5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAyMS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIumihOe6plwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9wYXkvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMy5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAzMS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIuS5sOWNlVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9jZW50ZXIvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wNC5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzA0MS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIuaIkeeahFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9hcnRpY2xlL2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDEucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMTEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLlk4HniYxcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICBuZXR3b3JrVGltZW91dDoge1xuICAgICAgcmVxdWVzdDogMTAwMDBcbiAgICB9XG4gIH0sXG4gIGdsb2JhbERhdGE6IHtcbiAgICBiYXNlVXJsOiBcImh0dHBzOi8vYXBpLm1kc2hpamllLmNvbS9cIixcbiAgICAvLyBiYXNlVXJsOiBcImh0dHA6Ly8xMjcuMC4wLjEvXCIsXG4gICAgdXNlckluZm86IHt9LFxuICAgIHNlc3Npb25faWQ6ICcnLFxuICAgIG5vUGhvbmU6IHRydWUsXG4gIH0sXG5cbiAgc2hvd1RvYXN0KHRleHQpIHtcbiAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgIHRpdGxlOiB0ZXh0LFxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgfSlcbiAgfSxcblxuICBzZXRTZXNzaW9uSWQoc2lkKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZ2xvYmFsRGF0YS5zZXNzaW9uX2lkID0gc2lkXG4gICAgICByZXR1cm4gd3guc2V0U3RvcmFnZVN5bmMoXCJzZXNzaW9uX2lkXCIsIHNpZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICB9LFxuXG4gIGdldFNlc3Npb25JZCgpIHtcbiAgICByZXR1cm4gd3guZ2V0U3RvcmFnZVN5bmMoXCJzZXNzaW9uX2lkXCIpID8gd3guZ2V0U3RvcmFnZVN5bmMoXCJzZXNzaW9uX2lkXCIpIDogdGhpcy5nbG9iYWxEYXRhLnNlc3Npb25faWQ7XG4gIH0sXG5cbiAgc2V0VXNlckluZm8odXNlcikge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmdsb2JhbERhdGEudXNlckluZm8gPSB1c2VyXG4gICAgICByZXR1cm4gd3guc2V0U3RvcmFnZVN5bmMoXCJ1c2VyX2luZm9cIiwgdXNlcik7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSxcblxuICBnZXRVc2VySW5mbygpIHtcbiAgICBjb25zdCB1c2VyID0gd3guZ2V0U3RvcmFnZVN5bmMoXCJ1c2VyX2luZm9cIikgPyB3eC5nZXRTdG9yYWdlU3luYyhcInVzZXJfaW5mb1wiKSA6IHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbztcbiAgICB0aGlzLmdsb2JhbERhdGEudXNlckluZm8gPSB1c2VyXG5cbiAgICByZXR1cm4gdXNlclxuICB9LFxuXG4gIHRvTG9naW4oKSB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcvcGFnZXMvYmluZC9pbmRleCcsXG4gICAgfSlcblxuICB9LFxuXG4gIGdvTG9naW4oKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICBpZiAoc2VsZi5nb0xvZ2luLnNob3cpXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IGF1dGhvcml6ZSA9IHNlbGYuZ2V0U2Vzc2lvbklkKClcbiAgICBjb25zdCBub1Bob25lID0gdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvLm5vUGhvbmVcbiAgICBpZiAoYXV0aG9yaXplICYmICFub1Bob25lKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIGlmICghYXV0aG9yaXplIHx8IG5vUGhvbmUpIHtcbiAgICAgIHNlbGYuZ29Mb2dpbi5zaG93ID0gdHJ1ZVxuICAgICAgLy8gbG9naW5Ub29sLnNldEdvTG9naW4oKVxuICAgICAgbGV0IG1lc3NhZ2UgPSAn5oKo6L+Y5pyq55m75b2V77yM5piv5ZCm55m75b2V77yfJ1xuXG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICBjb250ZW50OiBtZXNzYWdlLFxuICAgICAgICBzdWNjZXNzKGUpIHtcbiAgICAgICAgICBpZiAoZS5jb25maXJtKSB7XG4gICAgICAgICAgICBzZWxmLnRvTG9naW4oKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwYWdlcyA9IGdldEN1cnJlbnRQYWdlcygpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwYWdlcy5sZW5ndGgpXG4gICAgICAgICAgICBpZiAocGFnZXMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgICAgICAgICBkZWx0YTogMixcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogKHJlcykgPT4ge30sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xuICAgICAgICAgICAgICAgIHVybDogJy9wYWdlcy9hcHBvaW50bWVudC9pbmRleCcsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZShlKSB7XG4gICAgICAgICAgc2VsZi5nb0xvZ2luLnNob3cgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBsb2dpbjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHd4LmxvZ2luKHtcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHNlbGYuZ2V0KFwieGN4TG9naW4vYXV0aG9yaXplXCIsIHsgY29kZTogZGF0YS5jb2RlIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBzZWxmLnNldFNlc3Npb25JZChkYXRhLmRhdGEuc2Vzc2lvbl9pZClcbiAgICAgICAgICAgIHJlcyhkYXRhLmRhdGEpXG4gICAgICAgICAgfSkuY2F0Y2goZSA9PiByZWooZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICByZWooZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSlcbiAgIFxuICB9LFxuICBvbkxhdW5jaCgpIHtcbiAgICAvLyB0aGlzLmxvZ2luKCk7XG4gIH0sXG4gIG9uU2hvdygpIHt9LFxuICBvbkhpZGUoKSB7fSxcblxuICBhc2tOb3RpY2UoKSB7XG4gICAgd3guZ2V0U2V0dGluZyh7XG4gICAgICB3aXRoU3Vic2NyaXB0aW9uczogdHJ1ZSxcbiAgICAgIHN1Y2Nlc3MgKHJlcykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuYXV0aFNldHRpbmcpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy5zdWJzY3JpcHRpb25zU2V0dGluZylcbiAgICAgICAgY29uc3Qgc2V0dGluZyA9IHJlcy5zdWJzY3JpcHRpb25zU2V0dGluZ1xuICAgICAgICBjb25zdCBhbGxvd1N1Y2Nlc3NOb3RpY2UgPSAnakdLanZNMTZNeHJtVUgyNHc0WFpxN0IzMGNIOHdJeXFXeEZRUGYxeXBjYydcbiAgICAgICAgY29uc3QgYWxsb3dDYW5jZWxOb3RpY2UgPSAnSmV2OXlIZ2kxeGwwOFdkODBQcERmc2lmUWVUOC1lX19ic3NiRkYwMGo5QSdcbiAgICAgICAgbGV0IHRtcGxJZHMgPSBbXVxuICAgICAgICAvLyBpZiAoc2V0dGluZy5tYWluU3dpdGNoID09IHRydWUpIHtcbiAgICAgICAgY29uc3QgaXRlbVNldHRpbmdzID0gc2V0dGluZy5pdGVtU2V0dGluZ3MgfHwge31cbiAgICAgICAgY29uc29sZS5sb2coc2V0dGluZylcbiAgICAgICAgY29uc29sZS5sb2coaXRlbVNldHRpbmdzKVxuICAgICAgICBpZiAodHlwZW9mIGl0ZW1TZXR0aW5nc1thbGxvd1N1Y2Nlc3NOb3RpY2VdID09PSAndW5kZWZpbmVkJyB8fCBpdGVtU2V0dGluZ3NbYWxsb3dTdWNjZXNzTm90aWNlXSAhPT0gJ2FjY2VwdCcpe1xuICAgICAgICAgIHRtcGxJZHMucHVzaChhbGxvd1N1Y2Nlc3NOb3RpY2UpXG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVNldHRpbmdzW2FsbG93Q2FuY2VsTm90aWNlXSA9PT0gJ3VuZGVmaW5lZCcgfHwgaXRlbVNldHRpbmdzW2FsbG93Q2FuY2VsTm90aWNlXSAhPT0gJ2FjY2VwdCcpe1xuICAgICAgICAgIHRtcGxJZHMucHVzaChhbGxvd0NhbmNlbE5vdGljZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHRtcGxJZHMpXG5cbiAgICAgICAgaWYgKHRtcGxJZHMubGVuZ3RoKSB7XG4gICAgICAgICAgd3gucmVxdWVzdFN1YnNjcmliZU1lc3NhZ2Uoe1xuICAgICAgICAgICAgdG1wbElkcyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ+ivt+WcqOWwj+eoi+W6j+iuvue9rumHjOaJk+W8gOiuoumYhea2iOaBr+aAu+W8gOWFsycsIFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSwgMzAwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIC8vIH1cbiAgICAgIH0sXG4gICAgICBmYWlsKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIGlmIChzaG93TG9hZGluZylcbiAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgIHRpdGxlOiBcIuWKoOi9veS4rS4uLlwiXG4gICAgICAgIH0pO1xuICAgICAgXG4gICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgIFwieC1yZXF1ZXN0ZWQtd2l0aFwiOiBcInhtbGh0dHByZXF1ZXN0XCIsXG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcbiAgICAgICAgICBcIngteGN4XCI6IFwieGN4XCIsXG4gICAgICAgICAgdG9rZW46IHNlbGYuZ2V0U2Vzc2lvbklkKClcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiBzZWxmLmdsb2JhbERhdGEuYmFzZVVybCArIHVybCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgc3VjY2VzczogcmVzdWx0ID0+IHtcbiAgICAgICAgICBsZXQgZGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSAxKSByZXMocmVzdWx0LmRhdGEpO1xuICAgICAgICAgIGVsc2UgaWYgKGRhdGEuc3RhdHVzID09IC05OTkpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0U2Vzc2lvbklkKCcnKVxuICAgICAgICAgICAgc2VsZi5zZXRVc2VySW5mbyh7fSlcblxuICAgICAgICAgICAgLy8g6Lez6L2s5Yiw57uR5a6a6aG1XG4gICAgICAgICAgICBzZWxmLmdvTG9naW4oKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWooZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBlcnJvciA9PiByZWooZXJyb3IpLFxuICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd3guaGlkZUxvYWRpbmcoKSwgNTAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24odXJsLCBkYXRhID0ge30sIHNob3dMb2FkaW5nID0gdHJ1ZSkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXCJHRVRcIiwgdXJsLCBkYXRhLCBzaG93TG9hZGluZyk7XG4gIH0sXG4gIHBvc3Q6IGZ1bmN0aW9uKHVybCwgZGF0YSA9IHt9LCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFwiUE9TVFwiLCB1cmwsIGRhdGEsIHNob3dMb2FkaW5nKTtcbiAgfVxufTsiXX0=