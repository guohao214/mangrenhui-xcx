'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    currentBeautician: {},
    projectList: [],
    currentProject: {},
    chooseProjects: [], // 已经选择的项目
    appointmentDayList: [],
    currentAppointmentDay: '',
    appointmentTimeList: [],
    currentAppointmentTimes: [] // 预约的时间
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

  // 选择项目
  chooseProject: function chooseProject(event) {
    var _setData,
        _this = this;

    var index = event.currentTarget.dataset.index;
    var currentProject = this.data.projectList[index];

    // 判断是否已经选择了项目
    var chooseProjects = this.data.chooseProjects;
    var findIndex = chooseProjects.findIndex(function (item) {
      return item === currentProject;
    });

    console.log(findIndex);

    if (findIndex >= 0) {
      currentProject.active = false;
      chooseProjects.splice(findIndex, 1);
    } else {
      currentProject.active = true;
      chooseProjects.push(currentProject);
    }

    // const projectList = this.data.projectList
    // projectList[index] = currentProject

    this.setData((_setData = {
      currentProject: currentProject
    }, _defineProperty(_setData, 'projectList[' + index + ']', currentProject), _defineProperty(_setData, 'chooseProjects', chooseProjects), _setData), function () {
      return console.log(_this.data.chooseProjects);
    });

    // 预约时间
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
    if (currentBeautician.beautician_id === this.data.currentBeautician.beautician_id) return;

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

    if (currentAppointmentDay.day === this.data.currentAppointmentDay.day) return;

    this.setData({
      currentAppointmentDay: currentAppointmentDay
    });

    var beauticianId = this.data.currentBeautician.beautician_id;
    var day = currentAppointmentDay.day;
    this.getAppointmentTimes(beauticianId, day);
  },

  _toast: function _toast(text) {
    wx.showToast({
      title: text,
      duration: 2000,
      icon: 'none'
    });
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

    var chooseProjects = this.data.chooseProjects;
    if (!chooseProjects.length) return this._toast('请选择预约项目');

    var projectUseTime = chooseProjects.reduce(function (init, item) {
      return item.use_time / 1 + init;
    }, 0);

    var useTimeNum = Math.ceil(projectUseTime / everyTime);
    var timeListLength = this.data.appointmentTimeList.length;
    if (index + useTimeNum > timeListLength) {
      this.setData({
        currentAppointmentTimes: [],
        appointmentTimeList: timeList
      });

      this._toast('预约时间不足,请重新选择.');

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

      content.projects = content.projects || [];
      content.projects.forEach(function (item) {
        return item.active = false;
      });

      // 默认选择的项目
      var currentProject = content.projects[0] || {};
      currentProject.active = true;

      var currentBeautician = content.beauticians[0] || {};
      var currentAppointmentDay = content.days[0] || {};

      self.setData({
        beauticianList: content.beauticians,
        projectList: content.projects,
        appointmentDayList: content.days,
        currentProject: currentProject,
        chooseProjects: [currentProject],
        currentBeautician: currentBeautician,
        currentAppointmentDay: currentAppointmentDay
      });

      self.getAppointmentTimes(currentBeautician.beautician_id, currentAppointmentDay.day);
    }).catch(function (e) {
      console.log(e);
    });
  },

  getAppointmentTimes: function getAppointmentTimes(beauticianId, day) {
    var app = getApp();
    var self = this;
    this.setData({
      currentAppointmentTimes: []
    });

    return app.get('appointment/getAppointmentTime/' + beauticianId + '/' + day).then(function (data) {
      var content = data.data && data.data.content || [];
      // for (var i in [0, 0, 0, 0])
      //   content.push({})

      self.setData({
        appointmentTimeList: content
      });
    });
  },

  // 发送预约
  appointment: function appointment(event) {
    var _this2 = this;

    var app = getApp();
    var formId = event.detail.formId;
    var chooseProjects = this.data.chooseProjects;
    if (!chooseProjects.length) return this._toast('请选择预约项目');

    // 预约项目
    var projectIds = chooseProjects.map(function (item) {
      return item.project_id;
    });
    projectIds = projectIds.join(',');

    // 预约
    var data = {
      shop_id: this.data.currentShop.shop_id,
      beautician_id: this.data.currentBeautician.beautician_id,
      project_id: projectIds,
      appointment_day: this.data.currentAppointmentDay.day,
      appointment_time: this.data.currentAppointmentTimes.join(','),
      from: 'xcx',
      formId: formId
    };
    app.post('cart/appointment', data).then(function () {
      _this2._toast('预约成功!');

      setTimeout(function (x) {
        wx.switchTab({
          url: '/pages/pay/index'
        });

        // this.getAppointmentTimes(data.beautician_id, data.appointment_day)
      }, 1000);

      // 通知
      // app.askNotice()
    }).catch(function (error) {
      _this2._toast(error.detail || '预约失败!');
    });
  },

  init: function init() {
    var app = getApp();
    var self = this;

    wx.getLocation({
      success: function success(data) {
        app.get('shop/getList', { latitude: data.latitude, longitude: data.longitude }).then(function (data) {
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

  onLoad: function onLoad() {
    this.init();
  },

  onTabItemTap: function onTabItemTap() {
    this.init();
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwidG9hc3RUZXh0Iiwic2hvd1RvYXN0Iiwic2hvcExpc3QiLCJjcFNob3BMaXN0Iiwic2hvd1Nob3BMaXN0UG9wIiwiY3VycmVudFNob3AiLCJiZWF1dGljaWFuTGlzdCIsImN1cnJlbnRCZWF1dGljaWFuIiwicHJvamVjdExpc3QiLCJjdXJyZW50UHJvamVjdCIsImNob29zZVByb2plY3RzIiwiYXBwb2ludG1lbnREYXlMaXN0IiwiY3VycmVudEFwcG9pbnRtZW50RGF5IiwiYXBwb2ludG1lbnRUaW1lTGlzdCIsImN1cnJlbnRBcHBvaW50bWVudFRpbWVzIiwiaGFuZGxlclNlYXJjaCIsImV2ZW50IiwidmFsdWUiLCJkZXRhaWwiLCJmaWx0ZXIiLCJpdGVtIiwic2hvcF9uYW1lIiwibWF0Y2giLCJSZWdFeHAiLCJzZXREYXRhIiwic2hvd1Nob3BMaXN0IiwiY2hvb3NlU2hvcCIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJnZXRCZWF1dGljaWFuQW5kUHJvamVjdCIsInNob3BfaWQiLCJjaG9vc2VQcm9qZWN0IiwiZmluZEluZGV4IiwiY29uc29sZSIsImxvZyIsImFjdGl2ZSIsInNwbGljZSIsInB1c2giLCJ0aW1lTGlzdCIsImZvckVhY2giLCJjaGVja2VkIiwiY2hvb3NlQmVhdXRpY2lhbiIsImJlYXV0aWNpYW5faWQiLCJiZWF1dGljaWFuSWQiLCJkYXkiLCJnZXRBcHBvaW50bWVudFRpbWVzIiwiY2hvb3NlRGF5IiwiX3RvYXN0IiwidGV4dCIsInd4IiwidGl0bGUiLCJkdXJhdGlvbiIsImljb24iLCJjaG9vc2VUaW1lIiwiZXZlcnlUaW1lIiwidGltZSIsInZhbGlkIiwibGVuZ3RoIiwicHJvamVjdFVzZVRpbWUiLCJyZWR1Y2UiLCJpbml0IiwidXNlX3RpbWUiLCJ1c2VUaW1lTnVtIiwiTWF0aCIsImNlaWwiLCJ0aW1lTGlzdExlbmd0aCIsInN0YXJ0IiwidXNlVGltZSIsInNob3BJZCIsImFwcCIsImdldEFwcCIsInNlbGYiLCJnZXQiLCJ0aGVuIiwiY29udGVudCIsImRheXMiLCJtYXAiLCJzcGxpdCIsImRhdGUiLCJ3ZWVrIiwicHJvamVjdHMiLCJiZWF1dGljaWFucyIsImNhdGNoIiwiZSIsImFwcG9pbnRtZW50IiwiZm9ybUlkIiwicHJvamVjdElkcyIsInByb2plY3RfaWQiLCJqb2luIiwiYXBwb2ludG1lbnRfZGF5IiwiYXBwb2ludG1lbnRfdGltZSIsImZyb20iLCJwb3N0Iiwic2V0VGltZW91dCIsInN3aXRjaFRhYiIsInVybCIsImVycm9yIiwiZ2V0TG9jYXRpb24iLCJzdWNjZXNzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJyZXN1bHQiLCJmYWlsIiwib3BlblNldHRpbmciLCJyZXMiLCJvbkxvYWQiLCJvblRhYkl0ZW1UYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQWNJQSxRQUFNO0FBQUE7QUFBQTtBQUFBOztBQUNKQyxlQUFXLEVBRFA7QUFFSkMsZUFBVyxLQUZQO0FBR0pDLGNBQVUsRUFITjtBQUlKQyxnQkFBWSxFQUpSO0FBS0pDLHFCQUFpQixNQUxiO0FBTUpDLGlCQUFhLEVBTlQ7QUFPSkMsb0JBQWdCLEVBUFo7QUFRSkMsdUJBQW1CLEVBUmY7QUFTSkMsaUJBQWEsRUFUVDtBQVVKQyxvQkFBZ0IsRUFWWjtBQVdKQyxvQkFBZ0IsRUFYWixFQVdnQjtBQUNwQkMsd0JBQW9CLEVBWmhCO0FBYUpDLDJCQUF1QixFQWJuQjtBQWNKQyx5QkFBcUIsRUFkakI7QUFlSkMsNkJBQXlCLEVBZnJCLENBZXlCO0FBZnpCLEc7QUFpQk5DLGlCQUFlLHVCQUFVQyxLQUFWLEVBQWlCO0FBQzlCLFFBQUlDLFFBQVFELE1BQU1FLE1BQU4sQ0FBYUQsS0FBekI7QUFDQSxRQUFJZixXQUFXLEtBQUtILElBQUwsQ0FBVUcsUUFBekI7QUFDQSxRQUFJQyxhQUFhRCxTQUFTaUIsTUFBVCxDQUFnQixVQUFVQyxJQUFWLEVBQWdCO0FBQy9DLGFBQU9BLEtBQUtDLFNBQUwsQ0FB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QztBQUNBSCxlQUFLaEQsT0FBTCxDQUFhO0FBQ1h0QixzQkFBVW9HLE9BQU8zQixPQUROO0FBRVh4RSx3QkFBWW1HLE9BQU8zQjtBQUZSLFdBQWI7O0FBS0E7QUFDQSxjQUFHSCxLQUFLekUsSUFBTCxDQUFVTSxXQUFWLENBQXNCMEIsT0FBekIsRUFBa0M7QUFDaEMxQiwwQkFBY21FLEtBQUt6RSxJQUFMLENBQVVNLFdBQXhCO0FBQ0FtRSxpQkFBS2hELE9BQUwsQ0FBYTtBQUNYbkI7QUFEVyxhQUFiO0FBR0QsV0FMRCxNQUtPO0FBQ0xtRSxpQkFBS2hELE9BQUwsQ0FBYTtBQUNYbkI7QUFEVyxhQUFiO0FBR0Q7O0FBRUQsY0FBSUEsV0FBSixFQUNFbUUsS0FBSzFDLHVCQUFMLENBQTZCekIsWUFBWTBCLE9BQXpDO0FBQ0gsU0F0QkQsRUFzQkdvRCxLQXRCSCxDQXNCUztBQUFBLGlCQUFLakQsUUFBUUMsR0FBUixDQUFZaUQsQ0FBWixDQUFMO0FBQUEsU0F0QlQ7QUF1QkQsT0F6Qlk7QUEwQmJtQixZQUFNLGdCQUFZO0FBQ2hCckQsV0FBR3NELFdBQUgsQ0FBZTtBQUNiTCxtQkFBUyxpQkFBVU0sR0FBVixFQUFlLENBQ3ZCLENBRlk7QUFHYkYsZ0JBQU0sZ0JBQVksQ0FDakI7QUFKWSxTQUFmO0FBTUQ7QUFqQ1ksS0FBZjtBQW1DRCxHOztBQUVIRyxVQUFRLGtCQUFZO0FBQ2xCLFNBQUs3QyxJQUFMO0FBQ0QsRzs7QUFFRDhDLGdCQUFjLHdCQUFXO0FBQ3ZCLFNBQUs5QyxJQUFMO0FBQ0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+mihOe6picsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICd3eGMtZmxleCc6ICdAbWludWkvd3hjLWZsZXgnLFxuICAgICAgICAnd3hjLWljb24nOiAnQG1pbnVpL3d4Yy1pY29uJyxcbiAgICAgICAgJ3d4Yy1hdmF0YXInOiAnQG1pbnVpL3d4Yy1hdmF0YXInLFxuICAgICAgICAnd3hjLW1hc2snOiAnQG1pbnVpL3d4Yy1tYXNrJyxcbiAgICAgICAgJ3d4Yy1wb3B1cCc6ICdAbWludWkvd3hjLXBvcHVwJyxcbiAgICAgICAgJ3d4Yy1lbGlwJzogJ0BtaW51aS93eGMtZWxpcCcsXG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICB0b2FzdFRleHQ6ICcnLFxuICAgICAgc2hvd1RvYXN0OiBmYWxzZSxcbiAgICAgIHNob3BMaXN0OiBbXSxcbiAgICAgIGNwU2hvcExpc3Q6IFtdLFxuICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnaGlkZScsXG4gICAgICBjdXJyZW50U2hvcDoge30sXG4gICAgICBiZWF1dGljaWFuTGlzdDogW10sXG4gICAgICBjdXJyZW50QmVhdXRpY2lhbjoge30sXG4gICAgICBwcm9qZWN0TGlzdDogW10sXG4gICAgICBjdXJyZW50UHJvamVjdDoge30sXG4gICAgICBjaG9vc2VQcm9qZWN0czogW10sIC8vIOW3sue7j+mAieaLqeeahOmhueebrlxuICAgICAgYXBwb2ludG1lbnREYXlMaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheTogJycsXG4gICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSwgLy8g6aKE57qm55qE5pe26Ze0XG4gICAgfSxcbiAgICBoYW5kbGVyU2VhcmNoOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCB2YWx1ZSA9IGV2ZW50LmRldGFpbC52YWx1ZVxuICAgICAgbGV0IHNob3BMaXN0ID0gdGhpcy5kYXRhLnNob3BMaXN0XG4gICAgICBsZXQgY3BTaG9wTGlzdCA9IHNob3BMaXN0LmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5zaG9wX25hbWUubWF0Y2gobmV3IFJlZ0V4cCh2YWx1ZSkpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjcFNob3BMaXN0OiBjcFNob3BMaXN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBzaG93U2hvcExpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHNob3dTaG9wTGlzdFBvcDogJ3Nob3cnXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjaG9vc2VTaG9wOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRTaG9wID0gdGhpcy5kYXRhLnNob3BMaXN0W2luZGV4XVxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudFNob3A6IGN1cnJlbnRTaG9wLFxuICAgICAgICBzaG93U2hvcExpc3RQb3A6ICdoaWRlJyxcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZ2V0QmVhdXRpY2lhbkFuZFByb2plY3QoY3VycmVudFNob3Auc2hvcF9pZClcbiAgICB9LFxuXG4gICAgLy8g6YCJ5oup6aG555uuXG4gICAgY2hvb3NlUHJvamVjdDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50UHJvamVjdCA9IHRoaXMuZGF0YS5wcm9qZWN0TGlzdFtpbmRleF1cblxuICAgICAgLy8g5Yik5pat5piv5ZCm5bey57uP6YCJ5oup5LqG6aG555uuXG4gICAgICBjb25zdCBjaG9vc2VQcm9qZWN0cyA9IHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0c1xuICAgICAgY29uc3QgZmluZEluZGV4ID0gY2hvb3NlUHJvamVjdHMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbSA9PT0gY3VycmVudFByb2plY3QpXG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKGZpbmRJbmRleClcblxuICAgICAgaWYgKGZpbmRJbmRleCA+PSAwKSB7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIGNob29zZVByb2plY3RzLnNwbGljZShmaW5kSW5kZXgsIDEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50UHJvamVjdC5hY3RpdmUgPSB0cnVlXG4gICAgICAgIGNob29zZVByb2plY3RzLnB1c2goY3VycmVudFByb2plY3QpXG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnN0IHByb2plY3RMaXN0ID0gdGhpcy5kYXRhLnByb2plY3RMaXN0XG4gICAgICAvLyBwcm9qZWN0TGlzdFtpbmRleF0gPSBjdXJyZW50UHJvamVjdFxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50UHJvamVjdDogY3VycmVudFByb2plY3QsXG4gICAgICAgIFtgcHJvamVjdExpc3RbJHtpbmRleH1dYF06IGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICBjaG9vc2VQcm9qZWN0c1xuICAgICAgfSwgKCkgPT4gY29uc29sZS5sb2codGhpcy5kYXRhLmNob29zZVByb2plY3RzKSlcblxuXG4gICAgICAvLyDpooTnuqbml7bpl7RcbiAgICAgIGxldCB0aW1lTGlzdCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0XG4gICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sXG4gICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjaG9vc2VCZWF1dGljaWFuOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRCZWF1dGljaWFuID0gdGhpcy5kYXRhLmJlYXV0aWNpYW5MaXN0W2luZGV4XVxuICAgICAgaWYgKGN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQgPT09IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkKVxuICAgICAgICByZXR1cm5cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEJlYXV0aWNpYW46IGN1cnJlbnRCZWF1dGljaWFuLFxuICAgICAgfSlcblxuICAgICAgbGV0IGJlYXV0aWNpYW5JZCA9IGN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWRcbiAgICAgIGxldCBkYXkgPSB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheVxuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGJlYXV0aWNpYW5JZCwgZGF5KVxuICAgIH0sXG5cblxuICAgIGNob29zZURheTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50QXBwb2ludG1lbnREYXkgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnREYXlMaXN0W2luZGV4XVxuXG4gICAgICBpZiAoY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSA9PT0gdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnREYXk6IGN1cnJlbnRBcHBvaW50bWVudERheSxcbiAgICAgIH0pXG5cbiAgICAgIGxldCBiZWF1dGljaWFuSWQgPSB0aGlzLmRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZFxuICAgICAgbGV0IGRheSA9IGN1cnJlbnRBcHBvaW50bWVudERheS5kYXlcbiAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhiZWF1dGljaWFuSWQsIGRheSlcbiAgICB9LFxuXG4gICAgX3RvYXN0KHRleHQpIHtcbiAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgIHRpdGxlOiB0ZXh0LFxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjaG9vc2VUaW1lOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBldmVyeVRpbWUgPSAzMFxuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgdGltZSA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0W2luZGV4XVxuICAgICAgaWYgKCF0aW1lLnZhbGlkKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgbGV0IHRpbWVMaXN0ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3RcbiAgICAgIHRpbWVMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcblxuICAgICAgY29uc3QgY2hvb3NlUHJvamVjdHMgPSB0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHNcbiAgICAgIGlmICghY2hvb3NlUHJvamVjdHMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9hc3QoJ+ivt+mAieaLqemihOe6pumhueebricpXG5cbiAgICAgIGNvbnN0IHByb2plY3RVc2VUaW1lID0gY2hvb3NlUHJvamVjdHMucmVkdWNlKChpbml0LCBpdGVtKSA9PiBpdGVtLnVzZV90aW1lIC8gMSArIGluaXQsIDApXG5cbiAgICAgIGxldCB1c2VUaW1lTnVtID0gTWF0aC5jZWlsKHByb2plY3RVc2VUaW1lIC8gZXZlcnlUaW1lKVxuICAgICAgbGV0IHRpbWVMaXN0TGVuZ3RoID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3QubGVuZ3RoXG4gICAgICBpZiAoaW5kZXggKyB1c2VUaW1lTnVtID4gdGltZUxpc3RMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sXG4gICAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3QsXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5fdG9hc3QoJ+mihOe6puaXtumXtOS4jei2syzor7fph43mlrDpgInmi6kuJylcblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGxldCBzdGFydCA9IDBcbiAgICAgIGxldCB1c2VUaW1lID0gW11cbiAgICAgIHdoaWxlIChzdGFydCA8IHVzZVRpbWVOdW0pIHtcbiAgICAgICAgbGV0IGl0ZW0gPSB0aW1lTGlzdFtpbmRleCArIHN0YXJ0KytdXG4gICAgICAgIGlmKCFpdGVtLnZhbGlkKSB7XG4gICAgICAgICAgdGltZUxpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2hlY2tlZCA9IGZhbHNlKVxuICAgICAgICAgIHVzZVRpbWUgPSBbXVxuICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogdXNlVGltZSxcbiAgICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0LFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fdG9hc3QoJ+mihOe6puaXtumXtOS4jei2sycpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbS5jaGVja2VkID0gdHJ1ZVxuICAgICAgICB1c2VUaW1lLnB1c2goaXRlbS50aW1lKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogdXNlVGltZSxcbiAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3RcbiAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgZ2V0QmVhdXRpY2lhbkFuZFByb2plY3Q6IGZ1bmN0aW9uIChzaG9wSWQpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICBhcHAuZ2V0KGBhcHBvaW50bWVudC9nZXRCZWF1dGljaWFuQW5kUHJvamVjdC8ke3Nob3BJZH1gKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgY29udGVudCA9IChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmNvbnRlbnQpIHx8IHt9XG5cbiAgICAgICAgY29udGVudC5kYXlzID0gY29udGVudC5kYXlzLm1hcChpdGVtID0+IHtcbiAgICAgICAgICBsZXQgZGF5ID0gaXRlbS5zcGxpdCgnIycpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGU6IGRheVswXSxcbiAgICAgICAgICAgIHdlZWs6IGRheVsxXSxcbiAgICAgICAgICAgIGRheTogZGF5WzJdXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnRlbnQucHJvamVjdHMgPSBjb250ZW50LnByb2plY3RzIHx8IFtdXG4gICAgICAgIGNvbnRlbnQucHJvamVjdHMuZm9yRWFjaChpdGVtID0+IGl0ZW0uYWN0aXZlID0gZmFsc2UpXG5cbiAgICAgICAgLy8g6buY6K6k6YCJ5oup55qE6aG555uuXG4gICAgICAgIGxldCBjdXJyZW50UHJvamVjdCA9IGNvbnRlbnQucHJvamVjdHNbMF0gfHwge31cbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gdHJ1ZVxuXG4gICAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IGNvbnRlbnQuYmVhdXRpY2lhbnNbMF0gfHwge31cbiAgICAgICAgbGV0IGN1cnJlbnRBcHBvaW50bWVudERheSA9IGNvbnRlbnQuZGF5c1swXSB8fCB7fVxuXG4gICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgYmVhdXRpY2lhbkxpc3Q6IGNvbnRlbnQuYmVhdXRpY2lhbnMsXG4gICAgICAgICAgcHJvamVjdExpc3Q6IGNvbnRlbnQucHJvamVjdHMsXG4gICAgICAgICAgYXBwb2ludG1lbnREYXlMaXN0OiBjb250ZW50LmRheXMsXG4gICAgICAgICAgY3VycmVudFByb2plY3QsXG4gICAgICAgICAgY2hvb3NlUHJvamVjdHM6IFtjdXJyZW50UHJvamVjdF0sXG4gICAgICAgICAgY3VycmVudEJlYXV0aWNpYW4sXG4gICAgICAgICAgY3VycmVudEFwcG9pbnRtZW50RGF5LFxuICAgICAgICB9KVxuXG4gICAgICAgIHNlbGYuZ2V0QXBwb2ludG1lbnRUaW1lcyhjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLCBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldEFwcG9pbnRtZW50VGltZXM6IGZ1bmN0aW9uIChiZWF1dGljaWFuSWQsIGRheSkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGFwcC5nZXQoJ2FwcG9pbnRtZW50L2dldEFwcG9pbnRtZW50VGltZS8nICsgYmVhdXRpY2lhbklkICsgJy8nICsgZGF5KVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBjb250ZW50ID0gKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuY29udGVudCkgfHwgW11cbiAgICAgICAgICAvLyBmb3IgKHZhciBpIGluIFswLCAwLCAwLCAwXSlcbiAgICAgICAgICAvLyAgIGNvbnRlbnQucHVzaCh7fSlcblxuICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiBjb250ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5Y+R6YCB6aKE57qmXG4gICAgYXBwb2ludG1lbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgZm9ybUlkID0gZXZlbnQuZGV0YWlsLmZvcm1JZFxuICAgICAgY29uc3QgY2hvb3NlUHJvamVjdHMgPSB0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHNcbiAgICAgIGlmICghY2hvb3NlUHJvamVjdHMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9hc3QoJ+ivt+mAieaLqemihOe6pumhueebricpXG4gICAgICBcbiAgICAgIC8vIOmihOe6pumhueebrlxuICAgICAgbGV0IHByb2plY3RJZHMgPSBjaG9vc2VQcm9qZWN0cy5tYXAoaXRlbSA9PiBpdGVtLnByb2plY3RfaWQpXG4gICAgICBwcm9qZWN0SWRzID0gcHJvamVjdElkcy5qb2luKCcsJylcblxuICAgICAgLy8g6aKE57qmXG4gICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgc2hvcF9pZDogdGhpcy5kYXRhLmN1cnJlbnRTaG9wLnNob3BfaWQsXG4gICAgICAgIGJlYXV0aWNpYW5faWQ6IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLFxuICAgICAgICBwcm9qZWN0X2lkOiBwcm9qZWN0SWRzLFxuICAgICAgICBhcHBvaW50bWVudF9kYXk6IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5LFxuICAgICAgICBhcHBvaW50bWVudF90aW1lOiB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50VGltZXMuam9pbignLCcpLFxuICAgICAgICBmcm9tOiAneGN4JyxcbiAgICAgICAgZm9ybUlkOiBmb3JtSWQsXG4gICAgICB9XG4gICAgICBhcHAucG9zdCgnY2FydC9hcHBvaW50bWVudCcsIGRhdGEpXG4gICAgICAgIC50aGVuKCgpID0+ICAge1xuICAgICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbmiJDlip8hJylcbiAgICAgICAgICBcbiAgICAgICAgICBzZXRUaW1lb3V0KHggPT4gIHtcbiAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL3BheS9pbmRleCdcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGRhdGEuYmVhdXRpY2lhbl9pZCwgZGF0YS5hcHBvaW50bWVudF9kYXkpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH0sIDEwMDApXG5cbiAgICAgICAgICAvLyDpgJrnn6VcbiAgICAgICAgICAvLyBhcHAuYXNrTm90aWNlKClcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICB0aGlzLl90b2FzdChlcnJvci5kZXRhaWwgfHwgJ+mihOe6puWksei0pSEnKVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG5cbiAgICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBhcHAuZ2V0KCdzaG9wL2dldExpc3QnLCB7bGF0aXR1ZGU6IGRhdGEubGF0aXR1ZGUsIGxvbmdpdHVkZTogZGF0YS5sb25naXR1ZGV9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTaG9wID0gcmVzdWx0LmNvbnRlbnRbMF0gfHwge31cbiAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgIHNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgICAgY3BTaG9wTGlzdDogcmVzdWx0LmNvbnRlbnQsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyDliKTmlq1zaG9wX2lk5piv5ZCm5a2Y5ZyoXG4gICAgICAgICAgICBpZihzZWxmLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCkge1xuICAgICAgICAgICAgICBjdXJyZW50U2hvcCA9IHNlbGYuZGF0YS5jdXJyZW50U2hvcFxuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2hvcClcbiAgICAgICAgICAgICAgc2VsZi5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3eC5vcGVuU2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmluaXQoKVxuICB9LFxuXG4gIG9uVGFiSXRlbVRhcDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbml0KClcbiAgfVxuICB9Il19