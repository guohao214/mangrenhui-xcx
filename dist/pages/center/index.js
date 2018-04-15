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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJvbkxvYWQiLCJzZWxmIiwid3giLCJnZXRVc2VySW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJ1c2VyIiwidXNlckluZm8iLCJuaWNrTmFtZSIsImF2YXRhclVybCIsInNldERhdGEiLCJmYWlsIiwib3BlblNldHRpbmciLCJhdXRoU2V0dGluZyIsInJlTGF1bmNoIiwidXJsIiwiZGF0YSIsImNhbGxQaG9uZSIsIm1ha2VQaG9uZUNhbGwiLCJwaG9uZU51bWJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUVBLFVBQVEsa0JBQVk7QUFDbEIsUUFBSUMsT0FBTyxJQUFYO0FBQ0FDLE9BQUdDLFdBQUgsQ0FBZTtBQUNiQyxlQUFTLGlCQUFTQyxHQUFULEVBQWM7QUFDckIsWUFBSUMsT0FBT0QsSUFBSUUsUUFBZjtBQURxQixZQUVmQyxRQUZlLEdBRVNGLElBRlQsQ0FFZkUsUUFGZTtBQUFBLFlBRUxDLFNBRkssR0FFU0gsSUFGVCxDQUVMRyxTQUZLOztBQUdyQlIsYUFBS1MsT0FBTCxDQUFhO0FBQ1hGLG9CQUFVQSxRQURDO0FBRVhDLHFCQUFXQTtBQUZBLFNBQWI7QUFJRCxPQVJZO0FBU2JFLFlBQU0sZ0JBQVk7QUFDaEJULFdBQUdVLFdBQUgsQ0FBZTtBQUNiUixtQkFBUyxpQkFBVUMsR0FBVixFQUFlO0FBQ3RCLGdCQUFJUSxjQUFjUixJQUFJUSxXQUF0QjtBQUNBLGdCQUFJQSxlQUFlQSxZQUFZLGdCQUFaLENBQWYsSUFBZ0RBLFlBQVksZ0JBQVosTUFBa0MsSUFBdEYsRUFBNEY7QUFDMUZYLGlCQUFHWSxRQUFILENBQVk7QUFDVkMscUJBQUs7QUFESyxlQUFaO0FBR0Q7QUFDRjtBQVJZLFNBQWY7QUFVRDtBQXBCWSxLQUFmO0FBc0JELEc7QUFDREMsUUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFDSlIsY0FBVSxFQUROO0FBRUpDLGVBQVc7QUFGUCxHO0FBSU5RLGFBQVcscUJBQVk7QUFDckJmLE9BQUdnQixhQUFILENBQWlCO0FBQ2ZDLG1CQUFhO0FBREUsS0FBakI7QUFHRCIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoQnLFxuICAgIHVzaW5nQ29tcG9uZW50czoge1xuICAgICAgJ3d4Yy1pY29uJyA6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgJ3d4Yy1hdmF0YXInOiAnQG1pbnVpL3d4Yy1hdmF0YXInLFxuICAgIH1cbiAgfSxcbiAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgd3guZ2V0VXNlckluZm8oe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIGxldCB1c2VyID0gcmVzLnVzZXJJbmZvXG4gICAgICAgIGxldCB7IG5pY2tOYW1lLCBhdmF0YXJVcmwgfSA9IHVzZXJcbiAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICBuaWNrTmFtZTogbmlja05hbWUsXG4gICAgICAgICAgYXZhdGFyVXJsOiBhdmF0YXJVcmxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBsZXQgYXV0aFNldHRpbmcgPSByZXMuYXV0aFNldHRpbmdcbiAgICAgICAgICAgIGlmIChhdXRoU2V0dGluZyAmJiBhdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSAmJiBhdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICB3eC5yZUxhdW5jaCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2NlbnRlci9pbmRleCdcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgZGF0YToge1xuICAgIG5pY2tOYW1lOiAnJyxcbiAgICBhdmF0YXJVcmw6ICcnLFxuICB9LFxuICBjYWxsUGhvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgIHBob25lTnVtYmVyOiAnMTg5NjY3ODY2NTUnXG4gICAgfSlcbiAgfVxufSJdfQ==