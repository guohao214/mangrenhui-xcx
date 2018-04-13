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
    showShopListPop: 'hide',
    currentShop: {},
    beauticianList: [],
    currentBeautician: {},
    projectList: [],
    currentProject: {},
    appointmentDayList: [],
    currentAppointmentDay: '',
    appointmentTimeList: [],
    currentAppointmentTimes: [] // 预约的时间
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
  chooseProject: function chooseProject(event) {
    var index = event.currentTarget.dataset.index;
    var currentProject = this.data.projectList[index];
    this.setData({
      currentProject: currentProject
    });

    var timeList = this.data.appointmentTimeList;
    timeList.forEach(function (item) {
      return item.checked = false;
    });
    this.setData({
      currentAppointmentTimes: [],
      appointmentTimeList: timeList
    });
  },
  chooseBeautician: function chooseBeautician(event) {
    var index = event.currentTarget.dataset.index;
    var currentBeautician = this.data.beauticianList[index];
    this.setData({
      currentBeautician: currentBeautician
    });

    var beauticianId = currentBeautician.beautician_id;
    var day = this.data.currentAppointmentDay.day;
    this.getAppointmentTimes(beauticianId, day);
  },
  chooseDay: function chooseDay(event) {
    var index = event.currentTarget.dataset.index;
    var currentAppointmentDay = this.data.appointmentDayList[index];
    this.setData({
      currentAppointmentDay: currentAppointmentDay
    });

    var beauticianId = this.data.currentBeautician.beautician_id;
    var day = currentAppointmentDay.day;
    this.getAppointmentTimes(beauticianId, day);
  },
  _toast: function _toast(text) {
    var _this = this;

    this.setData({
      showToast: true,
      toastText: text
    });

    setTimeout(function () {
      _this.setData({
        showToast: false
      });
    }, 2000);
  },

  chooseTime: function chooseTime(event) {
    var everyTime = 30;
    var index = event.currentTarget.dataset.index;
    var time = this.data.appointmentTimeList[index];
    if (!time.valid) return false;

    var timeList = this.data.appointmentTimeList;
    timeList.forEach(function (item) {
      return item.checked = false;
    });

    var projectUseTime = this.data.currentProject.use_time;
    var useTimeNum = Math.ceil(projectUseTime / everyTime);
    var timeListLength = this.data.appointmentTimeList.length;
    if (index + useTimeNum > timeListLength) {
      this.setData({
        currentAppointmentTimes: [],
        appointmentTimeList: timeList
      });

      this._toast('预约时间不足');

      return;
    }
    var start = 0;
    var useTime = [];
    while (start < useTimeNum) {
      var item = timeList[index + start++];
      if (!item.valid) {
        timeList.forEach(function (item) {
          return item.checked = false;
        });
        useTime = [];
        this.setData({
          currentAppointmentTimes: useTime,
          appointmentTimeList: timeList
        });
        this._toast('预约时间不足');
        break;
      }
      item.checked = true;
      useTime.push(item.time);
    }

    this.setData({
      currentAppointmentTimes: useTime,
      appointmentTimeList: timeList
    });
  },
  getBeauticianAndProject: function getBeauticianAndProject(shopId) {
    var app = getApp();
    var self = this;
    app.get('appointment/getBeauticianAndProject/' + shopId).then(function (data) {
      var content = data.data && data.data.content || {};

      content.days = content.days.map(function (item) {
        var day = item.split('#');
        return {
          date: day[0],
          week: day[1],
          day: day[2]
        };
      });

      var currentProject = content.projects[0] || {};
      var currentBeautician = content.beauticians[0] || {};
      var currentAppointmentDay = content.days[0] || {};

      self.setData({
        beauticianList: content.beauticians,
        projectList: content.projects,
        appointmentDayList: content.days,
        currentProject: currentProject,
        currentBeautician: currentBeautician,
        currentAppointmentDay: currentAppointmentDay
      });

      self.getAppointmentTimes(currentBeautician.beautician_id, currentAppointmentDay.day);
    });
  },
  getAppointmentTimes: function getAppointmentTimes(beauticianId, day) {
    var app = getApp();
    var self = this;
    this.setData({
      currentAppointmentTimes: []
    });

    app.get('appointment/getAppointmentTime/' + beauticianId + '/' + day).then(function (data) {
      var content = data.data && data.data.content || [];
      // for (var i in [0, 0, 0, 0])
      //   content.push({})

      self.setData({
        appointmentTimeList: content
      });
    });
  },
  appointment: function appointment() {
    var _this2 = this;

    var app = getApp();
    // 预约
    var data = {
      shop_id: this.data.currentShop.shop_id,
      beautician_id: this.data.currentBeautician.beautician_id,
      project_id: this.data.currentProject.project_id,
      appointment_day: this.data.currentAppointmentDay.day,
      appointment_time: this.data.currentAppointmentTimes.join(','),
      from: 'xcx'
    };
    app.post('cart/appointment', data).then(function () {
      return _this2._toast('预约成功!');
    }).catch(function (error) {
      _this2._toast(error.detail || '预约失败!');
    });
  },
  onShow: function onShow() {
    var app = getApp();
    var self = this;
    wx.getLocation({
      success: function success(data) {
        app.get('shop/getList', { latitude: data.latitude, longitude: data.longitude }).then(function (data) {
          var result = data.data;
          var currentShop = result.content[0] || {};
          self.setData({
            shopList: result.content,
            currentShop: result.content[0] || []
          });

          if (currentShop) self.getBeauticianAndProject(currentShop.shop_id);
        });
      }
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwidG9hc3RUZXh0Iiwic2hvd1RvYXN0Iiwic2hvcExpc3QiLCJzaG93U2hvcExpc3RQb3AiLCJjdXJyZW50U2hvcCIsImJlYXV0aWNpYW5MaXN0IiwiY3VycmVudEJlYXV0aWNpYW4iLCJwcm9qZWN0TGlzdCIsImN1cnJlbnRQcm9qZWN0IiwiYXBwb2ludG1lbnREYXlMaXN0IiwiY3VycmVudEFwcG9pbnRtZW50RGF5IiwiYXBwb2ludG1lbnRUaW1lTGlzdCIsImN1cnJlbnRBcHBvaW50bWVudFRpbWVzIiwic2hvd1Nob3BMaXN0Iiwic2V0RGF0YSIsImNob29zZVNob3AiLCJldmVudCIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJnZXRCZWF1dGljaWFuQW5kUHJvamVjdCIsInNob3BfaWQiLCJjaG9vc2VQcm9qZWN0IiwidGltZUxpc3QiLCJmb3JFYWNoIiwiaXRlbSIsImNoZWNrZWQiLCJjaG9vc2VCZWF1dGljaWFuIiwiYmVhdXRpY2lhbklkIiwiYmVhdXRpY2lhbl9pZCIsImRheSIsImdldEFwcG9pbnRtZW50VGltZXMiLCJjaG9vc2VEYXkiLCJfdG9hc3QiLCJ0ZXh0Iiwic2V0VGltZW91dCIsImNob29zZVRpbWUiLCJldmVyeVRpbWUiLCJ0aW1lIiwidmFsaWQiLCJwcm9qZWN0VXNlVGltZSIsInVzZV90aW1lIiwidXNlVGltZU51bSIsIk1hdGgiLCJjZWlsIiwidGltZUxpc3RMZW5ndGgiLCJsZW5ndGgiLCJzdGFydCIsInVzZVRpbWUiLCJwdXNoIiwic2hvcElkIiwiYXBwIiwiZ2V0QXBwIiwic2VsZiIsImdldCIsInRoZW4iLCJjb250ZW50IiwiZGF5cyIsIm1hcCIsInNwbGl0IiwiZGF0ZSIsIndlZWsiLCJwcm9qZWN0cyIsImJlYXV0aWNpYW5zIiwiYXBwb2ludG1lbnQiLCJwcm9qZWN0X2lkIiwiYXBwb2ludG1lbnRfZGF5IiwiYXBwb2ludG1lbnRfdGltZSIsImpvaW4iLCJmcm9tIiwicG9zdCIsImNhdGNoIiwiZXJyb3IiLCJkZXRhaWwiLCJvblNob3ciLCJ3eCIsImdldExvY2F0aW9uIiwic3VjY2VzcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwicmVzdWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFhSUEsUUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFDSkMsZUFBVyxFQURQO0FBRUpDLGVBQVcsS0FGUDtBQUdKQyxjQUFVLEVBSE47QUFJSkMscUJBQWlCLE1BSmI7QUFLSkMsaUJBQWEsRUFMVDtBQU1KQyxvQkFBZ0IsRUFOWjtBQU9KQyx1QkFBbUIsRUFQZjtBQVFKQyxpQkFBYSxFQVJUO0FBU0pDLG9CQUFnQixFQVRaO0FBVUpDLHdCQUFvQixFQVZoQjtBQVdKQywyQkFBdUIsRUFYbkI7QUFZSkMseUJBQXFCLEVBWmpCO0FBYUpDLDZCQUF5QixFQWJyQixDQWF5QjtBQWJ6QixHO0FBZU5DLGdCQUFjLHdCQUFZO0FBQ3hCLFNBQUtDLE9BQUwsQ0FBYTtBQUNYWCx1QkFBaUI7QUFETixLQUFiO0FBR0QsRztBQUNEWSxjQUFZLG9CQUFVQyxLQUFWLEVBQWlCO0FBQzNCLFFBQUlDLFFBQVFELE1BQU1FLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCRixLQUF4QztBQUNBLFFBQUliLGNBQWMsS0FBS0wsSUFBTCxDQUFVRyxRQUFWLENBQW1CZSxLQUFuQixDQUFsQjtBQUNBLFNBQUtILE9BQUwsQ0FBYTtBQUNYVixtQkFBYUEsV0FERjtBQUVYRCx1QkFBaUI7QUFGTixLQUFiOztBQUtBLFNBQUtpQix1QkFBTCxDQUE2QmhCLFlBQVlpQixPQUF6QztBQUNELEc7QUFDREMsaUJBQWUsdUJBQVVOLEtBQVYsRUFBaUI7QUFDOUIsUUFBSUMsUUFBUUQsTUFBTUUsYUFBTixDQUFvQkMsT0FBcEIsQ0FBNEJGLEtBQXhDO0FBQ0EsUUFBSVQsaUJBQWlCLEtBQUtULElBQUwsQ0FBVVEsV0FBVixDQUFzQlUsS0FBdEIsQ0FBckI7QUFDQSxTQUFLSCxPQUFMLENBQWE7QUFDWE4sc0JBQWdCQTtB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QWdDb0IsR0FKeEM7QUFLVHFDLHdCQUFrQixLQUFLcEUsSUFBTCxDQUFVYSx1QkFBVixDQUFrQ3dELElBQWxDLENBQXVDLEdBQXZDLENBTFQ7QUFNVEMsWUFBTTtBQU5HLEtBQVg7QUFRQWxCLFFBQUltQixJQUFKLENBQVMsa0JBQVQsRUFBNkJ2RSxJQUE3QixFQUNHd0QsSUFESCxDQUNRO0FBQUEsYUFBTyxPQUFLdEIsTUFBTCxDQUFZLE9BQVosQ0FBUDtBQUFBLEtBRFIsRUFFR3NDLEtBRkgsQ0FFUyxpQkFBUztBQUNkLGFBQUt0QyxNQUFMLENBQVl1QyxNQUFNQyxNQUFOLElBQWdCLE9BQTVCO0FBQ0QsS0FKSDtBQUtELEc7QUFDREMsVUFBUSxrQkFBWTtBQUNsQixRQUFJdkIsTUFBTUMsUUFBVjtBQUNBLFFBQUlDLE9BQU8sSUFBWDtBQUNBc0IsT0FBR0MsV0FBSCxDQUFlO0FBQ2JDLGVBQVMsaUJBQVU5RSxJQUFWLEVBQWdCO0FBQ3ZCb0QsWUFBSUcsR0FBSixDQUFRLGNBQVIsRUFBd0IsRUFBQ3dCLFVBQVUvRSxLQUFLK0UsUUFBaEIsRUFBMEJDLFdBQVdoRixLQUFLZ0YsU0FBMUMsRUFBeEIsRUFBOEV4QixJQUE5RSxDQUFtRixnQkFBUTtBQUN6RixjQUFJeUIsU0FBU2pGLEtBQUtBLElBQWxCO0FBQ0EsY0FBSUssY0FBYzRFLE9BQU94QixPQUFQLENBQWUsQ0FBZixLQUFxQixFQUF2QztBQUNBSCxlQUFLdkMsT0FBTCxDQUFhO0FBQ1haLHNCQUFVOEUsT0FBT3hCLE9BRE47QUFFWHBELHlCQUFhNEUsT0FBT3hCLE9BQVAsQ0FBZSxDQUFmLEtBQXFCO0FBRnZCLFdBQWI7O0FBS0EsY0FBSXBELFdBQUosRUFDRWlELEtBQUtqQyx1QkFBTCxDQUE2QmhCLFlBQVlpQixPQUF6QztBQUNILFNBVkQ7QUFXRDtBQWJZLEtBQWY7QUFlRCIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6aKE57qmJyxcbiAgICAgIHVzaW5nQ29tcG9uZW50czoge1xuICAgICAgICAnd3hjLWZsZXgnOiAnQG1pbnVpL3d4Yy1mbGV4JyxcbiAgICAgICAgJ3d4Yy1pY29uJzogJ0BtaW51aS93eGMtaWNvbicsXG4gICAgICAgICd3eGMtYXZhdGFyJzogJ0BtaW51aS93eGMtYXZhdGFyJyxcbiAgICAgICAgJ3d4Yy1tYXNrJzogJ0BtaW51aS93eGMtbWFzaycsXG4gICAgICAgICd3eGMtcG9wdXAnOiAnQG1pbnVpL3d4Yy1wb3B1cCcsXG4gICAgICAgICd3eGMtZWxpcCc6ICdAbWludWkvd3hjLWVsaXAnLFxuICAgICAgICAnd3hjLXRvYXN0JzogJ0BtaW51aS93eGMtdG9hc3QnXG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICB0b2FzdFRleHQ6ICcnLFxuICAgICAgc2hvd1RvYXN0OiBmYWxzZSxcbiAgICAgIHNob3BMaXN0OiBbXSxcbiAgICAgIHNob3dTaG9wTGlzdFBvcDogJ2hpZGUnLFxuICAgICAgY3VycmVudFNob3A6IHt9LFxuICAgICAgYmVhdXRpY2lhbkxpc3Q6IFtdLFxuICAgICAgY3VycmVudEJlYXV0aWNpYW46IHt9LFxuICAgICAgcHJvamVjdExpc3Q6IFtdLFxuICAgICAgY3VycmVudFByb2plY3Q6IHt9LFxuICAgICAgYXBwb2ludG1lbnREYXlMaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheTogJycsXG4gICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSwgLy8g6aKE57qm55qE5pe26Ze0XG4gICAgfSxcbiAgICBzaG93U2hvcExpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHNob3dTaG9wTGlzdFBvcDogJ3Nob3cnXG4gICAgICB9KVxuICAgIH0sXG4gICAgY2hvb3NlU2hvcDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50U2hvcCA9IHRoaXMuZGF0YS5zaG9wTGlzdFtpbmRleF1cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRTaG9wOiBjdXJyZW50U2hvcCxcbiAgICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnaGlkZSdcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZ2V0QmVhdXRpY2lhbkFuZFByb2plY3QoY3VycmVudFNob3Auc2hvcF9pZClcbiAgICB9LFxuICAgIGNob29zZVByb2plY3Q6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFByb2plY3QgPSB0aGlzLmRhdGEucHJvamVjdExpc3RbaW5kZXhdXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50UHJvamVjdDogY3VycmVudFByb2plY3QsXG4gICAgICB9KVxuXG4gICAgICBsZXQgdGltZUxpc3QgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFxuICAgICAgdGltZUxpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2hlY2tlZCA9IGZhbHNlKVxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdLFxuICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdFxuICAgICAgfSlcbiAgICB9LFxuICAgIGNob29zZUJlYXV0aWNpYW46IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudEJlYXV0aWNpYW4gPSB0aGlzLmRhdGEuYmVhdXRpY2lhbkxpc3RbaW5kZXhdXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QmVhdXRpY2lhbjogY3VycmVudEJlYXV0aWNpYW4sXG4gICAgICB9KVxuXG4gICAgICBsZXQgYmVhdXRpY2lhbklkID0gY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZFxuICAgICAgbGV0IGRheSA9IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5XG4gICAgICB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoYmVhdXRpY2lhbklkLCBkYXkpXG4gICAgfSxcbiAgICBjaG9vc2VEYXk6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudEFwcG9pbnRtZW50RGF5ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50RGF5TGlzdFtpbmRleF1cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheTogY3VycmVudEFwcG9pbnRtZW50RGF5LFxuICAgICAgfSlcblxuICAgICAgbGV0IGJlYXV0aWNpYW5JZCA9IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkXG4gICAgICBsZXQgZGF5ID0gY3VycmVudEFwcG9pbnRtZW50RGF5LmRheVxuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGJlYXV0aWNpYW5JZCwgZGF5KVxuICAgIH0sXG4gICAgX3RvYXN0KHRleHQpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHNob3dUb2FzdDogdHJ1ZSxcbiAgICAgICAgdG9hc3RUZXh0OiB0ZXh0XG4gICAgICB9KVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBzaG93VG9hc3Q6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICB9LCAyMDAwKVxuICAgIH0sXG4gICAgY2hvb3NlVGltZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgZXZlcnlUaW1lID0gMzBcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IHRpbWUgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFtpbmRleF1cbiAgICAgIGlmICghdGltZS52YWxpZClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGxldCB0aW1lTGlzdCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0XG4gICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG5cbiAgICAgIGxldCBwcm9qZWN0VXNlVGltZSA9IHRoaXMuZGF0YS5jdXJyZW50UHJvamVjdC51c2VfdGltZVxuICAgICAgbGV0IHVzZVRpbWVOdW0gPSBNYXRoLmNlaWwocHJvamVjdFVzZVRpbWUgLyBldmVyeVRpbWUpXG4gICAgICBsZXQgdGltZUxpc3RMZW5ndGggPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdC5sZW5ndGhcbiAgICAgIGlmIChpbmRleCArIHVzZVRpbWVOdW0gPiB0aW1lTGlzdExlbmd0aCkge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSxcbiAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdCxcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5pe26Ze05LiN6LazJylcblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGxldCBzdGFydCA9IDBcbiAgICAgIGxldCB1c2VUaW1lID0gW11cbiAgICAgIHdoaWxlIChzdGFydCA8IHVzZVRpbWVOdW0pIHtcbiAgICAgICAgbGV0IGl0ZW0gPSB0aW1lTGlzdFtpbmRleCArIHN0YXJ0KytdXG4gICAgICAgIGlmKCFpdGVtLnZhbGlkKSB7XG4gICAgICAgICAgdGltZUxpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2hlY2tlZCA9IGZhbHNlKVxuICAgICAgICAgIHVzZVRpbWUgPSBbXVxuICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogdXNlVGltZSxcbiAgICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0LFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fdG9hc3QoJ+mihOe6puaXtumXtOS4jei2sycpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbS5jaGVja2VkID0gdHJ1ZVxuICAgICAgICB1c2VUaW1lLnB1c2goaXRlbS50aW1lKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogdXNlVGltZSxcbiAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3RcbiAgICAgIH0pXG5cbiAgICB9LFxuICAgIGdldEJlYXV0aWNpYW5BbmRQcm9qZWN0OiBmdW5jdGlvbiAoc2hvcElkKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgYXBwLmdldChgYXBwb2ludG1lbnQvZ2V0QmVhdXRpY2lhbkFuZFByb2plY3QvJHtzaG9wSWR9YCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IGNvbnRlbnQgPSAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5jb250ZW50KSB8fCB7fVxuXG4gICAgICAgIGNvbnRlbnQuZGF5cyA9IGNvbnRlbnQuZGF5cy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgbGV0IGRheSA9IGl0ZW0uc3BsaXQoJyMnKVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRlOiBkYXlbMF0sXG4gICAgICAgICAgICB3ZWVrOiBkYXlbMV0sXG4gICAgICAgICAgICBkYXk6IGRheVsyXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY3VycmVudFByb2plY3QgPSBjb250ZW50LnByb2plY3RzWzBdIHx8IHt9XG4gICAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IGNvbnRlbnQuYmVhdXRpY2lhbnNbMF0gfHwge31cbiAgICAgICAgbGV0IGN1cnJlbnRBcHBvaW50bWVudERheSA9IGNvbnRlbnQuZGF5c1swXSB8fCB7fVxuXG4gICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgYmVhdXRpY2lhbkxpc3Q6IGNvbnRlbnQuYmVhdXRpY2lhbnMsXG4gICAgICAgICAgcHJvamVjdExpc3Q6IGNvbnRlbnQucHJvamVjdHMsXG4gICAgICAgICAgYXBwb2ludG1lbnREYXlMaXN0OiBjb250ZW50LmRheXMsXG4gICAgICAgICAgY3VycmVudFByb2plY3QsXG4gICAgICAgICAgY3VycmVudEJlYXV0aWNpYW4sXG4gICAgICAgICAgY3VycmVudEFwcG9pbnRtZW50RGF5LFxuICAgICAgICB9KVxuXG4gICAgICAgIHNlbGYuZ2V0QXBwb2ludG1lbnRUaW1lcyhjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLCBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgfSlcblxuICAgIH0sXG4gICAgZ2V0QXBwb2ludG1lbnRUaW1lczogZnVuY3Rpb24gKGJlYXV0aWNpYW5JZCwgZGF5KSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdXG4gICAgICB9KVxuXG4gICAgICBhcHAuZ2V0KCdhcHBvaW50bWVudC9nZXRBcHBvaW50bWVudFRpbWUvJyArIGJlYXV0aWNpYW5JZCArICcvJyArIGRheSlcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgY29udGVudCA9IChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmNvbnRlbnQpIHx8IFtdXG4gICAgICAgICAgLy8gZm9yICh2YXIgaSBpbiBbMCwgMCwgMCwgMF0pXG4gICAgICAgICAgLy8gICBjb250ZW50LnB1c2goe30pXG5cbiAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogY29udGVudFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBhcHBvaW50bWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICAvLyDpooTnuqZcbiAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICBzaG9wX2lkOiB0aGlzLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCxcbiAgICAgICAgYmVhdXRpY2lhbl9pZDogdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQsXG4gICAgICAgIHByb2plY3RfaWQ6IHRoaXMuZGF0YS5jdXJyZW50UHJvamVjdC5wcm9qZWN0X2lkLFxuICAgICAgICBhcHBvaW50bWVudF9kYXk6IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5LFxuICAgICAgICBhcHBvaW50bWVudF90aW1lOiB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50VGltZXMuam9pbignLCcpLFxuICAgICAgICBmcm9tOiAneGN4J1xuICAgICAgfVxuICAgICAgYXBwLnBvc3QoJ2NhcnQvYXBwb2ludG1lbnQnLCBkYXRhKVxuICAgICAgICAudGhlbigoKSA9PiAgdGhpcy5fdG9hc3QoJ+mihOe6puaIkOWKnyEnKSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICB0aGlzLl90b2FzdChlcnJvci5kZXRhaWwgfHwgJ+mihOe6puWksei0pSEnKVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgd3guZ2V0TG9jYXRpb24oe1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGFwcC5nZXQoJ3Nob3AvZ2V0TGlzdCcsIHtsYXRpdHVkZTogZGF0YS5sYXRpdHVkZSwgbG9uZ2l0dWRlOiBkYXRhLmxvbmdpdHVkZX0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgICAgICBsZXQgY3VycmVudFNob3AgPSByZXN1bHQuY29udGVudFswXSB8fCB7fVxuICAgICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgICAgc2hvcExpc3Q6IHJlc3VsdC5jb250ZW50LFxuICAgICAgICAgICAgICBjdXJyZW50U2hvcDogcmVzdWx0LmNvbnRlbnRbMF0gfHwgW11cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50U2hvcClcbiAgICAgICAgICAgICAgc2VsZi5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9Il19