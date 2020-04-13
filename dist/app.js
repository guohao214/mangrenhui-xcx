'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _globalData;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  globalData: (_globalData = {
    baseUrl: "https://api.mangrenhui.cn/"
  }, _defineProperty(_globalData, 'baseUrl', "http://127.0.0.1:8080/"), _defineProperty(_globalData, 'userInfo', {}), _defineProperty(_globalData, 'noPhone', true), _globalData),

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC53eGEiXSwibmFtZXMiOlsid3giLCJtZXNzYWdlIiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJvbk5ldHdvcmtTdGF0dXNDaGFuZ2UiLCJyZXMiLCJzdGF0dXMiLCJpc0Nvbm5lY3RlZCIsImNhbGxUZWwiLCJ0ZWxlcGhvbmUiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiLCJjb3B5VGV4dCIsImRhdGEiLCJzZXRDbGlwYm9hcmREYXRhIiwic3VjY2VzcyIsImdldENsaXBib2FyZERhdGEiLCJnbG9iYWxEYXRhIiwiYmFzZVVybCIsInNldFNlc3Npb25JZCIsInNpZCIsInNldFN0b3JhZ2VTeW5jIiwiZ2V0U2Vzc2lvbklkIiwiZ2V0U3RvcmFnZVN5bmMiLCJzZXRVc2VySW5mbyIsInVzZXIiLCJ1c2VySW5mbyIsImdldFVzZXJJbmZvIiwidG9Mb2dpbiIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJnb0xvZ2luIiwic2VsZiIsInNob3ciLCJhdXRob3JpemUiLCJub1Bob25lIiwic2hvd01vZGFsIiwiY29udGVudCIsImUiLCJjb25maXJtIiwicGFnZXMiLCJnZXRDdXJyZW50UGFnZXMiLCJjb25zb2xlIiwibG9nIiwibGVuZ3RoIiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJjb21wbGV0ZSIsInN3aXRjaFRhYiIsImxvZ2luIiwiUHJvbWlzZSIsInJlaiIsImdldCIsImNvZGUiLCJ0aGVuIiwic2Vzc2lvbl9pZCIsImNhdGNoIiwiZmFpbCIsIm9uTGF1bmNoIiwib25TaG93Iiwib25IaWRlIiwicmVxdWVzdCIsIm1ldGhvZCIsInNob3dMb2FkaW5nIiwiaGVhZGVyIiwidG9rZW4iLCJyZXN1bHQiLCJlcnJvciIsInNldFRpbWVvdXQiLCJoaWRlTG9hZGluZyIsInBvc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsR0FBR0MsT0FBSCxHQUFhLFVBQVVBLE9BQVYsRUFBbUI7QUFDNUJELEtBQUdFLFNBQUgsQ0FB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TyxLQUFLRixPQUFMLENBQWEsTUFBYixFQUFxQi9CLEdBQXJCLEVBQTBCakIsSUFBMUIsRUFBZ0NrRCxXQUFoQyxDQUFQO0FBQ0QiLCJmaWxlIjoiYXBwLnd4YSIsInNvdXJjZXNDb250ZW50IjpbInd4Lm1lc3NhZ2UgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICB0aXRsZTogbWVzc2FnZSB8fCAn5Y+R55Sf6ZSZ6K+v5LqGJyxcbiAgICAgIGljb246ICdub25lJyxcbiAgICAgIGR1cmF0aW9uOiAxNTAwXG4gICAgfSlcbiAgfVxuXG4gIHd4Lm9uTmV0d29ya1N0YXR1c0NoYW5nZShmdW5jdGlvbiAocmVzKSB7XG4gICAgY29uc3Qgc3RhdHVzID0gcmVzLmlzQ29ubmVjdGVkXG4gICAgaWYgKCFzdGF0dXMpIHtcbiAgICAgIHd4Lm1lc3NhZ2UoJ+e9kee7nOi/nuaOpeWksei0pe+8jOivt+ajgOafpee9kee7nC4uLicpXG4gICAgfVxuICB9KVxuXG4gIHd4LmNhbGxUZWwgPSBmdW5jdGlvbiAodGVsZXBob25lKSB7XG4gICAgd3gubWFrZVBob25lQ2FsbCh7XG4gICAgICBwaG9uZU51bWJlcjogdGVsZXBob25lLFxuICAgIH0pXG4gIH1cblxuICB3eC5jb3B5VGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgd3guc2V0Q2xpcGJvYXJkRGF0YSh7XG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB3eC5nZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICB3eC5tZXNzYWdlKCflpI3liLbmiJDlip8nKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBwZXJtaXNzaW9uOiB7XG4gICAgICAvLyBcInNjb3BlLnVzZXJJbmZvXCI6IHtcbiAgICAgIC8vICAgZGVzYzogXCLojrflj5bmgqjnmoTln7rmnKzkv6Hmga9cIlxuICAgICAgLy8gfSxcbiAgICAgIFwic2NvcGUudXNlckxvY2F0aW9uXCI6IHtcbiAgICAgICAgZGVzYzogXCLkvaDnmoTkvY3nva7kv6Hmga/lsIbnlKjkuo7orqHnrpfkuI7pl6jlupfnmoTot53nprtcIlxuICAgICAgfVxuICAgIH0sXG4gICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICBcImxheW91dC1oZWFkXCI6IFwibGF5b3V0L2hlYWRcIlxuICAgICAgLy8gJ2xheW91dC1mb290JzogJ2xheW91dC9mb290J1xuICAgIH0sXG4gICAgcGFnZXM6IFtdLFxuICAgIHdpbmRvdzoge1xuICAgICAgYmFja2dyb3VuZFRleHRTdHlsZTogXCJsaWdodFwiLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCLnjKvnmoTkuJbnlYxcIixcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6IFwid2hpdGVcIlxuICAgIH0sXG4gICAgdGFiQmFyOiB7XG4gICAgICBjb2xvcjogXCIjOGE4YThhXCIsXG4gICAgICBzZWxlY3RlZENvbG9yOiBcIiMwMDAwMDBcIixcbiAgICAgIGJvcmRlclN0eWxlOiBcImJsYWNrXCIsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgbGlzdDogW1xuICAgICAgICB7XG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvYXJ0aWNsZS9pbmRleFwiLFxuICAgICAgICAgIGljb25QYXRoOiBcImNvbW1vbi9hc3NldHMvdGFiLzAyLnBuZ1wiLFxuICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDIxLnBuZ1wiLFxuICAgICAgICAgIHRleHQ6IFwi5ZOB54mMXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL2FwcG9pbnRtZW50L2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDMucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMzEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLpooTnuqZcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvcGF5L2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDEucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wMTEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLkubDljZVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvY2VudGVyL2luZGV4XCIsXG4gICAgICAgICAgaWNvblBhdGg6IFwiY29tbW9uL2Fzc2V0cy90YWIvMDQucG5nXCIsXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJjb21tb24vYXNzZXRzL3RhYi8wNDEucG5nXCIsXG4gICAgICAgICAgdGV4dDogXCLmiJHnmoRcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICBuZXR3b3JrVGltZW91dDoge1xuICAgICAgcmVxdWVzdDogMTAwMDBcbiAgICB9XG4gIH0sXG4gIGdsb2JhbERhdGE6IHtcbiAgICBiYXNlVXJsOiBcImh0dHBzOi8vYXBpLm1hbmdyZW5odWkuY24vXCIsXG4gICAgYmFzZVVybDogXCJodHRwOi8vMTI3LjAuMC4xOjgwODAvXCIsXG4gICAgdXNlckluZm86IHt9LFxuICAgIG5vUGhvbmU6IHRydWUsXG4gIH0sXG5cbiAgc2V0U2Vzc2lvbklkKHNpZCkge1xuICAgIHJldHVybiB3eC5zZXRTdG9yYWdlU3luYyhcInNlc3Npb25faWRcIiwgc2lkKTtcbiAgfSxcblxuICBnZXRTZXNzaW9uSWQoKSB7XG4gICAgcmV0dXJuIHd4LmdldFN0b3JhZ2VTeW5jKFwic2Vzc2lvbl9pZFwiKTtcbiAgfSxcblxuICBzZXRVc2VySW5mbyh1c2VyKSB7XG4gICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gdXNlclxuICAgIHJldHVybiB3eC5zZXRTdG9yYWdlU3luYyhcInVzZXJfaW5mb1wiLCB1c2VyKTtcbiAgfSxcblxuICBnZXRVc2VySW5mbygpIHtcbiAgICBjb25zdCB1c2VyID0gd3guZ2V0U3RvcmFnZVN5bmMoXCJ1c2VyX2luZm9cIik7XG4gICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gdXNlclxuXG4gICAgcmV0dXJuIHVzZXJcbiAgfSxcblxuICB0b0xvZ2luKCkge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnL3BhZ2VzL2JpbmQvaW5kZXgnLFxuICAgIH0pXG5cbiAgfSxcblxuICBnb0xvZ2luKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgaWYgKHNlbGYuZ29Mb2dpbi5zaG93KVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBhdXRob3JpemUgPSBzZWxmLmdldFNlc3Npb25JZCgpXG4gICAgY29uc3Qgbm9QaG9uZSA9IHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mby5ub1Bob25lXG4gICAgaWYgKGF1dGhvcml6ZSAmJiAhbm9QaG9uZSlcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBpZiAoIWF1dGhvcml6ZSB8fCBub1Bob25lKSB7XG4gICAgICBzZWxmLmdvTG9naW4uc2hvdyA9IHRydWVcbiAgICAgIC8vIGxvZ2luVG9vbC5zZXRHb0xvZ2luKClcbiAgICAgIGxldCBtZXNzYWdlID0gJ+aCqOi/mOacqueZu+W9le+8jOaYr+WQpueZu+W9le+8nydcblxuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgY29udGVudDogbWVzc2FnZSxcbiAgICAgICAgc3VjY2VzcyhlKSB7XG4gICAgICAgICAgaWYgKGUuY29uZmlybSkge1xuICAgICAgICAgICAgc2VsZi50b0xvZ2luKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGFnZXMgPSBnZXRDdXJyZW50UGFnZXMoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocGFnZXMubGVuZ3RoKVxuICAgICAgICAgICAgaWYgKHBhZ2VzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgICAgICAgICAgZGVsdGE6IDIsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IChyZXMpID0+IHt9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvYXBwb2ludG1lbnQvaW5kZXgnLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGUoZSkge1xuICAgICAgICAgIHNlbGYuZ29Mb2dpbi5zaG93ID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgbG9naW46IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICB3eC5sb2dpbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBzZWxmLmdldChcInhjeExvZ2luL2F1dGhvcml6ZVwiLCB7IGNvZGU6IGRhdGEuY29kZSB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgc2VsZi5zZXRTZXNzaW9uSWQoZGF0YS5kYXRhLnNlc3Npb25faWQpXG4gICAgICAgICAgICByZXMoZGF0YS5kYXRhKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gcmVqKGUpKVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgcmVqKGUpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pXG4gICBcbiAgfSxcbiAgb25MYXVuY2goKSB7XG4gICAgLy8gdGhpcy5sb2dpbigpO1xuICB9LFxuICBvblNob3coKSB7fSxcbiAgb25IaWRlKCkge30sXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIGlmIChzaG93TG9hZGluZylcbiAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgIHRpdGxlOiBcIuWKoOi9veS4rS4uLlwiXG4gICAgICAgIH0pO1xuICAgICAgXG4gICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgIFwieC1yZXF1ZXN0ZWQtd2l0aFwiOiBcInhtbGh0dHByZXF1ZXN0XCIsXG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcbiAgICAgICAgICBcIngteGN4XCI6IFwieGN4XCIsXG4gICAgICAgICAgdG9rZW46IHd4LmdldFN0b3JhZ2VTeW5jKFwic2Vzc2lvbl9pZFwiKVxuICAgICAgICB9LFxuICAgICAgICB1cmw6IHRoaXMuZ2xvYmFsRGF0YS5iYXNlVXJsICsgdXJsLFxuICAgICAgICBkYXRhLFxuICAgICAgICBzdWNjZXNzOiByZXN1bHQgPT4ge1xuICAgICAgICAgIGxldCBkYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09IDEpIHJlcyhyZXN1bHQuZGF0YSk7XG4gICAgICAgICAgZWxzZSBpZiAoZGF0YS5zdGF0dXMgPT0gLTk5OSkge1xuICAgICAgICAgICAgLy8g6Lez6L2s5Yiw57uR5a6a6aG1XG4gICAgICAgICAgICBzZWxmLmdvTG9naW4oKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWooZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBlcnJvciA9PiByZWooZXJyb3IpLFxuICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd3guaGlkZUxvYWRpbmcoKSwgNTAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24odXJsLCBkYXRhID0ge30sIHNob3dMb2FkaW5nID0gdHJ1ZSkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXCJHRVRcIiwgdXJsLCBkYXRhLCBzaG93TG9hZGluZyk7XG4gIH0sXG4gIHBvc3Q6IGZ1bmN0aW9uKHVybCwgZGF0YSA9IHt9LCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFwiUE9TVFwiLCB1cmwsIGRhdGEsIHNob3dMb2FkaW5nKTtcbiAgfVxufTsiXX0=