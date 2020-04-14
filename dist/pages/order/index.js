'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    amount: 0,
    orderType: '',
    orderId: '',
    lastComponent: '',
    orderList: [],
    payType: '',
    beauticianCode: '', // 技师工号
    couponCode: '' // 优惠券
  },
  onLoad: function onLoad(options) {
    // console.log(options)
  },
  onShow: function onShow() {
    this.getOrderList();
  },
  getOrderList: function getOrderList() {
    var _this = this;

    var app = getApp();
    app.get('center/order').then(function (data) {
      var result = data.data;
      result.content.forEach(function (item) {
        return item.appointment_end_time = _this._realDay(item.appointment_day, item.appointment_end_time);
      });
      _this.setData({
        orderList: result.content
      });
    });
  },
  payOffline: function payOffline() {
    var _this2 = this;

    var app = getApp();
    if (this.data.payType === 'cash') {
      if (this.data.beauticianCode.trim().length === 0) {
        wx.showToast({
          title: '技师工号不能为空',
          icon: 'none'
        });

        return;
      }
    }

    // 团购
    if (this.data.payType === 'group') {
      if (!this.data.couponCode.match(/^\d{6,}$/)) {
        wx.showToast({
          title: '券号输入错误',
          icon: 'none'
        });

        return;
      }
    }

    app.post('center/completeOrder/' + this.data.orderId, {
      type: this.data.payType,
      beautician_code: this.data.beauticianCode, coupon_code: this.data.couponCode
    }).then(function () {
      _this2.getOrderList();
      _this2.data.lastComponent.hide();
      _this2.setData({
        orderId: '',
        orderNo: '',
        lastComponent: '',
        payType: '',
        beauticianCode: '', // 技师工号
        couponCode: '' // 优惠券
      });
    }).catch(function (error) {
      wx.showToast({
        title: error.detail || '支付失败，请重试',
        duration: 2000,
        icon: 'none'
      });
    });
  },
  payOnline: function payOnline() {
    var app = getApp();
    app.get('order/pay/' + this.data.orderNo).then(function (data) {
      var result = data.data;
      var payParams = {
        'success': function success(res) {
          var _this3 = this;

          wx.showToast({
            title: '支付成功,等待数据确认，请稍等...',
            duration: 3000,
            icon: 'none'
          });

          setTimeout(function (x) {
            return _this3.getOrderList();
          }, 2000);
        },
        'fail': function fail(res) {
          wx.showToast({
            title: '支付失败, 请重试...',
            duration: 2000,
            icon: 'none'
          });
        }
      };

      Object.assign(payParams, result.content);

      wx.requestPayment(payParams);
    }).catch(function (error) {
      wx.showToast({
        title: error.detail || '支付失败，请重试',
        duration: 2000,
        icon: 'none'
      });
    });
  },
  cash: function cash(event) {
    var id = event.currentTarget.dataset.id;
    this.setData({
      payType: 'cash',
      orderId: id
    });
    var dialogComponent = this.data.lastComponent = this.selectComponent('.wxc-cash');
    dialogComponent && dialogComponent.show();
  },
  handlerBeautician: function handlerBeautician(event) {
    var value = event.detail.value;
    this.setData({
      beauticianCode: value
    });
  },
  handlerCouponCode: function handlerCouponCode(event) {
    var value = event.detail.value;
    this.setData({
      couponCode: value
    });
  },
  scan: function scan(event) {
    var id = event.currentTarget.dataset.id;
    this.setData({
      payType: 'scan',
      orderId: id
    });
    var dialogComponent = this.data.lastComponent = this.selectComponent('.wxc-scan');
    dialogComponent && dialogComponent.show();
  },
  groupBy: function groupBy(event) {
    var id = event.currentTarget.dataset.id;
    this.setData({
      payType: 'group',
      orderId: id
    });
    var dialogComponent = this.data.lastComponent = this.selectComponent('.wxc-group');
    dialogComponent && dialogComponent.show();
  },
  online: function online(event) {
    var orderNo = event.currentTarget.dataset.id;
    var amount = event.currentTarget.dataset.amount;
    this.setData({
      payType: 'online',
      orderNo: orderNo,
      amount: amount
    });
    var dialogComponent = this.data.lastComponent = this.selectComponent('.wxc-online');
    dialogComponent && dialogComponent.show();
  },
  cancel: function cancel() {
    this.data.lastComponent.hide();
  },
  cancelOrderConfirm: function cancelOrderConfirm() {
    var _this4 = this;

    var app = getApp();
    var formId = this.data.formId;
    var orderId = this.data.orderId;
    var index = this.data.lastIndex;

    app.get('center/cancelOrder/' + orderId, { formId: formId }).then(function (data) {
      _this4.data.lastComponent.hide();
      var orderList = _this4.data.orderList;
      orderList[index].order_status = 2;
      _this4.setData({
        orderList: orderList,
        orderId: '',
        orderNo: '',
        lastComponent: '',
        payType: '',
        beauticianCode: '', // 技师工号
        couponCode: '', // 优惠券,
        formId: ''
      });
    }).catch(function (error) {
      wx.showToast({
        title: error.detail
      });
    });
  },
  cancelOrder: function cancelOrder(event) {

    var dialogComponent = this.data.lastComponent = this.selectComponent('.wxc-cancel-order');
    dialogComponent && dialogComponent.show();

    var formId = event.detail.formId;
    var orderId = event.detail.target.dataset.id;
    var index = event.detail.target.dataset.index;
    this.setData({
      formId: formId,
      orderId: orderId,
      lastIndex: index
    });
  },

  cancelOrder_1: function cancelOrder_1(event) {
    var _this5 = this;

    var app = getApp();
    var formId = event.detail.formId;
    var orderId = event.detail.target.dataset.id;
    var index = event.detail.target.dataset.index;

    //console.log(event)

    app.get('center/cancelOrder/' + orderId, { formId: formId }).then(function (data) {
      var orderList = _this5.data.orderList;
      orderList[index].order_status = 2;
      _this5.setData({
        orderList: orderList
      });
    }).catch(function (error) {
      wx.showToast({
        title: error.detail
      });
    });
  },
  _realDay: function _realDay(day, value) {
    try {
      var _day = day + ' ' + value;
      _day = _day.replace(/-/g, '/');
      var date = new Date(_day).getTime() + 30 * 60 * 1000;
      date = new Date(date);
      var minute = date.getMinutes();
      if (minute.toString().length == 1) minute += '0';

      // console.log(value)
      // console.log(day)
      return date.getHours() + ':' + minute + ':00';
    } catch (e) {
      return value;
    }
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwiYW1vdW50Iiwib3JkZXJUeXBlIiwib3JkZXJJZCIsImxhc3RDb21wb25lbnQiLCJvcmRlckxpc3QiLCJwYXlUeXBlIiwiYmVhdXRpY2lhbkNvZGUiLCJjb3Vwb25Db2RlIiwib25Mb2FkIiwib3B0aW9ucyIsIm9uU2hvdyIsImdldE9yZGVyTGlzdCIsImFwcCIsImdldEFwcCIsImdldCIsInRoZW4iLCJyZXN1bHQiLCJjb250ZW50IiwiZm9yRWFjaCIsIml0ZW0iLCJhcHBvaW50bWVudF9lbmRfdGltZSIsIl9yZWFsRGF5IiwiYXBwb2ludG1lbnRfZGF5Iiwic2V0RGF0YSIsInBheU9mZmxpbmUiLCJ0cmltIiwibGVuZ3RoIiwid3giLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJtYXRjaCIsInBvc3QiLCJ0eXBlIiwiYmVhdXRpY2lhbl9jb2RlIiwiY291cG9uX2NvZGUiLCJoaWRlIiwib3JkZXJObyIsImNhdGNoIiwiZXJyb3IiLCJkZXRhaWwiLCJkdXJhdGlvbiIsInBheU9ubGluZSIsInBheVBhcmFtcyIsInJlcyIsInNldFRpbWVvdXQiLCJPYmplY3QiLCJhc3NpZ24iLCJyZXF1ZXN0UGF5bWVudCIsImNhc2giLCJldmVudCIsImlkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJkaWFsb2dDb21wb25lbnQiLCJzZWxlY3RDb21wb25lbnQiLCJzaG93IiwiaGFuZGxlckJlYXV0aWNpYW4iLCJ2YWx1ZSIsImhhbmRsZXJDb3Vwb25Db2RlIiwic2NhbiIsImdyb3VwQnkiLCJvbmxpbmUiLCJjYW5jZWwiLCJjYW5jZWxPcmRlckNvbmZpcm0iLCJmb3JtSWQiLCJpbmRleCIsImxhc3RJbmRleCIsIm9yZGVyX3N0YXR1cyIsImNhbmNlbE9yZGVyIiwidGFyZ2V0IiwiY2FuY2VsT3JkZXJfMSIsImRheSIsIl9kYXkiLCJyZXBsYWNlIiwiZGF0ZSIsIkRhdGUiLCJnZXRUaW1lIiwibWludXRlIiwi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QVM7QUFDZFgsU0FBR0MsU0FBSCxDQUFhO0FBQ1hDLGVBQU9VLE1BQU1DO0FBREYsT0FBYjtBQUdELEtBWkg7QUFhRCxHO0FBQ0RuQixZQUFVLGtCQUFVbUQsR0FBVixFQUFlZCxLQUFmLEVBQXNCO0FBQzlCLFFBQUk7QUFDRixVQUFJZSxPQUFPRCxNQUFNLEdBQU4sR0FBWWQsS0FBdkI7QUFDQWUsYUFBT0EsS0FBS0MsT0FBTCxDQUFhLElBQWIsRUFBbUIsR0FBbkIsQ0FBUDtBQUNBLFVBQUlDLE9BQVEsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQUQsQ0FBaUJJLE9BQWpCLEtBQTZCLEtBQUssRUFBTCxHQUFVLElBQWxEO0FBQ0FGLGFBQVEsSUFBSUMsSUFBSixDQUFTRCxJQUFULENBQVI7QUFDQSxVQUFJRyxTQUFTSCxLQUFLSSxVQUFMLEVBQWI7QUFDQSxVQUFJRCxPQUFPRSxRQUFQLEdBQWtCdEQsTUFBbEIsSUFBNEIsQ0FBaEMsRUFDRW9ELFVBQVUsR0FBVjs7QUFFRjtBQUNBO0FBQ0EsYUFBT0gsS0FBS00sUUFBTCxLQUFrQixHQUFsQixHQUF3QkgsTUFBeEIsR0FBaUMsS0FBeEM7QUFDRCxLQVpELENBWUUsT0FBT0ksQ0FBUCxFQUFVO0FBQ1YsYUFBT3hCLEtBQVA7QUFDRDtBQUNGIiwiZmlsZSI6ImluZGV4Lnd4cCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWc6IHtcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoTorqLljZUnLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJyxcbiAgICAgIHVzaW5nQ29tcG9uZW50czoge1xuICAgICAgICAnd3hjLWRpYWxvZyc6ICdAbWludWkvd3hjLWRpYWxvZycsXG4gICAgICAgICd3eGMtYWJub3InOiAnQG1pbnVpL3d4Yy1hYm5vcicsXG4gICAgICAgICd3eGMtZWxpcCc6ICdAbWludWkvd3hjLWVsaXAnLFxuICAgICAgfVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgYW1vdW50OiAwLFxuICAgICAgb3JkZXJUeXBlOiAnJyxcbiAgICAgIG9yZGVySWQ6ICcnLFxuICAgICAgbGFzdENvbXBvbmVudDogJycsXG4gICAgICBvcmRlckxpc3Q6IFtdLFxuICAgICAgcGF5VHlwZTogJycsXG4gICAgICBiZWF1dGljaWFuQ29kZTogJycsICAvLyDmioDluIjlt6Xlj7dcbiAgICAgIGNvdXBvbkNvZGU6ICcnICAgICAgIC8vIOS8mOaDoOWIuFxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgLy8gY29uc29sZS5sb2cob3B0aW9ucylcbiAgICB9LFxuICAgIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5nZXRPcmRlckxpc3QoKVxuICAgIH0sXG4gICAgZ2V0T3JkZXJMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGFwcC5nZXQoJ2NlbnRlci9vcmRlcicpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBkYXRhLmRhdGFcbiAgICAgICAgcmVzdWx0LmNvbnRlbnQuZm9yRWFjaChpdGVtID0+IGl0ZW0uYXBwb2ludG1lbnRfZW5kX3RpbWUgPSB0aGlzLl9yZWFsRGF5KGl0ZW0uYXBwb2ludG1lbnRfZGF5LCBpdGVtLmFwcG9pbnRtZW50X2VuZF90aW1lKSlcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBvcmRlckxpc3Q6IHJlc3VsdC5jb250ZW50XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gICAgcGF5T2ZmbGluZTogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBpZiAodGhpcy5kYXRhLnBheVR5cGUgPT09ICdjYXNoJykge1xuICAgICAgICBpZiAodGhpcy5kYXRhLmJlYXV0aWNpYW5Db2RlLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgdGl0bGU6ICfmioDluIjlt6Xlj7fkuI3og73kuLrnqbonLFxuICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOWboui0rVxuICAgICAgaWYgKHRoaXMuZGF0YS5wYXlUeXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgIGlmICghdGhpcy5kYXRhLmNvdXBvbkNvZGUubWF0Y2goL15cXGR7Nix9JC8pKSB7XG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIHRpdGxlOiAn5Yi45Y+36L6T5YWl6ZSZ6K+vJyxcbiAgICAgICAgICAgIGljb246ICdub25lJ1xuICAgICAgICAgIH0pXG5cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIGFwcC5wb3N0KGBjZW50ZXIvY29tcGxldGVPcmRlci8ke3RoaXMuZGF0YS5vcmRlcklkfWAsIHtcbiAgICAgICAgdHlwZTogdGhpcy5kYXRhLnBheVR5cGUsXG4gICAgICAgIGJlYXV0aWNpYW5fY29kZTogdGhpcy5kYXRhLmJlYXV0aWNpYW5Db2RlLCBjb3Vwb25fY29kZTogdGhpcy5kYXRhLmNvdXBvbkNvZGVcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmdldE9yZGVyTGlzdCgpXG4gICAgICAgIHRoaXMuZGF0YS5sYXN0Q29tcG9uZW50LmhpZGUoKVxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIG9yZGVySWQ6ICcnLFxuICAgICAgICAgIG9yZGVyTm86ICcnLFxuICAgICAgICAgIGxhc3RDb21wb25lbnQ6ICcnLFxuICAgICAgICAgIHBheVR5cGU6ICcnLFxuICAgICAgICAgIGJlYXV0aWNpYW5Db2RlOiAnJywgIC8vIOaKgOW4iOW3peWPt1xuICAgICAgICAgIGNvdXBvbkNvZGU6ICcnICAgICAgIC8vIOS8mOaDoOWIuFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgdGl0bGU6IGVycm9yLmRldGFpbCB8fCAn5pSv5LuY5aSx6LSl77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIHBheU9ubGluZTogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBhcHAuZ2V0KGBvcmRlci9wYXkvJHt0aGlzLmRhdGEub3JkZXJOb31gKVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgICAgbGV0IHBheVBhcmFtcyA9IHtcbiAgICAgICAgICAgICdzdWNjZXNzJzogZnVuY3Rpb24gKHJlcykge1xuXG4gICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICfmlK/ku5jmiJDlip8s562J5b6F5pWw5o2u56Gu6K6k77yM6K+356iN562JLi4uJyxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KHggPT4gdGhpcy5nZXRPcmRlckxpc3QoKSwgMjAwMClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnZmFpbCc6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+aUr+S7mOWksei0pSwg6K+36YeN6K+VLi4uJyxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBPYmplY3QuYXNzaWduKHBheVBhcmFtcywgcmVzdWx0LmNvbnRlbnQpXG5cbiAgICAgICAgICB3eC5yZXF1ZXN0UGF5bWVudChwYXlQYXJhbXMpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIHRpdGxlOiBlcnJvci5kZXRhaWwgfHwgJ+aUr+S7mOWksei0pe+8jOivt+mHjeivlScsXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICAgIGljb246ICdub25lJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBjYXNoOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZFxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgcGF5VHlwZTogJ2Nhc2gnLFxuICAgICAgICBvcmRlcklkOiBpZCxcbiAgICAgIH0pXG4gICAgICBsZXQgZGlhbG9nQ29tcG9uZW50ID0gdGhpcy5kYXRhLmxhc3RDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1jYXNoJylcbiAgICAgIGRpYWxvZ0NvbXBvbmVudCAmJiBkaWFsb2dDb21wb25lbnQuc2hvdygpO1xuICAgIH0sXG4gICAgaGFuZGxlckJlYXV0aWNpYW46IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IHZhbHVlID0gZXZlbnQuZGV0YWlsLnZhbHVlXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBiZWF1dGljaWFuQ29kZTogdmFsdWVcbiAgICAgIH0pXG4gICAgfSxcbiAgICBoYW5kbGVyQ291cG9uQ29kZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgdmFsdWUgPSBldmVudC5kZXRhaWwudmFsdWVcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGNvdXBvbkNvZGU6IHZhbHVlXG4gICAgICB9KVxuICAgIH0sXG4gICAgc2NhbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHBheVR5cGU6ICdzY2FuJyxcbiAgICAgICAgb3JkZXJJZDogaWRcbiAgICAgIH0pXG4gICAgICBsZXQgZGlhbG9nQ29tcG9uZW50ID0gdGhpcy5kYXRhLmxhc3RDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1zY2FuJylcbiAgICAgIGRpYWxvZ0NvbXBvbmVudCAmJiBkaWFsb2dDb21wb25lbnQuc2hvdygpO1xuICAgIH0sXG4gICAgZ3JvdXBCeTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHBheVR5cGU6ICdncm91cCcsXG4gICAgICAgIG9yZGVySWQ6IGlkXG4gICAgICB9KVxuICAgICAgbGV0IGRpYWxvZ0NvbXBvbmVudCA9IHRoaXMuZGF0YS5sYXN0Q29tcG9uZW50ID0gdGhpcy5zZWxlY3RDb21wb25lbnQoJy53eGMtZ3JvdXAnKVxuICAgICAgZGlhbG9nQ29tcG9uZW50ICYmIGRpYWxvZ0NvbXBvbmVudC5zaG93KCk7XG4gICAgfSxcbiAgICBvbmxpbmU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IG9yZGVyTm8gPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgIGxldCBhbW91bnQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuYW1vdW50XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBwYXlUeXBlOiAnb25saW5lJyxcbiAgICAgICAgb3JkZXJObzogb3JkZXJObyxcbiAgICAgICAgYW1vdW50OiBhbW91bnQsXG4gICAgICB9KVxuICAgICAgbGV0IGRpYWxvZ0NvbXBvbmVudCA9IHRoaXMuZGF0YS5sYXN0Q29tcG9uZW50ID0gdGhpcy5zZWxlY3RDb21wb25lbnQoJy53eGMtb25saW5lJylcbiAgICAgIGRpYWxvZ0NvbXBvbmVudCAmJiBkaWFsb2dDb21wb25lbnQuc2hvdygpO1xuICAgIH0sXG4gICAgY2FuY2VsOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmRhdGEubGFzdENvbXBvbmVudC5oaWRlKCk7XG4gICAgfSxcbiAgICBjYW5jZWxPcmRlckNvbmZpcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IGZvcm1JZCA9IHRoaXMuZGF0YS5mb3JtSWRcbiAgICAgIGxldCBvcmRlcklkID0gdGhpcy5kYXRhLm9yZGVySWRcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5sYXN0SW5kZXhcblxuICAgICAgYXBwLmdldCgnY2VudGVyL2NhbmNlbE9yZGVyLycgKyBvcmRlcklkLCB7IGZvcm1JZDogZm9ybUlkfSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgdGhpcy5kYXRhLmxhc3RDb21wb25lbnQuaGlkZSgpXG4gICAgICAgICAgbGV0IG9yZGVyTGlzdCA9IHRoaXMuZGF0YS5vcmRlckxpc3RcbiAgICAgICAgICBvcmRlckxpc3RbaW5kZXhdLm9yZGVyX3N0YXR1cyA9IDJcbiAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgb3JkZXJMaXN0OiBvcmRlckxpc3QsXG4gICAgICAgICAgICBvcmRlcklkOiAnJyxcbiAgICAgICAgICAgIG9yZGVyTm86ICcnLFxuICAgICAgICAgICAgbGFzdENvbXBvbmVudDogJycsXG4gICAgICAgICAgICBwYXlUeXBlOiAnJyxcbiAgICAgICAgICAgIGJlYXV0aWNpYW5Db2RlOiAnJywgIC8vIOaKgOW4iOW3peWPt1xuICAgICAgICAgICAgY291cG9uQ29kZTogJycgLCAgICAgIC8vIOS8mOaDoOWIuCxcbiAgICAgICAgICAgIGZvcm1JZDogJydcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICB0aXRsZTogZXJyb3IuZGV0YWlsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGNhbmNlbE9yZGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgbGV0IGRpYWxvZ0NvbXBvbmVudCA9IHRoaXMuZGF0YS5sYXN0Q29tcG9uZW50ID0gdGhpcy5zZWxlY3RDb21wb25lbnQoJy53eGMtY2FuY2VsLW9yZGVyJylcbiAgICAgIGRpYWxvZ0NvbXBvbmVudCAmJiBkaWFsb2dDb21wb25lbnQuc2hvdygpO1xuXG4gICAgICBsZXQgZm9ybUlkID0gZXZlbnQuZGV0YWlsLmZvcm1JZFxuICAgICAgbGV0IG9yZGVySWQgPSBldmVudC5kZXRhaWwudGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmRldGFpbC50YXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgZm9ybUlkOiBmb3JtSWQsXG4gICAgICAgIG9yZGVySWQ6IG9yZGVySWQsXG4gICAgICAgIGxhc3RJbmRleDogaW5kZXhcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNhbmNlbE9yZGVyXzE6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgZm9ybUlkID0gZXZlbnQuZGV0YWlsLmZvcm1JZFxuICAgICAgbGV0IG9yZGVySWQgPSBldmVudC5kZXRhaWwudGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmRldGFpbC50YXJnZXQuZGF0YXNldC5pbmRleFxuXG4gICAgICAvL2NvbnNvbGUubG9nKGV2ZW50KVxuXG4gICAgICBhcHAuZ2V0KCdjZW50ZXIvY2FuY2VsT3JkZXIvJyArIG9yZGVySWQsIHsgZm9ybUlkOiBmb3JtSWR9KVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICBsZXQgb3JkZXJMaXN0ID0gdGhpcy5kYXRhLm9yZGVyTGlzdFxuICAgICAgICAgIG9yZGVyTGlzdFtpbmRleF0ub3JkZXJfc3RhdHVzID0gMlxuICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICBvcmRlckxpc3Q6IG9yZGVyTGlzdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIHRpdGxlOiBlcnJvci5kZXRhaWxcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgX3JlYWxEYXk6IGZ1bmN0aW9uIChkYXksIHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgX2RheSA9IGRheSArICcgJyArIHZhbHVlXG4gICAgICAgIF9kYXkgPSBfZGF5LnJlcGxhY2UoLy0vZywgJy8nKVxuICAgICAgICBsZXQgZGF0ZSA9IChuZXcgRGF0ZShfZGF5KSkuZ2V0VGltZSgpICsgMzAgKiA2MCAqIDEwMDBcbiAgICAgICAgZGF0ZSA9IChuZXcgRGF0ZShkYXRlKSlcbiAgICAgICAgbGV0IG1pbnV0ZSA9IGRhdGUuZ2V0TWludXRlcygpXG4gICAgICAgIGlmIChtaW51dGUudG9TdHJpbmcoKS5sZW5ndGggPT0gMSlcbiAgICAgICAgICBtaW51dGUgKz0gJzAnXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2codmFsdWUpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRheSlcbiAgICAgICAgcmV0dXJuIGRhdGUuZ2V0SG91cnMoKSArICc6JyArIG1pbnV0ZSArICc6MDAnXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfVxuICAgIH1cblxuICB9Il19