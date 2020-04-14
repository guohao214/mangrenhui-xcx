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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJvblNob3ciLCJzZWxmIiwiYXBwIiwiZ2V0QXBwIiwidXNlckluZm8iLCJnZXRVc2VySW5mbyIsIm5pY2tOYW1lIiwiYXZhdGFyVXJsIiwic2V0RGF0YSIsImdldCIsInRoZW4iLCJyZXN1bHQiLCJkYXRhIiwicGhvbmUiLCJjb250ZW50IiwiZ29Mb2dpbiIsInRvTG9naW4iLCJjYWxsUGhvbmUiLCJ3eCIsIm1ha2VQaG9uZUNhbGwiLCJwaG9uZU51bWJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBVUlBLFVBQVEsa0JBQVk7QUFBQTs7QUFDbEIsUUFBSUMsT0FBTyxJQUFYO0FBQ0EsUUFBTUMsTUFBTUMsUUFBWjtBQUNBLFFBQU1DLFdBQVdGLElBQUlHLFdBQUosRUFBakI7QUFIa0IsUUFJYkMsUUFKYSxHQUlVRixRQUpWLENBSWJFLFFBSmE7QUFBQSxRQUlIQyxTQUpHLEdBSVVILFFBSlYsQ0FJSEcsU0FKRzs7QUFLbEJOLFNBQUtPLE9BQUwsQ0FBYTtBQUNYRixnQkFBVUEsUUFEQztBQUVYQyxpQkFBV0E7QUFGQSxLQUFiO0FBSUFMLFFBQUlPLEdBQUosQ0FBUSxlQUFSLEVBQXlCLEVBQXpCLEVBQTZCLEVBQTdCLEVBQWlDLEtBQWpDLEVBQXdDQyxJQUF4QyxDQUE2QyxnQkFBUTtBQUNuRCxVQUFJQyxTQUFTQyxLQUFLQSxJQUFsQjtBQUNBLFlBQUtKLE9BQUwsQ0FBYTtBQUNYSyxlQUFPRixPQUFPRyxPQUFQLENBQWVEO0FBRFgsT0FBYjtBQUdELEtBTEQ7QUFNRCxHO0FBQ0RELFFBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ0pOLGNBQVUsRUFETjtBQUVKQyxlQUFXLEVBRlA7QUFHSk0sV0FBTztBQUhILEc7O0FBTU5FLFMscUJBQVU7QUFDUlosYUFBU2EsT0FBVDtBQUVELEc7O0FBQ0RDLGFBQVcscUJBQVk7QUFDckIsUUFBSWhCLE9BQU8sSUFBWDtBQUNBaUIsT0FBR0MsYUFBSCxDQUFpQjtBQUNmQyxtQkFBYW5CLEtBQUtXLElBQUwsQ0FBVUM7QUFEUixLQUFqQjtBQUdEIiwiZmlsZSI6ImluZGV4Lnd4cCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWc6IHtcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoQnLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJyxcbiAgICAgIHVzaW5nQ29tcG9uZW50czoge1xuICAgICAgICAnd3hjLWljb24nOiAnQG1pbnVpL3d4Yy1pY29uJyxcbiAgICAgICAgJ3d4Yy1hdmF0YXInOiAnQG1pbnVpL3d4Yy1hdmF0YXInLFxuICAgICAgfVxuICAgIH0sXG4gICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgIGNvbnN0IGFwcCA9IGdldEFwcCgpXG4gICAgICBjb25zdCB1c2VySW5mbyA9IGFwcC5nZXRVc2VySW5mbygpXG4gICAgICBsZXQge25pY2tOYW1lLCBhdmF0YXJVcmx9ID0gdXNlckluZm9cbiAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgIG5pY2tOYW1lOiBuaWNrTmFtZSxcbiAgICAgICAgYXZhdGFyVXJsOiBhdmF0YXJVcmxcbiAgICAgIH0pXG4gICAgICBhcHAuZ2V0KCdzaG9wL2dldFBob25lJywgJycsICcnLCBmYWxzZSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIHBob25lOiByZXN1bHQuY29udGVudC5waG9uZVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIG5pY2tOYW1lOiAnJyxcbiAgICAgIGF2YXRhclVybDogJycsXG4gICAgICBwaG9uZTogJydcbiAgICB9LFxuXG4gICAgZ29Mb2dpbigpIHtcbiAgICAgIGdldEFwcCgpLnRvTG9naW4oKVxuXG4gICAgfSxcbiAgICBjYWxsUGhvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgd3gubWFrZVBob25lQ2FsbCh7XG4gICAgICAgIHBob25lTnVtYmVyOiBzZWxmLmRhdGEucGhvbmVcbiAgICAgIH0pXG4gICAgfVxuICB9Il19