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
    console.log('authorize', authorize);
    var noPhone = this.globalData.userInfo.noPhone;
    if (authorize && !noPhone) return true;

    if (!authorize || noPhone) {
      self.goLogin.show = true;
      // loginTool.setGoLogin()
      var message = '您还未登录，是否登录？';

      if (authorize && noPhone) message = '猫的世界需要获取您的手机号';

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
    var authData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var self = this;
    return new Promise(function (res, rej) {
      wx.login({
        success: function success(data) {
          self.post("xcxLogin/authorize", { code: data.code, authData: authData }).then(function (data) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC53eGEiXSwibmFtZXMiOlsid3giLCJtZXNzYWdlIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJvbk5ldHdvcmtTdGF0dXNDaGFuZ2UiLCJyZXMiLCJzdGF0dXMiLCJpc0Nvbm5lY3RlZCIsImNhbGxUZWwiLCJ0ZWxlcGhvbmUiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJjb3B5VGV4dCIsImRhdGEiLCJzZXRDbGlwYm9hcmREYXRhIiwic3VjY2VzcyIsImdldENsaXBib2FyZERhdGEiLCJnbG9iYWxEYXRhIiwiYmFzZVVybCIsInVzZXJJbmZvIiwic2Vzc2lvbl9pZCIsIm5vUGhvbmUiLCJ0ZXh0Iiwic2V0U2Vzc2lvbklkIiwic2lkIiwic2V0U3RvcmFnZVN5bmMiLCJlIiwiZ2V0U2Vzc2lvbklkIiwiZ2V0U3RvcmFnZVN5bmMiLCJzZXRVc2VySW5mbyIsInVzZXIiLCJnZXRVc2VySW5mbyIsInRvTG9naW4iLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZ29Mb2dpbiIsInNlbGYiLCJzaG93IiwiYXV0aG9yaXplIiwiY29uc29sZSIsImxvZyIsInNob3dNb2RhbCIsImNvbnRlbnQiLCJjb25maXJtIiwicGFnZXMiLCJnZXRDdXJyZW50UGFnZXMiLCJsZW5ndGgiLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsImNvbXBsZXRlIiwic3dpdGNoVGFiIiwibG9naW4iLCJhdXRoRGF0YSIsIlByb21pc2UiLCJyZWoiLCJwb3N0IiwiY29kZSIsInRoZW4iLCJjYXRjaCIsImZhaWwiLCJvbkxhdW5jaCIsIm9uU2hvdyIsIm9uSGlkZSIsImFza05vdGljZSIsImdldFNldHRpbmciLCJ3aXRoU3Vic2NyaXB0aW9ucyIsInNldHRpbmciLCJzdWJzY3JpcHRpb25zU2V0dGluZyIsImFsbG93U3VjY2Vzc05vdGljZSIsImFsbG93Q2FuY2VsTm90aWNlIiwidG1wbElkcyIsIml0ZW1TZXR0aW5ncyIsInB1c2giLCJyZXF1ZXN0U3Vic2NyaWJlTWVzc2FnZSIsInNldFRpbWVvdXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwic2hvd0xvYWRpbmciLCJoZWFkZXIiLCJ0b2tlbiIsInJlc3VsdCIsImVycm9yIiwiaGlkZUxvYWRpbmciLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUFBLEdBQUdDLE9BQUgsR0FBYSxVQUFVQSxPQUFWLEVBQW1CO0FBQzVCRCxLQUFHRSxTQUFILENBQWE7QUFDWEMsV0FBT0YsV0FBVyxPQURQO0FBRVhHLFVBQU0sTUFGSztBQUdYQyxjQUFVO0FBSEMsR0FBYjtBQUtELENBTkg7O0FBUUVMLEdBQUdNLHFCQUFILENBQXlCLFVBQVVDLEdBQVYsRUFBZTtBQUN0QyxNQUFNQyxTQUFTRCxJQUFJRSxXQUFuQjtBQUNBLE1BQUksQ0FBQ0QsTUFBTCxFQUFhO0FBQ1hSLE9BQUdDLE9BQUgsQ0FBVyxpQkFBWDtBQUNEO0FBQ0YsQ0FMRDs7QUFPQUQsR0FBR1UsT0FBSCxHQUFhLFVBQVVDLFNBQVYsRUFBcUI7QUFDaENYLEtBQUdZLGFBQUgsQ0FBaUI7QUFDZkMsaUJBQWFGO0FBREUsR0FBakI7QUFHRCxDQUpEOztBQU1BWCxHQUFHYyxRQUFILEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUM1QmYsS0FBR2dCLGdCQUFILENBQW9CO0FBQ2xCRCxVQUFNQSxJQURZO0FBRWxCRSxhQUFTLGlCQUFVVixHQUFWLEVBQWU7QUFDdEJQLFNBQUdrQixnQkFBSCxDQUFvQjtBQUNsQkQsaUJBQVMsaUJBQVVWLEdBQVYsRUFBZTtBQUN0QlAsYUFBR0MsT0FBSCxDQUFXLE1BQVg7QUFDRDtBQUhpQixPQUFwQjtBQUtEO0FBUmlCLEdBQXBCO0FBVUQsQ0FYRDs7O0FBeUVBa0IsY0FBWTtBQUNWQyxhQUFTLDJCQURDO0FBRVY7QUFDQUMsY0FBVSxFQUhBO0FBSVZDLGdCQUFZLEVBSkY7QUFLVkMsYUFBUztBQUxDLEc7O0FBUVpyQixXLHFCQUFVc0IsSSxFQUFNO0FBQ1p4QixPQUFHRSxTQUFILENBQWE7QUFDWEMsYUFBT3FCLElBREk7QUFFWG5C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QUwsQ0FBYSxNQUFiLEVBQXFCekMsR0FBckIsRUFBMEJyQixJQUExQixFQUFnQ2dFLFdBQWhDLENBQVA7QUFDRCIsImZpbGUiOiJhcHAud3hhIiwic291cmNlc0NvbnRlbnQiOlsid3gubWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgIHRpdGxlOiBtZXNzYWdlIHx8ICflj5HnlJ/plJnor6/kuoYnLFxuICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgZHVyYXRpb246IDE1MDBcbiAgICB9KVxuICB9XG5cbiAgd3gub25OZXR3b3JrU3RhdHVzQ2hhbmdlKGZ1bmN0aW9uIChyZXMpIHtcbiAgICBjb25zdCBzdGF0dXMgPSByZXMuaXNDb25uZWN0ZWRcbiAgICBpZiAoIXN0YXR1cykge1xuICAgICAgd3gubWVzc2FnZSgn572R57uc6L+e5o6l5aSx6LSl77yM6K+35qOA5p+l572R57ucLi4uJylcbiAgICB9XG4gIH0pXG5cbiAgd3guY2FsbFRlbCA9IGZ1bmN0aW9uICh0ZWxlcGhvbmUpIHtcbiAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgIHBob25lTnVtYmVyOiB0ZWxlcGhvbmUsXG4gICAgfSlcbiAgfVxuXG4gIHd4LmNvcHlUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB3eC5zZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHd4LmdldENsaXBib2FyZERhdGEoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHd4Lm1lc3NhZ2UoJ+WkjeWItuaIkOWKnycpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHBlcm1pc3Npb246IHtcbiAgICAgIC8vIFwic2NvcGUudXNlckluZm9cIjoge1xuICAgICAgLy8gICBkZXNjOiBcIuiOt+WPluaCqOeahOWfuuacrOS/oeaBr1wiXG4gICAgICAvLyB9LFxuICAgICAgXCJzY29wZS51c2VyTG9jYXRpb25cIjoge1xuICAgICAgICBkZXNjOiBcIuS9oOeahOS9jee9ruS/oeaBr+WwhueUqOS6juiuoeeul+S4jumXqOW6l+eahOi3neemu1wiXG4gICAgICB9XG4gICAgfSxcbiAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgIFwibGF5b3V0LWhlYWRcIjogXCJsYXlvdXQvaGVhZFwiXG4gICAgICAvLyAnbGF5b3V0LWZvb3QnOiAnbGF5b3V0L2Zvb3QnXG4gICAgfSxcbiAgICBwYWdlczogW10sXG4gICAgd2luZG93OiB7XG4gICAgICBiYWNrZ3JvdW5kVGV4dFN0eWxlOiBcImxpZ2h0XCIsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIueMq+eahOS4lueVjFwiLFxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogXCJ3aGl0ZVwiXG4gICAgfSxcbiAgICB0YWJCYXI6IHtcbiAgICAgIGNvbG9yOiBcIiM4YThhOGFcIixcbiAgICAgIHNlbGVjdGVkQ29sb3I6IFwiI0UwM0I1OFwiLFxuICAgICAgYm9yZGVyU3R5bGU6IFwiYmxhY2tcIixcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICBsaXN0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL2FydGljbGUvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMS5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAxMS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIuWTgeeJjFwiXG4gICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL2FwcG9pbnRtZW50L2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDIucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMjEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLpooTnuqZcIlxuICAgICAgICB9LFxuICAgXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9wYXkvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMy5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAzMS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIuS5sOWNlVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9jZW50ZXIvaW5kZXhcIixcbiAgICAgICAgICBpY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wNC5wbmdcIixcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzA0MS5wbmdcIixcbiAgICAgICAgICB0ZXh0OiBcIuaIkeeahFwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIG5ldHdvcmtUaW1lb3V0OiB7XG4gICAgICByZXF1ZXN0OiAxMDAwMFxuICAgIH1cbiAgfSxcbiAgZ2xvYmFsRGF0YToge1xuICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkubWRzaGlqaWUuY29tL1wiLFxuICAgIC8vIGJhc2VVcmw6IFwiaHR0cDovLzEyNy4wLjAuMS9cIixcbiAgICB1c2VySW5mbzoge30sXG4gICAgc2Vzc2lvbl9pZDogJycsXG4gICAgbm9QaG9uZTogdHJ1ZSxcbiAgfSxcblxuICBzaG93VG9hc3QodGV4dCkge1xuICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgdGl0bGU6IHRleHQsXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICBpY29uOiAnbm9uZSdcbiAgICB9KVxuICB9LFxuXG4gIHNldFNlc3Npb25JZChzaWQpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5nbG9iYWxEYXRhLnNlc3Npb25faWQgPSBzaWRcbiAgICAgIHJldHVybiB3eC5zZXRTdG9yYWdlU3luYyhcInNlc3Npb25faWRcIiwgc2lkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gIH0sXG5cbiAgZ2V0U2Vzc2lvbklkKCkge1xuICAgIHJldHVybiB3eC5nZXRTdG9yYWdlU3luYyhcInNlc3Npb25faWRcIikgPyB3eC5nZXRTdG9yYWdlU3luYyhcInNlc3Npb25faWRcIikgOiB0aGlzLmdsb2JhbERhdGEuc2Vzc2lvbl9pZDtcbiAgfSxcblxuICBzZXRVc2VySW5mbyh1c2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHVzZXJcbiAgICAgIHJldHVybiB3eC5zZXRTdG9yYWdlU3luYyhcInVzZXJfaW5mb1wiLCB1c2VyKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9LFxuXG4gIGdldFVzZXJJbmZvKCkge1xuICAgIGNvbnN0IHVzZXIgPSB3eC5nZXRTdG9yYWdlU3luYyhcInVzZXJfaW5mb1wiKSA/IHd4LmdldFN0b3JhZ2VTeW5jKFwidXNlcl9pbmZvXCIpIDogdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvO1xuICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHVzZXJcblxuICAgIHJldHVybiB1c2VyXG4gIH0sXG5cbiAgdG9Mb2dpbigpIHtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIHVybDogJy9wYWdlcy9iaW5kL2luZGV4JyxcbiAgICB9KVxuXG4gIH0sXG5cbiAgZ29Mb2dpbigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIGlmIChzZWxmLmdvTG9naW4uc2hvdylcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgYXV0aG9yaXplID0gc2VsZi5nZXRTZXNzaW9uSWQoKVxuICAgIGNvbnNvbGUubG9nKCdhdXRob3JpemUnLCBhdXRob3JpemUpXG4gICAgY29uc3Qgbm9QaG9uZSA9IHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mby5ub1Bob25lXG4gICAgaWYgKGF1dGhvcml6ZSAmJiAhbm9QaG9uZSlcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBpZiAoIWF1dGhvcml6ZSB8fCBub1Bob25lKSB7XG4gICAgICBzZWxmLmdvTG9naW4uc2hvdyA9IHRydWVcbiAgICAgIC8vIGxvZ2luVG9vbC5zZXRHb0xvZ2luKClcbiAgICAgIGxldCBtZXNzYWdlID0gJ+aCqOi/mOacqueZu+W9le+8jOaYr+WQpueZu+W9le+8nydcblxuICAgICAgaWYgKGF1dGhvcml6ZSAmJiBub1Bob25lKVxuICAgICAgICBtZXNzYWdlID0gJ+eMq+eahOS4lueVjOmcgOimgeiOt+WPluaCqOeahOaJi+acuuWPtydcblxuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgY29udGVudDogbWVzc2FnZSxcbiAgICAgICAgc3VjY2VzcyhlKSB7XG4gICAgICAgICAgaWYgKGUuY29uZmlybSkge1xuICAgICAgICAgICAgc2VsZi50b0xvZ2luKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGFnZXMgPSBnZXRDdXJyZW50UGFnZXMoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocGFnZXMubGVuZ3RoKVxuICAgICAgICAgICAgaWYgKHBhZ2VzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgICAgICAgICAgZGVsdGE6IDIsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IChyZXMpID0+IHt9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvYXBwb2ludG1lbnQvaW5kZXgnLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGUoZSkge1xuICAgICAgICAgIHNlbGYuZ29Mb2dpbi5zaG93ID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgbG9naW46IGZ1bmN0aW9uKGF1dGhEYXRhID0gJycpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgd3gubG9naW4oe1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgc2VsZi5wb3N0KFwieGN4TG9naW4vYXV0aG9yaXplXCIsIHsgY29kZTogZGF0YS5jb2RlLCBhdXRoRGF0YTogYXV0aERhdGEgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIHNlbGYuc2V0U2Vzc2lvbklkKGRhdGEuZGF0YS5zZXNzaW9uX2lkKVxuICAgICAgICAgICAgcmVzKGRhdGEuZGF0YSlcbiAgICAgICAgICB9KS5jYXRjaChlID0+IHJlaihlKSlcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHJlaihlKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KVxuICAgXG4gIH0sXG4gIG9uTGF1bmNoKCkge1xuICAgIC8vIHRoaXMubG9naW4oKTtcbiAgfSxcbiAgb25TaG93KCkge30sXG4gIG9uSGlkZSgpIHt9LFxuXG4gIGFza05vdGljZSgpIHtcbiAgICB3eC5nZXRTZXR0aW5nKHtcbiAgICAgIHdpdGhTdWJzY3JpcHRpb25zOiB0cnVlLFxuICAgICAgc3VjY2VzcyAocmVzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy5hdXRoU2V0dGluZylcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLnN1YnNjcmlwdGlvbnNTZXR0aW5nKVxuICAgICAgICBjb25zdCBzZXR0aW5nID0gcmVzLnN1YnNjcmlwdGlvbnNTZXR0aW5nXG4gICAgICAgIGNvbnN0IGFsbG93U3VjY2Vzc05vdGljZSA9ICdqR0tqdk0xNk14cm1VSDI0dzRYWnE3QjMwY0g4d0l5cVd4RlFQZjF5cGNjJ1xuICAgICAgICBjb25zdCBhbGxvd0NhbmNlbE5vdGljZSA9ICdKZXY5eUhnaTF4bDA4V2Q4MFBwRGZzaWZRZVQ4LWVfX2Jzc2JGRjAwajlBJ1xuICAgICAgICBsZXQgdG1wbElkcyA9IFtdXG4gICAgICAgIC8vIGlmIChzZXR0aW5nLm1haW5Td2l0Y2ggPT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBpdGVtU2V0dGluZ3MgPSBzZXR0aW5nLml0ZW1TZXR0aW5ncyB8fCB7fVxuICAgICAgICBjb25zb2xlLmxvZyhzZXR0aW5nKVxuICAgICAgICBjb25zb2xlLmxvZyhpdGVtU2V0dGluZ3MpXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVNldHRpbmdzW2FsbG93U3VjY2Vzc05vdGljZV0gPT09ICd1bmRlZmluZWQnIHx8IGl0ZW1TZXR0aW5nc1thbGxvd1N1Y2Nlc3NOb3RpY2VdICE9PSAnYWNjZXB0Jyl7XG4gICAgICAgICAgdG1wbElkcy5wdXNoKGFsbG93U3VjY2Vzc05vdGljZSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtU2V0dGluZ3NbYWxsb3dDYW5jZWxOb3RpY2VdID09PSAndW5kZWZpbmVkJyB8fCBpdGVtU2V0dGluZ3NbYWxsb3dDYW5jZWxOb3RpY2VdICE9PSAnYWNjZXB0Jyl7XG4gICAgICAgICAgdG1wbElkcy5wdXNoKGFsbG93Q2FuY2VsTm90aWNlKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2codG1wbElkcylcblxuICAgICAgICBpZiAodG1wbElkcy5sZW5ndGgpIHtcbiAgICAgICAgICB3eC5yZXF1ZXN0U3Vic2NyaWJlTWVzc2FnZSh7XG4gICAgICAgICAgICB0bXBsSWRzLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsKGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn6K+35Zyo5bCP56iL5bqP6K6+572u6YeM5omT5byA6K6i6ZiF5raI5oGv5oC75byA5YWzJywgXG4gICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9LCAzMDAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgfSxcbiAgICAgIGZhaWwoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIHNob3dMb2FkaW5nID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgaWYgKHNob3dMb2FkaW5nKVxuICAgICAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgICAgdGl0bGU6IFwi5Yqg6L295LitLi4uXCJcbiAgICAgICAgfSk7XG4gICAgICBcbiAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgXCJ4LXJlcXVlc3RlZC13aXRoXCI6IFwieG1saHR0cHJlcXVlc3RcIixcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxuICAgICAgICAgIFwieC14Y3hcIjogXCJ4Y3hcIixcbiAgICAgICAgICB0b2tlbjogc2VsZi5nZXRTZXNzaW9uSWQoKVxuICAgICAgICB9LFxuICAgICAgICB1cmw6IHNlbGYuZ2xvYmFsRGF0YS5iYXNlVXJsICsgdXJsLFxuICAgICAgICBkYXRhLFxuICAgICAgICBzdWNjZXNzOiByZXN1bHQgPT4ge1xuICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09IDEpIHJlcyhyZXN1bHQuZGF0YSk7XG4gICAgICAgICAgZWxzZSBpZiAoZGF0YS5zdGF0dXMgPT0gLTk5OSkge1xuICAgICAgICAgICAgc2VsZi5zZXRTZXNzaW9uSWQoJycpXG4gICAgICAgICAgICBzZWxmLnNldFVzZXJJbmZvKHt9KVxuXG4gICAgICAgICAgICAvLyDot7PovazliLDnu5HlrprpobVcbiAgICAgICAgICAgIHNlbGYuZ29Mb2dpbigpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlaihkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGVycm9yID0+IHJlaihlcnJvciksXG4gICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3eC5oaWRlTG9hZGluZygpLCA1MDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbih1cmwsIGRhdGEgPSB7fSwgc2hvd0xvYWRpbmcgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcIkdFVFwiLCB1cmwsIGRhdGEsIHNob3dMb2FkaW5nKTtcbiAgfSxcbiAgcG9zdDogZnVuY3Rpb24odXJsLCBkYXRhID0ge30sIHNob3dMb2FkaW5nID0gdHJ1ZSkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXCJQT1NUXCIsIHVybCwgZGF0YSwgc2hvd0xvYWRpbmcpO1xuICB9XG59OyJdfQ==