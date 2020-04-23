'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var $projectMore = '选择项目';
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    currentPet: {},
    pets: [],
    project_more: $projectMore,
    toastText: '',
    showToast: false,
    shopList: [],
    cpShopList: [],
    showShopListPop: 'hide',
    currentShop: {},
    beauticianList: [],
    currentBeautician: {},
    projectList: [],
    projectListFilter: [],
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
    var currentProject = this.data.projectListFilter[index];

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
    }, _defineProperty(_setData, 'projectListFilter[' + index + ']', currentProject), _defineProperty(_setData, 'chooseProjects', chooseProjects), _setData), function () {
      return console.log(_this.data.chooseProjects);
    });

    // 预约时间
    this.clearAppointmentTime();
  },

  clearAppointmentTime: function clearAppointmentTime() {
    var timeList = this.data.appointmentTimeList;
    timeList.forEach(function (item) {
      return item.checked = false;
    });
    this.setData({
      currentAppointmentTimes: [],
      appointmentTimeList: timeList
    });
  },
  filterProject: function filterProject() {
    var currentPet = this.data.currentPet;
    var hair = currentPet.hair;

    this.data.projectList.forEach(function (item) {
      return item.active = false;
    });

    var project = this.data.projectList.filter(function (item) {
      return item.project_property === hair;
    });

    if (project.length) {
      var currentProject = project[0];
      currentProject.active = true;
      this.setData({
        currentProject: currentProject,
        chooseProjects: [currentProject]
      });
    } else {
      this.setData({
        chooseProjects: []
      });
    }

    this.setData({
      projectListFilter: project
    });
  },


  choosePet: function choosePet(event) {
    var _this2 = this;

    var index = event.currentTarget.dataset.index;
    var currentPet = this.data.pets[index];
    if (currentPet.pet_id === this.data.currentPet.pet_id) return;

    // 筛选项目 projectListFilter
    this.setData({
      currentPet: currentPet,
      chooseProjects: []
    }, function () {
      return _this2.filterProject();
    });

    this.clearAppointmentTime();
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
        project_more: $projectMore,
        appointmentDayList: content.days,
        currentProject: currentProject,
        chooseProjects: [currentProject],
        currentBeautician: currentBeautician,
        currentAppointmentDay: currentAppointmentDay
      });

      self.getPets();

      self.getAppointmentTimes(currentBeautician.beautician_id, currentAppointmentDay.day);
    }).catch(function (e) {
      console.log(e);
    });
  },

  getPets: function getPets() {
    var _this3 = this;

    var app = getApp();
    var self = this;

    app.get('pet/findMyPets').then(function (data) {
      var currentPet = data.data.content[0];
      if (!currentPet) currentPet = {};

      self.setData({
        pets: data.data.content,
        currentPet: currentPet
      }, function () {
        return _this3.filterProject();
      });
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
    var _this4 = this;

    var app = getApp();
    var formId = event.detail.formId;
    var chooseProjects = this.data.chooseProjects;
    if (!chooseProjects.length) return this._toast('请选择预约项目');

    if (!this.data.currentAppointmentTimes.length) return this._toast('请选择预约时间');

    // 预约项目
    var projectIds = chooseProjects.map(function (item) {
      return item.project_id;
    });
    projectIds = projectIds.join(',');

    // 预约
    var data = {
      shop_id: this.data.currentShop.shop_id,
      pet_id: this.data.currentPet.pet_id,
      beautician_id: this.data.currentBeautician.beautician_id,
      project_id: projectIds,
      appointment_day: this.data.currentAppointmentDay.day,
      appointment_time: this.data.currentAppointmentTimes.join(','),
      from: 'xcx',
      formId: formId
    };
    app.post('cart/appointment', data).then(function () {
      _this4._toast('预约成功!');

      _this4.getAppointmentTimes(data.beautician_id, data.appointment_day);

      setTimeout(function (x) {
        wx.navigateTo({
          url: '/pages/order/index'
        });
      }, 1000);

      // 通知
      // app.askNotice()
    }).catch(function (error) {
      _this4._toast(error.detail || '预约失败!');
    });
  },

  addPet: function addPet() {
    wx.navigateTo({
      url: '/pages/pet/index'
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

          // self.getPets()

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

  onShow: function onShow() {
    if (!this.data.pets.length) this.getPets();

    var data = this.data;
    // 加载
    if (data.currentBeautician.beautician_id && data.currentAppointmentDay.day) {
      this.getAppointmentTimes(data.currentBeautician.beautician_id, data.currentAppointmentDay.day);
    }
  },

  onTabItemTap: function onTabItemTap() {
    this.init();
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyIkcHJvamVjdE1vcmUiLCJkYXRhIiwiY3VycmVudFBldCIsInBldHMiLCJwcm9qZWN0X21vcmUiLCJ0b2FzdFRleHQiLCJzaG93VG9hc3QiLCJzaG9wTGlzdCIsImNwU2hvcExpc3QiLCJzaG93U2hvcExpc3RQb3AiLCJjdXJyZW50U2hvcCIsImJlYXV0aWNpYW5MaXN0IiwiY3VycmVudEJlYXV0aWNpYW4iLCJwcm9qZWN0TGlzdCIsInByb2plY3RMaXN0RmlsdGVyIiwiY3VycmVudFByb2plY3QiLCJjaG9vc2VQcm9qZWN0cyIsImFwcG9pbnRtZW50RGF5TGlzdCIsImN1cnJlbnRBcHBvaW50bWVudERheSIsImFwcG9pbnRtZW50VGltZUxpc3QiLCJjdXJyZW50QXBwb2ludG1lbnRUaW1lcyIsImhhbmRsZXJTZWFyY2giLCJldmVudCIsInZhbHVlIiwiZGV0YWlsIiwiZmlsdGVyIiwiaXRlbSIsInNob3BfbmFtZSIsIm1hdGNoIiwiUmVnRXhwIiwic2V0RGF0YSIsInNob3dTaG9wTGlzdCIsImNob29zZVNob3AiLCJpbmRleCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwiZ2V0QmVhdXRpY2lhbkFuZFByb2plY3QiLCJzaG9wX2lkIiwiY2hvb3NlUHJvamVjdCIsImZpbmRJbmRleCIsImNvbnNvbGUiLCJsb2ciLCJhY3RpdmUiLCJzcGxpY2UiLCJwdXNoIiwiY2xlYXJBcHBvaW50bWVudFRpbWUiLCJ0aW1lTGlzdCIsImZvckVhY2giLCJjaGVja2VkIiwiZmlsdGVyUHJvamVjdCIsImhhaXIiLCJwcm9qZWN0IiwicHJvamVjdF9wcm9wZXJ0eSIsImxlbmd0aCIsImNob29zZVBldCIsInBldF9pZCIsImNob29zZUJlYXV0aWNpYW4iLCJiZWF1dGljaWFuX2lkIiwiYmVhdXRpY2lhbklkIiwiZGF5IiwiZ2V0QXBwb2ludG1lbnRUaW1lcyIsImNob29zZURheSIsIl90b2FzdCIsInRleHQiLCJ3eCIsInRpdGxlIiwiZHVyYXRpb24iLCJpY29uIiwiY2hvb3NlVGltZSIsImV2ZXJ5VGltZSIsInRpbWUiLCJ2YWxpZCIsInByb2plY3RVc2VUaW1lIiwicmVkdWNlIiwiaW5pdCIsInVzZV90aW1lIiwidXNlVGltZU51bSIsIk1hdGgiLCJjZWlsIiwidGltZUxpc3RMZW5ndGgiLCJzdGFydCIsInVzZVRpbWUiLCJzaG9wSWQiLCJhcHAiLCJnZXRBcHAiLCJzZWxmIiwiZ2V0IiwidGhlbiIsImNvbnRlbnQiLCJkYXlzIiwibWFwIiwic3BsaXQiLCJkYXRlIiwid2VlayIsInByb2plY3RzIiwiYmVhdXRpY2lhbnMiLCJnZXRQZXRzIiwiY2F0Y2giLCJlIiwiYXBwb2ludG1lbnQiLCJmb3JtSWQiLCJwcm9qZWN0SWRzIiwicHJvamVjdF9pZCIsImpvaW4iLCJhcHBvaW50bWVudF9kYXkiLCJhcHBvaW50bWVudF90aW1lIiwiZnJvbSIsInBvc3QiLCJzZXRUaW1lb3V0IiwibmF2aWdhdGVUbyIsInVybCIsImVycm9yIiwiYWRkUGV0IiwiZ2V0TG9jYXRpb24iLCJzdWNjZXNzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJyZXN1bHQiLCJmYWlsIiwib3BlblNldHRpbmciLCJyZXMiLCJvblNob3ciLCJvblRhYkl0ZW1UYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTUEsZUFBZSxNQUFyQjs7QUFlSUMsUUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFDSkMsZ0JBQVcsRUFEUDtBQUVKQyxVQUFNLEVBRkY7QUFHSkMsa0JBQWNKLFlBSFY7QUFJSkssZUFBVyxFQUpQO0FBS0pDLGVBQVcsS0FMUDtBQU1KQyxjQUFVLEVBTk47QUFPSkMsZ0JBQVksRUFQUjtBQVFKQyxxQkFBaUIsTUFSYjtBQVNKQyxpQkFBYSxFQVRUO0FBVUpDLG9CQUFnQixFQVZaO0FBV0pDLHVCQUFtQixFQVhmO0FBWUpDLGlCQUFhLEVBWlQ7QUFhSkMsdUJBQW1CLEVBYmY7QUFjSkMsb0JBQWdCLEVBZFo7QUFlSkMsb0JBQWdCLEVBZlosRUFlZ0I7QUFD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MkJ5QyxHQUF2RSxFQUE0RTtBQUMxRSxXQUFLQyxtQkFBTCxDQUF5QjNELEtBQUtXLGlCQUFMLENBQXVCNkMsYUFBaEQsRUFBK0R4RCxLQUFLaUIscUJBQUwsQ0FBMkJ5QyxHQUExRjtBQUNEO0FBRUYsRzs7QUFFRCtELGdCQUFjLHdCQUFXO0FBQ3ZCLFNBQUtoRCxJQUFMO0FBQ0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgJHByb2plY3RNb3JlID0gJ+mAieaLqemhueebridcbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+mihOe6picsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICd3eGMtZmxleCc6ICdAbWludWkvd3hjLWZsZXgnLFxuICAgICAgICAnd3hjLWljb24nOiAnQG1pbnVpL3d4Yy1pY29uJyxcbiAgICAgICAgJ3d4Yy1hdmF0YXInOiAnQG1pbnVpL3d4Yy1hdmF0YXInLFxuICAgICAgICAnd3hjLW1hc2snOiAnQG1pbnVpL3d4Yy1tYXNrJyxcbiAgICAgICAgJ3d4Yy1wb3B1cCc6ICdAbWludWkvd3hjLXBvcHVwJyxcbiAgICAgICAgJ3d4Yy1lbGlwJzogJ0BtaW51aS93eGMtZWxpcCcsXG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBjdXJyZW50UGV0Ont9LFxuICAgICAgcGV0czogW10sXG4gICAgICBwcm9qZWN0X21vcmU6ICRwcm9qZWN0TW9yZSxcbiAgICAgIHRvYXN0VGV4dDogJycsXG4gICAgICBzaG93VG9hc3Q6IGZhbHNlLFxuICAgICAgc2hvcExpc3Q6IFtdLFxuICAgICAgY3BTaG9wTGlzdDogW10sXG4gICAgICBzaG93U2hvcExpc3RQb3A6ICdoaWRlJyxcbiAgICAgIGN1cnJlbnRTaG9wOiB7fSxcbiAgICAgIGJlYXV0aWNpYW5MaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRCZWF1dGljaWFuOiB7fSxcbiAgICAgIHByb2plY3RMaXN0OiBbXSxcbiAgICAgIHByb2plY3RMaXN0RmlsdGVyOiBbXSxcbiAgICAgIGN1cnJlbnRQcm9qZWN0OiB7fSxcbiAgICAgIGNob29zZVByb2plY3RzOiBbXSwgLy8g5bey57uP6YCJ5oup55qE6aG555uuXG4gICAgICBhcHBvaW50bWVudERheUxpc3Q6IFtdLFxuICAgICAgY3VycmVudEFwcG9pbnRtZW50RGF5OiAnJyxcbiAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IFtdLFxuICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdLCAvLyDpooTnuqbnmoTml7bpl7RcbiAgICB9LFxuICAgIGhhbmRsZXJTZWFyY2g6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IHZhbHVlID0gZXZlbnQuZGV0YWlsLnZhbHVlXG4gICAgICBsZXQgc2hvcExpc3QgPSB0aGlzLmRhdGEuc2hvcExpc3RcbiAgICAgIGxldCBjcFNob3BMaXN0ID0gc2hvcExpc3QuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnNob3BfbmFtZS5tYXRjaChuZXcgUmVnRXhwKHZhbHVlKSlcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGNwU2hvcExpc3Q6IGNwU2hvcExpc3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIHNob3dTaG9wTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnc2hvdydcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVNob3A6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFNob3AgPSB0aGlzLmRhdGEuc2hvcExpc3RbaW5kZXhdXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50U2hvcDogY3VycmVudFNob3AsXG4gICAgICAgIHNob3dTaG9wTGlzdFBvcDogJ2hpZGUnLFxuICAgICAgfSlcblxuICAgICAgdGhpcy5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgIH0sXG5cbiAgICAvLyDpgInmi6npobnnm65cbiAgICBjaG9vc2VQcm9qZWN0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRQcm9qZWN0ID0gdGhpcy5kYXRhLnByb2plY3RMaXN0RmlsdGVyW2luZGV4XVxuXG4gICAgICAvLyDliKTmlq3mmK/lkKblt7Lnu4/pgInmi6nkuobpobnnm65cbiAgICAgIGNvbnN0IGNob29zZVByb2plY3RzID0gdGhpcy5kYXRhLmNob29zZVByb2plY3RzXG4gICAgICBjb25zdCBmaW5kSW5kZXggPSBjaG9vc2VQcm9qZWN0cy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtID09PSBjdXJyZW50UHJvamVjdClcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coZmluZEluZGV4KVxuXG4gICAgICBpZiAoZmluZEluZGV4ID49IDApIHtcbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgY2hvb3NlUHJvamVjdHMuc3BsaWNlKGZpbmRJbmRleCwgMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcbiAgICAgICAgY2hvb3NlUHJvamVjdHMucHVzaChjdXJyZW50UHJvamVjdClcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3QgcHJvamVjdExpc3QgPSB0aGlzLmRhdGEucHJvamVjdExpc3RcbiAgICAgIC8vIHByb2plY3RMaXN0W2luZGV4XSA9IGN1cnJlbnRQcm9qZWN0XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0OiBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgW2Bwcm9qZWN0TGlzdEZpbHRlclske2luZGV4fV1gXTogY3VycmVudFByb2plY3QsXG4gICAgICAgIGNob29zZVByb2plY3RzXG4gICAgICB9LCAoKSA9PiBjb25zb2xlLmxvZyh0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHMpKVxuXG5cbiAgICAgIC8vIOmihOe6puaXtumXtFxuICAgICAgdGhpcy5jbGVhckFwcG9pbnRtZW50VGltZSgpXG4gICAgfSxcbiAgICBcbiAgICBjbGVhckFwcG9pbnRtZW50VGltZSgpIHtcbiAgICAgIGxldCB0aW1lTGlzdCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0XG4gICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sXG4gICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBmaWx0ZXJQcm9qZWN0KCkge1xuICAgICAgY29uc3QgY3VycmVudFBldCA9IHRoaXMuZGF0YS5jdXJyZW50UGV0XG4gICAgICBjb25zdCBoYWlyID0gY3VycmVudFBldC5oYWlyXG5cbiAgICAgIHRoaXMuZGF0YS5wcm9qZWN0TGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5hY3RpdmUgPSBmYWxzZSlcblxuICAgICAgY29uc3QgcHJvamVjdCA9IHRoaXMuZGF0YS5wcm9qZWN0TGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnByb2plY3RfcHJvcGVydHkgPT09IGhhaXIpXG5cbiAgICAgIGlmIChwcm9qZWN0Lmxlbmd0aCkge1xuICAgICAgICBsZXQgY3VycmVudFByb2plY3QgPSBwcm9qZWN0WzBdXG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcbiAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIGNob29zZVByb2plY3RzOiBbY3VycmVudFByb2plY3RdLFxuICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgY2hvb3NlUHJvamVjdHM6IFtdXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHByb2plY3RMaXN0RmlsdGVyOiBwcm9qZWN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjaG9vc2VQZXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFBldCA9IHRoaXMuZGF0YS5wZXRzW2luZGV4XVxuICAgICAgaWYgKGN1cnJlbnRQZXQucGV0X2lkID09PSB0aGlzLmRhdGEuY3VycmVudFBldC5wZXRfaWQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICAvLyDnrZvpgInpobnnm64gcHJvamVjdExpc3RGaWx0ZXJcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRQZXQsXG4gICAgICAgIGNob29zZVByb2plY3RzOiBbXSxcbiAgICAgIH0sICgpID0+IHRoaXMuZmlsdGVyUHJvamVjdCgpKVxuXG4gICAgICB0aGlzLmNsZWFyQXBwb2ludG1lbnRUaW1lKClcbiAgICB9LFxuXG4gICAgY2hvb3NlQmVhdXRpY2lhbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IHRoaXMuZGF0YS5iZWF1dGljaWFuTGlzdFtpbmRleF1cbiAgICAgIGlmIChjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkID09PSB0aGlzLmRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRCZWF1dGljaWFuOiBjdXJyZW50QmVhdXRpY2lhbixcbiAgICAgIH0pXG5cbiAgICAgIGxldCBiZWF1dGljaWFuSWQgPSBjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkXG4gICAgICBsZXQgZGF5ID0gdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXlcbiAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhiZWF1dGljaWFuSWQsIGRheSlcbiAgICB9LFxuXG5cbiAgICBjaG9vc2VEYXk6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudEFwcG9pbnRtZW50RGF5ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50RGF5TGlzdFtpbmRleF1cblxuICAgICAgaWYgKGN1cnJlbnRBcHBvaW50bWVudERheS5kYXkgPT09IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgICByZXR1cm5cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50RGF5OiBjdXJyZW50QXBwb2ludG1lbnREYXksXG4gICAgICB9KVxuXG4gICAgICBsZXQgYmVhdXRpY2lhbklkID0gdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWRcbiAgICAgIGxldCBkYXkgPSBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5XG4gICAgICB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoYmVhdXRpY2lhbklkLCBkYXkpXG4gICAgfSxcblxuICAgIF90b2FzdCh0ZXh0KSB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogdGV4dCxcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgIGljb246ICdub25lJ1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgY2hvb3NlVGltZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgZXZlcnlUaW1lID0gMzBcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IHRpbWUgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFtpbmRleF1cbiAgICAgIGlmICghdGltZS52YWxpZClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGxldCB0aW1lTGlzdCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0XG4gICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG5cbiAgICAgIGNvbnN0IGNob29zZVByb2plY3RzID0gdGhpcy5kYXRhLmNob29zZVByb2plY3RzXG4gICAgICBpZiAoIWNob29zZVByb2plY3RzLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvYXN0KCfor7fpgInmi6npooTnuqbpobnnm64nKVxuXG4gICAgICBjb25zdCBwcm9qZWN0VXNlVGltZSA9IGNob29zZVByb2plY3RzLnJlZHVjZSgoaW5pdCwgaXRlbSkgPT4gaXRlbS51c2VfdGltZSAvIDEgKyBpbml0LCAwKVxuXG4gICAgICBsZXQgdXNlVGltZU51bSA9IE1hdGguY2VpbChwcm9qZWN0VXNlVGltZSAvIGV2ZXJ5VGltZSlcbiAgICAgIGxldCB0aW1lTGlzdExlbmd0aCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0Lmxlbmd0aFxuICAgICAgaWYgKGluZGV4ICsgdXNlVGltZU51bSA+IHRpbWVMaXN0TGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdLFxuICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0LFxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbml7bpl7TkuI3otrMs6K+36YeN5paw6YCJ5oupLicpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBsZXQgc3RhcnQgPSAwXG4gICAgICBsZXQgdXNlVGltZSA9IFtdXG4gICAgICB3aGlsZSAoc3RhcnQgPCB1c2VUaW1lTnVtKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGltZUxpc3RbaW5kZXggKyBzdGFydCsrXVxuICAgICAgICBpZighaXRlbS52YWxpZCkge1xuICAgICAgICAgIHRpbWVMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcbiAgICAgICAgICB1c2VUaW1lID0gW11cbiAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IHVzZVRpbWUsXG4gICAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdCxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbml7bpl7TkuI3otrMnKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0uY2hlY2tlZCA9IHRydWVcbiAgICAgICAgdXNlVGltZS5wdXNoKGl0ZW0udGltZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IHVzZVRpbWUsXG4gICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0XG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldEJlYXV0aWNpYW5BbmRQcm9qZWN0OiBmdW5jdGlvbiAoc2hvcElkKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgYXBwLmdldChgYXBwb2ludG1lbnQvZ2V0QmVhdXRpY2lhbkFuZFByb2plY3QvJHtzaG9wSWR9YCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IGNvbnRlbnQgPSAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5jb250ZW50KSB8fCB7fVxuXG4gICAgICAgIGNvbnRlbnQuZGF5cyA9IGNvbnRlbnQuZGF5cy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgbGV0IGRheSA9IGl0ZW0uc3BsaXQoJyMnKVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRlOiBkYXlbMF0sXG4gICAgICAgICAgICB3ZWVrOiBkYXlbMV0sXG4gICAgICAgICAgICBkYXk6IGRheVsyXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBjb250ZW50LnByb2plY3RzID0gY29udGVudC5wcm9qZWN0cyB8fCBbXVxuICAgICAgICBjb250ZW50LnByb2plY3RzLmZvckVhY2goaXRlbSA9PiBpdGVtLmFjdGl2ZSA9IGZhbHNlKVxuXG4gICAgICAgIC8vIOm7mOiupOmAieaLqeeahOmhueebrlxuICAgICAgICBsZXQgY3VycmVudFByb2plY3QgPSBjb250ZW50LnByb2plY3RzWzBdIHx8IHt9XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcblxuICAgICAgICBsZXQgY3VycmVudEJlYXV0aWNpYW4gPSBjb250ZW50LmJlYXV0aWNpYW5zWzBdIHx8IHt9XG4gICAgICAgIGxldCBjdXJyZW50QXBwb2ludG1lbnREYXkgPSBjb250ZW50LmRheXNbMF0gfHwge31cblxuICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgIGJlYXV0aWNpYW5MaXN0OiBjb250ZW50LmJlYXV0aWNpYW5zLFxuICAgICAgICAgIHByb2plY3RMaXN0OiBjb250ZW50LnByb2plY3RzLFxuICAgICAgICAgIHByb2plY3RfbW9yZTogJHByb2plY3RNb3JlLFxuICAgICAgICAgIGFwcG9pbnRtZW50RGF5TGlzdDogY29udGVudC5kYXlzLFxuICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgIGNob29zZVByb2plY3RzOiBbY3VycmVudFByb2plY3RdLFxuICAgICAgICAgIGN1cnJlbnRCZWF1dGljaWFuLFxuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheSxcbiAgICAgICAgfSlcblxuICAgICAgICBzZWxmLmdldFBldHMoKVxuXG4gICAgICAgIHNlbGYuZ2V0QXBwb2ludG1lbnRUaW1lcyhjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLCBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldFBldHMoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgICBhcHAuZ2V0KCdwZXQvZmluZE15UGV0cycpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCBjdXJyZW50UGV0ID0gZGF0YS5kYXRhLmNvbnRlbnRbMF1cbiAgICAgICAgaWYgKCFjdXJyZW50UGV0KVxuICAgICAgICAgIGN1cnJlbnRQZXQgPSB7fVxuXG4gICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgcGV0czogZGF0YS5kYXRhLmNvbnRlbnQsXG4gICAgICAgICAgY3VycmVudFBldCxcbiAgICAgICAgfSwgKCkgPT4gdGhpcy5maWx0ZXJQcm9qZWN0KCkpXG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldEFwcG9pbnRtZW50VGltZXM6IGZ1bmN0aW9uIChiZWF1dGljaWFuSWQsIGRheSkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGFwcC5nZXQoJ2FwcG9pbnRtZW50L2dldEFwcG9pbnRtZW50VGltZS8nICsgYmVhdXRpY2lhbklkICsgJy8nICsgZGF5KVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBjb250ZW50ID0gKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuY29udGVudCkgfHwgW11cbiAgICAgICAgICAvLyBmb3IgKHZhciBpIGluIFswLCAwLCAwLCAwXSlcbiAgICAgICAgICAvLyAgIGNvbnRlbnQucHVzaCh7fSlcblxuICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiBjb250ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5Y+R6YCB6aKE57qmXG4gICAgYXBwb2ludG1lbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgZm9ybUlkID0gZXZlbnQuZGV0YWlsLmZvcm1JZFxuICAgICAgY29uc3QgY2hvb3NlUHJvamVjdHMgPSB0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHNcbiAgICAgIGlmICghY2hvb3NlUHJvamVjdHMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9hc3QoJ+ivt+mAieaLqemihOe6pumhueebricpXG5cbiAgICAgIGlmICghdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudFRpbWVzLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvYXN0KCfor7fpgInmi6npooTnuqbml7bpl7QnKVxuICAgICAgXG4gICAgICAvLyDpooTnuqbpobnnm65cbiAgICAgIGxldCBwcm9qZWN0SWRzID0gY2hvb3NlUHJvamVjdHMubWFwKGl0ZW0gPT4gaXRlbS5wcm9qZWN0X2lkKVxuICAgICAgcHJvamVjdElkcyA9IHByb2plY3RJZHMuam9pbignLCcpXG5cbiAgICAgIC8vIOmihOe6plxuICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIHNob3BfaWQ6IHRoaXMuZGF0YS5jdXJyZW50U2hvcC5zaG9wX2lkLFxuICAgICAgICBwZXRfaWQ6IHRoaXMuZGF0YS5jdXJyZW50UGV0LnBldF9pZCxcbiAgICAgICAgYmVhdXRpY2lhbl9pZDogdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQsXG4gICAgICAgIHByb2plY3RfaWQ6IHByb2plY3RJZHMsXG4gICAgICAgIGFwcG9pbnRtZW50X2RheTogdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXksXG4gICAgICAgIGFwcG9pbnRtZW50X3RpbWU6IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnRUaW1lcy5qb2luKCcsJyksXG4gICAgICAgIGZyb206ICd4Y3gnLFxuICAgICAgICBmb3JtSWQ6IGZvcm1JZCxcbiAgICAgIH1cbiAgICAgIGFwcC5wb3N0KCdjYXJ0L2FwcG9pbnRtZW50JywgZGF0YSlcbiAgICAgICAgLnRoZW4oKCkgPT4gICB7XG4gICAgICAgICAgdGhpcy5fdG9hc3QoJ+mihOe6puaIkOWKnyEnKVxuXG4gICAgICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGRhdGEuYmVhdXRpY2lhbl9pZCwgZGF0YS5hcHBvaW50bWVudF9kYXkpXG4gICAgICAgICAgXG4gICAgICAgICAgc2V0VGltZW91dCh4ID0+ICB7XG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvb3JkZXIvaW5kZXgnXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH0sIDEwMDApXG5cbiAgICAgICAgICAvLyDpgJrnn6VcbiAgICAgICAgICAvLyBhcHAuYXNrTm90aWNlKClcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICB0aGlzLl90b2FzdChlcnJvci5kZXRhaWwgfHwgJ+mihOe6puWksei0pSEnKVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBhZGRQZXQoKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiAnL3BhZ2VzL3BldC9pbmRleCdcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcblxuICAgIFxuICAgICAgd3guZ2V0TG9jYXRpb24oe1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGFwcC5nZXQoJ3Nob3AvZ2V0TGlzdCcsIHtsYXRpdHVkZTogZGF0YS5sYXRpdHVkZSwgbG9uZ2l0dWRlOiBkYXRhLmxvbmdpdHVkZX0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgICAgICBsZXQgY3VycmVudFNob3AgPSByZXN1bHQuY29udGVudFswXSB8fCB7fVxuICAgICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgICAgc2hvcExpc3Q6IHJlc3VsdC5jb250ZW50LFxuICAgICAgICAgICAgICBjcFNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIOWIpOaWrXNob3BfaWTmmK/lkKblrZjlnKhcbiAgICAgICAgICAgIGlmKHNlbGYuZGF0YS5jdXJyZW50U2hvcC5zaG9wX2lkKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRTaG9wID0gc2VsZi5kYXRhLmN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY3VycmVudFNob3BcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY3VycmVudFNob3BcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VsZi5nZXRQZXRzKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTaG9wKVxuICAgICAgICAgICAgICBzZWxmLmdldEJlYXV0aWNpYW5BbmRQcm9qZWN0KGN1cnJlbnRTaG9wLnNob3BfaWQpXG4gICAgICAgICAgfSkuY2F0Y2goZSA9PiBjb25zb2xlLmxvZyhlKSlcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5kYXRhLnBldHMubGVuZ3RoKVxuICAgICAgdGhpcy5nZXRQZXRzKClcblxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGFcbiAgICAvLyDliqDovb1cbiAgICBpZiAoZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkICYmIGRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSkge1xuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCwgZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgIH1cbiAgICBcbiAgfSxcblxuICBvblRhYkl0ZW1UYXA6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH1cbiAgfSJdfQ==