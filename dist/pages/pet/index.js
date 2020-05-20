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
    // 手机号
    if (getApp().goLogin() !== true) return;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwicGV0cyIsIm9uTG9hZCIsIm9wdGlvbnMiLCJvblNob3ciLCJnZXRBcHAiLCJnb0xvZ2luIiwiZ2V0UGV0cyIsImdvRm9ybSIsImUiLCJpZCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0Iiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiYWRkUGV0IiwiYXBwIiwiZ2V0IiwidGhlbiIsInJlc3VsdCIsInNldERhdGEiLCJjb250ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFjSUEsUUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFDSkMsVUFBTTtBQURGLEc7QUFHTkMsVUFBUSxnQkFBVUMsT0FBVixFQUFtQjtBQUN6QjtBQUNELEc7O0FBRURDLFVBQVEsa0JBQVk7QUFDbEI7QUFDQSxRQUFJQyxTQUFTQyxPQUFULE9BQXVCLElBQTNCLEVBQ0U7O0FBRUYsU0FBS0MsT0FBTDtBQUNELEc7O0FBRURDLFEsa0JBQU9DLEMsRUFBRztBQUNSLFFBQU1DLEtBQUtELEVBQUVFLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCRixFQUFuQztBQUNBRyxPQUFHQyxVQUFILENBQWM7QUFDWkMsV0FBSyx3QkFBd0JMO0FBRGpCLEtBQWQ7QUFHRCxHO0FBRURNLFEsb0JBQVM7QUFDUEgsT0FBR0MsVUFBSCxDQUFjO0FBQ1pDLFdBQUs7QUFETyxLQUFkO0FBR0QsRzs7O0FBRURSLFdBQVMsbUJBQVk7QUFBQTs7QUFDbkIsUUFBSVUsTUFBTVosUUFBVjtBQUNBWSxRQUFJQyxHQUFKLENBQVEsZ0JBQVIsRUFBMEJDLElBQTFCLENBQStCLGdCQUFRO0FBQ3JDLFVBQUlDLFNBQVNwQixLQUFLQSxJQUFsQjtBQUNBLFlBQUtxQixPQUFMLENBQWE7QUFDWHBCLGNBQU1tQixPQUFPRTtBQURGLE9BQWI7QUFHRCxLQUxEO0FBTUQiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+aIkeeahOeMq+WSqicsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI0U4RThFOCcsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICd3eGMtZGlhbG9nJzogJ0BtaW51aS93eGMtZGlhbG9nJyxcbiAgICAgICAgJ3d4Yy1hYm5vcic6ICdAbWludWkvd3hjLWFibm9yJyxcbiAgICAgICAgJ3d4Yy1lbGlwJzogJ0BtaW51aS93eGMtZWxpcCcsXG4gICAgICAgICd3eGMtZmxleCc6ICdAbWludWkvd3hjLWZsZXgnLFxuICAgICAgICAnd3hjLWljb24nOiAnQG1pbnVpL3d4Yy1pY29uJyxcbiAgICAgICAgJ3d4Yy1hdmF0YXInOiAnQG1pbnVpL3d4Yy1hdmF0YXInLFxuICAgICAgfVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgcGV0czogW10sXG4gICAgfSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhvcHRpb25zKVxuICAgIH0sXG5cbiAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIOaJi+acuuWPt1xuICAgICAgaWYgKGdldEFwcCgpLmdvTG9naW4oKSAhPT0gdHJ1ZSlcbiAgICAgICAgcmV0dXJuXG4gICAgICBcbiAgICAgIHRoaXMuZ2V0UGV0cygpXG4gICAgfSxcblxuICAgIGdvRm9ybShlKSB7XG4gICAgICBjb25zdCBpZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiAnL3BhZ2VzL3BldC9mb3JtP2lkPScgKyBpZFxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgYWRkUGV0KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogJy9wYWdlcy9wZXQvZm9ybSdcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGdldFBldHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgYXBwLmdldCgncGV0L2ZpbmRNeVBldHMnKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgcGV0czogcmVzdWx0LmNvbnRlbnRcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcbiAgfSJdfQ==