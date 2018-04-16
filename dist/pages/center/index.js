'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  onLoad: function onLoad() {
    var _this = this;

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

    var app = getApp();
    app.get('center/getPhone').then(function (data) {
      var result = data.data;
      _this.setData({
        phone: result.content.phone
      });
    });
  },
  data: {
    '__code__': {
      readme: ''
    },

    nickName: '',
    avatarUrl: '',
    phone: ''
  },
  callPhone: function callPhone() {
    var self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phone
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJvbkxvYWQiLCJzZWxmIiwid3giLCJnZXRVc2VySW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJ1c2VyIiwidXNlckluZm8iLCJuaWNrTmFtZSIsImF2YXRhclVybCIsInNldERhdGEiLCJmYWlsIiwib3BlblNldHRpbmciLCJhdXRoU2V0dGluZyIsInJlTGF1bmNoIiwidXJsIiwiYXBwIiwiZ2V0QXBwIiwiZ2V0IiwidGhlbiIsInJlc3VsdCIsImRhdGEiLCJwaG9uZSIsImNvbnRlbnQiLCJjYWxsUGhvbmUiLCJtYWtlUGhvbmVDYWxsIiwicGhvbmVOdW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFJQSxVQUFRLGtCQUFZO0FBQUE7O0FBQ2xCLFFBQUlDLE9BQU8sSUFBWDtBQUNBQyxPQUFHQyxXQUFILENBQWU7QUFDYkMsZUFBUyxpQkFBVUMsR0FBVixFQUFlO0FBQ3RCLFlBQUlDLE9BQU9ELElBQUlFLFFBQWY7QUFEc0IsWUFFakJDLFFBRmlCLEdBRU1GLElBRk4sQ0FFakJFLFFBRmlCO0FBQUEsWUFFUEMsU0FGTyxHQUVNSCxJQUZOLENBRVBHLFNBRk87O0FBR3RCUixhQUFLUyxPQUFMLENBQWE7QUFDWEYsb0JBQVVBLFFBREM7QUFFWEMscUJBQVdBO0FBRkEsU0FBYjtBQUlELE9BUlk7QUFTYkUsWUFBTSxnQkFBWTtBQUNoQlQsV0FBR1UsV0FBSCxDQUFlO0FBQ2JSLG1CQUFTLGlCQUFVQyxHQUFWLEVBQWU7QUFDdEIsZ0JBQUlRLGNBQWNSLElBQUlRLFdBQXRCO0FBQ0EsZ0JBQUlBLGVBQWVBLFlBQVksZ0JBQVosQ0FBZixJQUFnREEsWUFBWSxnQkFBWixNQUFrQyxJQUF0RixFQUE0RjtBQUMxRlgsaUJBQUdZLFFBQUgsQ0FBWTtBQUNWQyxxQkFBSztBQURLLGVBQVo7QUFHRDtBQUNGO0FBUlksU0FBZjtBQVVEO0FBcEJZLEtBQWY7O0FBdUJBLFFBQUlDLE1BQU1DLFFBQVY7QUFDQUQsUUFBSUUsR0FBSixDQUFRLGlCQUFSLEVBQTJCQyxJQUEzQixDQUFnQyxnQkFBUTtBQUN0QyxVQUFJQyxTQUFTQyxLQUFLQSxJQUFsQjtBQUNBLFlBQUtYLE9BQUwsQ0FBYTtBQUNYWSxlQUFPRixPQUFPRyxPQUFQLENBQWVEO0FBRFgsT0FBYjtBQUdELEtBTEQ7QUFNRCxHO0FBQ0RELFFBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ0piLGNBQVUsRUFETjtBQUVKQyxlQUFXLEVBRlA7QUFHSmEsV0FBTztBQUhILEc7QUFLTkUsYUFBVyxxQkFBWTtBQUNyQixRQUFJdkIsT0FBTyxJQUFYO0FBQ0FDLE9BQUd1QixhQUFILENBQWlCO0FBQ2ZDLG1CQUFhekIsS0FBS29CLElBQUwsQ0FBVUM7QUFEUixLQUFqQjtBQUdEIiwiZmlsZSI6ImluZGV4Lnd4cCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWc6IHtcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoQnLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICB9XG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgd3guZ2V0VXNlckluZm8oe1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgbGV0IHVzZXIgPSByZXMudXNlckluZm9cbiAgICAgICAgICBsZXQge25pY2tOYW1lLCBhdmF0YXJVcmx9ID0gdXNlclxuICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICBuaWNrTmFtZTogbmlja05hbWUsXG4gICAgICAgICAgICBhdmF0YXJVcmw6IGF2YXRhclVybFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3eC5vcGVuU2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgIGxldCBhdXRoU2V0dGluZyA9IHJlcy5hdXRoU2V0dGluZ1xuICAgICAgICAgICAgICBpZiAoYXV0aFNldHRpbmcgJiYgYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ10gJiYgYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB3eC5yZUxhdW5jaCh7XG4gICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvY2VudGVyL2luZGV4J1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGFwcC5nZXQoJ2NlbnRlci9nZXRQaG9uZScpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBkYXRhLmRhdGFcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBwaG9uZTogcmVzdWx0LmNvbnRlbnQucGhvbmVcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBuaWNrTmFtZTogJycsXG4gICAgICBhdmF0YXJVcmw6ICcnLFxuICAgICAgcGhvbmU6ICcnXG4gICAgfSxcbiAgICBjYWxsUGhvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgd3gubWFrZVBob25lQ2FsbCh7XG4gICAgICAgIHBob25lTnVtYmVyOiBzZWxmLmRhdGEucGhvbmVcbiAgICAgIH0pXG4gICAgfVxuICB9Il19