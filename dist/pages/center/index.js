'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  onLoad: function onLoad() {
    var self = this;
    wx.getUserInfo({
      success: function success(res) {
        var user = res.userInfo;
        var nickName = user.nickName,
            avatarUrl = user.avatarUrl;

        self.setData({
          nickName: nickName,
          avatarUrl: avatarUrl
        });
      },
      fail: function fail() {
        wx.openSetting({
          success: function success(res) {
            var authSetting = res.authSetting;
            if (authSetting && authSetting['scope.userInfo'] && authSetting['scope.userInfo'] === true) {
              wx.reLaunch({
                url: '/pages/center/index'
              });
            }
          }
        });
      }
    });
  },
  data: {
    '__code__': {
      readme: ''
    },

    nickName: '',
    avatarUrl: ''
  },
  callPhone: function callPhone() {
    wx.makePhoneCall({
      phoneNumber: '18966786655'
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJvbkxvYWQiLCJzZWxmIiwid3giLCJnZXRVc2VySW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJ1c2VyIiwidXNlckluZm8iLCJuaWNrTmFtZSIsImF2YXRhclVybCIsInNldERhdGEiLCJmYWlsIiwib3BlblNldHRpbmciLCJhdXRoU2V0dGluZyIsInJlTGF1bmNoIiwidXJsIiwiZGF0YSIsImNhbGxQaG9uZSIsIm1ha2VQaG9uZUNhbGwiLCJwaG9uZU51bWJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUlBLFVBQVEsa0JBQVk7QUFDbEIsUUFBSUMsT0FBTyxJQUFYO0FBQ0FDLE9BQUdDLFdBQUgsQ0FBZTtBQUNiQyxlQUFTLGlCQUFVQyxHQUFWLEVBQWU7QUFDdEIsWUFBSUMsT0FBT0QsSUFBSUUsUUFBZjtBQURzQixZQUVqQkMsUUFGaUIsR0FFTUYsSUFGTixDQUVqQkUsUUFGaUI7QUFBQSxZQUVQQyxTQUZPLEdBRU1ILElBRk4sQ0FFUEcsU0FGTzs7QUFHdEJSLGFBQUtTLE9BQUwsQ0FBYTtBQUNYRixvQkFBVUEsUUFEQztBQUVYQyxxQkFBV0E7QUFGQSxTQUFiO0FBSUQsT0FSWTtBQVNiRSxZQUFNLGdCQUFZO0FBQ2hCVCxXQUFHVSxXQUFILENBQWU7QUFDYlIsbUJBQVMsaUJBQVVDLEdBQVYsRUFBZTtBQUN0QixnQkFBSVEsY0FBY1IsSUFBSVEsV0FBdEI7QUFDQSxnQkFBSUEsZUFBZUEsWUFBWSxnQkFBWixDQUFmLElBQWdEQSxZQUFZLGdCQUFaLE1BQWtDLElBQXRGLEVBQTRGO0FBQzFGWCxpQkFBR1ksUUFBSCxDQUFZO0FBQ1ZDLHFCQUFLO0FBREssZUFBWjtBQUdEO0FBQ0Y7QUFSWSxTQUFmO0FBVUQ7QUFwQlksS0FBZjtBQXNCRCxHO0FBQ0RDLFFBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ0pSLGNBQVUsRUFETjtBQUVKQyxlQUFXO0FBRlAsRztBQUlOUSxhQUFXLHFCQUFZO0FBQ3JCZixPQUFHZ0IsYUFBSCxDQUFpQjtBQUNmQyxtQkFBYTtBQURFLEtBQWpCO0FBR0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+aIkeeahCcsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1pY29uJzogJ0BtaW51aS93eGMtaWNvbicsXG4gICAgICAgICd3eGMtYXZhdGFyJzogJ0BtaW51aS93eGMtYXZhdGFyJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICB3eC5nZXRVc2VySW5mbyh7XG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICBsZXQgdXNlciA9IHJlcy51c2VySW5mb1xuICAgICAgICAgIGxldCB7bmlja05hbWUsIGF2YXRhclVybH0gPSB1c2VyXG4gICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgIG5pY2tOYW1lOiBuaWNrTmFtZSxcbiAgICAgICAgICAgIGF2YXRhclVybDogYXZhdGFyVXJsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgbGV0IGF1dGhTZXR0aW5nID0gcmVzLmF1dGhTZXR0aW5nXG4gICAgICAgICAgICAgIGlmIChhdXRoU2V0dGluZyAmJiBhdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSAmJiBhdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHd4LnJlTGF1bmNoKHtcbiAgICAgICAgICAgICAgICAgIHVybDogJy9wYWdlcy9jZW50ZXIvaW5kZXgnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBuaWNrTmFtZTogJycsXG4gICAgICBhdmF0YXJVcmw6ICcnLFxuICAgIH0sXG4gICAgY2FsbFBob25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgICAgcGhvbmVOdW1iZXI6ICcxODk2Njc4NjY1NSdcbiAgICAgIH0pXG4gICAgfVxuICB9Il19