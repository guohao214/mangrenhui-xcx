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
    phone: '',
    version: getApp().globalData.version || ''
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJvblNob3ciLCJzZWxmIiwiYXBwIiwiZ2V0QXBwIiwidXNlckluZm8iLCJnZXRVc2VySW5mbyIsIm5pY2tOYW1lIiwiYXZhdGFyVXJsIiwic2V0RGF0YSIsImdldCIsInRoZW4iLCJyZXN1bHQiLCJkYXRhIiwicGhvbmUiLCJjb250ZW50IiwidmVyc2lvbiIsImdsb2JhbERhdGEiLCJnb0xvZ2luIiwidG9Mb2dpbiIsImNhbGxQaG9uZSIsInd4IiwibWFrZVBob25lQ2FsbCIsInBob25lTnVtYmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFVSUEsVUFBUSxrQkFBWTtBQUFBOztBQUNsQixRQUFJQyxPQUFPLElBQVg7QUFDQSxRQUFNQyxNQUFNQyxRQUFaO0FBQ0EsUUFBTUMsV0FBV0YsSUFBSUcsV0FBSixFQUFqQjtBQUhrQixRQUliQyxRQUphLEdBSVVGLFFBSlYsQ0FJYkUsUUFKYTtBQUFBLFFBSUhDLFNBSkcsR0FJVUgsUUFKVixDQUlIRyxTQUpHOztBQUtsQk4sU0FBS08sT0FBTCxDQUFhO0FBQ1hGLGdCQUFVQSxRQURDO0FBRVhDLGlCQUFXQTtBQUZBLEtBQWI7QUFJQUwsUUFBSU8sR0FBSixDQUFRLGVBQVIsRUFBeUIsRUFBekIsRUFBNkIsRUFBN0IsRUFBaUMsS0FBakMsRUFBd0NDLElBQXhDLENBQTZDLGdCQUFRO0FBQ25ELFVBQUlDLFNBQVNDLEtBQUtBLElBQWxCO0FBQ0EsWUFBS0osT0FBTCxDQUFhO0FBQ1hLLGVBQU9GLE9BQU9HLE9BQVAsQ0FBZUQ7QUFEWCxPQUFiO0FBR0QsS0FMRDtBQU1ELEc7QUFDREQsUUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFDSk4sY0FBVSxFQUROO0FBRUpDLGVBQVcsRUFGUDtBQUdKTSxXQUFPLEVBSEg7QUFJSkUsYUFBU1osU0FBU2EsVUFBVCxDQUFvQkQsT0FBcEIsSUFBK0I7QUFKcEMsRzs7QUFPTkUsUyxxQkFBVTtBQUNSZCxhQUFTZSxPQUFUO0FBRUQsRzs7QUFDREMsYUFBVyxxQkFBWTtBQUNyQixRQUFJbEIsT0FBTyxJQUFYO0FBQ0FtQixPQUFHQyxhQUFILENBQWlCO0FBQ2ZDLG1CQUFhckIsS0FBS1csSUFBTCxDQUFVQztBQURSLEtBQWpCO0FBR0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+aIkeeahCcsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI0U4RThFOCcsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICB9XG4gICAgfSxcbiAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgY29uc3QgYXBwID0gZ2V0QXBwKClcbiAgICAgIGNvbnN0IHVzZXJJbmZvID0gYXBwLmdldFVzZXJJbmZvKClcbiAgICAgIGxldCB7bmlja05hbWUsIGF2YXRhclVybH0gPSB1c2VySW5mb1xuICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgbmlja05hbWU6IG5pY2tOYW1lLFxuICAgICAgICBhdmF0YXJVcmw6IGF2YXRhclVybFxuICAgICAgfSlcbiAgICAgIGFwcC5nZXQoJ3Nob3AvZ2V0UGhvbmUnLCAnJywgJycsIGZhbHNlKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgcGhvbmU6IHJlc3VsdC5jb250ZW50LnBob25lXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgbmlja05hbWU6ICcnLFxuICAgICAgYXZhdGFyVXJsOiAnJyxcbiAgICAgIHBob25lOiAnJyxcbiAgICAgIHZlcnNpb246IGdldEFwcCgpLmdsb2JhbERhdGEudmVyc2lvbiB8fCAnJ1xuICAgIH0sXG5cbiAgICBnb0xvZ2luKCkge1xuICAgICAgZ2V0QXBwKCkudG9Mb2dpbigpXG5cbiAgICB9LFxuICAgIGNhbGxQaG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgICAgcGhvbmVOdW1iZXI6IHNlbGYuZGF0YS5waG9uZVxuICAgICAgfSlcbiAgICB9XG4gIH0iXX0=