'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    cardList: []
  },

  onLoad: function onLoad(options) {},

  onShow: function onShow() {
    this.getCardList();
  },

  getCardList: function getCardList() {
    var _this = this;

    var app = getApp();
    app.get('pet/findMycards').then(function (data) {
      var result = data.data;
      _this.setData({
        cardList: result.content
      });
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwiY2FyZExpc3QiLCJvbkxvYWQiLCJvcHRpb25zIiwib25TaG93IiwiZ2V0Q2FyZExpc3QiLCJhcHAiLCJnZXRBcHAiLCJnZXQiLCJ0aGVuIiwicmVzdWx0Iiwic2V0RGF0YSIsImNvbnRlbnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVNJQSxRQUFNO0FBQUE7QUFBQTtBQUFBOztBQUNKQyxjQUFVO0FBRE4sRzs7QUFJTkMsVUFBUSxnQkFBVUMsT0FBVixFQUFtQixDQUMxQixDOztBQUVEQyxVQUFRLGtCQUFZO0FBQ2xCLFNBQUtDLFdBQUw7QUFDRCxHOztBQUVEQSxlQUFhLHVCQUFZO0FBQUE7O0FBQ3ZCLFFBQUlDLE1BQU1DLFFBQVY7QUFDQUQsUUFBSUUsR0FBSixDQUFRLGlCQUFSLEVBQTJCQyxJQUEzQixDQUFnQyxnQkFBUTtBQUN0QyxVQUFJQyxTQUFTVixLQUFLQSxJQUFsQjtBQUNBLFlBQUtXLE9BQUwsQ0FBYTtBQUNYVixrQkFBVVMsT0FBT0U7QUFETixPQUFiO0FBR0QsS0FMRDtBQU1EIiwiZmlsZSI6ImluZGV4Lnd4cCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWc6IHtcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoTmrKHljaEnLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJyxcbiAgICAgIHVzaW5nQ29tcG9uZW50czoge1xuICAgICAgICAgJ3d4Yy1hYm5vcic6ICdAbWludWkvd3hjLWFibm9yJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIGNhcmRMaXN0OiBbXSxcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIH0sXG5cbiAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZ2V0Q2FyZExpc3QoKVxuICAgIH0sXG5cbiAgICBnZXRDYXJkTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBhcHAuZ2V0KCdwZXQvZmluZE15Y2FyZHMnKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgY2FyZExpc3Q6IHJlc3VsdC5jb250ZW50XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gIH0iXX0=