'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    toastText: '',
    showToast: false,
    shopList: [],
    cpShopList: [],
    showShopListPop: 'hide',
    currentShop: {},
    beauticianList: [],
    currentBeautician: {}
  },

  handlerSearch: function handlerSearch(event) {
    var value = event.detail.value;
    var shopList = this.data.shopList;
    var cpShopList = shopList.filter(function (item) {
      return item.shop_name.match(new RegExp(value));
    });

    this.setData({
      cpShopList: cpShopList
    });
  },

  showShopList: function showShopList() {
    this.setData({
      showShopListPop: 'show'
    });
  },

  chooseShop: function chooseShop(event) {
    var index = event.currentTarget.dataset.index;
    var currentShop = this.data.shopList[index];
    this.setData({
      currentShop: currentShop,
      showShopListPop: 'hide'
    });

    this.getBeauticianAndProject(currentShop.shop_id);
  },

  chooseBeautician: function chooseBeautician(event) {
    var _this = this;

    var app = getApp();
    var _currentBeautician = this.data.currentBeautician;

    var index = event.currentTarget.dataset.index;
    var currentBeautician = this.data.beauticianList[index];
    if (currentBeautician.beautician_id === this.data.currentBeautician.beautician_id) return;

    this.setData({
      currentBeautician: currentBeautician
    });

    var beauticianId = currentBeautician.beautician_id;

    // 设置默认管家
    app.post('center/setBeautician/' + beauticianId).then(function (data) {
      console.log(data);
    }).catch(function (e) {
      _this.setData({
        currentBeautician: _currentBeautician
      });

      wx.message('设置默认管家出错，请重试.');
    });
  },

  _toast: function _toast(text) {
    wx.showToast({
      title: text,
      duration: 2000,
      icon: 'none'
    });
  },


  getBeauticianAndProject: function getBeauticianAndProject(shopId) {
    var app = getApp();
    var self = this;
    app.get('appointment/getBeauticianAndProject/' + shopId).then(function (data) {
      var content = data.data && data.data.content || {};
      var currentBeautician = {};

      var defaultBeautician = (content.defaultBeautician || 0) / 1;
      if (defaultBeautician > 0) {
        currentBeautician = content.beauticians.filter(function (item) {
          return item.beautician_id == defaultBeautician;
        }).pop();
      }

      self.setData({
        beauticianList: content.beauticians,
        currentBeautician: currentBeautician
      });
    }).catch(function (e) {
      console.log(e);
    });
  },

  init: function init() {
    var app = getApp();
    var self = this;

    wx.getLocation({
      complete: function complete(data) {
        if (Object.prototype.toString.call(data) !== '[object Object]') data = {};

        app.get('shop/getList', { latitude: data.latitude || '', longitude: data.longitude || '' }).then(function (data) {
          var result = data.data;
          var currentShop = result.content[0] || {};
          self.setData({
            shopList: result.content,
            cpShopList: result.content
          });

          // 判断shop_id是否存在
          if (self.data.currentShop.shop_id) {
            currentShop = self.data.currentShop;
            self.setData({
              currentShop: currentShop
            });
          } else {
            self.setData({
              currentShop: currentShop
            });
          }

          // self.getPets()

          if (currentShop) self.getBeauticianAndProject(currentShop.shop_id);
        }).catch(function (e) {
          return console.log(e);
        });
      },
      fail: function fail() {
        wx.openSetting({
          success: function success(res) {},
          fail: function fail() {}
        });
      }
    });
  },
  onShow: function onShow() {
    this.init();
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwidG9hc3RUZXh0Iiwic2hvd1RvYXN0Iiwic2hvcExpc3QiLCJjcFNob3BMaXN0Iiwic2hvd1Nob3BMaXN0UG9wIiwiY3VycmVudFNob3AiLCJiZWF1dGljaWFuTGlzdCIsImN1cnJlbnRCZWF1dGljaWFuIiwiaGFuZGxlclNlYXJjaCIsImV2ZW50IiwidmFsdWUiLCJkZXRhaWwiLCJmaWx0ZXIiLCJpdGVtIiwic2hvcF9uYW1lIiwibWF0Y2giLCJSZWdFeHAiLCJzZXREYXRhIiwic2hvd1Nob3BMaXN0IiwiY2hvb3NlU2hvcCIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJnZXRCZWF1dGljaWFuQW5kUHJvamVjdCIsInNob3BfaWQiLCJjaG9vc2VCZWF1dGljaWFuIiwiYXBwIiwiZ2V0QXBwIiwiX2N1cnJlbnRCZWF1dGljaWFuIiwiYmVhdXRpY2lhbl9pZCIsImJlYXV0aWNpYW5JZCIsInBvc3QiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwid3giLCJtZXNzYWdlIiwiX3RvYXN0IiwidGV4dCIsInRpdGxlIiwiZHVyYXRpb24iLCJpY29uIiwic2hvcElkIiwic2VsZiIsImdldCIsImNvbnRlbnQiLCJkZWZhdWx0QmVhdXRpY2lhbiIsImJlYXV0aWNpYW5zIiwicG9wIiwiZSIsImluaXQiLCJnZXRMb2NhdGlvbiIsImNvbXBsZXRlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJyZXN1bHQiLCJmYWlsIiwib3BlblNldHRpbmciLCJzdWNjZXNzIiwicmVzIiwib25TaG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFjSUEsUUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFDSkMsZUFBVyxFQURQO0FBRUpDLGVBQVcsS0FGUDtBQUdKQyxjQUFVLEVBSE47QUFJSkMsZ0JBQVksRUFKUjtBQUtKQyxxQkFBaUIsTUFMYjtB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RDs7QUFFRDs7QUFFQSxjQUFJQSxXQUFKLEVBQ0V1QyxLQUFLckIsdUJBQUwsQ0FBNkJsQixZQUFZbUIsT0FBekM7QUFDSCxTQXhCRCxFQXdCR1csS0F4QkgsQ0F3QlM7QUFBQSxpQkFBS0YsUUFBUUMsR0FBUixDQUFZZ0IsQ0FBWixDQUFMO0FBQUEsU0F4QlQ7QUF5QkQsT0E5Qlk7QUErQmJXLFlBQU0sZ0JBQVk7QUFDaEJ6QixXQUFHMEIsV0FBSCxDQUFlO0FBQ2JDLG1CQUFTLGlCQUFVQyxHQUFWLEVBQWUsQ0FDdkIsQ0FGWTtBQUdiSCxnQkFBTSxnQkFBWSxDQUNqQjtBQUpZLFNBQWY7QUFNRDtBQXRDWSxLQUFmO0FBd0NILEc7QUFDREksUSxvQkFBUztBQUNQLFNBQUtkLElBQUw7QUFDRCIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5oiR55qE566h5a62JyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjRThFOEU4JyxcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaycsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1mbGV4JzogJ0BtaW51aS93eGMtZmxleCcsXG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICAgICd3eGMtbWFzayc6ICdAbWludWkvd3hjLW1hc2snLFxuICAgICAgICAnd3hjLXBvcHVwJzogJ0BtaW51aS93eGMtcG9wdXAnLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIHRvYXN0VGV4dDogJycsXG4gICAgICBzaG93VG9hc3Q6IGZhbHNlLFxuICAgICAgc2hvcExpc3Q6IFtdLFxuICAgICAgY3BTaG9wTGlzdDogW10sXG4gICAgICBzaG93U2hvcExpc3RQb3A6ICdoaWRlJyxcbiAgICAgIGN1cnJlbnRTaG9wOiB7fSxcbiAgICAgIGJlYXV0aWNpYW5MaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRCZWF1dGljaWFuOiB7fSxcbiAgICB9LFxuXG4gICAgaGFuZGxlclNlYXJjaDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgdmFsdWUgPSBldmVudC5kZXRhaWwudmFsdWVcbiAgICAgIGxldCBzaG9wTGlzdCA9IHRoaXMuZGF0YS5zaG9wTGlzdFxuICAgICAgbGV0IGNwU2hvcExpc3QgPSBzaG9wTGlzdC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uc2hvcF9uYW1lLm1hdGNoKG5ldyBSZWdFeHAodmFsdWUpKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3BTaG9wTGlzdDogY3BTaG9wTGlzdFxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgc2hvd1Nob3BMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBzaG93U2hvcExpc3RQb3A6ICdzaG93J1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgY2hvb3NlU2hvcDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50U2hvcCA9IHRoaXMuZGF0YS5zaG9wTGlzdFtpbmRleF1cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRTaG9wOiBjdXJyZW50U2hvcCxcbiAgICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnaGlkZScsXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmdldEJlYXV0aWNpYW5BbmRQcm9qZWN0KGN1cnJlbnRTaG9wLnNob3BfaWQpXG4gICAgfSxcblxuICAgIGNob29zZUJlYXV0aWNpYW46IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgX2N1cnJlbnRCZWF1dGljaWFuID0gdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuXG5cbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRCZWF1dGljaWFuID0gdGhpcy5kYXRhLmJlYXV0aWNpYW5MaXN0W2luZGV4XVxuICAgICAgaWYgKGN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQgPT09IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkKVxuICAgICAgICByZXR1cm5cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEJlYXV0aWNpYW46IGN1cnJlbnRCZWF1dGljaWFuLFxuICAgICAgfSlcblxuICAgICAgbGV0IGJlYXV0aWNpYW5JZCA9IGN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWRcblxuICAgICAgLy8g6K6+572u6buY6K6k566h5a62XG4gICAgICBhcHAucG9zdCgnY2VudGVyL3NldEJlYXV0aWNpYW4vJyArIGJlYXV0aWNpYW5JZCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGN1cnJlbnRCZWF1dGljaWFuOiBfY3VycmVudEJlYXV0aWNpYW5cbiAgICAgICAgfSlcblxuICAgICAgICB3eC5tZXNzYWdlKCforr7nva7pu5jorqTnrqHlrrblh7rplJnvvIzor7fph43or5UuJylcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF90b2FzdCh0ZXh0KSB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogdGV4dCxcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgIGljb246ICdub25lJ1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZ2V0QmVhdXRpY2lhbkFuZFByb2plY3Q6IGZ1bmN0aW9uIChzaG9wSWQpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICBhcHAuZ2V0KGBhcHBvaW50bWVudC9nZXRCZWF1dGljaWFuQW5kUHJvamVjdC8ke3Nob3BJZH1gKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgY29udGVudCA9IChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmNvbnRlbnQpIHx8IHt9XG4gICAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IHt9XG5cbiAgICAgICAgbGV0IGRlZmF1bHRCZWF1dGljaWFuID0gKGNvbnRlbnQuZGVmYXVsdEJlYXV0aWNpYW4gfHwgMCkgLyAxXG4gICAgICAgIGlmIChkZWZhdWx0QmVhdXRpY2lhbiA+IDApIHtcbiAgICAgICAgICBjdXJyZW50QmVhdXRpY2lhbiA9IGNvbnRlbnQuYmVhdXRpY2lhbnMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5iZWF1dGljaWFuX2lkID09IGRlZmF1bHRCZWF1dGljaWFuKS5wb3AoKVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICBiZWF1dGljaWFuTGlzdDogY29udGVudC5iZWF1dGljaWFucyxcbiAgICAgICAgICBjdXJyZW50QmVhdXRpY2lhbixcbiAgICAgICAgfSlcblxuXG4gICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIH0pXG5cbiAgICB9LFxuXG5cbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgXG4gICAgICB3eC5nZXRMb2NhdGlvbih7XG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgIT09ICdbb2JqZWN0IE9iamVjdF0nKVxuICAgICAgICAgICAgZGF0YSA9IHt9XG5cbiAgICAgICAgICBhcHAuZ2V0KCdzaG9wL2dldExpc3QnLCB7bGF0aXR1ZGU6IGRhdGEubGF0aXR1ZGUgfHwgJycsIGxvbmdpdHVkZTogZGF0YS5sb25naXR1ZGUgfHwgJyd9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTaG9wID0gcmVzdWx0LmNvbnRlbnRbMF0gfHwge31cbiAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgIHNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgICAgY3BTaG9wTGlzdDogcmVzdWx0LmNvbnRlbnQsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyDliKTmlq1zaG9wX2lk5piv5ZCm5a2Y5ZyoXG4gICAgICAgICAgICBpZihzZWxmLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCkge1xuICAgICAgICAgICAgICBjdXJyZW50U2hvcCA9IHNlbGYuZGF0YS5jdXJyZW50U2hvcFxuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlbGYuZ2V0UGV0cygpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2hvcClcbiAgICAgICAgICAgICAgc2VsZi5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3eC5vcGVuU2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH0sXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLmluaXQoKVxuICB9LFxuICB9Il19