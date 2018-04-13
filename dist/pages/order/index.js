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
  }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwib3JkZXJMaXN0Iiwib25TaG93IiwiYXBwIiwiZ2V0QXBwIiwiZ2V0IiwidGhlbiIsInJlc3VsdCIsInNldERhdGEiLCJjb250ZW50IiwiY2FzaCIsImRpYWxvZ0NvbXBvbmVudCIsInNlbGVjdENvbXBvbmVudCIsInNob3ciLCJzY2FuIiwiZ3JvdXBCeSIsInBheSIsImNhbmNlbE9yZGVyIiwiZXZlbnQiLCJvcmRlcklkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJpZCIsImluZGV4Iiwib3JkZXJfc3RhdHVzIiwiY2F0Y2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9FQSxRQUFNO0FBQUE7QUFBQTtBQUFBOztBQUNKQyxlQUFXO0FBRFAsRztBQUdOQyxVQUFRLGtCQUFZO0FBQUE7O0FBQ2xCLFFBQUlDLE1BQU1DLFFBQVY7QUFDQUQsUUFBSUUsR0FBSixDQUFRLGNBQVIsRUFBd0JDLElBQXhCLENBQTZCLGdCQUFRO0FBQ25DLFVBQUlDLFNBQVNQLEtBQUtBLElBQWxCO0FBQ0EsWUFBS1EsT0FBTCxDQUFhO0FBQ1hQLG1CQUFXTSxPQUFPRTtBQURQLE9BQWI7QUFHRCxLQUxEO0FBTUQsRztBQUNEQyxRQUFNLGdCQUFZO0FBQ2hCLFFBQUlDLGtCQUFrQixLQUFLQyxlQUFMLENBQXFCLFdBQXJCLENBQXRCO0FBQ0FELHVCQUFtQkEsZ0JBQWdCRSxJQUFoQixFQUFuQjtBQUNELEc7QUFDREMsUUFBTSxnQkFBWTtBQUNoQixRQUFJSCxrQkFBa0IsS0FBS0MsZUFBTCxDQUFxQixXQUFyQixDQUF0QjtBQUNBRCx1QkFBbUJBLGdCQUFnQkUsSUFBaEIsRUFBbkI7QUFDRCxHO0FBQ0RFLFdBQVMsbUJBQVk7QUFDbkIsUUFBSUosa0JBQWtCLEtBQUtDLGVBQUwsQ0FBcUIsWUFBckIsQ0FBdEI7QUFDQUQsdUJBQW1CQSxnQkFBZ0JFLElBQWhCLEVBQW5CO0FBQ0QsRztBQUNERyxPQUFLLGVBQVk7QUFDZixRQUFJTCxrQkFBa0IsS0FBS0MsZUFBTCxDQUFxQixVQUFyQixDQUF0QjtBQUNBRCx1QkFBbUJBLGdCQUFnQkUsSUFBaEIsRUFBbkI7QUFDRCxHO0FBQ0RJLGVBQWEscUJBQVVDLEtBQVYsRUFBaUI7QUFBQTs7QUFDNUIsUUFBSWYsTUFBTUMsUUFBVjtBQUNBLFFBQUllLFVBQVVELE1BQU1FLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCQyxFQUExQztBQUNBLFFBQUlDLFFBQVFMLE1BQU1FLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCRSxLQUF4QztBQUNBcEIsUUFBSUUsR0FBSixDQUFRLHdCQUF3QmMsT0FBaEMsRUFDR2IsSUFESCxDQUNRLFlBQU07QUFDVixVQUFJTCxZQUFZLE9BQUtELElBQUwsQ0FBVUMsU0FBMUI7QUFDQUEsZ0JBQVVzQixLQUFWLEVBQWlCQyxZQUFqQixHQUFnQyxDQUFoQztBQUNBLGFBQUtoQixPQUFMLENBQWE7QUFDWFAsbUJBQVdBO0FBREEsT0FBYjtBQUdELEtBUEgsRUFRR3dCLEtBUkgsQ0FRUyxpQkFBUyxDQUFFLENBUnBCO0FBU0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5oiR55qE6K6i5Y2VJyxcbiAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICd3eGMtZGlhbG9nJzogJ0BtaW51aS93eGMtZGlhbG9nJ1xuICAgIH1cbiAgfSxcbiAgZGF0YToge1xuICAgIG9yZGVyTGlzdDogW11cbiAgfSxcbiAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgYXBwLmdldCgnY2VudGVyL29yZGVyJykudGhlbihkYXRhID0+IHtcbiAgICAgIGxldCByZXN1bHQgPSBkYXRhLmRhdGFcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIG9yZGVyTGlzdDogcmVzdWx0LmNvbnRlbnRcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbiAgY2FzaDogZnVuY3Rpb24gKCkge1xuICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1jYXNoJylcbiAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcbiAgfSxcbiAgc2NhbjogZnVuY3Rpb24gKCkge1xuICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1zY2FuJylcbiAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcbiAgfSxcbiAgZ3JvdXBCeTogZnVuY3Rpb24gKCkge1xuICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1ncm91cCcpXG4gICAgZGlhbG9nQ29tcG9uZW50ICYmIGRpYWxvZ0NvbXBvbmVudC5zaG93KCk7XG4gIH0sXG4gIHBheTogZnVuY3Rpb24gKCkge1xuICAgIGxldCBkaWFsb2dDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1wYXknKVxuICAgIGRpYWxvZ0NvbXBvbmVudCAmJiBkaWFsb2dDb21wb25lbnQuc2hvdygpO1xuICB9LFxuICBjYW5jZWxPcmRlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgbGV0IG9yZGVySWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWRcbiAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICBhcHAuZ2V0KCdjZW50ZXIvY2FuY2VsT3JkZXIvJyArIG9yZGVySWQpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGxldCBvcmRlckxpc3QgPSB0aGlzLmRhdGEub3JkZXJMaXN0XG4gICAgICAgIG9yZGVyTGlzdFtpbmRleF0ub3JkZXJfc3RhdHVzID0gMlxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIG9yZGVyTGlzdDogb3JkZXJMaXN0XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHt9KVxuICB9XG5cbn0iXX0=