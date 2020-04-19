'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    pets: []
  },
  onLoad: function onLoad(options) {
    // console.log(options)
  },

  onShow: function onShow() {
    this.getPets();
  },

  goForm: function goForm(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/pet/form?id=' + id
    });
  },
  addPet: function addPet() {
    wx.navigateTo({
      url: '/pages/pet/form'
    });
  },


  getPets: function getPets() {
    var _this = this;

    var app = getApp();
    app.get('pet/findMyPets').then(function (data) {
      var result = data.data;
      _this.setData({
        pets: result.content
      });
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwicGV0cyIsIm9uTG9hZCIsIm9wdGlvbnMiLCJvblNob3ciLCJnZXRQZXRzIiwiZ29Gb3JtIiwiZSIsImlkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJhZGRQZXQiLCJhcHAiLCJnZXRBcHAiLCJnZXQiLCJ0aGVuIiwicmVzdWx0Iiwic2V0RGF0YSIsImNvbnRlbnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQWNJQSxRQUFNO0FBQUE7QUFBQTtBQUFBOztBQUNKQyxVQUFNO0FBREYsRztBQUdOQyxVQUFRLGdCQUFVQyxPQUFWLEVBQW1CO0FBQ3pCO0FBQ0QsRzs7QUFFREMsVUFBUSxrQkFBWTtBQUNsQixTQUFLQyxPQUFMO0FBQ0QsRzs7QUFFREMsUSxrQkFBT0MsQyxFQUFHO0FBQ1IsUUFBTUMsS0FBS0QsRUFBRUUsYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JGLEVBQW5DO0FBQ0FHLE9BQUdDLFVBQUgsQ0FBYztBQUNaQyxXQUFLLHdCQUF3Qkw7QUFEakIsS0FBZDtBQUdELEc7QUFFRE0sUSxvQkFBUztBQUNQSCxPQUFHQyxVQUFILENBQWM7QUFDWkMsV0FBSztBQURPLEtBQWQ7QUFHRCxHOzs7QUFFRFIsV0FBUyxtQkFBWTtBQUFBOztBQUNuQixRQUFJVSxNQUFNQyxRQUFWO0FBQ0FELFFBQUlFLEdBQUosQ0FBUSxnQkFBUixFQUEwQkMsSUFBMUIsQ0FBK0IsZ0JBQVE7QUFDckMsVUFBSUMsU0FBU25CLEtBQUtBLElBQWxCO0FBQ0EsWUFBS29CLE9BQUwsQ0FBYTtBQUNYbkIsY0FBTWtCLE9BQU9FO0FBREYsT0FBYjtBQUdELEtBTEQ7QUFNRCIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5oiR55qE5a6g54mpJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJyxcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaycsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1kaWFsb2cnOiAnQG1pbnVpL3d4Yy1kaWFsb2cnLFxuICAgICAgICAnd3hjLWFibm9yJzogJ0BtaW51aS93eGMtYWJub3InLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgICAgJ3d4Yy1mbGV4JzogJ0BtaW51aS93eGMtZmxleCcsXG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBwZXRzOiBbXSxcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKG9wdGlvbnMpXG4gICAgfSxcblxuICAgIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5nZXRQZXRzKClcbiAgICB9LFxuXG4gICAgZ29Gb3JtKGUpIHtcbiAgICAgIGNvbnN0IGlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6ICcvcGFnZXMvcGV0L2Zvcm0/aWQ9JyArIGlkXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBhZGRQZXQoKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiAnL3BhZ2VzL3BldC9mb3JtJ1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZ2V0UGV0czogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBhcHAuZ2V0KCdwZXQvZmluZE15UGV0cycpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBkYXRhLmRhdGFcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBwZXRzOiByZXN1bHQuY29udGVudFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICB9Il19