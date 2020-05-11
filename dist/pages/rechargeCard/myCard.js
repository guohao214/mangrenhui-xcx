'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    cards: [],
    totalAmount: 0
  },
  onLoad: function onLoad(options) {
    // console.log(options)
  },

  onShow: function onShow() {
    this.getCards();
    this.getTotalAmount();
  },

  getTotalAmount: function getTotalAmount() {
    var _this = this;

    var app = getApp();
    app.get('rechargeCard/getMyRechargeCardTotalAmountSummery').then(function (data) {
      _this.setData({
        totalAmount: data.data.content / 1 || 0
      });
    });
  },


  getCards: function getCards() {
    var _this2 = this;

    var app = getApp();
    app.get('rechargeCard/getMyRechargeCard').then(function (data) {
      var result = data.data;
      _this2.setData({
        cards: result.content
      });
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm15Q2FyZC53eHAiXSwibmFtZXMiOlsiZGF0YSIsImNhcmRzIiwidG90YWxBbW91bnQiLCJvbkxvYWQiLCJvcHRpb25zIiwib25TaG93IiwiZ2V0Q2FyZHMiLCJnZXRUb3RhbEFtb3VudCIsImFwcCIsImdldEFwcCIsImdldCIsInRoZW4iLCJzZXREYXRhIiwiY29udGVudCIsInJlc3VsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBY0lBLFFBQU07QUFDSkMsV0FBTyxFQURIO0FBRUpDLGlCQUFhO0FBRlQsRztBQUlOQyxVQUFRLGdCQUFVQyxPQUFWLEVBQW1CO0FBQ3pCO0FBQ0QsRzs7QUFFREMsVUFBUSxrQkFBWTtBQUNsQixTQUFLQyxRQUFMO0FBQ0EsU0FBS0MsY0FBTDtBQUNELEc7O0FBRURBLGdCLDRCQUFpQjtBQUFBOztBQUNmLFFBQUlDLE1BQU1DLFFBQVY7QUFDQUQsUUFBSUUsR0FBSixDQUFRLGtEQUFSLEVBQTREQyxJQUE1RCxDQUFpRSxnQkFBUTtBQUN2RSxZQUFLQyxPQUFMLENBQWE7QUFDWFYscUJBQWNGLEtBQUtBLElBQUwsQ0FBVWEsT0FBVixHQUFtQixDQUFwQixJQUEyQjtBQUQ3QixPQUFiO0FBR0QsS0FKRDtBQUtELEc7OztBQUVEUCxZQUFVLG9CQUFZO0FBQUE7O0FBQ3BCLFFBQUlFLE1BQU1DLFFBQVY7QUFDQUQsUUFBSUUsR0FBSixDQUFRLGdDQUFSLEVBQTBDQyxJQUExQyxDQUErQyxnQkFBUTtBQUNyRCxVQUFJRyxTQUFTZCxLQUFLQSxJQUFsQjtBQUNBLGFBQUtZLE9BQUwsQ0FBYTtBQUNYWCxlQUFPYSxPQUFPRDtBQURILE9BQWI7QUFHRCxLQUxEO0FBTUQiLCJmaWxlIjoibXlDYXJkLnd4cCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWc6IHtcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICflhYXlgLzljaEnLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNFOEU4RTgnLFxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJyxcbiAgICAgIHVzaW5nQ29tcG9uZW50czoge1xuICAgICAgICAnd3hjLWRpYWxvZyc6ICdAbWludWkvd3hjLWRpYWxvZycsXG4gICAgICAgICd3eGMtYWJub3InOiAnQG1pbnVpL3d4Yy1hYm5vcicsXG4gICAgICAgICd3eGMtZWxpcCc6ICdAbWludWkvd3hjLWVsaXAnLFxuICAgICAgICAnd3hjLWZsZXgnOiAnQG1pbnVpL3d4Yy1mbGV4JyxcbiAgICAgICAgJ3d4Yy1pY29uJzogJ0BtaW51aS93eGMtaWNvbicsXG4gICAgICAgICd3eGMtYXZhdGFyJzogJ0BtaW51aS93eGMtYXZhdGFyJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIGNhcmRzOiBbXSxcbiAgICAgIHRvdGFsQW1vdW50OiAwLFxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgLy8gY29uc29sZS5sb2cob3B0aW9ucylcbiAgICB9LFxuXG4gICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmdldENhcmRzKClcbiAgICAgIHRoaXMuZ2V0VG90YWxBbW91bnQoKVxuICAgIH0sXG5cbiAgICBnZXRUb3RhbEFtb3VudCgpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgYXBwLmdldCgncmVjaGFyZ2VDYXJkL2dldE15UmVjaGFyZ2VDYXJkVG90YWxBbW91bnRTdW1tZXJ5JykudGhlbihkYXRhID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICB0b3RhbEFtb3VudDogKGRhdGEuZGF0YS5jb250ZW50IC8xICkgfHwgMFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZ2V0Q2FyZHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgYXBwLmdldCgncmVjaGFyZ2VDYXJkL2dldE15UmVjaGFyZ2VDYXJkJykudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGNhcmRzOiByZXN1bHQuY29udGVudFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICB9Il19