'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    addressList: []
  },
  onLoad: function onLoad(options) {
    // console.log(options)
  },

  onShow: function onShow() {
    this.getAddressList();
  },

  goForm: function goForm(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address/form?id=' + id
    });
  },
  addPet: function addPet() {
    wx.navigateTo({
      url: '/pages/address/form'
    });
  },


  getAddressList: function getAddressList() {
    var _this = this;

    var app = getApp();
    app.get('center/addressList').then(function (data) {
      var result = data.data;
      _this.setData({
        addressList: result.content
      });
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwiYWRkcmVzc0xpc3QiLCJvbkxvYWQiLCJvcHRpb25zIiwib25TaG93IiwiZ2V0QWRkcmVzc0xpc3QiLCJnb0Zvcm0iLCJlIiwiaWQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImFkZFBldCIsImFwcCIsImdldEFwcCIsImdldCIsInRoZW4iLCJyZXN1bHQiLCJzZXREYXRhIiwiY29udGVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBY0lBLFFBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ0pDLGlCQUFhO0FBRFQsRztBQUdOQyxVQUFRLGdCQUFVQyxPQUFWLEVBQW1CO0FBQ3pCO0FBQ0QsRzs7QUFFREMsVUFBUSxrQkFBWTtBQUNsQixTQUFLQyxjQUFMO0FBQ0QsRzs7QUFFREMsUSxrQkFBT0MsQyxFQUFHO0FBQ1IsUUFBTUMsS0FBS0QsRUFBRUUsYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JGLEVBQW5DO0FBQ0FHLE9BQUdDLFVBQUgsQ0FBYztBQUNaQyxXQUFLLDRCQUE0Qkw7QUFEckIsS0FBZDtBQUdELEc7QUFFRE0sUSxvQkFBUztBQUNQSCxPQUFHQyxVQUFILENBQWM7QUFDWkMsV0FBSztBQURPLEtBQWQ7QUFHRCxHOzs7QUFFRFIsa0JBQWdCLDBCQUFZO0FBQUE7O0FBQzFCLFFBQUlVLE1BQU1DLFFBQVY7QUFDQUQsUUFBSUUsR0FBSixDQUFRLG9CQUFSLEVBQThCQyxJQUE5QixDQUFtQyxnQkFBUTtBQUN6QyxVQUFJQyxTQUFTbkIsS0FBS0EsSUFBbEI7QUFDQSxZQUFLb0IsT0FBTCxDQUFhO0FBQ1huQixxQkFBYWtCLE9BQU9FO0FBRFQsT0FBYjtBQUdELEtBTEQ7QUFNRCIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5oiR55qE5Zyw5Z2AJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjRThFOEU4JyxcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaycsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1kaWFsb2cnOiAnQG1pbnVpL3d4Yy1kaWFsb2cnLFxuICAgICAgICAnd3hjLWFibm9yJzogJ0BtaW51aS93eGMtYWJub3InLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgICAgJ3d4Yy1mbGV4JzogJ0BtaW51aS93eGMtZmxleCcsXG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBhZGRyZXNzTGlzdDogW10sXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhvcHRpb25zKVxuICAgIH0sXG5cbiAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZ2V0QWRkcmVzc0xpc3QoKVxuICAgIH0sXG5cbiAgICBnb0Zvcm0oZSkge1xuICAgICAgY29uc3QgaWQgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZFxuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogJy9wYWdlcy9hZGRyZXNzL2Zvcm0/aWQ9JyArIGlkXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBhZGRQZXQoKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiAnL3BhZ2VzL2FkZHJlc3MvZm9ybSdcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGdldEFkZHJlc3NMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGFwcC5nZXQoJ2NlbnRlci9hZGRyZXNzTGlzdCcpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBkYXRhLmRhdGFcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBhZGRyZXNzTGlzdDogcmVzdWx0LmNvbnRlbnRcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcbiAgfSJdfQ==