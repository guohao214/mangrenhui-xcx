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

    var beauticianId = currentBeautician.beautician_id;
    if (this.data.defaultBeautician > 0 && beauticianId != this.data.defaultBeautician) {
      this.setToast('我可以提供服务，但我不是您的专属管家');
    }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyIkcHJvamVjdE1vcmUiLCJkYXRhIiwiY3VycmVudFBldCIsInBldHMiLCJwcm9qZWN0X21vcmUiLCJ0b2FzdFRleHQiLCJzaG93VG9hc3QiLCJzaG9wTGlzdCIsImNwU2hvcExpc3QiLCJzaG93U2hvcExpc3RQb3AiLCJjdXJyZW50U2hvcCIsImJlYXV0aWNpYW5MaXN0IiwiY3VycmVudEJlYXV0aWNpYW4iLCJwcm9qZWN0TGlzdCIsInByb2plY3RMaXN0RmlsdGVyIiwiY3VycmVudFByb2plY3QiLCJjaG9vc2VQcm9qZWN0cyIsImFwcG9pbnRtZW50RGF5TGlzdCIsImN1cnJlbnRBcHBvaW50bWVudERheSIsImFwcG9pbnRtZW50VGltZUxpc3QiLCJjdXJyZW50QXBwb2ludG1lbnRUaW1lcyIsImRlZmF1bHRCZWF1dGljaWFuIiwidG9hc3RNc2ciLCJ0b2FzdFNob3ciLCJvblNoYXJlQXBwTWVzc2FnZSIsInRpdGxlIiwicGF0aCIsImltYWdlVXJsIiwiaGFuZGxlclNlYXJjaCIsImV2ZW50IiwidmFsdWUiLCJkZXRhaWwiLCJmaWx0ZXIiLCJpdGVtIiwic2hvcF9uYW1lIiwibWF0Y2giLCJSZWdFeHAiLCJzZXREYXRhIiwic2hvd1Nob3BMaXN0IiwiY2hvb3NlU2hvcCIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJnZXRCZWF1dGljaWFuQW5kUHJvamVjdCIsInNob3BfaWQiLCJjaG9vc2VQcm9qZWN0IiwiZmluZEluZGV4IiwiY29uc29sZSIsImxvZyIsImFjdGl2ZSIsInNwbGljZSIsInB1c2giLCJjbGVhckFwcG9pbnRtZW50VGltZSIsInRpbWVMaXN0IiwiZm9yRWFjaCIsImNoZWNrZWQiLCJmaWx0ZXJQcm9qZWN0IiwiaGFpciIsInByb2plY3QiLCJwcm9qZWN0X3Byb3BlcnR5IiwibGVuZ3RoIiwiY2hvb3NlUGV0IiwicGV0X2lkIiwic2V0VG9hc3QiLCJtc2ciLCJzZXRUaW1lb3V0IiwiY2hvb3NlQmVhdXRpY2lhbiIsImJlYXV0aWNpYW5faWQiLCJiZWF1dGljaWFuSWQiLCJkYXkiLCJnZXRBcHBvaW50bWVudFRpbWVzIiwiY2hvb3NlRGF5IiwiX3RvYXN0IiwidGV4dCIsInd4IiwiZHVyYXRpb24iLCJpY29uIiwiY2hvb3NlVGltZSIsImV2ZXJ5VGltZSIsInRpbWUiLCJ2YWxpZCIsInByb2plY3RVc2VUaW1lIiwicmVkdWNlIiwiaW5pdCIsInVzZV90aW1lIiwidXNlVGltZU51bSIsIk1hdGgiLCJjZWlsIiwidGltZUxpc3RMZW5ndGgiLCJzdGFydCIsInVzZVRpbWUiLCJzaG9wSWQiLCJhcHAiLCJnZXRBcHAiLCJzZWxmIiwiZ2V0IiwidGhlbiIsImNvbnRlbnQiLCJkYXlzIiwibWFwIiwic3BsaXQiLCJkYXRlIiwid2VlayIsInByb2plY3RzIiwiYmVhdXRpY2lhbnMiLCJwb3AiLCJnZXRQZXRzIiwiY2F0Y2giLCJlIiwiYXBwb2ludG1lbnQiLCJmb3JtSWQiLCJwcm9qZWN0SWRzIiwicHJvamVjdF9pZCIsImpvaW4iLCJhcHBvaW50bWVudF9kYXkiLCJhcHBvaW50bWVudF90aW1lIiwiZnJvbSIsInBvc3QiLCJzd2l0Y2hUYWIiLCJ1cmwiLCJlcnJvciIsImFkZFBldCIsIm5hdmlnYXRlVG8iLCJnZXRMb2NhdGlvbiIsImNvbXBsZXRlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJyZXN1bHQiLCJmYWlsIiwib3BlblNldHRpbmciLCJzdWNjZXNzIiwicmVzIiwib25Mb2FkIiwib25TaG93Iiwib25UYWJJdGVtVGFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU1BLGVBQWUsTUFBckI7O0FBZ0JJQyxRQUFNO0FBQUE7QUFBQTtBQUFBOztBQUNKQyxnQkFBVyxFQURQO0FBRUpDLFVBQU0sRUFGRjtBQUdKQyxrQkFBY0osWUFIVjtBQUlKSyxlQUFXLEVBSlA7QUFLSkMsZUFBVyxLQUxQO0FBTUpDLGNBQVUsRUFOTjtBQU9KQyxnQkFBWSxFQVBSO0FBUUpDLHFCQUFpQixNQVJiO0FBU0pDLGlCQUFhLEVBVFQ7QUFVSkMsb0JBQWdCLEVBVlo7QUFXSkMsdUJBQW1CLEVBWGY7QUFZSkMsaUJBQWEsRUFaVDtBQWFKQyx1QkFBbUIsRUFiZjtBQWNKQyxvQkFBZ0IsRUFkWjtBQWVKQyxvQkFBZ0IsRUFmWixFQWVnQjtBQUNwQkMsd0JBQW9CLEVBaEJoQjtBQWlCSkMsMkJBQXVCLEVBakJuQjtBQWtCSkMseUJBQXFCLEVBbEJqQjtBQW1CSkMsNkJBQXlCLEVBbkJyQixFQW1CeUI7QUFDN0JDLHVCQUFtQixDQXBCZixFQW9Ca0I7QUFDdEJDLGNBQVUsRUFyQk47QUFzQkpDLGVBQVc7QUF0QlAsRzs7QUF5Qk5DLG1CLCtCQUFvQjtBQUNsQixXQUFPO0FBQ0xDLGFBQU8sU0FERjtBQUVMQyxZQUFNLHNCQUZEO0FBR0xDLGdCQUFVO0FBSEwsS0FBUDtBQUtELEc7O0FBQ0RDLGlCQUFlLHVCQUFVQyxLQUFWLEVBQWlCO0FBQzlCLFFBQUlDLFFBQVFELE1BQU1FLE1BQU4sQ0FBYUQsS0FBekI7QUFDQSxRQUFJdkIsV0FBVyxLQUFLTixJQUFMLENBQVVNLFFBQXpCO0FBQ0EsUUFBSUMsYUFBYUQsU0FBU3lCLE1BQVQsQ0FBZ0IsVUFBVUMsSUFBVixFQUFnQjtBQUMvQyxhQUFPQSxLQUFLQyxTQUFMLENBQWVDLEtBQWYsQ0FBcUIsSUFBSUMsTUFBSixDQUFXTixLQUFYLENBQXJCLENBQVA7QUFDRCxLQUZnQixDQUFqQjs7QUFJQSxTQUFLTyxPQUFMLENBQWE7QUFDWDdCLGtCQUFZQTtBQURELEtBQWI7QUFHRCxHOztBQUVEOEIsZ0JBQWMsd0JBQVk7QUFDeEIsU0FBS0QsT0FBTCxDQUFhO0FBQ1g1Qix1QkFBaUI7QUFETixLQUFiO0FBR0QsRzs7QUFFRDhCLGNBQVksb0JBQVVWLEtBQVYsRUFBaUI7QUFDM0IsUUFBSVcsUUFBUVgsTUFBTVksYUFBTixDQUFvQkMsT0FBcEIsQ0FBNEJGLEtBQXhDO0FBQ0EsUUFBSTlCLGNBQWMsS0FBS1QsSUFBTCxDQUFVTSxRQUFWLENBQW1CaUMsS0FBbkIsQ0FBbEI7QUFDQSxTQUFLSCxPQUFMLENBQWE7QUFDWDNCLG1CQUFhQSxXQURGO0FBRVhELHVCQUFpQjtBQUZOLEtBQWI7O0FBS0EsU0FBS2tDLHVCQUFMLENBQTZCakMsWUFBWWtDLE9BQXpDO0FBQ0QsRzs7QUFFRDtBQUNBQyxpQkFBZSx1QkFBVWhCLEtBQVYsRUFBaUI7QUFBQTtBQUFBOztBQUM5QixRQUFJVyxRQUFRWCxNQUFNWSxhQUFOLENBQW9CQyxPQUFwQixDQUE0QkYsS0FBeEM7QUFDQSxRQUFJekIsaUJBQWlCLEtBQUtkLElBQUwsQ0FBVWEsaUJBQVYsQ0FBNEIwQixLQUE1QixDQUFyQjs7QUFFQTtBQUNBLFFBQU14QixpQkFBaUIsS0FBS2YsSUFBTCxDQUFVZSxjQUFqQztBQUNBLFFBQU04QixZQUFZOUIsZUFBZThCLFNBQWYsQ0FBeUI7QUFBQSxhQUFRYixTQUFTbEIsY0FBakI7QUFBQSxLQUF6QixDQUFsQjs7QUFFQWdDLFlBQVFDLEdBQVIsQ0FBWUYsU0FBWjs7QUFFQSxRQUFJQSxhQUFhLENBQWpCLEVBQW9CO0FBQ2xCL0IscUJBQWVrQyxNQUFmLEdBQXdCLEtBQXhCO0FBQ0FqQyxxQkFBZWtDLE1BQWYsQ0FBc0JKLFNBQXRCLEVBQWlDLENBQWpDO0FBQ0QsS0FIRCxNQUdPO0FBQ0wvQixxQkFBZWtDLE1BQWYsR0FBd0IsSUFBeEI7QUFDQWpDLHFCQUFlbUMsSUFBZixDQUFvQnBDLGNBQXBCO0FBQ0Q7O0FBRUQ7QUFDQTs7QUFFQSxTQUFLc0IsT0FBTDtBQUNFdEIsc0JBQWdCQTtBQURsQix3REFFd0J5QixLQUZ4QixRQUVtQ3pCLGNBRm5DLCtDQUdFQyxjQUhGLGNBSUc7QUFBQSxhQUFNK0IsUUFBUUMsR0FBUixDQUFZLE1BQUsvQyxJQUFMLENBQVVlLGNBQXRCLENBQU47QUFBQSxLQUpIOztBQU9BO0FBQ0EsU0FBS29DLG9CQUFMO0FBQ0QsRzs7QUFFREEsc0Isa0NBQXVCO0FBQ3JCLFFBQUlDLFdBQVcsS0FBS3BELElBQUwsQ0FBVWtCLG1CQUF6QjtBQUNBa0MsYUFBU0MsT0FBVCxDQUFpQjtBQUFBLGFBQVFyQixLQUFLc0IsT0FBTCxHQUFlLEtBQXZCO0FBQUEsS0FBakI7QUFDQSxTQUFLbEIsT0FBTCxDQUFhO0FBQ1hqQiwrQkFBeUIsRUFEZDtBQUVYRCwyQkFBcUJrQztBQUZWLEtBQWI7QUFJRCxHO0FBRURHLGUsMkJBQWdCO0FBQ2QsUUFBTXRELGFBQWEsS0FBS0QsSUFBTCxDQUFVQyxVQUE3QjtBQUNBLFFBQU11RCxPQUFPdkQsV0FBV3VELElBQXhCOztBQUVBLFNBQUt4RCxJQUFMLENBQVVZLFdBQVYsQ0FBc0J5QyxPQUF0QixDQUE4QjtBQUFBLGFBQVFyQixLQUFLZ0IsTUFBTCxHQUFjLEtBQXRCO0FBQUEsS0FBOUI7O0FBRUEsUUFBTVMsVUFBVSxLQUFLekQsSUFBTCxDQUFVWSxXQUFWLENBQXNCbUIsTUFBdEIsQ0FBNkI7QUFBQSxhQUFRQyxLQUFLMEIsZ0JBQUwsS0FBMEJGLElBQWxDO0FBQUEsS0FBN0IsQ0FBaEI7O0FBRUEsUUFBSUMsUUFBUUUsTUFBWixFQUFvQjtBQUNsQixVQUFJN0MsaUJBQWlCMkMsUUFBUSxDQUFSLENBQXJCO0FBQ0EzQyxxQkFBZWtDLE1BQWYsR0FBd0IsSUFBeEI7QUFDQyxXQUFLWixPQUFMLENBQWE7QUFDVnRCLHNDQURVO0FBRVZDLHdCQUFnQixDQUFDRCxjQUFEO0FBRk4sT0FBYjtBQUlGLEtBUEQsTUFPTztBQUNMLFdBQUtzQixPQUFMLENBQWE7QUFDWHJCLHdCQUFnQjtBQURMLE9BQWI7QUFHRDs7QUFFRCxTQUFLcUIsT0FBTCxDQUFhO0FBQ1h2Qix5QkFBbUI0QztBQURSLEtBQWI7QUFHRCxHOzs7QUFFREcsYUFBVyxtQkFBVWhDLEtBQVYsRUFBaUI7QUFBQTs7QUFDMUIsUUFBSVcsUUFBUVgsTUFBTVksYUFBTixDQUFvQkMsT0FBcEIsQ0FBNEJGLEtBQXhDO0FBQ0EsUUFBSXRDLGFBQWEsS0FBS0QsSUFBTCxDQUFVRSxJQUFWLENBQWVxQyxLQUFmLENBQWpCO0FBQ0EsUUFBSXRDLFdBQVc0RCxNQUFYLEtBQXNCLEtBQUs3RCxJQUFMLENBQVVDLFVBQVYsQ0FBcUI0RCxNQUEvQyxFQUNFOztBQUVGO0FBQ0EsU0FBS3pCLE9BQUwsQ0FBYTtBQUNYbkMsNEJBRFc7QUFFWGMsc0JBQWdCO0FBRkwsS0FBYixFQUdHO0FBQUEsYUFBTSxPQUFLd0MsYUFBTCxFQUFOO0FBQUEsS0FISDs7QUFLQSxTQUFLSixvQkFBTDtBQUNELEc7O0FBRURXLFUsb0JBQVNDLEcsRUFBSztBQUFBOztBQUNaLFNBQUszQixPQUFMLENBQWE7QUFDVGYsZ0JBQVUwQyxHQUREO0FBRVR6QyxpQkFBVztBQUZGLEtBQWIsRUFHSztBQUFBLGFBQU0wQyxXQUFXLFlBQU07QUFDeEIsZUFBSzVCLE9BQUwsQ0FBYTtBQUNiZixvQkFBVSxFQURHO0FBRWJDLHFCQUFXO0FBRkUsU0FBYjtBQUlELE9BTFEsRUFLTixJQUxNLENBQU47QUFBQSxLQUhMO0FBU0QsRzs7O0FBRUQyQyxvQkFBa0IsMEJBQVVyQyxLQUFWLEVBQWlCO0FBQ2pDLFFBQUlXLFFBQVFYLE1BQU1ZLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCRixLQUF4QztBQUNBLFFBQUk1QixvQkFBb0IsS0FBS1gsSUFBTCxDQUFVVSxjQUFWLENBQXlCNkIsS0FBekIsQ0FBeEI7QUFDQSxRQUFJNUIsa0JBQWtCdUQsYUFBbEIsS0FBb0MsS0FBS2xFLElBQUwsQ0FBVVcsaUJBQVYsQ0FBNEJ1RCxhQUFwRSxFQUNFOztBQUVGLFNBQUs5QixPQUFMLENBQWE7QUFDWHpCLHlCQUFtQkE7QUFEUixLQUFiOztBQUlBLFFBQUl3RCxlQUFleEQsa0JBQWtCdUQsYUFBckM7QUFDQSxRQUFJLEtBQUtsRSxJQUFMLENBQVVvQixpQkFBVixHQUE4QixDQUE5QixJQUFtQytDLGdCQUFnQixLQUFLbkUsSUFBTCxDQUFVb0IsaUJBQWpFLEVBQW9GO0FBQ2xGLFdBQUswQyxRQUFMLENBQWMsb0JBQWQ7QUFDRDs7QUFFRCxRQUFJTSxNQUFNLEtBQUtwRSxJQUFMLENBQVVpQixxQkFBVixDQUFnQ21ELEdBQTFDO0FBQ0EsU0FBS0MsbUJBQUwsQ0FBeUJGLFlBQXpCLEVBQXVDQyxHQUF2QztBQUNELEc7O0FBR0RFLGFBQVcsbUJBQVUxQyxLQUFWLEVBQWlCO0FBQzFCLFFBQUlXLFFBQVFYLE1BQU1ZLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCRixLQUF4QztBQUNBLFFBQUl0Qix3QkFBd0IsS0FBS2pCLElBQUwsQ0FBVWdCLGtCQUFWLENBQTZCdUIsS0FBN0IsQ0FBNUI7O0FBRUEsUUFBSXRCLHNCQUFzQm1ELEdBQXRCLEtBQThCLEtBQUtwRSxJQUFMLENBQVVpQixxQkFBVixDQUFnQ21ELEdBQWxFLEVBQ0U7O0FBRUYsU0FBS2hDLE9BQUwsQ0FBYTtBQUNYbkIsNkJBQXVCQTtBQURaLEtBQWI7O0FBSUEsUUFBSWtELGVBQWUsS0FBS25FLElBQUwsQ0FBVVcsaUJBQVYsQ0FBNEJ1RCxhQUEvQztBQUNBLFFBQUlFLE1BQU1uRCxzQkFBc0JtRCxHQUFoQztBQUNBLFNBQUtDLG1CQUFMLENBQXlCRixZQUF6QixFQUF1Q0MsR0FBdkM7QUFDRCxHOztBQUVERyxRLGtCQUFPQyxJLEVBQU07QUFDWEMsT0FBR3BFLFNBQUgsQ0FBYTtBQUNYbUIsYUFBT2dELElBREk7QUFFWEUsZ0JBQVUsSUFGQztBQUdYQyxZQUFNO0FBSEssS0FBYjtBQUtELEc7OztBQUVEQyxjQUFZLG9CQUFVaEQsS0FBVixFQUFpQjtBQUMzQixRQUFJaUQsWUFBWSxFQUFoQjtBQUNBLFFBQUl0QyxRQUFRWCxNQUFNWSxhQUFOLENBQW9CQyxPQUFwQixDQUE0QkYsS0FBeEM7QUFDQSxRQUFJdUMsT0FBTyxLQUFLOUUsSUFBTCxDQUFVa0IsbUJBQVYsQ0FBOEJxQixLQUE5QixDQUFYO0FBQ0EsUUFBSSxDQUFDdUMsS0FBS0MsS0FBVixFQUNFLE9BQU8sS0FBUDs7QUFFRixRQUFJM0IsV0FBVyxLQUFLcEQsSUFBTCxDQUFVa0IsbUJBQXpCO0FBQ0FrQyxhQUFTQyxPQUFULENBQWlCO0FBQUEsYUFBUXJCLEtBQUtzQixPQUFMLEdBQWUsS0FBdkI7QUFBQSxLQUFqQjs7QUFFQSxRQUFNdkMsaUJBQWlCLEtBQUtmLElBQUwsQ0FBVWUsY0FBakM7QUFDQSxRQUFJLENBQUNBLGVBQWU0QyxNQUFwQixFQUNFLE9BQU8sS0FBS1ksTUFBTCxDQUFZLFNBQVosQ0FBUDs7QUFFRixRQUFNUyxpQkFBaUJqRSxlQUFla0UsTUFBZixDQUFzQixVQUFDQyxJQUFELEVBQU9sRCxJQUFQO0FBQUEsYUFBZ0JBLEtBQUttRCxRQUFMLEdBQWdCLENBQWhCLEdBQW9CRCxJQUFwQztBQUFBLEtBQXRCLEVBQWdFLENBQWhFLENBQXZCOztBQUVBLFFBQUlFLGFBQWFDLEtBQUtDLElBQUwsQ0FBVU4saUJBQWlCSCxTQUEzQixDQUFqQjtBQUNBLFFBQUlVLGlCQUFpQixLQUFLdkYsSUFBTCxDQUFVa0IsbUJBQVYsQ0FBOEJ5QyxNQUFuRDtBQUNBLFFBQUlwQixRQUFRNkMsVUFBUixHQUFxQkcsY0FBekIsRUFBeUM7QUFDdkMsV0FBS25ELE9BQUwsQ0FBYTtBQUNYakIsaUNBQXlCLEVBRGQ7QUFFWEQsNkJBQXFCa0M7QUFGVixPQUFiOztBQUtBLFdBQUttQixNQUFMLENBQVksZUFBWjs7QUFFQTtBQUNEO0FBQ0QsUUFBSWlCLFFBQVEsQ0FBWjtBQUNBLFFBQUlDLFVBQVUsRUFBZDtBQUNBLFdBQU9ELFFBQVFKLFVBQWYsRUFBMkI7QUFDekIsVUFBSXBELE9BQU9vQixTQUFTYixRQUFRaUQsT0FBakIsQ0FBWDtBQUNBLFVBQUcsQ0FBQ3hELEtBQUsrQyxLQUFULEVBQWdCO0FBQ2QzQixpQkFBU0MsT0FBVCxDQUFpQjtBQUFBLGlCQUFRckIsS0FBS3NCLE9BQUwsR0FBZSxLQUF2QjtBQUFBLFNBQWpCO0FBQ0FtQyxrQkFBVSxFQUFWO0FBQ0EsYUFBS3JELE9BQUwsQ0FBYTtBQUNYakIsbUNBQXlCc0UsT0FEZDtBQUVYdkUsK0JBQXFCa0M7QUFGVixTQUFiO0FBSUEsYUFBS21CLE1BQUwsQ0FBWSxRQUFaO0FBQ0E7QUFDRDtBQUNEdkMsV0FBS3NCLE9BQUwsR0FBZSxJQUFmO0FBQ0FtQyxjQUFRdkMsSUFBUixDQUFhbEIsS0FBSzhDLElBQWxCO0FBQ0Q7O0FBRUQsU0FBSzFDLE9BQUwsQ0FBYTtBQUNYakIsK0JBQXlCc0UsT0FEZDtBQUVYdkUsMkJBQXFCa0M7QUFGVixLQUFiO0FBS0QsRzs7QUFFRFYsMkJBQXlCLGlDQUFVZ0QsTUFBVixFQUFrQjtBQUN6QyxRQUFJQyxNQUFNQyxRQUFWO0FBQ0EsUUFBSUMsT0FBTyxJQUFYO0FBQ0FGLFFBQUlHLEdBQUosMENBQStDSixNQUEvQyxFQUF5REssSUFBekQsQ0FBOEQsZ0JBQVE7QUFDcEUsVUFBSUMsVUFBV2hHLEtBQUtBLElBQUwsSUFBYUEsS0FBS0EsSUFBTCxDQUFVZ0csT0FBeEIsSUFBb0MsRUFBbEQ7O0FBRUFBLGNBQVFDLElBQVIsR0FBZUQsUUFBUUMsSUFBUixDQUFhQyxHQUFiLENBQWlCLGdCQUFRO0FBQ3RDLFlBQUk5QixNQUFNcEMsS0FBS21FLEtBQUwsQ0FBVyxHQUFYLENBQVY7QUFDQSxlQUFPO0FBQ0xDLGdCQUFNaEMsSUFBSSxDQUFKLENBREQ7QUFFTGlDLGdCQUFNakMsSUFBSSxDQUFKLENBRkQ7QUFHTEEsZUFBS0EsSUFBSSxDQUFKO0FBSEEsU0FBUDtBQUtELE9BUGMsQ0FBZjs7QUFTQTRCLGNBQVFNLFFBQVIsR0FBbUJOLFFBQVFNLFFBQVIsSUFBb0IsRUFBdkM7QUFDQU4sY0FBUU0sUUFBUixDQUFpQmpELE9BQWpCLENBQXlCO0FBQUEsZUFBUXJCLEtBQUtnQixNQUFMLEdBQWMsS0FBdEI7QUFBQSxPQUF6Qjs7QUFFQTtBQUNBLFVBQUlsQyxpQkFBaUJrRixRQUFRTSxRQUFSLENBQWlCLENBQWpCLEtBQXVCLEVBQTVDO0FBQ0F4RixxQkFBZWtDLE1BQWYsR0FBd0IsSUFBeEI7O0FBRUEsVUFBSXJDLG9CQUFvQnFGLFFBQVFPLFdBQVIsQ0FBb0IsQ0FBcEIsS0FBMEIsRUFBbEQ7O0FBRUEsVUFBSW5GLG9CQUFvQixDQUFDNEUsUUFBUTVFLGlCQUFSLElBQTZCLENBQTlCLElBQW1DLENBQTNEO0FBQ0EsVUFBSUEsb0JBQW9CLENBQXhCLEVBQTJCO0FBQ3pCVCw0QkFBb0JxRixRQUFRTyxXQUFSLENBQW9CeEUsTUFBcEIsQ0FBMkI7QUFBQSxpQkFBUUMsS0FBS2tDLGFBQUwsSUFBc0I5QyxpQkFBOUI7QUFBQSxTQUEzQixFQUE0RW9GLEdBQTVFLEVBQXBCO0FBQ0Q7O0FBRUQsVUFBSXZGLHdCQUF3QitFLFFBQVFDLElBQVIsQ0FBYSxDQUFiLEtBQW1CLEVBQS9DOztBQUVBSixXQUFLekQsT0FBTCxDQUFhO0FBQ1gxQix3QkFBZ0JzRixRQUFRTyxXQURiO0FBRVgzRixxQkFBYW9GLFFBQVFNLFFBRlY7QUFHWG5HLHNCQUFjSixZQUhIO0FBSVhpQiw0QkFBb0JnRixRQUFRQyxJQUpqQjtBQUtYbkYsc0NBTFc7QUFNWEMsd0JBQWdCLENBQUNELGNBQUQsQ0FOTDtBQU9YSCw0Q0FQVztBQVFYTSxvREFSVztBQVNYRztBQVRXLE9BQWI7O0FBWUF5RSxXQUFLWSxPQUFMOztBQUVBWixXQUFLeEIsbUJBQUwsQ0FBeUIxRCxrQkFBa0J1RCxhQUEzQyxFQUEwRGpELHNCQUFzQm1ELEdBQWhGO0FBQ0QsS0EzQ0QsRUEyQ0dzQyxLQTNDSCxDQTJDUyxhQUFLO0FBQ1o1RCxjQUFRQyxHQUFSLENBQVk0RCxDQUFaO0FBQ0QsS0E3Q0Q7QUErQ0QsRzs7QUFFREYsUyxxQkFBVTtBQUFBOztBQUNSLFFBQUlkLE1BQU1DLFFBQVY7QUFDQSxRQUFJQyxPQUFPLElBQVg7O0FBRUFGLFFBQUlHLEdBQUosQ0FBUSxrQkFBUixFQUE0QkMsSUFBNUIsQ0FBaUMsZ0JBQVE7QUFDdkMsVUFBSTlGLGFBQWFELEtBQUtBLElBQUwsQ0FBVWdHLE9BQVYsQ0FBa0IsQ0FBbEIsQ0FBakI7QUFDQSxVQUFJLENBQUMvRixVQUFMLEVBQ0VBLGFBQWEsRUFBYjs7QUFFRjRGLFdBQUt6RCxPQUFMLENBQWE7QUFDWGxDLGNBQU1GLEtBQUtBLElBQUwsQ0FBVWdHLE9BREw7QUFFWC9GO0FBRlcsT0FBYixFQUdHO0FBQUEsZUFBTSxPQUFLc0QsYUFBTCxFQUFOO0FBQUEsT0FISDtBQUlELEtBVEQ7QUFXRCxHOzs7QUFFRGMsdUJBQXFCLDZCQUFVRixZQUFWLEVBQXdCQyxHQUF4QixFQUE2QjtBQUNoRCxRQUFJdUIsTUFBTUMsUUFBVjtBQUNBLFFBQUlDLE9BQU8sSUFBWDtBQUNBLFNBQUt6RCxPQUFMLENBQWE7QUFDWGpCLCtCQUF5QjtBQURkLEtBQWI7O0FBSUEsV0FBT3dFLElBQUlHLEdBQUosQ0FBUSxvQ0FBb0MzQixZQUFwQyxHQUFtRCxHQUFuRCxHQUF5REMsR0FBakUsRUFDSjJCLElBREksQ0FDQyxVQUFDL0YsSUFBRCxFQUFVO0FBQ2QsVUFBSWdHLFVBQVdoRyxLQUFLQSxJQUFMLElBQWFBLEtBQUtBLElBQUwsQ0FBVWdHLE9BQXhCLElBQW9DLEVBQWxEO0FBQ0E7QUFDQTs7QUFFQUgsV0FBS3pELE9BQUwsQ0FBYTtBQUNYbEIsNkJBQXFCOEU7QUFEVixPQUFiO0FBR0QsS0FUSSxDQUFQO0FBVUQsRzs7QUFFRDtBQUNBWSxlQUFhLHFCQUFVaEYsS0FBVixFQUFpQjtBQUFBOztBQUM1QixRQUFJK0QsTUFBTUMsUUFBVjtBQUNBLFFBQUlpQixTQUFTakYsTUFBTUUsTUFBTixDQUFhK0UsTUFBMUI7QUFDQSxRQUFNOUYsaUJBQWlCLEtBQUtmLElBQUwsQ0FBVWUsY0FBakM7QUFDQSxRQUFJLENBQUNBLGVBQWU0QyxNQUFwQixFQUNFLE9BQU8sS0FBS1ksTUFBTCxDQUFZLFNBQVosQ0FBUDs7QUFFRixRQUFJLENBQUMsS0FBS3ZFLElBQUwsQ0FBVW1CLHVCQUFWLENBQWtDd0MsTUFBdkMsRUFDRSxPQUFPLEtBQUtZLE1BQUwsQ0FBWSxTQUFaLENBQVA7O0FBRUY7QUFDQSxRQUFJdUMsYUFBYS9GLGVBQWVtRixHQUFmLENBQW1CO0FBQUEsYUFBUWxFLEtBQUsrRSxVQUFiO0FBQUEsS0FBbkIsQ0FBakI7QUFDQUQsaUJBQWFBLFdBQVdFLElBQVgsQ0FBZ0IsR0FBaEIsQ0FBYjs7QUFFQTtBQUNBLFFBQUloSCxPQUFPO0FBQ1QyQyxlQUFTLEtBQUszQyxJQUFMLENBQVVTLFdBQVYsQ0FBc0JrQyxPQUR0QjtBQUVUa0IsY0FBUSxLQUFLN0QsSUFBTCxDQUFVQyxVQUFWLENBQXFCNEQsTUFGcEI7QUFHVEsscUJBQWUsS0FBS2xFLElBQUwsQ0FBVVcsaUJBQVYsQ0FBNEJ1RCxhQUhsQztBQUlUNkMsa0JBQVlELFVBSkg7QUFLVEcsdUJBQWlCLEtBQUtqSCxJQUFMLENBQVVpQixxQkFBVixDQUFnQ21ELEdBTHhDO0FBTVQ4Qyx3QkFBa0IsS0FBS2xILElBQUwsQ0FBVW1CLHVCQUFWLENBQWtDNkYsSUFBbEMsQ0FBdUMsR0FBdkMsQ0FOVDtBQU9URyxZQUFNLEtBUEc7QUFRVE4sY0FBUUE7QUFSQyxLQUFYO0FBVUFsQixRQUFJeUIsSUFBSixDQUFTLGtCQUFULEVBQTZCcEgsSUFBN0IsRUFDRytGLElBREgsQ0FDUSxZQUFRO0FBQ1osYUFBS3hCLE1BQUwsQ0FBWSxPQUFaOztBQUVBLGFBQUtGLG1CQUFMLENBQXlCckUsS0FBS2tFLGFBQTlCLEVBQTZDbEUsS0FBS2lILGVBQWxEOztBQUVBakQsaUJBQVcsYUFBTTtBQUNmUyxXQUFHNEMsU0FBSCxDQUFhO0FBQ1RDLGVBQUs7QUFESSxTQUFiO0FBSUMsT0FMSCxFQUtLLElBTEw7O0FBT0E7QUFDQTtBQUNELEtBZkgsRUFnQkdaLEtBaEJILENBZ0JTLGlCQUFTO0FBQ2QsYUFBS25DLE1BQUwsQ0FBWWdELE1BQU16RixNQUFOLElBQWdCLE9BQTVCO0FBQ0QsS0FsQkg7QUFtQkQsRzs7QUFFRDBGLFEsb0JBQVM7QUFDUC9DLE9BQUdnRCxVQUFILENBQWM7QUFDWkgsV0FBSztBQURPLEtBQWQ7QUFHRCxHOzs7QUFFRHBDLFFBQU0sZ0JBQVc7QUFDZixRQUFJUyxNQUFNQyxRQUFWO0FBQ0EsUUFBSUMsT0FBTyxJQUFYOztBQUdBcEIsT0FBR2lELFdBQUgsQ0FBZTtBQUNiQyxnQkFBVSxrQkFBVTNILElBQVYsRUFBZ0I7QUFDeEIsWUFBSTRILE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQi9ILElBQS9CLE1BQXlDLGlCQUE3QyxFQUNFQSxPQUFPLEVBQVA7O0FBRUYyRixZQUFJRyxHQUFKLENBQVEsY0FBUixFQUF3QixFQUFDa0MsVUFBVWhJLEtBQUtnSSxRQUFMLElBQWlCLEVBQTVCLEVBQWdDQyxXQUFXakksS0FBS2lJLFNBQUwsSUFBa0IsRUFBN0QsRUFBeEIsRUFBMEZsQyxJQUExRixDQUErRixnQkFBUTtBQUNyRyxjQUFJbUMsU0FBU2xJLEtBQUtBLElBQWxCO0FBQ0EsY0FBSVMsY0FBY3lILE9BQU9sQyxPQUFQLENBQWUsQ0FBZixLQUFxQixFQUF2QztBQUNBSCxlQUFLekQsT0FBTCxDQUFhO0FBQ1g5QixzQkFBVTRILE9BQU9sQyxPQUROO0FBRVh6Rix3QkFBWTJILE9BQU9sQztBQUZSLFdBQWI7O0FBS0E7QUFDQSxjQUFHSCxLQUFLN0YsSUFBTCxDQUFVUyxXQUFWLENBQXNCa0MsT0FBekIsRUFBa0M7QUFDaENsQywwQkFBY29GLEtBQUs3RixJQUFMLENBQVVTLFdBQXhCO0FBQ0FvRixpQkFBS3pELE9BQUwsQ0FBYTtBQUNYM0I7QUFEVyxhQUFiO0FBR0QsV0FMRCxNQUtPO0FBQ0xvRixpQkFBS3pELE9BQUwsQ0FBYTtBQUNYM0I7QUFEVyxhQUFiO0FBR0Q7O0FBRUQ7O0FBRUEsY0FBSUEsV0FBSixFQUNFb0YsS0FBS25ELHVCQUFMLENBQTZCakMsWUFBWWtDLE9BQXpDO0FBQ0gsU0F4QkQsRUF3QkcrRCxLQXhCSCxDQXdCUztBQUFBLGlCQUFLNUQsUUFBUUMsR0FBUixDQUFZNEQsQ0FBWixDQUFMO0FBQUEsU0F4QlQ7QUF5QkQsT0E5Qlk7QUErQmJ3QixZQUFNLGdCQUFZO0FBQ2hCMUQsV0FBRzJELFdBQUgsQ0FBZTtBQUNiQyxtQkFBUyxpQkFBVUMsR0FBVixFQUFlLENBQ3ZCLENBRlk7QUFHYkgsZ0JBQU0sZ0JBQVksQ0FDakI7QUFKWSxTQUFmO0FBTUQ7QUF0Q1ksS0FBZjtBQXdDSCxHO0FBQ0RJLFEsb0JBQVM7QUFDUCxTQUFLckQsSUFBTDtBQUNELEc7OztBQUVEc0QsVUFBUSxrQkFBWTtBQUNsQixRQUFJLENBQUMsS0FBS3hJLElBQUwsQ0FBVUUsSUFBVixDQUFleUQsTUFBcEIsRUFDRSxLQUFLOEMsT0FBTDs7QUFFRixRQUFNekcsT0FBTyxLQUFLQSxJQUFsQjtBQUNBO0FBQ0EsUUFBSUEsS0FBS1csaUJBQUwsQ0FBdUJ1RCxhQUF2QixJQUF3Q2xFLEtBQUtpQixxQkFBTCxDQUEyQm1ELEdBQXZFLEVBQTRFO0FBQzFFLFdBQUtDLG1CQUFMLENBQXlCckUsS0FBS1csaUJBQUwsQ0FBdUJ1RCxhQUFoRCxFQUErRGxFLEtBQUtpQixxQkFBTCxDQUEyQm1ELEdBQTFGO0FBQ0Q7QUFFRixHOztBQUVEcUUsZ0JBQWMsd0JBQVc7QUFDdkIsU0FBS3ZELElBQUw7QUFDRCIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCAkcHJvamVjdE1vcmUgPSAn6YCJ5oup6aG555uuJ1xuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6aKE57qmJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjRThFOEU4JyxcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaycsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1mbGV4JzogJ0BtaW51aS93eGMtZmxleCcsXG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICAgICd3eGMtbWFzayc6ICdAbWludWkvd3hjLW1hc2snLFxuICAgICAgICAnd3hjLXBvcHVwJzogJ0BtaW51aS93eGMtcG9wdXAnLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgICAgJ3d4Yy10b2FzdCc6ICdAbWludWkvd3hjLXRvYXN0JyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIGN1cnJlbnRQZXQ6e30sXG4gICAgICBwZXRzOiBbXSxcbiAgICAgIHByb2plY3RfbW9yZTogJHByb2plY3RNb3JlLFxuICAgICAgdG9hc3RUZXh0OiAnJyxcbiAgICAgIHNob3dUb2FzdDogZmFsc2UsXG4gICAgICBzaG9wTGlzdDogW10sXG4gICAgICBjcFNob3BMaXN0OiBbXSxcbiAgICAgIHNob3dTaG9wTGlzdFBvcDogJ2hpZGUnLFxuICAgICAgY3VycmVudFNob3A6IHt9LFxuICAgICAgYmVhdXRpY2lhbkxpc3Q6IFtdLFxuICAgICAgY3VycmVudEJlYXV0aWNpYW46IHt9LFxuICAgICAgcHJvamVjdExpc3Q6IFtdLFxuICAgICAgcHJvamVjdExpc3RGaWx0ZXI6IFtdLFxuICAgICAgY3VycmVudFByb2plY3Q6IHt9LFxuICAgICAgY2hvb3NlUHJvamVjdHM6IFtdLCAvLyDlt7Lnu4/pgInmi6nnmoTpobnnm65cbiAgICAgIGFwcG9pbnRtZW50RGF5TGlzdDogW10sXG4gICAgICBjdXJyZW50QXBwb2ludG1lbnREYXk6ICcnLFxuICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogW10sXG4gICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sIC8vIOmihOe6pueahOaXtumXtFxuICAgICAgZGVmYXVsdEJlYXV0aWNpYW46IDAsIC8vIOm7mOiupOeuoeWutlxuICAgICAgdG9hc3RNc2c6ICcnLFxuICAgICAgdG9hc3RTaG93OiBmYWxzZSxcbiAgICB9LFxuXG4gICAgb25TaGFyZUFwcE1lc3NhZ2UoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogJ0NBVOeMq+eahOS4lueVjCcsXG4gICAgICAgIHBhdGg6ICcvcGFnZXMvYXJ0aWNsZS9pbmRleCcsXG4gICAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9hcGkubWRzaGlqaWUuY29tL3N0YXRpYy9zaGFyZS5wbmcnXG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVyU2VhcmNoOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCB2YWx1ZSA9IGV2ZW50LmRldGFpbC52YWx1ZVxuICAgICAgbGV0IHNob3BMaXN0ID0gdGhpcy5kYXRhLnNob3BMaXN0XG4gICAgICBsZXQgY3BTaG9wTGlzdCA9IHNob3BMaXN0LmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5zaG9wX25hbWUubWF0Y2gobmV3IFJlZ0V4cCh2YWx1ZSkpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjcFNob3BMaXN0OiBjcFNob3BMaXN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBzaG93U2hvcExpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHNob3dTaG9wTGlzdFBvcDogJ3Nob3cnXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjaG9vc2VTaG9wOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRTaG9wID0gdGhpcy5kYXRhLnNob3BMaXN0W2luZGV4XVxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudFNob3A6IGN1cnJlbnRTaG9wLFxuICAgICAgICBzaG93U2hvcExpc3RQb3A6ICdoaWRlJyxcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZ2V0QmVhdXRpY2lhbkFuZFByb2plY3QoY3VycmVudFNob3Auc2hvcF9pZClcbiAgICB9LFxuXG4gICAgLy8g6YCJ5oup6aG555uuXG4gICAgY2hvb3NlUHJvamVjdDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50UHJvamVjdCA9IHRoaXMuZGF0YS5wcm9qZWN0TGlzdEZpbHRlcltpbmRleF1cblxuICAgICAgLy8g5Yik5pat5piv5ZCm5bey57uP6YCJ5oup5LqG6aG555uuXG4gICAgICBjb25zdCBjaG9vc2VQcm9qZWN0cyA9IHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0c1xuICAgICAgY29uc3QgZmluZEluZGV4ID0gY2hvb3NlUHJvamVjdHMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbSA9PT0gY3VycmVudFByb2plY3QpXG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKGZpbmRJbmRleClcblxuICAgICAgaWYgKGZpbmRJbmRleCA+PSAwKSB7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIGNob29zZVByb2plY3RzLnNwbGljZShmaW5kSW5kZXgsIDEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50UHJvamVjdC5hY3RpdmUgPSB0cnVlXG4gICAgICAgIGNob29zZVByb2plY3RzLnB1c2goY3VycmVudFByb2plY3QpXG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnN0IHByb2plY3RMaXN0ID0gdGhpcy5kYXRhLnByb2plY3RMaXN0XG4gICAgICAvLyBwcm9qZWN0TGlzdFtpbmRleF0gPSBjdXJyZW50UHJvamVjdFxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50UHJvamVjdDogY3VycmVudFByb2plY3QsXG4gICAgICAgIFtgcHJvamVjdExpc3RGaWx0ZXJbJHtpbmRleH1dYF06IGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICBjaG9vc2VQcm9qZWN0c1xuICAgICAgfSwgKCkgPT4gY29uc29sZS5sb2codGhpcy5kYXRhLmNob29zZVByb2plY3RzKSlcblxuXG4gICAgICAvLyDpooTnuqbml7bpl7RcbiAgICAgIHRoaXMuY2xlYXJBcHBvaW50bWVudFRpbWUoKVxuICAgIH0sXG4gICAgXG4gICAgY2xlYXJBcHBvaW50bWVudFRpbWUoKSB7XG4gICAgICBsZXQgdGltZUxpc3QgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFxuICAgICAgdGltZUxpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2hlY2tlZCA9IGZhbHNlKVxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdLFxuICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdFxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZmlsdGVyUHJvamVjdCgpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRQZXQgPSB0aGlzLmRhdGEuY3VycmVudFBldFxuICAgICAgY29uc3QgaGFpciA9IGN1cnJlbnRQZXQuaGFpclxuXG4gICAgICB0aGlzLmRhdGEucHJvamVjdExpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uYWN0aXZlID0gZmFsc2UpXG5cbiAgICAgIGNvbnN0IHByb2plY3QgPSB0aGlzLmRhdGEucHJvamVjdExpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5wcm9qZWN0X3Byb3BlcnR5ID09PSBoYWlyKVxuXG4gICAgICBpZiAocHJvamVjdC5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdFswXVxuICAgICAgICBjdXJyZW50UHJvamVjdC5hY3RpdmUgPSB0cnVlXG4gICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgY3VycmVudFByb2plY3QsXG4gICAgICAgICAgICBjaG9vc2VQcm9qZWN0czogW2N1cnJlbnRQcm9qZWN0XSxcbiAgICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGNob29zZVByb2plY3RzOiBbXVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBwcm9qZWN0TGlzdEZpbHRlcjogcHJvamVjdFxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgY2hvb3NlUGV0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRQZXQgPSB0aGlzLmRhdGEucGV0c1tpbmRleF1cbiAgICAgIGlmIChjdXJyZW50UGV0LnBldF9pZCA9PT0gdGhpcy5kYXRhLmN1cnJlbnRQZXQucGV0X2lkKVxuICAgICAgICByZXR1cm5cblxuICAgICAgLy8g562b6YCJ6aG555uuIHByb2plY3RMaXN0RmlsdGVyXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50UGV0LFxuICAgICAgICBjaG9vc2VQcm9qZWN0czogW10sXG4gICAgICB9LCAoKSA9PiB0aGlzLmZpbHRlclByb2plY3QoKSlcblxuICAgICAgdGhpcy5jbGVhckFwcG9pbnRtZW50VGltZSgpXG4gICAgfSxcblxuICAgIHNldFRvYXN0KG1zZykge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICB0b2FzdE1zZzogbXNnLFxuICAgICAgICAgIHRvYXN0U2hvdzogdHJ1ZSxcbiAgICAgICAgfSwgKCkgPT4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICB0b2FzdE1zZzogJycsXG4gICAgICAgICAgdG9hc3RTaG93OiBmYWxzZSxcbiAgICAgICAgICB9KVxuICAgICAgICB9LCAyMDAwKSlcbiAgICB9LFxuXG4gICAgY2hvb3NlQmVhdXRpY2lhbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IHRoaXMuZGF0YS5iZWF1dGljaWFuTGlzdFtpbmRleF1cbiAgICAgIGlmIChjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkID09PSB0aGlzLmRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRCZWF1dGljaWFuOiBjdXJyZW50QmVhdXRpY2lhbixcbiAgICAgIH0pXG5cbiAgICAgIGxldCBiZWF1dGljaWFuSWQgPSBjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkXG4gICAgICBpZiAodGhpcy5kYXRhLmRlZmF1bHRCZWF1dGljaWFuID4gMCAmJiBiZWF1dGljaWFuSWQgIT0gdGhpcy5kYXRhLmRlZmF1bHRCZWF1dGljaWFuKSB7XG4gICAgICAgIHRoaXMuc2V0VG9hc3QoJ+aIkeWPr+S7peaPkOS+m+acjeWKoe+8jOS9huaIkeS4jeaYr+aCqOeahOS4k+WxnueuoeWuticpXG4gICAgICB9XG5cbiAgICAgIGxldCBkYXkgPSB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheVxuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGJlYXV0aWNpYW5JZCwgZGF5KVxuICAgIH0sXG5cblxuICAgIGNob29zZURheTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50QXBwb2ludG1lbnREYXkgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnREYXlMaXN0W2luZGV4XVxuXG4gICAgICBpZiAoY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSA9PT0gdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnREYXk6IGN1cnJlbnRBcHBvaW50bWVudERheSxcbiAgICAgIH0pXG5cbiAgICAgIGxldCBiZWF1dGljaWFuSWQgPSB0aGlzLmRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZFxuICAgICAgbGV0IGRheSA9IGN1cnJlbnRBcHBvaW50bWVudERheS5kYXlcbiAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhiZWF1dGljaWFuSWQsIGRheSlcbiAgICB9LFxuXG4gICAgX3RvYXN0KHRleHQpIHtcbiAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgIHRpdGxlOiB0ZXh0LFxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjaG9vc2VUaW1lOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBldmVyeVRpbWUgPSAzMFxuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgdGltZSA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0W2luZGV4XVxuICAgICAgaWYgKCF0aW1lLnZhbGlkKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgbGV0IHRpbWVMaXN0ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3RcbiAgICAgIHRpbWVMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcblxuICAgICAgY29uc3QgY2hvb3NlUHJvamVjdHMgPSB0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHNcbiAgICAgIGlmICghY2hvb3NlUHJvamVjdHMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9hc3QoJ+ivt+mAieaLqemihOe6pumhueebricpXG5cbiAgICAgIGNvbnN0IHByb2plY3RVc2VUaW1lID0gY2hvb3NlUHJvamVjdHMucmVkdWNlKChpbml0LCBpdGVtKSA9PiBpdGVtLnVzZV90aW1lIC8gMSArIGluaXQsIDApXG5cbiAgICAgIGxldCB1c2VUaW1lTnVtID0gTWF0aC5jZWlsKHByb2plY3RVc2VUaW1lIC8gZXZlcnlUaW1lKVxuICAgICAgbGV0IHRpbWVMaXN0TGVuZ3RoID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3QubGVuZ3RoXG4gICAgICBpZiAoaW5kZXggKyB1c2VUaW1lTnVtID4gdGltZUxpc3RMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sXG4gICAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3QsXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5fdG9hc3QoJ+mihOe6puaXtumXtOS4jei2syzor7fph43mlrDpgInmi6kuJylcblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGxldCBzdGFydCA9IDBcbiAgICAgIGxldCB1c2VUaW1lID0gW11cbiAgICAgIHdoaWxlIChzdGFydCA8IHVzZVRpbWVOdW0pIHtcbiAgICAgICAgbGV0IGl0ZW0gPSB0aW1lTGlzdFtpbmRleCArIHN0YXJ0KytdXG4gICAgICAgIGlmKCFpdGVtLnZhbGlkKSB7XG4gICAgICAgICAgdGltZUxpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2hlY2tlZCA9IGZhbHNlKVxuICAgICAgICAgIHVzZVRpbWUgPSBbXVxuICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogdXNlVGltZSxcbiAgICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0LFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fdG9hc3QoJ+mihOe6puaXtumXtOS4jei2sycpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbS5jaGVja2VkID0gdHJ1ZVxuICAgICAgICB1c2VUaW1lLnB1c2goaXRlbS50aW1lKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogdXNlVGltZSxcbiAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3RcbiAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgZ2V0QmVhdXRpY2lhbkFuZFByb2plY3Q6IGZ1bmN0aW9uIChzaG9wSWQpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICBhcHAuZ2V0KGBhcHBvaW50bWVudC9nZXRCZWF1dGljaWFuQW5kUHJvamVjdC8ke3Nob3BJZH1gKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgY29udGVudCA9IChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmNvbnRlbnQpIHx8IHt9XG5cbiAgICAgICAgY29udGVudC5kYXlzID0gY29udGVudC5kYXlzLm1hcChpdGVtID0+IHtcbiAgICAgICAgICBsZXQgZGF5ID0gaXRlbS5zcGxpdCgnIycpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGU6IGRheVswXSxcbiAgICAgICAgICAgIHdlZWs6IGRheVsxXSxcbiAgICAgICAgICAgIGRheTogZGF5WzJdXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnRlbnQucHJvamVjdHMgPSBjb250ZW50LnByb2plY3RzIHx8IFtdXG4gICAgICAgIGNvbnRlbnQucHJvamVjdHMuZm9yRWFjaChpdGVtID0+IGl0ZW0uYWN0aXZlID0gZmFsc2UpXG5cbiAgICAgICAgLy8g6buY6K6k6YCJ5oup55qE6aG555uuXG4gICAgICAgIGxldCBjdXJyZW50UHJvamVjdCA9IGNvbnRlbnQucHJvamVjdHNbMF0gfHwge31cbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gdHJ1ZVxuXG4gICAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IGNvbnRlbnQuYmVhdXRpY2lhbnNbMF0gfHwge31cbiAgICAgICAgXG4gICAgICAgIGxldCBkZWZhdWx0QmVhdXRpY2lhbiA9IChjb250ZW50LmRlZmF1bHRCZWF1dGljaWFuIHx8IDApIC8gMVxuICAgICAgICBpZiAoZGVmYXVsdEJlYXV0aWNpYW4gPiAwKSB7XG4gICAgICAgICAgY3VycmVudEJlYXV0aWNpYW4gPSBjb250ZW50LmJlYXV0aWNpYW5zLmZpbHRlcihpdGVtID0+IGl0ZW0uYmVhdXRpY2lhbl9pZCA9PSBkZWZhdWx0QmVhdXRpY2lhbikucG9wKClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJyZW50QXBwb2ludG1lbnREYXkgPSBjb250ZW50LmRheXNbMF0gfHwge31cblxuICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgIGJlYXV0aWNpYW5MaXN0OiBjb250ZW50LmJlYXV0aWNpYW5zLFxuICAgICAgICAgIHByb2plY3RMaXN0OiBjb250ZW50LnByb2plY3RzLFxuICAgICAgICAgIHByb2plY3RfbW9yZTogJHByb2plY3RNb3JlLFxuICAgICAgICAgIGFwcG9pbnRtZW50RGF5TGlzdDogY29udGVudC5kYXlzLFxuICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgIGNob29zZVByb2plY3RzOiBbY3VycmVudFByb2plY3RdLFxuICAgICAgICAgIGN1cnJlbnRCZWF1dGljaWFuLFxuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheSxcbiAgICAgICAgICBkZWZhdWx0QmVhdXRpY2lhbixcbiAgICAgICAgfSlcblxuICAgICAgICBzZWxmLmdldFBldHMoKVxuXG4gICAgICAgIHNlbGYuZ2V0QXBwb2ludG1lbnRUaW1lcyhjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLCBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldFBldHMoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgICBhcHAuZ2V0KCdteVBldC9maW5kTXlQZXRzJykudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRQZXQgPSBkYXRhLmRhdGEuY29udGVudFswXVxuICAgICAgICBpZiAoIWN1cnJlbnRQZXQpXG4gICAgICAgICAgY3VycmVudFBldCA9IHt9XG5cbiAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICBwZXRzOiBkYXRhLmRhdGEuY29udGVudCxcbiAgICAgICAgICBjdXJyZW50UGV0LFxuICAgICAgICB9LCAoKSA9PiB0aGlzLmZpbHRlclByb2plY3QoKSlcbiAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgZ2V0QXBwb2ludG1lbnRUaW1lczogZnVuY3Rpb24gKGJlYXV0aWNpYW5JZCwgZGF5KSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gYXBwLmdldCgnYXBwb2ludG1lbnQvZ2V0QXBwb2ludG1lbnRUaW1lLycgKyBiZWF1dGljaWFuSWQgKyAnLycgKyBkYXkpXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IGNvbnRlbnQgPSAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5jb250ZW50KSB8fCBbXVxuICAgICAgICAgIC8vIGZvciAodmFyIGkgaW4gWzAsIDAsIDAsIDBdKVxuICAgICAgICAgIC8vICAgY29udGVudC5wdXNoKHt9KVxuXG4gICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IGNvbnRlbnRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvLyDlj5HpgIHpooTnuqZcbiAgICBhcHBvaW50bWVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBmb3JtSWQgPSBldmVudC5kZXRhaWwuZm9ybUlkXG4gICAgICBjb25zdCBjaG9vc2VQcm9qZWN0cyA9IHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0c1xuICAgICAgaWYgKCFjaG9vc2VQcm9qZWN0cy5sZW5ndGgpXG4gICAgICAgIHJldHVybiB0aGlzLl90b2FzdCgn6K+36YCJ5oup6aKE57qm6aG555uuJylcblxuICAgICAgaWYgKCF0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50VGltZXMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9hc3QoJ+ivt+mAieaLqemihOe6puaXtumXtCcpXG4gICAgICBcbiAgICAgIC8vIOmihOe6pumhueebrlxuICAgICAgbGV0IHByb2plY3RJZHMgPSBjaG9vc2VQcm9qZWN0cy5tYXAoaXRlbSA9PiBpdGVtLnByb2plY3RfaWQpXG4gICAgICBwcm9qZWN0SWRzID0gcHJvamVjdElkcy5qb2luKCcsJylcblxuICAgICAgLy8g6aKE57qmXG4gICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgc2hvcF9pZDogdGhpcy5kYXRhLmN1cnJlbnRTaG9wLnNob3BfaWQsXG4gICAgICAgIHBldF9pZDogdGhpcy5kYXRhLmN1cnJlbnRQZXQucGV0X2lkLFxuICAgICAgICBiZWF1dGljaWFuX2lkOiB0aGlzLmRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCxcbiAgICAgICAgcHJvamVjdF9pZDogcHJvamVjdElkcyxcbiAgICAgICAgYXBwb2ludG1lbnRfZGF5OiB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSxcbiAgICAgICAgYXBwb2ludG1lbnRfdGltZTogdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudFRpbWVzLmpvaW4oJywnKSxcbiAgICAgICAgZnJvbTogJ3hjeCcsXG4gICAgICAgIGZvcm1JZDogZm9ybUlkLFxuICAgICAgfVxuICAgICAgYXBwLnBvc3QoJ2NhcnQvYXBwb2ludG1lbnQnLCBkYXRhKVxuICAgICAgICAudGhlbigoKSA9PiAgIHtcbiAgICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5oiQ5YqfIScpXG5cbiAgICAgICAgICB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoZGF0YS5iZWF1dGljaWFuX2lkLCBkYXRhLmFwcG9pbnRtZW50X2RheSlcbiAgICAgICAgICBcbiAgICAgICAgICBzZXRUaW1lb3V0KHggPT4gIHtcbiAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL3BheS9pbmRleCdcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfSwgMTAwMClcblxuICAgICAgICAgIC8vIOmAmuefpVxuICAgICAgICAgIC8vIGFwcC5hc2tOb3RpY2UoKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIHRoaXMuX3RvYXN0KGVycm9yLmRldGFpbCB8fCAn6aKE57qm5aSx6LSlIScpXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIGFkZFBldCgpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6ICcvcGFnZXMvcGV0L2luZGV4J1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgXG4gICAgICB3eC5nZXRMb2NhdGlvbih7XG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgIT09ICdbb2JqZWN0IE9iamVjdF0nKVxuICAgICAgICAgICAgZGF0YSA9IHt9XG5cbiAgICAgICAgICBhcHAuZ2V0KCdzaG9wL2dldExpc3QnLCB7bGF0aXR1ZGU6IGRhdGEubGF0aXR1ZGUgfHwgJycsIGxvbmdpdHVkZTogZGF0YS5sb25naXR1ZGUgfHwgJyd9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTaG9wID0gcmVzdWx0LmNvbnRlbnRbMF0gfHwge31cbiAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgIHNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgICAgY3BTaG9wTGlzdDogcmVzdWx0LmNvbnRlbnQsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyDliKTmlq1zaG9wX2lk5piv5ZCm5a2Y5ZyoXG4gICAgICAgICAgICBpZihzZWxmLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCkge1xuICAgICAgICAgICAgICBjdXJyZW50U2hvcCA9IHNlbGYuZGF0YS5jdXJyZW50U2hvcFxuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlbGYuZ2V0UGV0cygpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2hvcClcbiAgICAgICAgICAgICAgc2VsZi5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3eC5vcGVuU2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH0sXG4gIG9uTG9hZCgpIHtcbiAgICB0aGlzLmluaXQoKVxuICB9LFxuXG4gIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5kYXRhLnBldHMubGVuZ3RoKVxuICAgICAgdGhpcy5nZXRQZXRzKClcbiAgICAgIFxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGFcbiAgICAvLyDliqDovb1cbiAgICBpZiAoZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkICYmIGRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSkge1xuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCwgZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgIH1cbiAgICBcbiAgfSxcblxuICBvblRhYkl0ZW1UYXA6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH1cbiAgfSJdfQ==