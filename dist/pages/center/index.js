'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  onShow: function onShow() {
    var _this = this;

    var self = this;
    var app = getApp();
    var userInfo = app.getUserInfo();
    var nickName = userInfo.nickName,
        avatarUrl = userInfo.avatarUrl;

    self.setData({
      nickName: nickName,
      avatarUrl: avatarUrl
    });
    app.get('shop/getPhone', '', '', false).then(function (data) {
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

  goLogin: function goLogin() {
    getApp().toLogin();
  },

  callPhone: function callPhone() {
    var self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phone
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJvblNob3ciLCJzZWxmIiwiYXBwIiwiZ2V0QXBwIiwidXNlckluZm8iLCJnZXRVc2VySW5mbyIsIm5pY2tOYW1lIiwiYXZhdGFyVXJsIiwic2V0RGF0YSIsImdldCIsInRoZW4iLCJyZXN1bHQiLCJkYXRhIiwicGhvbmUiLCJjb250ZW50IiwiZ29Mb2dpbiIsInRvTG9naW4iLCJjYWxsUGhvbmUiLCJ3eCIsIm1ha2VQaG9uZUNhbGwiLCJwaG9uZU51bWJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0lBLFVBQVEsa0JBQVk7QUFBQTs7QUFDbEIsUUFBSUMsT0FBTyxJQUFYO0FBQ0EsUUFBTUMsTUFBTUMsUUFBWjtBQUNBLFFBQU1DLFdBQVdGLElBQUlHLFdBQUosRUFBakI7QUFIa0IsUUFJYkMsUUFKYSxHQUlVRixRQUpWLENBSWJFLFFBSmE7QUFBQSxRQUlIQyxTQUpHLEdBSVVILFFBSlYsQ0FJSEcsU0FKRzs7QUFLbEJOLFNBQUtPLE9BQUwsQ0FBYTtBQUNYRixnQkFBVUEsUUFEQztBQUVYQyxpQkFBV0E7QUFGQSxLQUFiO0FBSUFMLFFBQUlPLEdBQUosQ0FBUSxlQUFSLEVBQXlCLEVBQXpCLEVBQTZCLEVBQTdCLEVBQWlDLEtBQWpDLEVBQXdDQyxJQUF4QyxDQUE2QyxnQkFBUTtBQUNuRCxVQUFJQyxTQUFTQyxLQUFLQSxJQUFsQjtBQUNBLFlBQUtKLE9BQUwsQ0FBYTtBQUNYSyxlQUFPRixPQUFPRyxPQUFQLENBQWVEO0FBRFgsT0FBYjtBQUdELEtBTEQ7QUFNRCxHO0FBQ0RELFFBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ0pOLGNBQVUsRUFETjtBQUVKQyxlQUFXLEVBRlA7QUFHSk0sV0FBTztBQUhILEc7O0FBTU5FLFMscUJBQVU7QUFDUlosYUFBU2EsT0FBVDtBQUVELEc7O0FBQ0RDLGFBQVcscUJBQVk7QUFDckIsUUFBSWhCLE9BQU8sSUFBWDtBQUNBaUIsT0FBR0MsYUFBSCxDQUFpQjtBQUNmQyxtQkFBYW5CLEtBQUtXLElBQUwsQ0FBVUM7QUFEUixLQUFqQjtBQUdEIiwiZmlsZSI6ImluZGV4Lnd4cCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWc6IHtcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoQnLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNGRkRDRTQnLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICB9XG4gICAgfSxcbiAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgY29uc3QgYXBwID0gZ2V0QXBwKClcbiAgICAgIGNvbnN0IHVzZXJJbmZvID0gYXBwLmdldFVzZXJJbmZvKClcbiAgICAgIGxldCB7bmlja05hbWUsIGF2YXRhclVybH0gPSB1c2VySW5mb1xuICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgbmlja05hbWU6IG5pY2tOYW1lLFxuICAgICAgICBhdmF0YXJVcmw6IGF2YXRhclVybFxuICAgICAgfSlcbiAgICAgIGFwcC5nZXQoJ3Nob3AvZ2V0UGhvbmUnLCAnJywgJycsIGZhbHNlKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgcGhvbmU6IHJlc3VsdC5jb250ZW50LnBob25lXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgbmlja05hbWU6ICcnLFxuICAgICAgYXZhdGFyVXJsOiAnJyxcbiAgICAgIHBob25lOiAnJ1xuICAgIH0sXG5cbiAgICBnb0xvZ2luKCkge1xuICAgICAgZ2V0QXBwKCkudG9Mb2dpbigpXG5cbiAgICB9LFxuICAgIGNhbGxQaG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgICAgcGhvbmVOdW1iZXI6IHNlbGYuZGF0YS5waG9uZVxuICAgICAgfSlcbiAgICB9XG4gIH0iXX0=