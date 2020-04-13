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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwidG9hc3RUZXh0Iiwic2hvd1RvYXN0Iiwic2hvcExpc3QiLCJjcFNob3BMaXN0Iiwic2hvd1Nob3BMaXN0UG9wIiwiY3VycmVudFNob3AiLCJiZWF1dGljaWFuTGlzdCIsImN1cnJlbnRCZWF1dGljaWFuIiwicHJvamVjdExpc3QiLCJjdXJyZW50UHJvamVjdCIsImNob29zZVByb2plY3RzIiwiYXBwb2ludG1lbnREYXlMaXN0IiwiY3VycmVudEFwcG9pbnRtZW50RGF5IiwiYXBwb2ludG1lbnRUaW1lTGlzdCIsImN1cnJlbnRBcHBvaW50bWVudFRpbWVzIiwiaGFuZGxlclNlYXJjaCIsImV2ZW50IiwidmFsdWUiLCJkZXRhaWwiLCJmaWx0ZXIiLCJpdGVtIiwic2hvcF9uYW1lIiwibWF0Y2giLCJSZWdFeHAiLCJzZXREYXRhIiwic2hvd1Nob3BMaXN0IiwiY2hvb3NlU2hvcCIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJnZXRCZWF1dGljaWFuQW5kUHJvamVjdCIsInNob3BfaWQiLCJjaG9vc2VQcm9qZWN0IiwiZmluZEluZGV4IiwiY29uc29sZSIsImxvZyIsImFjdGl2ZSIsInNwbGljZSIsInB1c2giLCJ0aW1lTGlzdCIsImZvckVhY2giLCJjaGVja2VkIiwiY2hvb3NlQmVhdXRpY2lhbiIsImJlYXV0aWNpYW5faWQiLCJiZWF1dGljaWFuSWQiLCJkYXkiLCJnZXRBcHBvaW50bWVudFRpbWVzIiwiY2hvb3NlRGF5IiwiX3RvYXN0IiwidGV4dCIsInd4IiwidGl0bGUiLCJkdXJhdGlvbiIsImljb24iLCJjaG9vc2VUaW1lIiwiZXZlcnlUaW1lIiwidGltZSIsInZhbGlkIiwibGVuZ3RoIiwicHJvamVjdFVzZVRpbWUiLCJyZWR1Y2UiLCJpbml0IiwidXNlX3RpbWUiLCJ1c2VUaW1lTnVtIiwiTWF0aCIsImNlaWwiLCJ0aW1lTGlzdExlbmd0aCIsInN0YXJ0IiwidXNlVGltZSIsInNob3BJZCIsImFwcCIsImdldEFwcCIsInNlbGYiLCJnZXQiLCJ0aGVuIiwiY29udGVudCIsImRheXMiLCJtYXAiLCJzcGxpdCIsImRhdGUiLCJ3ZWVrIiwicHJvamVjdHMiLCJiZWF1dGljaWFucyIsImNhdGNoIiwiZSIsImFwcG9pbnRtZW50IiwiZm9ybUlkIiwicHJvamVjdElkcyIsInByb2plY3RfaWQiLCJqb2luIiwiYXBwb2ludG1lbnRfZGF5IiwiYXBwb2ludG1lbnRfdGltZSIsImZyb20iLCJwb3N0Iiwic2V0VGltZW91dCIsInN3aXRjaFRhYiIsInVybCIsImVycm9yIiwiZ2V0TG9jYXRpb24iLCJzdWNjZXNzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJyZXN1bHQiLCJmYWlsIiwib3BlblNldHRpbmciLCJyZXMiLCJvbkxvYWQiLCJvblRhYkl0ZW1UYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQWFJQSxRQUFNO0FBQUE7QUFBQTtBQUFBOztBQUNKQyxlQUFXLEVBRFA7QUFFSkMsZUFBVyxLQUZQO0FBR0pDLGNBQVUsRUFITjtBQUlKQyxnQkFBWSxFQUpSO0FBS0pDLHFCQUFpQixNQUxiO0FBTUpDLGlCQUFhLEVBTlQ7QUFPSkMsb0JBQWdCLEVBUFo7QUFRSkMsdUJBQW1CLEVBUmY7QUFTSkMsaUJBQWEsRUFUVDtBQVVKQyxvQkFBZ0IsRUFWWjtBQVdKQyxvQkFBZ0IsRUFYWixFQVdnQjtBQUNwQkMsd0JBQW9CLEVBWmhCO0FBYUpDLDJCQUF1QixFQWJuQjtBQWNKQyx5QkFBcUIsRUFkakI7QUFlSkMsNkJBQXlCLEVBZnJCLENBZXlCO0FBZnpCLEc7QUFpQk5DLGlCQUFlLHVCQUFVQyxLQUFWLEVBQWlCO0FBQzlCLFFBQUlDLFFBQVFELE1BQU1FLE1BQU4sQ0FBYUQsS0FBekI7QUFDQSxRQUFJZixXQUFXLEtBQUtILElBQUwsQ0FBVUcsUUFBekI7QUFDQSxRQUFJQyxhQUFhRCxTQUFTaUIsTUFBVCxDQUFnQixVQUFVQyxJQUFWLEVBQWdCO0FBQy9DLGFBQU9BLEtBQUtDLFNBQUwsQ0FB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QztBQUNBSCxlQUFLaEQsT0FBTCxDQUFhO0FBQ1h0QixzQkFBVW9HLE9BQU8zQixPQUROO0FBRVh4RSx3QkFBWW1HLE9BQU8zQjtBQUZSLFdBQWI7O0FBS0E7QUFDQSxjQUFHSCxLQUFLekUsSUFBTCxDQUFVTSxXQUFWLENBQXNCMEIsT0FBekIsRUFBa0M7QUFDaEMxQiwwQkFBY21FLEtBQUt6RSxJQUFMLENBQVVNLFdBQXhCO0FBQ0FtRSxpQkFBS2hELE9BQUwsQ0FBYTtBQUNYbkI7QUFEVyxhQUFiO0FBR0QsV0FMRCxNQUtPO0FBQ0xtRSxpQkFBS2hELE9BQUwsQ0FBYTtBQUNYbkI7QUFEVyxhQUFiO0FBR0Q7O0FBRUQsY0FBSUEsV0FBSixFQUNFbUUsS0FBSzFDLHVCQUFMLENBQTZCekIsWUFBWTBCLE9BQXpDO0FBQ0gsU0F0QkQsRUFzQkdvRCxLQXRCSCxDQXNCUztBQUFBLGlCQUFLakQsUUFBUUMsR0FBUixDQUFZaUQsQ0FBWixDQUFMO0FBQUEsU0F0QlQ7QUF1QkQsT0F6Qlk7QUEwQmJtQixZQUFNLGdCQUFZO0FBQ2hCckQsV0FBR3NELFdBQUgsQ0FBZTtBQUNiTCxtQkFBUyxpQkFBVU0sR0FBVixFQUFlLENBQ3ZCLENBRlk7QUFHYkYsZ0JBQU0sZ0JBQVksQ0FDakI7QUFKWSxTQUFmO0FBTUQ7QUFqQ1ksS0FBZjtBQW1DRCxHOztBQUVIRyxVQUFRLGtCQUFZO0FBQ2xCLFNBQUs3QyxJQUFMO0FBQ0QsRzs7QUFFRDhDLGdCQUFjLHdCQUFXO0FBQ3ZCLFNBQUs5QyxJQUFMO0FBQ0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+mihOe6picsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI0ZGRENFNCcsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1mbGV4JzogJ0BtaW51aS93eGMtZmxleCcsXG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICAgICd3eGMtbWFzayc6ICdAbWludWkvd3hjLW1hc2snLFxuICAgICAgICAnd3hjLXBvcHVwJzogJ0BtaW51aS93eGMtcG9wdXAnLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIHRvYXN0VGV4dDogJycsXG4gICAgICBzaG93VG9hc3Q6IGZhbHNlLFxuICAgICAgc2hvcExpc3Q6IFtdLFxuICAgICAgY3BTaG9wTGlzdDogW10sXG4gICAgICBzaG93U2hvcExpc3RQb3A6ICdoaWRlJyxcbiAgICAgIGN1cnJlbnRTaG9wOiB7fSxcbiAgICAgIGJlYXV0aWNpYW5MaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRCZWF1dGljaWFuOiB7fSxcbiAgICAgIHByb2plY3RMaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRQcm9qZWN0OiB7fSxcbiAgICAgIGNob29zZVByb2plY3RzOiBbXSwgLy8g5bey57uP6YCJ5oup55qE6aG555uuXG4gICAgICBhcHBvaW50bWVudERheUxpc3Q6IFtdLFxuICAgICAgY3VycmVudEFwcG9pbnRtZW50RGF5OiAnJyxcbiAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IFtdLFxuICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdLCAvLyDpooTnuqbnmoTml7bpl7RcbiAgICB9LFxuICAgIGhhbmRsZXJTZWFyY2g6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IHZhbHVlID0gZXZlbnQuZGV0YWlsLnZhbHVlXG4gICAgICBsZXQgc2hvcExpc3QgPSB0aGlzLmRhdGEuc2hvcExpc3RcbiAgICAgIGxldCBjcFNob3BMaXN0ID0gc2hvcExpc3QuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnNob3BfbmFtZS5tYXRjaChuZXcgUmVnRXhwKHZhbHVlKSlcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGNwU2hvcExpc3Q6IGNwU2hvcExpc3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIHNob3dTaG9wTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnc2hvdydcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVNob3A6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFNob3AgPSB0aGlzLmRhdGEuc2hvcExpc3RbaW5kZXhdXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50U2hvcDogY3VycmVudFNob3AsXG4gICAgICAgIHNob3dTaG9wTGlzdFBvcDogJ2hpZGUnLFxuICAgICAgfSlcblxuICAgICAgdGhpcy5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgIH0sXG5cbiAgICAvLyDpgInmi6npobnnm65cbiAgICBjaG9vc2VQcm9qZWN0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRQcm9qZWN0ID0gdGhpcy5kYXRhLnByb2plY3RMaXN0W2luZGV4XVxuXG4gICAgICAvLyDliKTmlq3mmK/lkKblt7Lnu4/pgInmi6nkuobpobnnm65cbiAgICAgIGNvbnN0IGNob29zZVByb2plY3RzID0gdGhpcy5kYXRhLmNob29zZVByb2plY3RzXG4gICAgICBjb25zdCBmaW5kSW5kZXggPSBjaG9vc2VQcm9qZWN0cy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtID09PSBjdXJyZW50UHJvamVjdClcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coZmluZEluZGV4KVxuXG4gICAgICBpZiAoZmluZEluZGV4ID49IDApIHtcbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgY2hvb3NlUHJvamVjdHMuc3BsaWNlKGZpbmRJbmRleCwgMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcbiAgICAgICAgY2hvb3NlUHJvamVjdHMucHVzaChjdXJyZW50UHJvamVjdClcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3QgcHJvamVjdExpc3QgPSB0aGlzLmRhdGEucHJvamVjdExpc3RcbiAgICAgIC8vIHByb2plY3RMaXN0W2luZGV4XSA9IGN1cnJlbnRQcm9qZWN0XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0OiBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgW2Bwcm9qZWN0TGlzdFske2luZGV4fV1gXTogY3VycmVudFByb2plY3QsXG4gICAgICAgIGNob29zZVByb2plY3RzXG4gICAgICB9LCAoKSA9PiBjb25zb2xlLmxvZyh0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHMpKVxuXG5cbiAgICAgIC8vIOmihOe6puaXtumXtFxuICAgICAgbGV0IHRpbWVMaXN0ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3RcbiAgICAgIHRpbWVMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSxcbiAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZUJlYXV0aWNpYW46IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudEJlYXV0aWNpYW4gPSB0aGlzLmRhdGEuYmVhdXRpY2lhbkxpc3RbaW5kZXhdXG4gICAgICBpZiAoY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCA9PT0gdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QmVhdXRpY2lhbjogY3VycmVudEJlYXV0aWNpYW4sXG4gICAgICB9KVxuXG4gICAgICBsZXQgYmVhdXRpY2lhbklkID0gY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZFxuICAgICAgbGV0IGRheSA9IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5XG4gICAgICB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoYmVhdXRpY2lhbklkLCBkYXkpXG4gICAgfSxcblxuXG4gICAgY2hvb3NlRGF5OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRBcHBvaW50bWVudERheSA9IHRoaXMuZGF0YS5hcHBvaW50bWVudERheUxpc3RbaW5kZXhdXG5cbiAgICAgIGlmIChjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5ID09PSB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheTogY3VycmVudEFwcG9pbnRtZW50RGF5LFxuICAgICAgfSlcblxuICAgICAgbGV0IGJlYXV0aWNpYW5JZCA9IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkXG4gICAgICBsZXQgZGF5ID0gY3VycmVudEFwcG9pbnRtZW50RGF5LmRheVxuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGJlYXV0aWNpYW5JZCwgZGF5KVxuICAgIH0sXG5cbiAgICBfdG9hc3QodGV4dCkge1xuICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgdGl0bGU6IHRleHQsXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVRpbWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGV2ZXJ5VGltZSA9IDMwXG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCB0aW1lID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3RbaW5kZXhdXG4gICAgICBpZiAoIXRpbWUudmFsaWQpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICBsZXQgdGltZUxpc3QgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFxuICAgICAgdGltZUxpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2hlY2tlZCA9IGZhbHNlKVxuXG4gICAgICBjb25zdCBjaG9vc2VQcm9qZWN0cyA9IHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0c1xuICAgICAgaWYgKCFjaG9vc2VQcm9qZWN0cy5sZW5ndGgpXG4gICAgICAgIHJldHVybiB0aGlzLl90b2FzdCgn6K+36YCJ5oup6aKE57qm6aG555uuJylcblxuICAgICAgY29uc3QgcHJvamVjdFVzZVRpbWUgPSBjaG9vc2VQcm9qZWN0cy5yZWR1Y2UoKGluaXQsIGl0ZW0pID0+IGl0ZW0udXNlX3RpbWUgLyAxICsgaW5pdCwgMClcblxuICAgICAgbGV0IHVzZVRpbWVOdW0gPSBNYXRoLmNlaWwocHJvamVjdFVzZVRpbWUgLyBldmVyeVRpbWUpXG4gICAgICBsZXQgdGltZUxpc3RMZW5ndGggPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdC5sZW5ndGhcbiAgICAgIGlmIChpbmRleCArIHVzZVRpbWVOdW0gPiB0aW1lTGlzdExlbmd0aCkge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSxcbiAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdCxcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5pe26Ze05LiN6LazLOivt+mHjeaWsOmAieaLqS4nKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgbGV0IHN0YXJ0ID0gMFxuICAgICAgbGV0IHVzZVRpbWUgPSBbXVxuICAgICAgd2hpbGUgKHN0YXJ0IDwgdXNlVGltZU51bSkge1xuICAgICAgICBsZXQgaXRlbSA9IHRpbWVMaXN0W2luZGV4ICsgc3RhcnQrK11cbiAgICAgICAgaWYoIWl0ZW0udmFsaWQpIHtcbiAgICAgICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG4gICAgICAgICAgdXNlVGltZSA9IFtdXG4gICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiB1c2VUaW1lLFxuICAgICAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3QsXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5pe26Ze05LiN6LazJylcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpdGVtLmNoZWNrZWQgPSB0cnVlXG4gICAgICAgIHVzZVRpbWUucHVzaChpdGVtLnRpbWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiB1c2VUaW1lLFxuICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdFxuICAgICAgfSlcblxuICAgIH0sXG5cbiAgICBnZXRCZWF1dGljaWFuQW5kUHJvamVjdDogZnVuY3Rpb24gKHNob3BJZCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgIGFwcC5nZXQoYGFwcG9pbnRtZW50L2dldEJlYXV0aWNpYW5BbmRQcm9qZWN0LyR7c2hvcElkfWApLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCBjb250ZW50ID0gKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuY29udGVudCkgfHwge31cblxuICAgICAgICBjb250ZW50LmRheXMgPSBjb250ZW50LmRheXMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgIGxldCBkYXkgPSBpdGVtLnNwbGl0KCcjJylcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0ZTogZGF5WzBdLFxuICAgICAgICAgICAgd2VlazogZGF5WzFdLFxuICAgICAgICAgICAgZGF5OiBkYXlbMl1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgY29udGVudC5wcm9qZWN0cyA9IGNvbnRlbnQucHJvamVjdHMgfHwgW11cbiAgICAgICAgY29udGVudC5wcm9qZWN0cy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5hY3RpdmUgPSBmYWxzZSlcblxuICAgICAgICAvLyDpu5jorqTpgInmi6nnmoTpobnnm65cbiAgICAgICAgbGV0IGN1cnJlbnRQcm9qZWN0ID0gY29udGVudC5wcm9qZWN0c1swXSB8fCB7fVxuICAgICAgICBjdXJyZW50UHJvamVjdC5hY3RpdmUgPSB0cnVlXG5cbiAgICAgICAgbGV0IGN1cnJlbnRCZWF1dGljaWFuID0gY29udGVudC5iZWF1dGljaWFuc1swXSB8fCB7fVxuICAgICAgICBsZXQgY3VycmVudEFwcG9pbnRtZW50RGF5ID0gY29udGVudC5kYXlzWzBdIHx8IHt9XG5cbiAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICBiZWF1dGljaWFuTGlzdDogY29udGVudC5iZWF1dGljaWFucyxcbiAgICAgICAgICBwcm9qZWN0TGlzdDogY29udGVudC5wcm9qZWN0cyxcbiAgICAgICAgICBhcHBvaW50bWVudERheUxpc3Q6IGNvbnRlbnQuZGF5cyxcbiAgICAgICAgICBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgICBjaG9vc2VQcm9qZWN0czogW2N1cnJlbnRQcm9qZWN0XSxcbiAgICAgICAgICBjdXJyZW50QmVhdXRpY2lhbixcbiAgICAgICAgICBjdXJyZW50QXBwb2ludG1lbnREYXksXG4gICAgICAgIH0pXG5cbiAgICAgICAgc2VsZi5nZXRBcHBvaW50bWVudFRpbWVzKGN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQsIGN1cnJlbnRBcHBvaW50bWVudERheS5kYXkpXG4gICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgZ2V0QXBwb2ludG1lbnRUaW1lczogZnVuY3Rpb24gKGJlYXV0aWNpYW5JZCwgZGF5KSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gYXBwLmdldCgnYXBwb2ludG1lbnQvZ2V0QXBwb2ludG1lbnRUaW1lLycgKyBiZWF1dGljaWFuSWQgKyAnLycgKyBkYXkpXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IGNvbnRlbnQgPSAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5jb250ZW50KSB8fCBbXVxuICAgICAgICAgIC8vIGZvciAodmFyIGkgaW4gWzAsIDAsIDAsIDBdKVxuICAgICAgICAgIC8vICAgY29udGVudC5wdXNoKHt9KVxuXG4gICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IGNvbnRlbnRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvLyDlj5HpgIHpooTnuqZcbiAgICBhcHBvaW50bWVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBmb3JtSWQgPSBldmVudC5kZXRhaWwuZm9ybUlkXG4gICAgICBjb25zdCBjaG9vc2VQcm9qZWN0cyA9IHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0c1xuICAgICAgaWYgKCFjaG9vc2VQcm9qZWN0cy5sZW5ndGgpXG4gICAgICAgIHJldHVybiB0aGlzLl90b2FzdCgn6K+36YCJ5oup6aKE57qm6aG555uuJylcbiAgICAgIFxuICAgICAgLy8g6aKE57qm6aG555uuXG4gICAgICBsZXQgcHJvamVjdElkcyA9IGNob29zZVByb2plY3RzLm1hcChpdGVtID0+IGl0ZW0ucHJvamVjdF9pZClcbiAgICAgIHByb2plY3RJZHMgPSBwcm9qZWN0SWRzLmpvaW4oJywnKVxuXG4gICAgICAvLyDpooTnuqZcbiAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICBzaG9wX2lkOiB0aGlzLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCxcbiAgICAgICAgYmVhdXRpY2lhbl9pZDogdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQsXG4gICAgICAgIHByb2plY3RfaWQ6IHByb2plY3RJZHMsXG4gICAgICAgIGFwcG9pbnRtZW50X2RheTogdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXksXG4gICAgICAgIGFwcG9pbnRtZW50X3RpbWU6IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnRUaW1lcy5qb2luKCcsJyksXG4gICAgICAgIGZyb206ICd4Y3gnLFxuICAgICAgICBmb3JtSWQ6IGZvcm1JZCxcbiAgICAgIH1cbiAgICAgIGFwcC5wb3N0KCdjYXJ0L2FwcG9pbnRtZW50JywgZGF0YSlcbiAgICAgICAgLnRoZW4oKCkgPT4gICB7XG4gICAgICAgICAgdGhpcy5fdG9hc3QoJ+mihOe6puaIkOWKnyEnKVxuICAgICAgICAgIFxuICAgICAgICAgIHNldFRpbWVvdXQoeCA9PiAge1xuICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvcGF5L2luZGV4J1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoZGF0YS5iZWF1dGljaWFuX2lkLCBkYXRhLmFwcG9pbnRtZW50X2RheSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfSwgMTAwMClcblxuICAgICAgICAgIC8vIOmAmuefpVxuICAgICAgICAgIC8vIGFwcC5hc2tOb3RpY2UoKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIHRoaXMuX3RvYXN0KGVycm9yLmRldGFpbCB8fCAn6aKE57qm5aSx6LSlIScpXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcblxuICAgICAgd3guZ2V0TG9jYXRpb24oe1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGFwcC5nZXQoJ3Nob3AvZ2V0TGlzdCcsIHtsYXRpdHVkZTogZGF0YS5sYXRpdHVkZSwgbG9uZ2l0dWRlOiBkYXRhLmxvbmdpdHVkZX0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgICAgICBsZXQgY3VycmVudFNob3AgPSByZXN1bHQuY29udGVudFswXSB8fCB7fVxuICAgICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgICAgc2hvcExpc3Q6IHJlc3VsdC5jb250ZW50LFxuICAgICAgICAgICAgICBjcFNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIOWIpOaWrXNob3BfaWTmmK/lkKblrZjlnKhcbiAgICAgICAgICAgIGlmKHNlbGYuZGF0YS5jdXJyZW50U2hvcC5zaG9wX2lkKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRTaG9wID0gc2VsZi5kYXRhLmN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY3VycmVudFNob3BcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY3VycmVudFNob3BcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTaG9wKVxuICAgICAgICAgICAgICBzZWxmLmdldEJlYXV0aWNpYW5BbmRQcm9qZWN0KGN1cnJlbnRTaG9wLnNob3BfaWQpXG4gICAgICAgICAgfSkuY2F0Y2goZSA9PiBjb25zb2xlLmxvZyhlKSlcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH0sXG5cbiAgb25UYWJJdGVtVGFwOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmluaXQoKVxuICB9XG4gIH0iXX0=