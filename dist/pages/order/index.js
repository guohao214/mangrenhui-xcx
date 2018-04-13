'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    orderList: []
  },
  onShow: function onShow() {
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
  cash: function cash() {
    var dialogComponent = this.selectComponent('.wxc-cash');
    dialogComponent && dialogComponent.show();
  },
  scan: function scan() {
    var dialogComponent = this.selectComponent('.wxc-scan');
    dialogComponent && dialogComponent.show();
  },
  groupBy: function groupBy() {
    var dialogComponent = this.selectComponent('.wxc-group');
    dialogComponent && dialogComponent.show();
  },
  pay: function pay() {
    var dialogComponent = this.selectComponent('.wxc-pay');
    dialogComponent && dialogComponent.show();
  },
  cancelOrder: function cancelOrder(event) {
    var _this2 = this;

    var app = getApp();
    var orderId = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    app.get('center/cancelOrder/' + orderId).then(function () {
      var orderList = _this2.data.orderList;
      orderList[index].order_status = 2;
      _this2.setData({
        orderList: orderList
      });
    }).catch(function (error) {});
  },
  _realDay: function _realDay(value, day) {
    try {
      var _day = day + ' ' + value;
      _day = _day.replace(/-/g, '/');
      var date = new Date(_day).getTime() + 30 * 60 * 1000;
      var date = new Date(date);
      var minute = date.getMinutes();
      if (minute.toString().length == 1) minute += '0';
      return date.getHours() + ':' + minute + ':00';
    } catch (e) {
      return value;
    }
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwib3JkZXJMaXN0Iiwib25TaG93IiwiYXBwIiwiZ2V0QXBwIiwiZ2V0IiwidGhlbiIsInJlc3VsdCIsImNvbnRlbnQiLCJmb3JFYWNoIiwiaXRlbSIsImFwcG9pbnRtZW50X2VuZF90aW1lIiwiX3JlYWxEYXkiLCJhcHBvaW50bWVudF9kYXkiLCJzZXREYXRhIiwiY2FzaCIsImRpYWxvZ0NvbXBvbmVudCIsInNlbGVjdENvbXBvbmVudCIsInNob3ciLCJzY2FuIiwiZ3JvdXBCeSIsInBheSIsImNhbmNlbE9yZGVyIiwiZXZlbnQiLCJvcmRlcklkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJpZCIsImluZGV4Iiwib3JkZXJfc3RhdHVzIiwiY2F0Y2giLCJ2YWx1ZSIsImRheSIsIl9kYXkiLCJyZXBsYWNlIiwiZGF0ZSIsIkRhdGUiLCJnZXRUaW1lIiwibWludXRlIiwiZ2V0TWludXRlcyIsInRvU3RyaW5nIiwibGVuZ3RoIiwiZ2V0SG91cnMiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFPRUEsUUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFDSkMsZUFBVztBQURQLEc7QUFHTkMsVUFBUSxrQkFBWTtBQUFBOztBQUNsQixRQUFJQyxNQUFNQyxRQUFWO0FBQ0FELFFBQUlFLEdBQUosQ0FBUSxjQUFSLEVBQXdCQyxJQUF4QixDQUE2QixnQkFBUTtBQUNuQyxVQUFJQyxTQUFTUCxLQUFLQSxJQUFsQjtBQUNBTyxhQUFPQyxPQUFQLENBQWVDLE9BQWYsQ0FBdUI7QUFBQSxlQUFRQyxLQUFLQyxvQkFBTCxHQUE0QixNQUFLQyxRQUFMLENBQWNGLEtBQUtHLGVBQW5CLEVBQW9DSCxLQUFLQyxvQkFBekMsQ0FBcEM7QUFBQSxPQUF2QjtBQUNBLFlBQUtHLE9BQUwsQ0FBYTtBQUNYYixtQkFBV00sT0FBT0M7QUFEUCxPQUFiO0FBR0QsS0FORDtBQU9ELEc7QUFDRE8sUUFBTSxnQkFBWTtBQUNoQixRQUFJQyxrQkFBa0IsS0FBS0MsZUFBTCxDQUFxQixXQUFyQixDQUF0QjtBQUNBRCx1QkFBbUJBLGdCQUFnQkUsSUFBaEIsRUFBbkI7QUFDRCxHO0FBQ0RDLFFBQU0sZ0JBQVk7QUFDaEIsUUFBSUgsa0JBQWtCLEtBQUtDLGVBQUwsQ0FBcUIsV0FBckIsQ0FBdEI7QUFDQUQsdUJBQW1CQSxnQkFBZ0JFLElBQWhCLEVBQW5CO0FBQ0QsRztBQUNERSxXQUFTLG1CQUFZO0FBQ25CLFFBQUlKLGtCQUFrQixLQUFLQyxlQUFMLENBQXFCLFlBQXJCLENBQXRCO0FBQ0FELHVCQUFtQkEsZ0JBQWdCRSxJQUFoQixFQUFuQjtBQUNELEc7QUFDREcsT0FBSyxlQUFZO0FBQ2YsUUFBSUwsa0JBQWtCLEtBQUtDLGVBQUwsQ0FBcUIsVUFBckIsQ0FBdEI7QUFDQUQsdUJBQW1CQSxnQkFBZ0JFLElBQWhCLEVBQW5CO0FBQ0QsRztBQUNESSxlQUFhLHFCQUFVQyxLQUFWLEVBQWlCO0FBQUE7O0FBQzVCLFFBQUlwQixNQUFNQyxRQUFWO0FBQ0EsUUFBSW9CLFVBQVVELE1BQU1FLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCQyxFQUExQztBQUNBLFFBQUlDLFFBQVFMLE1BQU1FLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCRSxLQUF4QztBQUNBekIsUUFBSUUsR0FBSixDQUFRLHdCQUF3Qm1CLE9BQWhDLEVBQ0dsQixJQURILENBQ1EsWUFBTTtBQUNWLFVBQUlMLFlBQVksT0FBS0QsSUFBTCxDQUFVQyxTQUExQjtBQUNBQSxnQkFBVTJCLEtBQVYsRUFBaUJDLFlBQWpCLEdBQWdDLENBQWhDO0FBQ0EsYUFBS2YsT0FBTCxDQUFhO0FBQ1hiLG1CQUFXQTtBQURBLE9BQWI7QUFHRCxLQVBILEVBUUc2QixLQVJILENBUVMsaUJBQVMsQ0FBRSxDQVJwQjtBQVNELEc7QUFDRGxCLFlBQVUsa0JBQVVtQixLQUFWLEVBQWlCQyxHQUFqQixFQUFzQjtBQUNoQyxRQUFJO0FBQ0YsVUFBSUMsT0FBT0QsTUFBTSxHQUFOLEdBQVlELEtBQXZCO0FBQ0FFLGFBQU9BLEtBQUtDLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBQVA7QUFDQSxVQUFJQyxPQUFRLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFELENBQWlCSSxPQUFqQixLQUE2QixLQUFLLEVBQUwsR0FBVSxJQUFsRDtBQUNBLFVBQUlGLE9BQVEsSUFBSUMsSUFBSixDQUFTRCxJQUFULENBQVo7QUFDQSxVQUFJRyxTQUFTSCxLQUFLSSxVQUFMLEVBQWI7QUFDQSxVQUFJRCxPQUFPRSxRQUFQLEdBQWtCQyxNQUFsQixJQUE0QixDQUFoQyxFQUNFSCxVQUFVLEdBQVY7QUFDRixhQUFPSCxLQUFLTyxRQUFMLEtBQWtCLEdBQWxCLEdBQXdCSixNQUF4QixHQUFpQyxLQUF4QztBQUNELEtBVEQsQ0FTRSxPQUFPSyxDQUFQLEVBQVU7QUFDVixhQUFPWixLQUFQO0FBQ0Q7QUFDRiIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiJHnmoTorqLljZUnLFxuICAgIHVzaW5nQ29tcG9uZW50czoge1xuICAgICAgJ3d4Yy1kaWFsb2cnOiAnQG1pbnVpL3d4Yy1kaWFsb2cnXG4gICAgfVxuICB9LFxuICBkYXRhOiB7XG4gICAgb3JkZXJMaXN0OiBbXVxuICB9LFxuICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICBhcHAuZ2V0KCdjZW50ZXIvb3JkZXInKS50aGVuKGRhdGEgPT4ge1xuICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgcmVzdWx0LmNvbnRlbnQuZm9yRWFjaChpdGVtID0+IGl0ZW0uYXBwb2ludG1lbnRfZW5kX3RpbWUgPSB0aGlzLl9yZWFsRGF5KGl0ZW0uYXBwb2ludG1lbnRfZGF5LCBpdGVtLmFwcG9pbnRtZW50X2VuZF90aW1lKSlcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIG9yZGVyTGlzdDogcmVzdWx0LmNvbnRlbnRcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbiAgY2FzaDogZnVuY3Rpb24gKCkge1xuICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1jYXNoJylcbiAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcbiAgfSxcbiAgc2NhbjogZnVuY3Rpb24gKCkge1xuICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1zY2FuJylcbiAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcbiAgfSxcbiAgZ3JvdXBCeTogZnVuY3Rpb24gKCkge1xuICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1ncm91cCcpXG4gICAgZGlhbG9nQ29tcG9uZW50ICYmIGRpYWxvZ0NvbXBvbmVudC5zaG93KCk7XG4gIH0sXG4gIHBheTogZnVuY3Rpb24gKCkge1xuICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1wYXknKVxuICAgIGRpYWxvZ0NvbXBvbmVudCAmJiBkaWFsb2dDb21wb25lbnQuc2hvdygpO1xuICB9LFxuICBjYW5jZWxPcmRlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgbGV0IG9yZGVySWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWRcbiAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICBhcHAuZ2V0KCdjZW50ZXIvY2FuY2VsT3JkZXIvJyArIG9yZGVySWQpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGxldCBvcmRlckxpc3QgPSB0aGlzLmRhdGEub3JkZXJMaXN0XG4gICAgICAgIG9yZGVyTGlzdFtpbmRleF0ub3JkZXJfc3RhdHVzID0gMlxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIG9yZGVyTGlzdDogb3JkZXJMaXN0XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHt9KVxuICB9LFxuICBfcmVhbERheTogZnVuY3Rpb24gKHZhbHVlLCBkYXkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgX2RheSA9IGRheSArICcgJyArIHZhbHVlXG4gICAgX2RheSA9IF9kYXkucmVwbGFjZSgvLS9nLCAnLycpXG4gICAgdmFyIGRhdGUgPSAobmV3IERhdGUoX2RheSkpLmdldFRpbWUoKSArIDMwICogNjAgKiAxMDAwXG4gICAgdmFyIGRhdGUgPSAobmV3IERhdGUoZGF0ZSkpXG4gICAgdmFyIG1pbnV0ZSA9IGRhdGUuZ2V0TWludXRlcygpXG4gICAgaWYgKG1pbnV0ZS50b1N0cmluZygpLmxlbmd0aCA9PSAxKVxuICAgICAgbWludXRlICs9ICcwJ1xuICAgIHJldHVybiBkYXRlLmdldEhvdXJzKCkgKyAnOicgKyBtaW51dGUgKyAnOjAwJ1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cbn1cblxufSJdfQ==