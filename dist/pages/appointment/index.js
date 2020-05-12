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
    currentAppointmentTimes: [], // 预约的时间
    defaultBeautician: 0, // 默认管家
    toastMsg: '',
    toastShow: false
  },

  onShareAppMessage: function onShareAppMessage() {
    return {
      title: 'CAT猫的世界',
      path: '/pages/article/index',
      imageUrl: 'https://api.mdshijie.com/static/share.png'
    };
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

  setToast: function setToast(msg) {
    var _this3 = this;

    this.setData({
      toastMsg: msg,
      toastShow: true
    }, function () {
      return setTimeout(function () {
        _this3.setData({
          toastMsg: '',
          toastShow: false
        });
      }, 2000);
    });
  },


  chooseBeautician: function chooseBeautician(event) {
    var index = event.currentTarget.dataset.index;
    var currentBeautician = this.data.beauticianList[index];
    if (currentBeautician.beautician_id === this.data.currentBeautician.beautician_id) return;

    this.setData({
      currentBeautician: currentBeautician
    });

    var showLoading = true;
    var beauticianId = currentBeautician.beautician_id;
    if (this.data.defaultBeautician > 0 && beauticianId != this.data.defaultBeautician) {
      this.setToast('我可以提供服务，但我不是您的专属管家');
      showLoading = false;
    }

    var day = this.data.currentAppointmentDay.day;
    this.getAppointmentTimes(beauticianId, day, showLoading);
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

      var defaultBeautician = (content.defaultBeautician || 0) / 1;
      if (defaultBeautician > 0) {
        currentBeautician = content.beauticians.filter(function (item) {
          return item.beautician_id == defaultBeautician;
        }).pop();
      }

      var currentAppointmentDay = content.days[0] || {};

      self.setData({
        beauticianList: content.beauticians,
        projectList: content.projects,
        project_more: $projectMore,
        appointmentDayList: content.days,
        currentProject: currentProject,
        chooseProjects: [currentProject],
        currentBeautician: currentBeautician,
        currentAppointmentDay: currentAppointmentDay,
        defaultBeautician: defaultBeautician
      });

      self.getPets();

      self.getAppointmentTimes(currentBeautician.beautician_id, currentAppointmentDay.day);
    }).catch(function (e) {
      console.log(e);
    });
  },

  getPets: function getPets() {
    var _this4 = this;

    var app = getApp();
    var self = this;

    app.get('myPet/findMyPets').then(function (data) {
      var currentPet = data.data.content[0];
      if (!currentPet) currentPet = {};

      self.setData({
        pets: data.data.content,
        currentPet: currentPet
      }, function () {
        return _this4.filterProject();
      });
    });
  },


  getAppointmentTimes: function getAppointmentTimes(beauticianId, day) {
    var showLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var app = getApp();
    var self = this;
    this.setData({
      currentAppointmentTimes: []
    });

    return app.get('appointment/getAppointmentTime/' + beauticianId + '/' + day, '', showLoading).then(function (data) {
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
    var _this5 = this;

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
      _this5._toast('预约成功!');

      _this5.getAppointmentTimes(data.beautician_id, data.appointment_day);

      setTimeout(function (x) {
        wx.switchTab({
          url: '/pages/pay/index'
        });
      }, 1000);

      // 通知
      // app.askNotice()
    }).catch(function (error) {
      _this5._toast(error.detail || '预约失败!');
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
      complete: function complete(data) {
        if (Object.prototype.toString.call(data) !== '[object Object]') data = {};

        app.get('shop/getList', { latitude: data.latitude || '', longitude: data.longitude || '' }).then(function (data) {
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
  onLoad: function onLoad() {
    this.init();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyIkcHJvamVjdE1vcmUiLCJkYXRhIiwiY3VycmVudFBldCIsInBldHMiLCJwcm9qZWN0X21vcmUiLCJ0b2FzdFRleHQiLCJzaG93VG9hc3QiLCJzaG9wTGlzdCIsImNwU2hvcExpc3QiLCJzaG93U2hvcExpc3RQb3AiLCJjdXJyZW50U2hvcCIsImJlYXV0aWNpYW5MaXN0IiwiY3VycmVudEJlYXV0aWNpYW4iLCJwcm9qZWN0TGlzdCIsInByb2plY3RMaXN0RmlsdGVyIiwiY3VycmVudFByb2plY3QiLCJjaG9vc2VQcm9qZWN0cyIsImFwcG9pbnRtZW50RGF5TGlzdCIsImN1cnJlbnRBcHBvaW50bWVudERheSIsImFwcG9pbnRtZW50VGltZUxpc3QiLCJjdXJyZW50QXBwb2ludG1lbnRUaW1lcyIsImRlZmF1bHRCZWF1dGljaWFuIiwidG9hc3RNc2ciLCJ0b2FzdFNob3ciLCJvblNoYXJlQXBwTWVzc2FnZSIsInRpdGxlIiwicGF0aCIsImltYWdlVXJsIiwiaGFuZGxlclNlYXJjaCIsImV2ZW50IiwidmFsdWUiLCJkZXRhaWwiLCJmaWx0ZXIiLCJpdGVtIiwic2hvcF9uYW1lIiwibWF0Y2giLCJSZWdFeHAiLCJzZXREYXRhIiwic2hvd1Nob3BMaXN0IiwiY2hvb3NlU2hvcCIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJnZXRCZWF1dGljaWFuQW5kUHJvamVjdCIsInNob3BfaWQiLCJjaG9vc2VQcm9qZWN0IiwiZmluZEluZGV4IiwiY29uc29sZSIsImxvZyIsImFjdGl2ZSIsInNwbGljZSIsInB1c2giLCJjbGVhckFwcG9pbnRtZW50VGltZSIsInRpbWVMaXN0IiwiZm9yRWFjaCIsImNoZWNrZWQiLCJmaWx0ZXJQcm9qZWN0IiwiaGFpciIsInByb2plY3QiLCJwcm9qZWN0X3Byb3BlcnR5IiwibGVuZ3RoIiwiY2hvb3NlUGV0IiwicGV0X2lkIiwic2V0VG9hc3QiLCJtc2ciLCJzZXRUaW1lb3V0IiwiY2hvb3NlQmVhdXRpY2lhbiIsImJlYXV0aWNpYW5faWQiLCJzaG93TG9hZGluZyIsImJlYXV0aWNpYW5JZCIsImRheSIsImdldEFwcG9pbnRtZW50VGltZXMiLCJjaG9vc2VEYXkiLCJfdG9hc3QiLCJ0ZXh0Iiwid3giLCJkdXJhdGlvbiIsImljb24iLCJjaG9vc2VUaW1lIiwiZXZlcnlUaW1lIiwidGltZSIsInZhbGlkIiwicHJvamVjdFVzZVRpbWUiLCJyZWR1Y2UiLCJpbml0IiwidXNlX3RpbWUiLCJ1c2VUaW1lTnVtIiwiTWF0aCIsImNlaWwiLCJ0aW1lTGlzdExlbmd0aCIsInN0YXJ0IiwidXNlVGltZSIsInNob3BJZCIsImFwcCIsImdldEFwcCIsInNlbGYiLCJnZXQiLCJ0aGVuIiwiY29udGVudCIsImRheXMiLCJtYXAiLCJzcGxpdCIsImRhdGUiLCJ3ZWVrIiwicHJvamVjdHMiLCJiZWF1dGljaWFucyIsInBvcCIsImdldFBldHMiLCJjYXRjaCIsImUiLCJhcHBvaW50bWVudCIsImZvcm1JZCIsInByb2plY3RJZHMiLCJwcm9qZWN0X2lkIiwiam9pbiIsImFwcG9pbnRtZW50X2RheSIsImFwcG9pbnRtZW50X3RpbWUiLCJmcm9tIiwicG9zdCIsInN3aXRjaFRhYiIsInVybCIsImVycm9yIiwiYWRkUGV0IiwibmF2aWdhdGVUbyIsImdldExvY2F0aW9uIiwiY29tcGxldGUiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInJlc3VsdCIsImZhaWwiLCJvcGVuU2V0dGluZyIsInN1Y2Nlc3MiLCJyZXMiLCJvbkxvYWQiLCJvblNob3ciLCJvblRhYkl0ZW1UYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTUEsZUFBZSxNQUFyQjs7QUFnQklDLFFBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ0pDLGdCQUFXLEVBRFA7QUFFSkMsVUFBTSxFQUZGO0FBR0pDLGtCQUFjSixZQUhWO0FBSUpLLGVBQVcsRUFKUDtBQUtKQyxlQUFX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LEdBQVYsRUFBZSxDQUN2QixDQUZZO0FBR2JILGdCQUFNLGdCQUFZLENBQ2pCO0FBSlksU0FBZjtBQU1EO0FBdENZLEtBQWY7QUF3Q0gsRztBQUNESSxRLG9CQUFTO0FBQ1AsU0FBS3JELElBQUw7QUFDRCxHOzs7QUFFRHNELFVBQVEsa0JBQVk7QUFDbEIsUUFBSSxDQUFDLEtBQUt6SSxJQUFMLENBQVVFLElBQVYsQ0FBZXlELE1BQXBCLEVBQ0UsS0FBSytDLE9BQUw7O0FBRUYsUUFBTTFHLE9BQU8sS0FBS0EsSUFBbEI7QUFDQTtBQUNBLFFBQUlBLEtBQUtXLGlCQUFMLENBQXVCdUQsYUFBdkIsSUFBd0NsRSxLQUFLaUIscUJBQUwsQ0FBMkJvRCxHQUF2RSxFQUE0RTtBQUMxRSxXQUFLQyxtQkFBTCxDQUF5QnRFLEtBQUtXLGlCQUFMLENBQXVCdUQsYUFBaEQsRUFBK0RsRSxLQUFLaUIscUJBQUwsQ0FBMkJvRCxHQUExRjtBQUNEO0FBRUYsRzs7QUFFRHFFLGdCQUFjLHdCQUFXO0FBQ3ZCLFNBQUt2RCxJQUFMO0FBQ0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgJHByb2plY3RNb3JlID0gJ+mAieaLqemhueebridcbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+mihOe6picsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI0U4RThFOCcsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICd3eGMtZmxleCc6ICdAbWludWkvd3hjLWZsZXgnLFxuICAgICAgICAnd3hjLWljb24nOiAnQG1pbnVpL3d4Yy1pY29uJyxcbiAgICAgICAgJ3d4Yy1hdmF0YXInOiAnQG1pbnVpL3d4Yy1hdmF0YXInLFxuICAgICAgICAnd3hjLW1hc2snOiAnQG1pbnVpL3d4Yy1tYXNrJyxcbiAgICAgICAgJ3d4Yy1wb3B1cCc6ICdAbWludWkvd3hjLXBvcHVwJyxcbiAgICAgICAgJ3d4Yy1lbGlwJzogJ0BtaW51aS93eGMtZWxpcCcsXG4gICAgICAgICd3eGMtdG9hc3QnOiAnQG1pbnVpL3d4Yy10b2FzdCcsXG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBjdXJyZW50UGV0Ont9LFxuICAgICAgcGV0czogW10sXG4gICAgICBwcm9qZWN0X21vcmU6ICRwcm9qZWN0TW9yZSxcbiAgICAgIHRvYXN0VGV4dDogJycsXG4gICAgICBzaG93VG9hc3Q6IGZhbHNlLFxuICAgICAgc2hvcExpc3Q6IFtdLFxuICAgICAgY3BTaG9wTGlzdDogW10sXG4gICAgICBzaG93U2hvcExpc3RQb3A6ICdoaWRlJyxcbiAgICAgIGN1cnJlbnRTaG9wOiB7fSxcbiAgICAgIGJlYXV0aWNpYW5MaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRCZWF1dGljaWFuOiB7fSxcbiAgICAgIHByb2plY3RMaXN0OiBbXSxcbiAgICAgIHByb2plY3RMaXN0RmlsdGVyOiBbXSxcbiAgICAgIGN1cnJlbnRQcm9qZWN0OiB7fSxcbiAgICAgIGNob29zZVByb2plY3RzOiBbXSwgLy8g5bey57uP6YCJ5oup55qE6aG555uuXG4gICAgICBhcHBvaW50bWVudERheUxpc3Q6IFtdLFxuICAgICAgY3VycmVudEFwcG9pbnRtZW50RGF5OiAnJyxcbiAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IFtdLFxuICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdLCAvLyDpooTnuqbnmoTml7bpl7RcbiAgICAgIGRlZmF1bHRCZWF1dGljaWFuOiAwLCAvLyDpu5jorqTnrqHlrrZcbiAgICAgIHRvYXN0TXNnOiAnJyxcbiAgICAgIHRvYXN0U2hvdzogZmFsc2UsXG4gICAgfSxcblxuICAgIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGU6ICdDQVTnjKvnmoTkuJbnlYwnLFxuICAgICAgICBwYXRoOiAnL3BhZ2VzL2FydGljbGUvaW5kZXgnLFxuICAgICAgICBpbWFnZVVybDogJ2h0dHBzOi8vYXBpLm1kc2hpamllLmNvbS9zdGF0aWMvc2hhcmUucG5nJ1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlclNlYXJjaDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgdmFsdWUgPSBldmVudC5kZXRhaWwudmFsdWVcbiAgICAgIGxldCBzaG9wTGlzdCA9IHRoaXMuZGF0YS5zaG9wTGlzdFxuICAgICAgbGV0IGNwU2hvcExpc3QgPSBzaG9wTGlzdC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uc2hvcF9uYW1lLm1hdGNoKG5ldyBSZWdFeHAodmFsdWUpKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3BTaG9wTGlzdDogY3BTaG9wTGlzdFxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgc2hvd1Nob3BMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBzaG93U2hvcExpc3RQb3A6ICdzaG93J1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgY2hvb3NlU2hvcDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50U2hvcCA9IHRoaXMuZGF0YS5zaG9wTGlzdFtpbmRleF1cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRTaG9wOiBjdXJyZW50U2hvcCxcbiAgICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnaGlkZScsXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmdldEJlYXV0aWNpYW5BbmRQcm9qZWN0KGN1cnJlbnRTaG9wLnNob3BfaWQpXG4gICAgfSxcblxuICAgIC8vIOmAieaLqemhueebrlxuICAgIGNob29zZVByb2plY3Q6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFByb2plY3QgPSB0aGlzLmRhdGEucHJvamVjdExpc3RGaWx0ZXJbaW5kZXhdXG5cbiAgICAgIC8vIOWIpOaWreaYr+WQpuW3sue7j+mAieaLqeS6humhueebrlxuICAgICAgY29uc3QgY2hvb3NlUHJvamVjdHMgPSB0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHNcbiAgICAgIGNvbnN0IGZpbmRJbmRleCA9IGNob29zZVByb2plY3RzLmZpbmRJbmRleChpdGVtID0+IGl0ZW0gPT09IGN1cnJlbnRQcm9qZWN0KVxuICAgICAgXG4gICAgICBjb25zb2xlLmxvZyhmaW5kSW5kZXgpXG5cbiAgICAgIGlmIChmaW5kSW5kZXggPj0gMCkge1xuICAgICAgICBjdXJyZW50UHJvamVjdC5hY3RpdmUgPSBmYWxzZVxuICAgICAgICBjaG9vc2VQcm9qZWN0cy5zcGxpY2UoZmluZEluZGV4LCAxKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gdHJ1ZVxuICAgICAgICBjaG9vc2VQcm9qZWN0cy5wdXNoKGN1cnJlbnRQcm9qZWN0KVxuICAgICAgfVxuXG4gICAgICAvLyBjb25zdCBwcm9qZWN0TGlzdCA9IHRoaXMuZGF0YS5wcm9qZWN0TGlzdFxuICAgICAgLy8gcHJvamVjdExpc3RbaW5kZXhdID0gY3VycmVudFByb2plY3RcblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudFByb2plY3Q6IGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICBbYHByb2plY3RMaXN0RmlsdGVyWyR7aW5kZXh9XWBdOiBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgY2hvb3NlUHJvamVjdHNcbiAgICAgIH0sICgpID0+IGNvbnNvbGUubG9nKHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0cykpXG5cblxuICAgICAgLy8g6aKE57qm5pe26Ze0XG4gICAgICB0aGlzLmNsZWFyQXBwb2ludG1lbnRUaW1lKClcbiAgICB9LFxuICAgIFxuICAgIGNsZWFyQXBwb2ludG1lbnRUaW1lKCkge1xuICAgICAgbGV0IHRpbWVMaXN0ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3RcbiAgICAgIHRpbWVMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSxcbiAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGZpbHRlclByb2plY3QoKSB7XG4gICAgICBjb25zdCBjdXJyZW50UGV0ID0gdGhpcy5kYXRhLmN1cnJlbnRQZXRcbiAgICAgIGNvbnN0IGhhaXIgPSBjdXJyZW50UGV0LmhhaXJcblxuICAgICAgdGhpcy5kYXRhLnByb2plY3RMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmFjdGl2ZSA9IGZhbHNlKVxuXG4gICAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5kYXRhLnByb2plY3RMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0ucHJvamVjdF9wcm9wZXJ0eSA9PT0gaGFpcilcblxuICAgICAgaWYgKHByb2plY3QubGVuZ3RoKSB7XG4gICAgICAgIGxldCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RbMF1cbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgICAgY2hvb3NlUHJvamVjdHM6IFtjdXJyZW50UHJvamVjdF0sXG4gICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBjaG9vc2VQcm9qZWN0czogW11cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgcHJvamVjdExpc3RGaWx0ZXI6IHByb2plY3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVBldDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50UGV0ID0gdGhpcy5kYXRhLnBldHNbaW5kZXhdXG4gICAgICBpZiAoY3VycmVudFBldC5wZXRfaWQgPT09IHRoaXMuZGF0YS5jdXJyZW50UGV0LnBldF9pZClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIC8vIOetm+mAiemhueebriBwcm9qZWN0TGlzdEZpbHRlclxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudFBldCxcbiAgICAgICAgY2hvb3NlUHJvamVjdHM6IFtdLFxuICAgICAgfSwgKCkgPT4gdGhpcy5maWx0ZXJQcm9qZWN0KCkpXG5cbiAgICAgIHRoaXMuY2xlYXJBcHBvaW50bWVudFRpbWUoKVxuICAgIH0sXG5cbiAgICBzZXRUb2FzdChtc2cpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgdG9hc3RNc2c6IG1zZyxcbiAgICAgICAgICB0b2FzdFNob3c6IHRydWUsXG4gICAgICAgIH0sICgpID0+IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgdG9hc3RNc2c6ICcnLFxuICAgICAgICAgIHRvYXN0U2hvdzogZmFsc2UsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSwgMjAwMCkpXG4gICAgfSxcblxuICAgIGNob29zZUJlYXV0aWNpYW46IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudEJlYXV0aWNpYW4gPSB0aGlzLmRhdGEuYmVhdXRpY2lhbkxpc3RbaW5kZXhdXG4gICAgICBpZiAoY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCA9PT0gdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QmVhdXRpY2lhbjogY3VycmVudEJlYXV0aWNpYW4sXG4gICAgICB9KVxuXG4gICAgICBsZXQgc2hvd0xvYWRpbmcgPSB0cnVlXG4gICAgICBsZXQgYmVhdXRpY2lhbklkID0gY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZFxuICAgICAgaWYgKHRoaXMuZGF0YS5kZWZhdWx0QmVhdXRpY2lhbiA+IDAgJiYgYmVhdXRpY2lhbklkICE9IHRoaXMuZGF0YS5kZWZhdWx0QmVhdXRpY2lhbikge1xuICAgICAgICB0aGlzLnNldFRvYXN0KCfmiJHlj6/ku6Xmj5DkvpvmnI3liqHvvIzkvYbmiJHkuI3mmK/mgqjnmoTkuJPlsZ7nrqHlrrYnKVxuICAgICAgICBzaG93TG9hZGluZyA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGxldCBkYXkgPSB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheVxuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGJlYXV0aWNpYW5JZCwgZGF5LCBzaG93TG9hZGluZylcbiAgICB9LFxuXG5cbiAgICBjaG9vc2VEYXk6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudEFwcG9pbnRtZW50RGF5ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50RGF5TGlzdFtpbmRleF1cblxuICAgICAgaWYgKGN1cnJlbnRBcHBvaW50bWVudERheS5kYXkgPT09IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgICByZXR1cm5cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50RGF5OiBjdXJyZW50QXBwb2ludG1lbnREYXksXG4gICAgICB9KVxuXG4gICAgICBsZXQgYmVhdXRpY2lhbklkID0gdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWRcbiAgICAgIGxldCBkYXkgPSBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5XG4gICAgICB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoYmVhdXRpY2lhbklkLCBkYXkpXG4gICAgfSxcblxuICAgIF90b2FzdCh0ZXh0KSB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogdGV4dCxcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgIGljb246ICdub25lJ1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgY2hvb3NlVGltZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgZXZlcnlUaW1lID0gMzBcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IHRpbWUgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFtpbmRleF1cbiAgICAgIGlmICghdGltZS52YWxpZClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGxldCB0aW1lTGlzdCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0XG4gICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG5cbiAgICAgIGNvbnN0IGNob29zZVByb2plY3RzID0gdGhpcy5kYXRhLmNob29zZVByb2plY3RzXG4gICAgICBpZiAoIWNob29zZVByb2plY3RzLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvYXN0KCfor7fpgInmi6npooTnuqbpobnnm64nKVxuXG4gICAgICBjb25zdCBwcm9qZWN0VXNlVGltZSA9IGNob29zZVByb2plY3RzLnJlZHVjZSgoaW5pdCwgaXRlbSkgPT4gaXRlbS51c2VfdGltZSAvIDEgKyBpbml0LCAwKVxuXG4gICAgICBsZXQgdXNlVGltZU51bSA9IE1hdGguY2VpbChwcm9qZWN0VXNlVGltZSAvIGV2ZXJ5VGltZSlcbiAgICAgIGxldCB0aW1lTGlzdExlbmd0aCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0Lmxlbmd0aFxuICAgICAgaWYgKGluZGV4ICsgdXNlVGltZU51bSA+IHRpbWVMaXN0TGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdLFxuICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0LFxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbml7bpl7TkuI3otrMs6K+36YeN5paw6YCJ5oupLicpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBsZXQgc3RhcnQgPSAwXG4gICAgICBsZXQgdXNlVGltZSA9IFtdXG4gICAgICB3aGlsZSAoc3RhcnQgPCB1c2VUaW1lTnVtKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGltZUxpc3RbaW5kZXggKyBzdGFydCsrXVxuICAgICAgICBpZighaXRlbS52YWxpZCkge1xuICAgICAgICAgIHRpbWVMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcbiAgICAgICAgICB1c2VUaW1lID0gW11cbiAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IHVzZVRpbWUsXG4gICAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdCxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbml7bpl7TkuI3otrMnKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0uY2hlY2tlZCA9IHRydWVcbiAgICAgICAgdXNlVGltZS5wdXNoKGl0ZW0udGltZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IHVzZVRpbWUsXG4gICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0XG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldEJlYXV0aWNpYW5BbmRQcm9qZWN0OiBmdW5jdGlvbiAoc2hvcElkKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgYXBwLmdldChgYXBwb2ludG1lbnQvZ2V0QmVhdXRpY2lhbkFuZFByb2plY3QvJHtzaG9wSWR9YCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IGNvbnRlbnQgPSAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5jb250ZW50KSB8fCB7fVxuXG4gICAgICAgIGNvbnRlbnQuZGF5cyA9IGNvbnRlbnQuZGF5cy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgbGV0IGRheSA9IGl0ZW0uc3BsaXQoJyMnKVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRlOiBkYXlbMF0sXG4gICAgICAgICAgICB3ZWVrOiBkYXlbMV0sXG4gICAgICAgICAgICBkYXk6IGRheVsyXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBjb250ZW50LnByb2plY3RzID0gY29udGVudC5wcm9qZWN0cyB8fCBbXVxuICAgICAgICBjb250ZW50LnByb2plY3RzLmZvckVhY2goaXRlbSA9PiBpdGVtLmFjdGl2ZSA9IGZhbHNlKVxuXG4gICAgICAgIC8vIOm7mOiupOmAieaLqeeahOmhueebrlxuICAgICAgICBsZXQgY3VycmVudFByb2plY3QgPSBjb250ZW50LnByb2plY3RzWzBdIHx8IHt9XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcblxuICAgICAgICBsZXQgY3VycmVudEJlYXV0aWNpYW4gPSBjb250ZW50LmJlYXV0aWNpYW5zWzBdIHx8IHt9XG4gICAgICAgIFxuICAgICAgICBsZXQgZGVmYXVsdEJlYXV0aWNpYW4gPSAoY29udGVudC5kZWZhdWx0QmVhdXRpY2lhbiB8fCAwKSAvIDFcbiAgICAgICAgaWYgKGRlZmF1bHRCZWF1dGljaWFuID4gMCkge1xuICAgICAgICAgIGN1cnJlbnRCZWF1dGljaWFuID0gY29udGVudC5iZWF1dGljaWFucy5maWx0ZXIoaXRlbSA9PiBpdGVtLmJlYXV0aWNpYW5faWQgPT0gZGVmYXVsdEJlYXV0aWNpYW4pLnBvcCgpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3VycmVudEFwcG9pbnRtZW50RGF5ID0gY29udGVudC5kYXlzWzBdIHx8IHt9XG5cbiAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICBiZWF1dGljaWFuTGlzdDogY29udGVudC5iZWF1dGljaWFucyxcbiAgICAgICAgICBwcm9qZWN0TGlzdDogY29udGVudC5wcm9qZWN0cyxcbiAgICAgICAgICBwcm9qZWN0X21vcmU6ICRwcm9qZWN0TW9yZSxcbiAgICAgICAgICBhcHBvaW50bWVudERheUxpc3Q6IGNvbnRlbnQuZGF5cyxcbiAgICAgICAgICBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgICBjaG9vc2VQcm9qZWN0czogW2N1cnJlbnRQcm9qZWN0XSxcbiAgICAgICAgICBjdXJyZW50QmVhdXRpY2lhbixcbiAgICAgICAgICBjdXJyZW50QXBwb2ludG1lbnREYXksXG4gICAgICAgICAgZGVmYXVsdEJlYXV0aWNpYW4sXG4gICAgICAgIH0pXG5cbiAgICAgICAgc2VsZi5nZXRQZXRzKClcblxuICAgICAgICBzZWxmLmdldEFwcG9pbnRtZW50VGltZXMoY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCwgY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSlcbiAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgfSlcblxuICAgIH0sXG5cbiAgICBnZXRQZXRzKCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcblxuICAgICAgYXBwLmdldCgnbXlQZXQvZmluZE15UGV0cycpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCBjdXJyZW50UGV0ID0gZGF0YS5kYXRhLmNvbnRlbnRbMF1cbiAgICAgICAgaWYgKCFjdXJyZW50UGV0KVxuICAgICAgICAgIGN1cnJlbnRQZXQgPSB7fVxuXG4gICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgcGV0czogZGF0YS5kYXRhLmNvbnRlbnQsXG4gICAgICAgICAgY3VycmVudFBldCxcbiAgICAgICAgfSwgKCkgPT4gdGhpcy5maWx0ZXJQcm9qZWN0KCkpXG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldEFwcG9pbnRtZW50VGltZXM6IGZ1bmN0aW9uIChiZWF1dGljaWFuSWQsIGRheSwgc2hvd0xvYWRpbmcgPSB0cnVlKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gYXBwLmdldCgnYXBwb2ludG1lbnQvZ2V0QXBwb2ludG1lbnRUaW1lLycgKyBiZWF1dGljaWFuSWQgKyAnLycgKyBkYXksICcnLCBzaG93TG9hZGluZylcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgY29udGVudCA9IChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmNvbnRlbnQpIHx8IFtdXG4gICAgICAgICAgLy8gZm9yICh2YXIgaSBpbiBbMCwgMCwgMCwgMF0pXG4gICAgICAgICAgLy8gICBjb250ZW50LnB1c2goe30pXG5cbiAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogY29udGVudFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8vIOWPkemAgemihOe6plxuICAgIGFwcG9pbnRtZW50OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IGZvcm1JZCA9IGV2ZW50LmRldGFpbC5mb3JtSWRcbiAgICAgIGNvbnN0IGNob29zZVByb2plY3RzID0gdGhpcy5kYXRhLmNob29zZVByb2plY3RzXG4gICAgICBpZiAoIWNob29zZVByb2plY3RzLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvYXN0KCfor7fpgInmi6npooTnuqbpobnnm64nKVxuXG4gICAgICBpZiAoIXRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnRUaW1lcy5sZW5ndGgpXG4gICAgICAgIHJldHVybiB0aGlzLl90b2FzdCgn6K+36YCJ5oup6aKE57qm5pe26Ze0JylcbiAgICAgIFxuICAgICAgLy8g6aKE57qm6aG555uuXG4gICAgICBsZXQgcHJvamVjdElkcyA9IGNob29zZVByb2plY3RzLm1hcChpdGVtID0+IGl0ZW0ucHJvamVjdF9pZClcbiAgICAgIHByb2plY3RJZHMgPSBwcm9qZWN0SWRzLmpvaW4oJywnKVxuXG4gICAgICAvLyDpooTnuqZcbiAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICBzaG9wX2lkOiB0aGlzLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCxcbiAgICAgICAgcGV0X2lkOiB0aGlzLmRhdGEuY3VycmVudFBldC5wZXRfaWQsXG4gICAgICAgIGJlYXV0aWNpYW5faWQ6IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLFxuICAgICAgICBwcm9qZWN0X2lkOiBwcm9qZWN0SWRzLFxuICAgICAgICBhcHBvaW50bWVudF9kYXk6IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5LFxuICAgICAgICBhcHBvaW50bWVudF90aW1lOiB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50VGltZXMuam9pbignLCcpLFxuICAgICAgICBmcm9tOiAneGN4JyxcbiAgICAgICAgZm9ybUlkOiBmb3JtSWQsXG4gICAgICB9XG4gICAgICBhcHAucG9zdCgnY2FydC9hcHBvaW50bWVudCcsIGRhdGEpXG4gICAgICAgIC50aGVuKCgpID0+ICAge1xuICAgICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbmiJDlip8hJylcblxuICAgICAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhkYXRhLmJlYXV0aWNpYW5faWQsIGRhdGEuYXBwb2ludG1lbnRfZGF5KVxuICAgICAgICAgIFxuICAgICAgICAgIHNldFRpbWVvdXQoeCA9PiAge1xuICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvcGF5L2luZGV4J1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9LCAxMDAwKVxuXG4gICAgICAgICAgLy8g6YCa55+lXG4gICAgICAgICAgLy8gYXBwLmFza05vdGljZSgpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgdGhpcy5fdG9hc3QoZXJyb3IuZGV0YWlsIHx8ICfpooTnuqblpLHotKUhJylcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgYWRkUGV0KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogJy9wYWdlcy9wZXQvaW5kZXgnXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG5cbiAgICBcbiAgICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpXG4gICAgICAgICAgICBkYXRhID0ge31cblxuICAgICAgICAgIGFwcC5nZXQoJ3Nob3AvZ2V0TGlzdCcsIHtsYXRpdHVkZTogZGF0YS5sYXRpdHVkZSB8fCAnJywgbG9uZ2l0dWRlOiBkYXRhLmxvbmdpdHVkZSB8fCAnJ30pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gZGF0YS5kYXRhXG4gICAgICAgICAgICBsZXQgY3VycmVudFNob3AgPSByZXN1bHQuY29udGVudFswXSB8fCB7fVxuICAgICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgICAgc2hvcExpc3Q6IHJlc3VsdC5jb250ZW50LFxuICAgICAgICAgICAgICBjcFNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIOWIpOaWrXNob3BfaWTmmK/lkKblrZjlnKhcbiAgICAgICAgICAgIGlmKHNlbGYuZGF0YS5jdXJyZW50U2hvcC5zaG9wX2lkKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRTaG9wID0gc2VsZi5kYXRhLmN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY3VycmVudFNob3BcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY3VycmVudFNob3BcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VsZi5nZXRQZXRzKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTaG9wKVxuICAgICAgICAgICAgICBzZWxmLmdldEJlYXV0aWNpYW5BbmRQcm9qZWN0KGN1cnJlbnRTaG9wLnNob3BfaWQpXG4gICAgICAgICAgfSkuY2F0Y2goZSA9PiBjb25zb2xlLmxvZyhlKSlcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgfSxcbiAgb25Mb2FkKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH0sXG5cbiAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmRhdGEucGV0cy5sZW5ndGgpXG4gICAgICB0aGlzLmdldFBldHMoKVxuICAgICAgXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YVxuICAgIC8vIOWKoOi9vVxuICAgIGlmIChkYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQgJiYgZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KSB7XG4gICAgICB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLCBkYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXkpXG4gICAgfVxuICAgIFxuICB9LFxuXG4gIG9uVGFiSXRlbVRhcDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbml0KClcbiAgfVxuICB9Il19