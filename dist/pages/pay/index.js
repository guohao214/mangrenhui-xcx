'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    accountAmount: 0, // 账户余额
    amount: 0,
    orderType: '',
    orderId: '',
    lastComponent: '',
    formId: '',
    lastIndex: '',
    orderList: [],
    payType: '',
    beauticianCode: '',
    couponCode: ''
  },
  onLoad: function onLoad(options) {
    // console.log(options)
  },

  onShow: function onShow() {
    this.getOrderList();
  },

  onTabItemTap: function onTabItemTap() {
    this.getOrderList();
  },


  getOrderList: function getOrderList() {
    var _this = this;

    var app = getApp();
    app.get('center/order', { order_status: 1 }).then(function (data) {
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
          title: '管家工号不能为空',
          icon: 'none'
        });

        return;
      }
    }

    // 团购
    if (this.data.payType === 'group') {
      if (!this.data.couponCode.match(/^\d{10}$/) && !this.data.couponCode.match(/^\d{12}$/)) {
        wx.showToast({
          title: '券号输入错误,券号位数为10位或者12位',
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
      _this2.cancel();
    }).catch(function (error) {
      wx.showToast({
        title: error.detail || '支付失败，请重试',
        duration: 2000,
        icon: 'none'
      });
    });
  },

  payOnline: function payOnline() {
    var _this3 = this;

    var app = getApp();
    app.get('order/pay/' + this.data.orderNo).then(function (data) {
      var result = data.data;
      var self = _this3;
      var payParams = {
        'success': function success(res) {

          wx.showToast({
            title: '支付成功,等待数据确认，请稍等...',
            duration: 3000,
            icon: 'none'
          });

          self.cancel();

          setTimeout(function (x) {
            return self.getOrderList();
          }, 2000);
        },
        'fail': function fail(res) {
          // wx.showToast({
          //   title: '支付失败, 请重试...',
          //   duration: 2000,
          //   icon: 'none'
          // })
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

  // 余额支付
  payRecharge: function payRecharge() {
    var app = getApp();
    var self = this;

    app.get('RechargeCard/rechargePayment/' + this.data.orderNo).then(function (data) {
      wx.showToast({
        title: '支付成功,等待数据确认，请稍等...',
        duration: 3000,
        icon: 'none'
      });

      self.cancel();

      setTimeout(function (x) {
        return self.getOrderList();
      }, 2000);
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

  // 在线支付
  online: function online(event) {
    var orderNo = event.currentTarget.dataset.id;
    var amount = event.currentTarget.dataset.amount / 1;
    this.setData({
      payType: 'online',
      orderNo: orderNo,
      amount: amount
    });
    var dialogComponent = this.data.lastComponent = this.selectComponent('.wxc-online');
    dialogComponent && dialogComponent.show();
  },

  // 余额支付弹窗
  rechargePayment: function rechargePayment(event) {
    var _this4 = this;

    // 查询账户余额
    var app = getApp();
    var orderNo = event.currentTarget.dataset.id;
    var amount = event.currentTarget.dataset.amount / 1;

    app.get('rechargeCard/getMyRechargeCardTotalAmount/' + orderNo).then(function (data) {
      var accountAmount = data.data.content.amount;
      var realPaymentAmount = data.data.content.real_pay_amount;
      if (accountAmount <= 0) {
        return wx.message('账户余额为0，不能支付');
      }

      if (amount > accountAmount) {
        return wx.message('\u8D26\u6237\u4F59\u989D\u4E3A:\uFFE5' + accountAmount + '\uFF0C\u4F59\u989D\u4E0D\u8DB3\uFF0C\u4E0D\u80FD\u652F\u4ED8');
      }

      _this4.setData({
        accountAmount: accountAmount
      }, function () {
        _this4.setData({
          payType: 'recharge',
          orderNo: orderNo,
          amount: realPaymentAmount
        });

        var dialogComponent = _this4.data.lastComponent = _this4.selectComponent('.wxc-recharge');
        dialogComponent && dialogComponent.show();
      });
    });
  },

  cancel: function cancel() {
    this.data.lastComponent.hide();

    this.setData({
      amount: 0,
      orderType: '',
      orderId: '',
      lastComponent: '',
      formId: '',
      lastIndex: '',
      payType: '',
      beauticianCode: '',
      couponCode: ''
    });
  },

  cancelOrderConfirm: function cancelOrderConfirm() {
    var _this5 = this;

    var app = getApp();
    var formId = this.data.formId;
    var orderId = this.data.orderId;
    var index = this.data.lastIndex;

    app.get('center/cancelOrder/' + orderId, { formId: formId }).then(function (data) {
      var orderList = _this5.data.orderList;
      orderList[index].order_status = 2;
      _this5.cancel();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwiYWNjb3VudEFtb3VudCIsImFtb3VudCIsIm9yZGVyVHlwZSIsIm9yZGVySWQiLCJsYXN0Q29tcG9uZW50IiwiZm9ybUlkIiwibGFzdEluZGV4Iiwib3JkZXJMaXN0IiwicGF5VHlwZSIsImJlYXV0aWNpYW5Db2RlIiwiY291cG9uQ29kZSIsIm9uTG9hZCIsIm9wdGlvbnMiLCJvblNob3ciLCJnZXRPcmRlckxpc3QiLCJvblRhYkl0ZW1UYXAiLCJhcHAiLCJnZXRBcHAiLCJnZXQiLCJvcmRlcl9zdGF0dXMiLCJ0aGVuIiwicmVzdWx0IiwiY29udGVudCIsImZvckVhY2giLCJpdGVtIiwiYXBwb2ludG1lbnRfZW5kX3RpbWUiLCJfcmVhbERheSIsImFwcG9pbnRtZW50X2RheSIsInNldERhdGEiLCJwYXlPZmZsaW5lIiwidHJpbSIsImxlbmd0aCIsInd4Iiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwibWF0Y2giLCJwb3N0IiwidHlwZSIsImJlYXV0aWNpYW5fY29kZSIsImNvdXBvbl9jb2RlIiwiY2FuY2VsIiwiY2F0Y2giLCJlcnJvciIsImRldGFpbCIsImR1cmF0aW9uIiwicGF5T25saW5lIiwib3JkZXJObyIsInNlbGYiLCJwYXlQYXJhbXMiLCJyZXMiLCJzZXRUaW1lb3V0IiwiT2JqZWN0IiwiYXNzaWduIiwicmVxdWVzdFBheW1lbnQiLCJwYXlSZWNoYXJnZSIsImNhc2giLCJldmVudCIsImlkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJkaWFsb2dDb21wb25lbnQiLCJzZWxlY3RDb21wb25lbnQiLCJzaG93IiwiaGFuZGxlckJlYXV0aWNpYW4iLCJ2YWx1ZSIsImhhbmRsZXJDb3Vwb25Db2RlIiwic2NhbiIsImdyb3VwQnkiLCJvbmxpbmUiLCJyZWNoYXJnZVBheW1lbnQiLCJyZWFsUGF5bWVudEFtb3VudCIsInJlYWxfcGF5X2Ftb3VudCIsIm1lc3NhZ2UiLCJoaWRlIiwiY2FuY2VsT3JkZXJDb25maXJtIiwiaW5kZXgiLCJjYW5jZWxPcmRlciIsInRhcmdldCIsImRheSIsIl9kYXkiLCJyZXBsYWNlIiwiZGF0ZSIsIkRhdGUiLCJnZXRUaW1lIiwibWludXRlIiwiZ2V0TWludXRlcyIsInRvU3RyaW5nIiwiZ2V0SG91cnMiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFXSUEsUUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFDSkMsbUJBQWUsQ0FEWCxFQUNjO0FBQ2xCQyxZQUFRLENBRko7QUFHSkMsZUFBVyxFQUhQO0FBSUpDLGFBQVMsRUFKTDtBQUtKQyxtQkFBZSxFQUxYO0FBTUpDLFlBQVEsRUFOSjtBQU9KQyxlQUFXLEVBUFA7QUFRSkMsZUFBVyxFQVJQO0FBU0pDLGFBQVMsRUFUTDtBQVVKQyxvQkFBZ0IsRUFWWjtBQVdKQyxnQkFBWTtBQVhSLEc7QUFhTkMsVUFBUSxnQkFBVUMsT0FBVixFQUFtQjtBQUN6QjtBQUNELEc7O0FBRURDLFVBQVEsa0JBQVk7QUFDbEIsU0FBS0MsWUFBTDtBQUNELEc7O0FBRURDLGMsMEJBQWU7QUFDYixTQUFLRCxZQUFMO0FBQ0QsRzs7O0FBRURBLGdCQUFjLHdCQUFZO0FBQUE7O0FBQ3hCLFFBQUlFLE1BQU1DLFFBQVY7QUFDQUQsUUFBSUUsR0FBSixDQUFRLGNBQVIsRUFBd0IsRUFBQ0MsY0FBYyxDQUFmLEVBQXhCLEVBQTJDQyxJQUEzQyxDQUFnRCxnQkFBUTtBQUN0RCxVQUFJQyxTQUFTdEIsS0FBS0EsSUFBbEI7QUFDQXNCLGFBQU9DLE9BQVAsQ0FBZUMsT0FBZixDQUF1QjtBQUFBLGVBQVFDLEtBQUtDLG9CQUFMLEdBQTRCLE1BQUtDLFFBQUwsQ0FBY0YsS0FBS0csZUFBbkIsRUFBb0NILEtBQUtDLG9CQUF6QyxDQUFwQztBQUFBLE9BQXZCO0FBQ0EsWUFBS0csT0FBTCxDQUFhO0FBQ1hyQixtQkFBV2MsT0FBT0M7QUFEUCxPQUFiO0FBR0QsS0FORDtBQU9ELEc7QUFDRE8sY0FBWSxzQkFBWTtBQUFBOztBQUN0QixRQUFJYixNQUFNQyxRQUFW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QVlkLEtBQXZCO0FBQ0FlLGFBQU9BLEtBQUtDLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBQVA7QUFDQSxVQUFJQyxPQUFRLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFELENBQWlCSSxPQUFqQixLQUE2QixLQUFLLEVBQUwsR0FBVSxJQUFsRDtBQUNBRixhQUFRLElBQUlDLElBQUosQ0FBU0QsSUFBVCxDQUFSO0FBQ0EsVUFBSUcsU0FBU0gsS0FBS0ksVUFBTCxFQUFiO0FBQ0EsVUFBSUQsT0FBT0UsUUFBUCxHQUFrQnhELE1BQWxCLElBQTRCLENBQWhDLEVBQ0VzRCxVQUFVLEdBQVY7O0FBRUY7QUFDQTtBQUNBLGFBQU9ILEtBQUtNLFFBQUwsS0FBa0IsR0FBbEIsR0FBd0JILE1BQXhCLEdBQWlDLEtBQXhDO0FBQ0QsS0FaRCxDQVlFLE9BQU9JLENBQVAsRUFBVTtBQUNWLGFBQU94QixLQUFQO0FBQ0Q7QUFDRiIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5Lmw5Y2VJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjRThFOEU4JyxcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaycsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1kaWFsb2cnOiAnQG1pbnVpL3d4Yy1kaWFsb2cnLFxuICAgICAgICAnd3hjLWFibm9yJzogJ0BtaW51aS93eGMtYWJub3InLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIGFjY291bnRBbW91bnQ6IDAsIC8vIOi0puaIt+S9meminVxuICAgICAgYW1vdW50OiAwLFxuICAgICAgb3JkZXJUeXBlOiAnJyxcbiAgICAgIG9yZGVySWQ6ICcnLFxuICAgICAgbGFzdENvbXBvbmVudDogJycsXG4gICAgICBmb3JtSWQ6ICcnLFxuICAgICAgbGFzdEluZGV4OiAnJyxcbiAgICAgIG9yZGVyTGlzdDogW10sXG4gICAgICBwYXlUeXBlOiAnJyxcbiAgICAgIGJlYXV0aWNpYW5Db2RlOiAnJyxcbiAgICAgIGNvdXBvbkNvZGU6ICcnXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhvcHRpb25zKVxuICAgIH0sXG5cbiAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZ2V0T3JkZXJMaXN0KClcbiAgICB9LFxuXG4gICAgb25UYWJJdGVtVGFwKCkge1xuICAgICAgdGhpcy5nZXRPcmRlckxpc3QoKVxuICAgIH0sXG5cbiAgICBnZXRPcmRlckxpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgYXBwLmdldCgnY2VudGVyL29yZGVyJywge29yZGVyX3N0YXR1czogMX0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBkYXRhLmRhdGFcbiAgICAgICAgcmVzdWx0LmNvbnRlbnQuZm9yRWFjaChpdGVtID0+IGl0ZW0uYXBwb2ludG1lbnRfZW5kX3RpbWUgPSB0aGlzLl9yZWFsRGF5KGl0ZW0uYXBwb2ludG1lbnRfZGF5LCBpdGVtLmFwcG9pbnRtZW50X2VuZF90aW1lKSlcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBvcmRlckxpc3Q6IHJlc3VsdC5jb250ZW50XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gICAgcGF5T2ZmbGluZTogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBpZiAodGhpcy5kYXRhLnBheVR5cGUgPT09ICdjYXNoJykge1xuICAgICAgICBpZiAodGhpcy5kYXRhLmJlYXV0aWNpYW5Db2RlLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgdGl0bGU6ICfnrqHlrrblt6Xlj7fkuI3og73kuLrnqbonLFxuICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOWboui0rVxuICAgICAgaWYgKHRoaXMuZGF0YS5wYXlUeXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgIGlmICghdGhpcy5kYXRhLmNvdXBvbkNvZGUubWF0Y2goL15cXGR7MTB9JC8pICYmICF0aGlzLmRhdGEuY291cG9uQ29kZS5tYXRjaCgvXlxcZHsxMn0kLykpIHtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgdGl0bGU6ICfliLjlj7fovpPlhaXplJnor68s5Yi45Y+35L2N5pWw5Li6MTDkvY3miJbogIUxMuS9jScsXG4gICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgICBhcHAucG9zdChgY2VudGVyL2NvbXBsZXRlT3JkZXIvJHt0aGlzLmRhdGEub3JkZXJJZH1gLCB7XG4gICAgICAgIHR5cGU6IHRoaXMuZGF0YS5wYXlUeXBlLFxuICAgICAgICBiZWF1dGljaWFuX2NvZGU6IHRoaXMuZGF0YS5iZWF1dGljaWFuQ29kZSwgY291cG9uX2NvZGU6IHRoaXMuZGF0YS5jb3Vwb25Db2RlXG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5nZXRPcmRlckxpc3QoKVxuICAgICAgICB0aGlzLmNhbmNlbCgpXG4gICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICB0aXRsZTogZXJyb3IuZGV0YWlsIHx8ICfmlK/ku5jlpLHotKXvvIzor7fph43or5UnLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBwYXlPbmxpbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgYXBwLmdldChgb3JkZXIvcGF5LyR7dGhpcy5kYXRhLm9yZGVyTm99YClcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgICAgIGxldCBwYXlQYXJhbXMgPSB7XG4gICAgICAgICAgICAnc3VjY2Vzcyc6IGZ1bmN0aW9uIChyZXMpIHtcblxuICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAn5pSv5LuY5oiQ5YqfLOetieW+heaVsOaNruehruiupO+8jOivt+eojeetiS4uLicsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMDAsXG4gICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgc2VsZi5jYW5jZWwoKVxuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoeCA9PiBzZWxmLmdldE9yZGVyTGlzdCgpLCAyMDAwKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdmYWlsJzogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAvLyB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAvLyAgIHRpdGxlOiAn5pSv5LuY5aSx6LSlLCDor7fph43or5UuLi4nLFxuICAgICAgICAgICAgICAvLyAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICAgICAgICAvLyAgIGljb246ICdub25lJ1xuICAgICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIE9iamVjdC5hc3NpZ24ocGF5UGFyYW1zLCByZXN1bHQuY29udGVudClcblxuICAgICAgICAgIHd4LnJlcXVlc3RQYXltZW50KHBheVBhcmFtcylcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgdGl0bGU6IGVycm9yLmRldGFpbCB8fCAn5pSv5LuY5aSx6LSl77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5L2Z6aKd5pSv5LuYXG4gICAgcGF5UmVjaGFyZ2UoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzXG5cbiAgICAgIGFwcC5nZXQoYFJlY2hhcmdlQ2FyZC9yZWNoYXJnZVBheW1lbnQvJHt0aGlzLmRhdGEub3JkZXJOb31gKVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAn5pSv5LuY5oiQ5YqfLOetieW+heaVsOaNruehruiupO+8jOivt+eojeetiS4uLicsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMDAsXG4gICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgc2VsZi5jYW5jZWwoKVxuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoeCA9PiBzZWxmLmdldE9yZGVyTGlzdCgpLCAyMDAwKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICB0aXRsZTogZXJyb3IuZGV0YWlsIHx8ICfmlK/ku5jlpLHotKXvvIzor7fph43or5UnLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0sXG5cblxuICAgIGNhc2g6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGlkID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBwYXlUeXBlOiAnY2FzaCcsXG4gICAgICAgIG9yZGVySWQ6IGlkLFxuICAgICAgfSlcbiAgICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLmRhdGEubGFzdENvbXBvbmVudCA9IHRoaXMuc2VsZWN0Q29tcG9uZW50KCcud3hjLWNhc2gnKVxuICAgICAgZGlhbG9nQ29tcG9uZW50ICYmIGRpYWxvZ0NvbXBvbmVudC5zaG93KCk7XG4gICAgfSxcbiAgICBoYW5kbGVyQmVhdXRpY2lhbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgdmFsdWUgPSBldmVudC5kZXRhaWwudmFsdWVcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGJlYXV0aWNpYW5Db2RlOiB2YWx1ZVxuICAgICAgfSlcbiAgICB9LFxuICAgIGhhbmRsZXJDb3Vwb25Db2RlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCB2YWx1ZSA9IGV2ZW50LmRldGFpbC52YWx1ZVxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY291cG9uQ29kZTogdmFsdWVcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIHNjYW46IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGlkID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBwYXlUeXBlOiAnc2NhbicsXG4gICAgICAgIG9yZGVySWQ6IGlkXG4gICAgICB9KVxuICAgICAgbGV0IGRpYWxvZ0NvbXBvbmVudCA9IHRoaXMuZGF0YS5sYXN0Q29tcG9uZW50ID0gdGhpcy5zZWxlY3RDb21wb25lbnQoJy53eGMtc2NhbicpXG4gICAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcbiAgICB9LFxuICAgIGdyb3VwQnk6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGlkID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBwYXlUeXBlOiAnZ3JvdXAnLFxuICAgICAgICBvcmRlcklkOiBpZFxuICAgICAgfSlcbiAgICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLmRhdGEubGFzdENvbXBvbmVudCA9IHRoaXMuc2VsZWN0Q29tcG9uZW50KCcud3hjLWdyb3VwJylcbiAgICAgIGRpYWxvZ0NvbXBvbmVudCAmJiBkaWFsb2dDb21wb25lbnQuc2hvdygpO1xuICAgIH0sXG5cbiAgICAvLyDlnKjnur/mlK/ku5hcbiAgICBvbmxpbmU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IG9yZGVyTm8gPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgIGxldCBhbW91bnQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuYW1vdW50IC8gMVxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgcGF5VHlwZTogJ29ubGluZScsXG4gICAgICAgIG9yZGVyTm86IG9yZGVyTm8sXG4gICAgICAgIGFtb3VudDogYW1vdW50LFxuICAgICAgfSlcbiAgICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLmRhdGEubGFzdENvbXBvbmVudCA9IHRoaXMuc2VsZWN0Q29tcG9uZW50KCcud3hjLW9ubGluZScpXG4gICAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcbiAgICB9LFxuXG4gICAgLy8g5L2Z6aKd5pSv5LuY5by556qXXG4gICAgcmVjaGFyZ2VQYXltZW50OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIC8vIOafpeivoui0puaIt+S9meminVxuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgb3JkZXJObyA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZFxuICAgICAgbGV0IGFtb3VudCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5hbW91bnQgLyAxXG5cbiAgICAgIGFwcC5nZXQoYHJlY2hhcmdlQ2FyZC9nZXRNeVJlY2hhcmdlQ2FyZFRvdGFsQW1vdW50LyR7b3JkZXJOb31gKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBjb25zdCBhY2NvdW50QW1vdW50ID0gZGF0YS5kYXRhLmNvbnRlbnQuYW1vdW50XG4gICAgICAgIGNvbnN0IHJlYWxQYXltZW50QW1vdW50ID0gZGF0YS5kYXRhLmNvbnRlbnQucmVhbF9wYXlfYW1vdW50XG4gICAgICAgIGlmIChhY2NvdW50QW1vdW50IDw9IDApIHtcbiAgICAgICAgICByZXR1cm4gd3gubWVzc2FnZSgn6LSm5oi35L2Z6aKd5Li6MO+8jOS4jeiDveaUr+S7mCcpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW1vdW50ID4gYWNjb3VudEFtb3VudCkge1xuICAgICAgICAgIHJldHVybiB3eC5tZXNzYWdlKGDotKbmiLfkvZnpop3kuLo677+lJHthY2NvdW50QW1vdW50fe+8jOS9memineS4jei2s++8jOS4jeiDveaUr+S7mGApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGFjY291bnRBbW91bnRcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICBwYXlUeXBlOiAncmVjaGFyZ2UnLFxuICAgICAgICAgICAgb3JkZXJObzogb3JkZXJObyxcbiAgICAgICAgICAgIGFtb3VudDogcmVhbFBheW1lbnRBbW91bnQsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLmRhdGEubGFzdENvbXBvbmVudCA9IHRoaXMuc2VsZWN0Q29tcG9uZW50KCcud3hjLXJlY2hhcmdlJylcbiAgICAgICAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBcbiAgICB9LFxuXG5cbiAgICBjYW5jZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZGF0YS5sYXN0Q29tcG9uZW50LmhpZGUoKTtcblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgYW1vdW50OiAwLFxuICAgICAgICBvcmRlclR5cGU6ICcnLFxuICAgICAgICBvcmRlcklkOiAnJyxcbiAgICAgICAgbGFzdENvbXBvbmVudDogJycsXG4gICAgICAgIGZvcm1JZDogJycsXG4gICAgICAgIGxhc3RJbmRleDogJycsXG4gICAgICAgIHBheVR5cGU6ICcnLFxuICAgICAgICBiZWF1dGljaWFuQ29kZTogJycsXG4gICAgICAgIGNvdXBvbkNvZGU6ICcnXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjYW5jZWxPcmRlckNvbmZpcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IGZvcm1JZCA9IHRoaXMuZGF0YS5mb3JtSWRcbiAgICAgIGxldCBvcmRlcklkID0gdGhpcy5kYXRhLm9yZGVySWRcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5sYXN0SW5kZXhcblxuICAgICAgYXBwLmdldCgnY2VudGVyL2NhbmNlbE9yZGVyLycgKyBvcmRlcklkLCB7Zm9ybUlkOiBmb3JtSWR9KVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICBsZXQgb3JkZXJMaXN0ID0gdGhpcy5kYXRhLm9yZGVyTGlzdFxuICAgICAgICAgIG9yZGVyTGlzdFtpbmRleF0ub3JkZXJfc3RhdHVzID0gMlxuICAgICAgICAgIHRoaXMuY2FuY2VsKClcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgdGl0bGU6IGVycm9yLmRldGFpbFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBjYW5jZWxPcmRlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLmRhdGEubGFzdENvbXBvbmVudCA9IHRoaXMuc2VsZWN0Q29tcG9uZW50KCcud3hjLWNhbmNlbC1vcmRlcicpXG4gICAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcblxuICAgICAgbGV0IGZvcm1JZCA9IGV2ZW50LmRldGFpbC5mb3JtSWRcbiAgICAgIGxldCBvcmRlcklkID0gZXZlbnQuZGV0YWlsLnRhcmdldC5kYXRhc2V0LmlkXG4gICAgICBsZXQgaW5kZXggPSBldmVudC5kZXRhaWwudGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGZvcm1JZDogZm9ybUlkLFxuICAgICAgICBvcmRlcklkOiBvcmRlcklkLFxuICAgICAgICBsYXN0SW5kZXg6IGluZGV4XG4gICAgICB9KVxuICAgIH0sXG4gICAgX3JlYWxEYXk6IGZ1bmN0aW9uIChkYXksIHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgX2RheSA9IGRheSArICcgJyArIHZhbHVlXG4gICAgICAgIF9kYXkgPSBfZGF5LnJlcGxhY2UoLy0vZywgJy8nKVxuICAgICAgICBsZXQgZGF0ZSA9IChuZXcgRGF0ZShfZGF5KSkuZ2V0VGltZSgpICsgMzAgKiA2MCAqIDEwMDBcbiAgICAgICAgZGF0ZSA9IChuZXcgRGF0ZShkYXRlKSlcbiAgICAgICAgbGV0IG1pbnV0ZSA9IGRhdGUuZ2V0TWludXRlcygpXG4gICAgICAgIGlmIChtaW51dGUudG9TdHJpbmcoKS5sZW5ndGggPT0gMSlcbiAgICAgICAgICBtaW51dGUgKz0gJzAnXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2codmFsdWUpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRheSlcbiAgICAgICAgcmV0dXJuIGRhdGUuZ2V0SG91cnMoKSArICc6JyArIG1pbnV0ZSArICc6MDAnXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfVxuICAgIH1cblxuICB9Il19