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

    app.get('myPet/findMyPets').then(function (data) {
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
        wx.switchTab({
          url: '/pages/pay/index'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyIkcHJvamVjdE1vcmUiLCJkYXRhIiwiY3VycmVudFBldCIsInBldHMiLCJwcm9qZWN0X21vcmUiLCJ0b2FzdFRleHQiLCJzaG93VG9hc3QiLCJzaG9wTGlzdCIsImNwU2hvcExpc3QiLCJzaG93U2hvcExpc3RQb3AiLCJjdXJyZW50U2hvcCIsImJlYXV0aWNpYW5MaXN0IiwiY3VycmVudEJlYXV0aWNpYW4iLCJwcm9qZWN0TGlzdCIsInByb2plY3RMaXN0RmlsdGVyIiwiY3VycmVudFByb2plY3QiLCJjaG9vc2VQcm9qZWN0cyIsImFwcG9pbnRtZW50RGF5TGlzdCIsImN1cnJlbnRBcHBvaW50bWVudERheSIsImFwcG9pbnRtZW50VGltZUxpc3QiLCJjdXJyZW50QXBwb2ludG1lbnRUaW1lcyIsIm9uU2hhcmVBcHBNZXNzYWdlIiwidGl0bGUiLCJwYXRoIiwiaW1hZ2VVcmwiLCJoYW5kbGVyU2VhcmNoIiwiZXZlbnQiLCJ2YWx1ZSIsImRldGFpbCIsImZpbHRlciIsIml0ZW0iLCJzaG9wX25hbWUiLCJtYXRjaCIsIlJlZ0V4cCIsInNldERhdGEiLCJzaG93U2hvcExpc3QiLCJjaG9vc2VTaG9wIiwiaW5kZXgiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImdldEJlYXV0aWNpYW5BbmRQcm9qZWN0Iiwic2hvcF9pZCIsImNob29zZVByb2plY3QiLCJmaW5kSW5kZXgiLCJjb25zb2xlIiwibG9nIiwiYWN0aXZlIiwic3BsaWNlIiwicHVzaCIsImNsZWFyQXBwb2ludG1lbnRUaW1lIiwidGltZUxpc3QiLCJmb3JFYWNoIiwiY2hlY2tlZCIsImZpbHRlclByb2plY3QiLCJoYWlyIiwicHJvamVjdCIsInByb2plY3RfcHJvcGVydHkiLCJsZW5ndGgiLCJjaG9vc2VQZXQiLCJwZXRfaWQiLCJjaG9vc2VCZWF1dGljaWFuIiwiYmVhdXRpY2lhbl9pZCIsImJlYXV0aWNpYW5JZCIsImRheSIsImdldEFwcG9pbnRtZW50VGltZXMiLCJjaG9vc2VEYXkiLCJfdG9hc3QiLCJ0ZXh0Iiwid3giLCJkdXJhdGlvbiIsImljb24iLCJjaG9vc2VUaW1lIiwiZXZlcnlUaW1lIiwidGltZSIsInZhbGlkIiwicHJvamVjdFVzZVRpbWUiLCJyZWR1Y2UiLCJpbml0IiwidXNlX3RpbWUiLCJ1c2VUaW1lTnVtIiwiTWF0aCIsImNlaWwiLCJ0aW1lTGlzdExlbmd0aCIsInN0YXJ0IiwidXNlVGltZSIsInNob3BJZCIsImFwcCIsImdldEFwcCIsInNlbGYiLCJnZXQiLCJ0aGVuIiwiY29udGVudCIsImRheXMiLCJtYXAiLCJzcGxpdCIsImRhdGUiLCJ3ZWVrIiwicHJvamVjdHMiLCJiZWF1dGljaWFucyIsImdldFBldHMiLCJjYXRjaCIsImUiLCJhcHBvaW50bWVudCIsImZvcm1JZCIsInByb2plY3RJZHMiLCJwcm9qZWN0X2lkIiwiam9pbiIsImFwcG9pbnRtZW50X2RheSIsImFwcG9pbnRtZW50X3RpbWUiLCJmcm9tIiwicG9zdCIsInNldFRpbWVvdXQiLCJzd2l0Y2hUYWIiLCJ1cmwiLCJlcnJvciIsImFkZFBldCIsIm5hdmlnYXRlVG8iLCJnZXRMb2NhdGlvbiIsImNvbXBsZXRlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJyZXN1bHQiLCJmYWlsIiwib3BlblNldHRpbmciLCJzdWNjZXNzIiwicmVzIiwib25Mb2FkIiwib25TaG93Iiwib25UYWJJdGVtVGFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU1BLGVBQWUsTUFBckI7O0FBZUlDLFFBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ0pDLGdCQUFXLEVBRFA7QUFFSkMsVUFBTSxFQUZGO0FBR0pDLGtCQUFjSixZQUhWO0FBSUpLLGVBQVcsRUFKUDtBQUtKQyxlQUFXLEtBTFA7QUFNSkMsY0FBVSxFQU5OO0FBT0pDLGdCQUFZLEVBUFI7QUFRSkMscUJBQWlCLE1BUmI7QUFTSkMsaUJBQWEsRUFUVDtBQVVKQyxvQkFBZ0IsRUFWWjtBQVdKQyx1QkFBbUIsRUFYZjtBQVlKQyxpQkFBYSxFQVpUO0FBYUpDLHVCQUFtQixFQWJmO0FBY0pDLG9CQUFnQixFQWRaO0FBZUpDLG9CQUFnQixFQWZaLEVBZWdCO0FBQ3BCQyx3QkFBb0IsRUFoQmhCO0FBaUJKQywyQkFBdUIsRUFqQm5CO0FBa0JKQyx5QkFBcUIsRUFsQmpCO0FBbUJKQyw2QkFBeUIsRUFuQnJCLENBbUJ5QjtBQW5CekIsRzs7QUFzQk5DLG1CLCtCQUFvQjtBQUNsQixXQUFPO0FBQ0xDLGFBQU8sU0FERjtBQUVMQyxZQUFNLHNCQUZEO0FBR0xDLGdCQUFVO0FBSEwsS0FBUDtBQUtELEc7O0FBQ0RDLGlCQUFlLHVCQUFVQyxLQUFWLEVBQWlCO0FBQzlCLFFBQUlDLFFBQVFELE1BQU1FLE1BQU4sQ0FBYUQsS0FBekI7QUFDQSxRQUFJcEIsV0FBVyxLQUFLTixJQUFMLENBQVVNLFFBQXpCO0FBQ0EsUUFBSUMsYUFBYUQsU0FBU3NCLE1BQVQsQ0FBZ0IsVUFBVUMsSUFBVixFQUFnQjtBQUMvQyxhQUFPQSxLQUFLQyxTQUFMLENBQWVDLEtBQWYsQ0FBcUIsSUFBSUMsTUFBSixDQUFXTixLQUFYLENBQXJCLENBQVA7QUFDRCxLQUZnQixDQUFqQjs7QUFJQSxTQUFLTyxPQUFMLENBQWE7QUFDWDFCLGtCQUFZQTtBQURELEtBQWI7QUFHRCxHOztBQUVEMkIsZ0JBQWMsd0JBQVk7QUFDeEIsU0FBS0QsT0FBTCxDQUFhO0FBQ1h6Qix1QkFBaUI7QUFETixLQUFiO0FBR0QsRzs7QUFFRDJCLGNBQVksb0JBQVVWLEtBQVYsRUFBaUI7QUFDM0IsUUFBSVcsUUFBUVgsTUFBTVksYUFBTixDQUFvQkMsT0FBcEIsQ0FBNEJGLEtBQXhDO0FBQ0EsUUFBSTNCLGNBQWMsS0FBS1QsSUFBTCxDQUFVTSxRQUFWLENBQW1COEIsS0FBbkIsQ0FBbEI7QUFDQSxTQUFLSCxPQUFMLENBQWE7QUFDWHhCLG1CQUFhQSxXQURGO0FBRVhELHVCQUFpQjtBQUZOLEtBQWI7O0FBS0EsU0FBSytCLHVCQUFMLENBQTZCOUIsWUFBWStCLE9BQXpDO0FBQ0QsRzs7QUFFRDtBQUNBQyxpQkFBZSx1QkFBVWhCLEtBQVYsRUFBaUI7QUFBQTtBQUFBOztBQUM5QixRQUFJVyxRQUFRWCxNQUFNWSxhQUFOLENBQW9CQyxPQUFwQixDQUE0QkYsS0FBeEM7QUFDQSxRQUFJdEIsaUJBQWlCLEtBQUtkLElBQUwsQ0FBVWEsaUJBQVYsQ0FBNEJ1QixLQUE1QixDQUFyQjs7QUFFQTtBQUNBLFFBQU1yQixpQkFBaUIsS0FBS2YsSUFBTCxDQUFVZSxjQUFqQztBQUNBLFFBQU0yQixZQUFZM0IsZUFBZTJCLFNBQWYsQ0FBeUI7QUFBQSxhQUFRYixTQUFTZixjQUFqQjtBQUFBLEtBQXpCLENBQWxCOztBQUVBNkIsWUFBUUMsR0FBUixDQUFZRixTQUFaOztBQUVBLFFBQUlBLGFBQWEsQ0FBakIsRUFBb0I7QUFDbEI1QixxQkFBZStCLE1BQWYsR0FBd0IsS0FBeEI7QUFDQTlCLHFCQUFlK0IsTUFBZixDQUFzQkosU0FBdEIsRUFBaUMsQ0FBakM7QUFDRCxLQUhELE1BR087QUFDTDVCLHFCQUFlK0IsTUFBZixHQUF3QixJQUF4QjtBQUNBOUIscUJBQWVnQyxJQUFmLENBQW9CakMsY0FBcEI7QUFDRDs7QUFFRDtBQUNBOztBQUVBLFNBQUttQixPQUFMO0FBQ0VuQixzQkFBZ0JBO0FBRGxCLHdEQUV3QnNCLEtBRnhCLFFBRW1DdEIsY0FGbkMsK0NBR0VDLGNBSEYsY0FJRztBQUFBLGFBQU00QixRQUFRQyxHQUFSLENBQVksTUFBSzVDLElBQUwsQ0FBVWUsY0FBdEIsQ0FBTjtBQUFBLEtBSkg7O0FBT0E7QUFDQSxTQUFLaUMsb0JBQUw7QUFDRCxHOztBQUVEQSxzQixrQ0FBdUI7QUFDckIsUUFBSUMsV0FBVyxLQUFLakQsSUFBTCxDQUFVa0IsbUJBQXpCO0FBQ0ErQixhQUFTQyxPQUFULENBQWlCO0FBQUEsYUFBUXJCLEtBQUtzQixPQUFMLEdBQWUsS0FBdkI7QUFBQSxLQUFqQjtBQUNBLFNBQUtsQixPQUFMLENBQWE7QUFDWGQsK0JBQXlCLEVBRGQ7QUFFWEQsMkJBQXFCK0I7QUFGVixLQUFiO0FBSUQsRztBQUVERyxlLDJCQUFnQjtBQUNkLFFBQU1uRCxhQUFhLEtBQUtELElBQUwsQ0FBVUMsVUFBN0I7QUFDQSxRQUFNb0QsT0FBT3BELFdBQVdvRCxJQUF4Qjs7QUFFQSxTQUFLckQsSUFBTCxDQUFVWSxXQUFWLENBQXNCc0MsT0FBdEIsQ0FBOEI7QUFBQSxhQUFRckIsS0FBS2dCLE1BQUwsR0FBYyxLQUF0QjtBQUFBLEtBQTlCOztBQUVBLFFBQU1TLFVBQVUsS0FBS3RELElBQUwsQ0FBVVksV0FBVixDQUFzQmdCLE1BQXRCLENBQTZCO0FBQUEsYUFBUUMsS0FBSzBCLGdCQUFMLEtBQTBCRixJQUFsQztBQUFBLEtBQTdCLENBQWhCOztBQUVBLFFBQUlDLFFBQVFFLE1BQVosRUFBb0I7QUFDbEIsVUFBSTFDLGlCQUFpQndDLFFBQVEsQ0FBUixDQUFyQjtBQUNBeEMscUJBQWUrQixNQUFmLEdBQXdCLElBQXhCO0FBQ0MsV0FBS1osT0FBTCxDQUFhO0FBQ1ZuQixzQ0FEVTtBQUVWQyx3QkFBZ0IsQ0FBQ0QsY0FBRDtBQUZOLE9BQWI7QUFJRixLQVBELE1BT087QUFDTCxXQUFLbUIsT0FBTCxDQUFhO0FBQ1hsQix3QkFBZ0I7QUFETCxPQUFiO0FBR0Q7O0FBRUQsU0FBS2tCLE9BQUwsQ0FBYTtBQUNYcEIseUJBQW1CeUM7QUFEUixLQUFiO0FBR0QsRzs7O0FBRURHLGFBQVcsbUJBQVVoQyxLQUFWLEVBQWlCO0FBQUE7O0FBQzFCLFFBQUlXLFFBQVFYLE1BQU1ZLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCRixLQUF4QztBQUNBLFFBQUluQyxhQUFhLEtBQUtELElBQUwsQ0FBVUUsSUFBVixDQUFla0MsS0FBZixDQUFqQjtBQUNBLFFBQUluQyxXQUFXeUQsTUFBWCxLQUFzQixLQUFLMUQsSUFBTCxDQUFVQyxVQUFWLENBQXFCeUQsTUFBL0MsRUFDRTs7QUFFRjtBQUNBLFNBQUt6QixPQUFMLENBQWE7QUFDWGhDLDRCQURXO0FBRVhjLHNCQUFnQjtBQUZMLEtBQWIsRUFHRztBQUFBLGFBQU0sT0FBS3FDLGFBQUwsRUFBTjtBQUFBLEtBSEg7O0FBS0EsU0FBS0osb0JBQUw7QUFDRCxHOztBQUVEVyxvQkFBa0IsMEJBQVVsQyxLQUFWLEVBQWlCO0FBQ2pDLFFBQUlXLFFBQVFYLE1BQU1ZLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCRixLQUF4QztBQUNBLFFBQUl6QixvQkFBb0IsS0FBS1gsSUFBTCxDQUFVVSxjQUFWLENBQXlCMEIsS0FBekIsQ0FBeEI7QUFDQSxRQUFJekIsa0JBQWtCaUQsYUFBbEIsS0FBb0MsS0FBSzVELElBQUwsQ0FBVVcsaUJBQVYsQ0FBNEJpRCxhQUFwRSxFQUNFOztBQUVGLFNBQUszQixPQUFMLENBQWE7QUFDWHRCLHlCQUFtQkE7QUFEUixLQUFiOztBQUlBLFFBQUlrRCxlQUFlbEQsa0JBQWtCaUQsYUFBckM7QUFDQSxRQUFJRSxNQUFNLEtBQUs5RCxJQUFMLENBQVVpQixxQkFBVixDQUFnQzZDLEdBQTFDO0FBQ0EsU0FBS0MsbUJBQUwsQ0FBeUJGLFlBQXpCLEVBQXVDQyxHQUF2QztBQUNELEc7O0FBR0RFLGFBQVcsbUJBQVV2QyxLQUFWLEVBQWlCO0FBQzFCLFFBQUlXLFFBQVFYLE1BQU1ZLGFBQU4sQ0FBb0JDLE9BQXBCLENBQTRCRixLQUF4QztBQUNBLFFBQUluQix3QkFBd0IsS0FBS2pCLElBQUwsQ0FBVWdCLGtCQUFWLENBQTZCb0IsS0FBN0IsQ0FBNUI7O0FBRUEsUUFBSW5CLHNCQUFzQjZDLEdBQXRCLEtBQThCLEtBQUs5RCxJQUFMLENBQVVpQixxQkFBVixDQUFnQzZDLEdBQWxFLEVBQ0U7O0FBRUYsU0FBSzdCLE9BQUwsQ0FBYTtBQUNYaEIsNkJBQXVCQTtBQURaLEtBQWI7O0FBSUEsUUFBSTRDLGVBQWUsS0FBSzdELElBQUwsQ0FBVVcsaUJBQVYsQ0FBNEJpRCxhQUEvQztBQUNBLFFBQUlFLE1BQU03QyxzQkFBc0I2QyxHQUFoQztBQUNBLFNBQUtDLG1CQUFMLENBQXlCRixZQUF6QixFQUF1Q0MsR0FBdkM7QUFDRCxHOztBQUVERyxRLGtCQUFPQyxJLEVBQU07QUFDWEMsT0FBRzlELFNBQUgsQ0FBYTtBQUNYZ0IsYUFBTzZDLElBREk7QUFFWEUsZ0JBQVUsSUFGQztBQUdYQyxZQUFNO0FBSEssS0FBYjtBQUtELEc7OztBQUVEQyxjQUFZLG9CQUFVN0MsS0FBVixFQUFpQjtBQUMzQixRQUFJOEMsWUFBWSxFQUFoQjtBQUNBLFFBQUluQyxRQUFRWCxNQUFNWSxhQUFOLENBQW9CQyxPQUFwQixDQUE0QkYsS0FBeEM7QUFDQSxRQUFJb0MsT0FBTyxLQUFLeEUsSUFBTCxDQUFVa0IsbUJBQVYsQ0FBOEJrQixLQUE5QixDQUFYO0FBQ0EsUUFBSSxDQUFDb0MsS0FBS0MsS0FBVixFQUNFLE9BQU8sS0FBUDs7QUFFRixRQUFJeEIsV0FBVyxLQUFLakQsSUFBTCxDQUFVa0IsbUJBQXpCO0FBQ0ErQixhQUFTQyxPQUFULENBQWlCO0FBQUEsYUFBUXJCLEtBQUtzQixPQUFMLEdBQWUsS0FBdkI7QUFBQSxLQUFqQjs7QUFFQSxRQUFNcEMsaUJBQWlCLEtBQUtmLElBQUwsQ0FBVWUsY0FBakM7QUFDQSxRQUFJLENBQUNBLGVBQWV5QyxNQUFwQixFQUNFLE9BQU8sS0FBS1MsTUFBTCxDQUFZLFNBQVosQ0FBUDs7QUFFRixRQUFNUyxpQkFBaUIzRCxlQUFlNEQsTUFBZixDQUFzQixVQUFDQyxJQUFELEVBQU8vQyxJQUFQO0FBQUEsYUFBZ0JBLEtBQUtnRCxRQUFMLEdBQWdCLENBQWhCLEdBQW9CRCxJQUFwQztBQUFBLEtBQXRCLEVBQWdFLENBQWhFLENBQXZCOztBQUVBLFFBQUlFLGFBQWFDLEtBQUtDLElBQUwsQ0FBVU4saUJBQWlCSCxTQUEzQixDQUFqQjtBQUNBLFFBQUlVLGlCQUFpQixLQUFLakYsSUFBTCxDQUFVa0IsbUJBQVYsQ0FBOEJzQyxNQUFuRDtBQUNBLFFBQUlwQixRQUFRMEMsVUFBUixHQUFxQkcsY0FBekIsRUFBeUM7QUFDdkMsV0FBS2hELE9BQUwsQ0FBYTtBQUNYZCxpQ0FBeUIsRUFEZDtBQUVYRCw2QkFBcUIrQjtBQUZWLE9BQWI7O0FBS0EsV0FBS2dCLE1BQUwsQ0FBWSxlQUFaOztBQUVBO0FBQ0Q7QUFDRCxRQUFJaUIsUUFBUSxDQUFaO0FBQ0EsUUFBSUMsVUFBVSxFQUFkO0FBQ0EsV0FBT0QsUUFBUUosVUFBZixFQUEyQjtBQUN6QixVQUFJakQsT0FBT29CLFNBQVNiLFFBQVE4QyxPQUFqQixDQUFYO0FBQ0EsVUFBRyxDQUFDckQsS0FBSzRDLEtBQVQsRUFBZ0I7QUFDZHhCLGlCQUFTQyxPQUFULENBQWlCO0FBQUEsaUJBQVFyQixLQUFLc0IsT0FBTCxHQUFlLEtBQXZCO0FBQUEsU0FBakI7QUFDQWdDLGtCQUFVLEVBQVY7QUFDQSxhQUFLbEQsT0FBTCxDQUFhO0FBQ1hkLG1DQUF5QmdFLE9BRGQ7QUFFWGpFLCtCQUFxQitCO0FBRlYsU0FBYjtBQUlBLGFBQUtnQixNQUFMLENBQVksUUFBWjtBQUNBO0FBQ0Q7QUFDRHBDLFdBQUtzQixPQUFMLEdBQWUsSUFBZjtBQUNBZ0MsY0FBUXBDLElBQVIsQ0FBYWxCLEtBQUsyQyxJQUFsQjtBQUNEOztBQUVELFNBQUt2QyxPQUFMLENBQWE7QUFDWGQsK0JBQXlCZ0UsT0FEZDtBQUVYakUsMkJBQXFCK0I7QUFGVixLQUFiO0FBS0QsRzs7QUFFRFYsMkJBQXlCLGlDQUFVNkMsTUFBVixFQUFrQjtBQUN6QyxRQUFJQyxNQUFNQyxRQUFWO0FBQ0EsUUFBSUMsT0FBTyxJQUFYO0FBQ0FGLFFBQUlHLEdBQUosMENBQStDSixNQUEvQyxFQUF5REssSUFBekQsQ0FBOEQsZ0JBQVE7QUFDcEUsVUFBSUMsVUFBVzFGLEtBQUtBLElBQUwsSUFBYUEsS0FBS0EsSUFBTCxDQUFVMEYsT0FBeEIsSUFBb0MsRUFBbEQ7O0FBRUFBLGNBQVFDLElBQVIsR0FBZUQsUUFBUUMsSUFBUixDQUFhQyxHQUFiLENBQWlCLGdCQUFRO0FBQ3RDLFlBQUk5QixNQUFNakMsS0FBS2dFLEtBQUwsQ0FBVyxHQUFYLENBQVY7QUFDQSxlQUFPO0FBQ0xDLGdCQUFNaEMsSUFBSSxDQUFKLENBREQ7QUFFTGlDLGdCQUFNakMsSUFBSSxDQUFKLENBRkQ7QUFHTEEsZUFBS0EsSUFBSSxDQUFKO0FBSEEsU0FBUDtBQUtELE9BUGMsQ0FBZjs7QUFTQTRCLGNBQVFNLFFBQVIsR0FBbUJOLFFBQVFNLFFBQVIsSUFBb0IsRUFBdkM7QUFDQU4sY0FBUU0sUUFBUixDQUFpQjlDLE9BQWpCLENBQXlCO0FBQUEsZUFBUXJCLEtBQUtnQixNQUFMLEdBQWMsS0FBdEI7QUFBQSxPQUF6Qjs7QUFFQTtBQUNBLFVBQUkvQixpQkFBaUI0RSxRQUFRTSxRQUFSLENBQWlCLENBQWpCLEtBQXVCLEVBQTVDO0FBQ0FsRixxQkFBZStCLE1BQWYsR0FBd0IsSUFBeEI7O0FBRUEsVUFBSWxDLG9CQUFvQitFLFFBQVFPLFdBQVIsQ0FBb0IsQ0FBcEIsS0FBMEIsRUFBbEQ7QUFDQSxVQUFJaEYsd0JBQXdCeUUsUUFBUUMsSUFBUixDQUFhLENBQWIsS0FBbUIsRUFBL0M7O0FBRUFKLFdBQUt0RCxPQUFMLENBQWE7QUFDWHZCLHdCQUFnQmdGLFFBQVFPLFdBRGI7QUFFWHJGLHFCQUFhOEUsUUFBUU0sUUFGVjtBQUdYN0Ysc0JBQWNKLFlBSEg7QUFJWGlCLDRCQUFvQjBFLFFBQVFDLElBSmpCO0FBS1g3RSxzQ0FMVztBQU1YQyx3QkFBZ0IsQ0FBQ0QsY0FBRCxDQU5MO0FBT1hILDRDQVBXO0FBUVhNO0FBUlcsT0FBYjs7QUFXQXNFLFdBQUtXLE9BQUw7O0FBRUFYLFdBQUt4QixtQkFBTCxDQUF5QnBELGtCQUFrQmlELGFBQTNDLEVBQTBEM0Msc0JBQXNCNkMsR0FBaEY7QUFDRCxLQXBDRCxFQW9DR3FDLEtBcENILENBb0NTLGFBQUs7QUFDWnhELGNBQVFDLEdBQVIsQ0FBWXdELENBQVo7QUFDRCxLQXRDRDtBQXdDRCxHOztBQUVERixTLHFCQUFVO0FBQUE7O0FBQ1IsUUFBSWIsTUFBTUMsUUFBVjtBQUNBLFFBQUlDLE9BQU8sSUFBWDs7QUFFQUYsUUFBSUcsR0FBSixDQUFRLGtCQUFSLEVBQTRCQyxJQUE1QixDQUFpQyxnQkFBUTtBQUN2QyxVQUFJeEYsYUFBYUQsS0FBS0EsSUFBTCxDQUFVMEYsT0FBVixDQUFrQixDQUFsQixDQUFqQjtBQUNBLFVBQUksQ0FBQ3pGLFVBQUwsRUFDRUEsYUFBYSxFQUFiOztBQUVGc0YsV0FBS3RELE9BQUwsQ0FBYTtBQUNYL0IsY0FBTUYsS0FBS0EsSUFBTCxDQUFVMEYsT0FETDtBQUVYekY7QUFGVyxPQUFiLEVBR0c7QUFBQSxlQUFNLE9BQUttRCxhQUFMLEVBQU47QUFBQSxPQUhIO0FBSUQsS0FURDtBQVdELEc7OztBQUVEVyx1QkFBcUIsNkJBQVVGLFlBQVYsRUFBd0JDLEdBQXhCLEVBQTZCO0FBQ2hELFFBQUl1QixNQUFNQyxRQUFWO0FBQ0EsUUFBSUMsT0FBTyxJQUFYO0FBQ0EsU0FBS3RELE9BQUwsQ0FBYTtBQUNYZCwrQkFBeUI7QUFEZCxLQUFiOztBQUlBLFdBQU9rRSxJQUFJRyxHQUFKLENBQVEsb0NBQW9DM0IsWUFBcEMsR0FBbUQsR0FBbkQsR0FBeURDLEdBQWpFLEVBQ0oyQixJQURJLENBQ0MsVUFBQ3pGLElBQUQsRUFBVTtBQUNkLFVBQUkwRixVQUFXMUYsS0FBS0EsSUFBTCxJQUFhQSxLQUFLQSxJQUFMLENBQVUwRixPQUF4QixJQUFvQyxFQUFsRDtBQUNBO0FBQ0E7O0FBRUFILFdBQUt0RCxPQUFMLENBQWE7QUFDWGYsNkJBQXFCd0U7QUFEVixPQUFiO0FBR0QsS0FUSSxDQUFQO0FBVUQsRzs7QUFFRDtBQUNBVyxlQUFhLHFCQUFVNUUsS0FBVixFQUFpQjtBQUFBOztBQUM1QixRQUFJNEQsTUFBTUMsUUFBVjtBQUNBLFFBQUlnQixTQUFTN0UsTUFBTUUsTUFBTixDQUFhMkUsTUFBMUI7QUFDQSxRQUFNdkYsaUJBQWlCLEtBQUtmLElBQUwsQ0FBVWUsY0FBakM7QUFDQSxRQUFJLENBQUNBLGVBQWV5QyxNQUFwQixFQUNFLE9BQU8sS0FBS1MsTUFBTCxDQUFZLFNBQVosQ0FBUDs7QUFFRixRQUFJLENBQUMsS0FBS2pFLElBQUwsQ0FBVW1CLHVCQUFWLENBQWtDcUMsTUFBdkMsRUFDRSxPQUFPLEtBQUtTLE1BQUwsQ0FBWSxTQUFaLENBQVA7O0FBRUY7QUFDQSxRQUFJc0MsYUFBYXhGLGVBQWU2RSxHQUFmLENBQW1CO0FBQUEsYUFBUS9ELEtBQUsyRSxVQUFiO0FBQUEsS0FBbkIsQ0FBakI7QUFDQUQsaUJBQWFBLFdBQVdFLElBQVgsQ0FBZ0IsR0FBaEIsQ0FBYjs7QUFFQTtBQUNBLFFBQUl6RyxPQUFPO0FBQ1R3QyxlQUFTLEtBQUt4QyxJQUFMLENBQVVTLFdBQVYsQ0FBc0IrQixPQUR0QjtBQUVUa0IsY0FBUSxLQUFLMUQsSUFBTCxDQUFVQyxVQUFWLENBQXFCeUQsTUFGcEI7QUFHVEUscUJBQWUsS0FBSzVELElBQUwsQ0FBVVcsaUJBQVYsQ0FBNEJpRCxhQUhsQztBQUlUNEMsa0JBQVlELFVBSkg7QUFLVEcsdUJBQWlCLEtBQUsxRyxJQUFMLENBQVVpQixxQkFBVixDQUFnQzZDLEdBTHhDO0FBTVQ2Qyx3QkFBa0IsS0FBSzNHLElBQUwsQ0FBVW1CLHVCQUFWLENBQWtDc0YsSUFBbEMsQ0FBdUMsR0FBdkMsQ0FOVDtBQU9URyxZQUFNLEtBUEc7QUFRVE4sY0FBUUE7QUFSQyxLQUFYO0FBVUFqQixRQUFJd0IsSUFBSixDQUFTLGtCQUFULEVBQTZCN0csSUFBN0IsRUFDR3lGLElBREgsQ0FDUSxZQUFRO0FBQ1osYUFBS3hCLE1BQUwsQ0FBWSxPQUFaOztBQUVBLGFBQUtGLG1CQUFMLENBQXlCL0QsS0FBSzRELGFBQTlCLEVBQTZDNUQsS0FBSzBHLGVBQWxEOztBQUVBSSxpQkFBVyxhQUFNO0FBQ2YzQyxXQUFHNEMsU0FBSCxDQUFhO0FBQ1RDLGVBQUs7QUFESSxTQUFiO0FBSUMsT0FMSCxFQUtLLElBTEw7O0FBT0E7QUFDQTtBQUNELEtBZkgsRUFnQkdiLEtBaEJILENBZ0JTLGlCQUFTO0FBQ2QsYUFBS2xDLE1BQUwsQ0FBWWdELE1BQU10RixNQUFOLElBQWdCLE9BQTVCO0FBQ0QsS0FsQkg7QUFtQkQsRzs7QUFFRHVGLFEsb0JBQVM7QUFDUC9DLE9BQUdnRCxVQUFILENBQWM7QUFDWkgsV0FBSztBQURPLEtBQWQ7QUFHRCxHOzs7QUFFRHBDLFFBQU0sZ0JBQVc7QUFDZixRQUFJUyxNQUFNQyxRQUFWO0FBQ0EsUUFBSUMsT0FBTyxJQUFYOztBQUdBcEIsT0FBR2lELFdBQUgsQ0FBZTtBQUNiQyxnQkFBVSxrQkFBVXJILElBQVYsRUFBZ0I7QUFDeEIsWUFBSXNILE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQnpILElBQS9CLE1BQXlDLGlCQUE3QyxFQUNFQSxPQUFPLEVBQVA7O0FBRUZxRixZQUFJRyxHQUFKLENBQVEsY0FBUixFQUF3QixFQUFDa0MsVUFBVTFILEtBQUswSCxRQUFMLElBQWlCLEVBQTVCLEVBQWdDQyxXQUFXM0gsS0FBSzJILFNBQUwsSUFBa0IsRUFBN0QsRUFBeEIsRUFBMEZsQyxJQUExRixDQUErRixnQkFBUTtBQUNyRyxjQUFJbUMsU0FBUzVILEtBQUtBLElBQWxCO0FBQ0EsY0FBSVMsY0FBY21ILE9BQU9sQyxPQUFQLENBQWUsQ0FBZixLQUFxQixFQUF2QztBQUNBSCxlQUFLdEQsT0FBTCxDQUFhO0FBQ1gzQixzQkFBVXNILE9BQU9sQyxPQUROO0FBRVhuRix3QkFBWXFILE9BQU9sQztBQUZSLFdBQWI7O0FBS0E7QUFDQSxjQUFHSCxLQUFLdkYsSUFBTCxDQUFVUyxXQUFWLENBQXNCK0IsT0FBekIsRUFBa0M7QUFDaEMvQiwwQkFBYzhFLEtBQUt2RixJQUFMLENBQVVTLFdBQXhCO0FBQ0E4RSxpQkFBS3RELE9BQUwsQ0FBYTtBQUNYeEI7QUFEVyxhQUFiO0FBR0QsV0FMRCxNQUtPO0FBQ0w4RSxpQkFBS3RELE9BQUwsQ0FBYTtBQUNYeEI7QUFEVyxhQUFiO0FBR0Q7O0FBRUQ7O0FBRUEsY0FBSUEsV0FBSixFQUNFOEUsS0FBS2hELHVCQUFMLENBQTZCOUIsWUFBWStCLE9BQXpDO0FBQ0gsU0F4QkQsRUF3QkcyRCxLQXhCSCxDQXdCUztBQUFBLGlCQUFLeEQsUUFBUUMsR0FBUixDQUFZd0QsQ0FBWixDQUFMO0FBQUEsU0F4QlQ7QUF5QkQsT0E5Qlk7QUErQmJ5QixZQUFNLGdCQUFZO0FBQ2hCMUQsV0FBRzJELFdBQUgsQ0FBZTtBQUNiQyxtQkFBUyxpQkFBVUMsR0FBVixFQUFlLENBQ3ZCLENBRlk7QUFHYkgsZ0JBQU0sZ0JBQVksQ0FDakI7QUFKWSxTQUFmO0FBTUQ7QUF0Q1ksS0FBZjtBQXdDSCxHO0FBQ0RJLFEsb0JBQVM7QUFDUCxTQUFLckQsSUFBTDtBQUNELEc7OztBQUVEc0QsVUFBUSxrQkFBWTtBQUNsQixRQUFJLENBQUMsS0FBS2xJLElBQUwsQ0FBVUUsSUFBVixDQUFlc0QsTUFBcEIsRUFDRSxLQUFLMEMsT0FBTDs7QUFFRixRQUFNbEcsT0FBTyxLQUFLQSxJQUFsQjtBQUNBO0FBQ0EsUUFBSUEsS0FBS1csaUJBQUwsQ0FBdUJpRCxhQUF2QixJQUF3QzVELEtBQUtpQixxQkFBTCxDQUEyQjZDLEdBQXZFLEVBQTRFO0FBQzFFLFdBQUtDLG1CQUFMLENBQXlCL0QsS0FBS1csaUJBQUwsQ0FBdUJpRCxhQUFoRCxFQUErRDVELEtBQUtpQixxQkFBTCxDQUEyQjZDLEdBQTFGO0FBQ0Q7QUFFRixHOztBQUVEcUUsZ0JBQWMsd0JBQVc7QUFDdkIsU0FBS3ZELElBQUw7QUFDRCIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCAkcHJvamVjdE1vcmUgPSAn6YCJ5oup6aG555uuJ1xuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6aKE57qmJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjRThFOEU4JyxcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaycsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1mbGV4JzogJ0BtaW51aS93eGMtZmxleCcsXG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICAgICd3eGMtbWFzayc6ICdAbWludWkvd3hjLW1hc2snLFxuICAgICAgICAnd3hjLXBvcHVwJzogJ0BtaW51aS93eGMtcG9wdXAnLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIGN1cnJlbnRQZXQ6e30sXG4gICAgICBwZXRzOiBbXSxcbiAgICAgIHByb2plY3RfbW9yZTogJHByb2plY3RNb3JlLFxuICAgICAgdG9hc3RUZXh0OiAnJyxcbiAgICAgIHNob3dUb2FzdDogZmFsc2UsXG4gICAgICBzaG9wTGlzdDogW10sXG4gICAgICBjcFNob3BMaXN0OiBbXSxcbiAgICAgIHNob3dTaG9wTGlzdFBvcDogJ2hpZGUnLFxuICAgICAgY3VycmVudFNob3A6IHt9LFxuICAgICAgYmVhdXRpY2lhbkxpc3Q6IFtdLFxuICAgICAgY3VycmVudEJlYXV0aWNpYW46IHt9LFxuICAgICAgcHJvamVjdExpc3Q6IFtdLFxuICAgICAgcHJvamVjdExpc3RGaWx0ZXI6IFtdLFxuICAgICAgY3VycmVudFByb2plY3Q6IHt9LFxuICAgICAgY2hvb3NlUHJvamVjdHM6IFtdLCAvLyDlt7Lnu4/pgInmi6nnmoTpobnnm65cbiAgICAgIGFwcG9pbnRtZW50RGF5TGlzdDogW10sXG4gICAgICBjdXJyZW50QXBwb2ludG1lbnREYXk6ICcnLFxuICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogW10sXG4gICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sIC8vIOmihOe6pueahOaXtumXtFxuICAgIH0sXG5cbiAgICBvblNoYXJlQXBwTWVzc2FnZSgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlOiAnQ0FU54yr55qE5LiW55WMJyxcbiAgICAgICAgcGF0aDogJy9wYWdlcy9hcnRpY2xlL2luZGV4JyxcbiAgICAgICAgaW1hZ2VVcmw6ICdodHRwczovL2FwaS5tZHNoaWppZS5jb20vc3RhdGljL3NoYXJlLnBuZydcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZXJTZWFyY2g6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IHZhbHVlID0gZXZlbnQuZGV0YWlsLnZhbHVlXG4gICAgICBsZXQgc2hvcExpc3QgPSB0aGlzLmRhdGEuc2hvcExpc3RcbiAgICAgIGxldCBjcFNob3BMaXN0ID0gc2hvcExpc3QuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnNob3BfbmFtZS5tYXRjaChuZXcgUmVnRXhwKHZhbHVlKSlcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGNwU2hvcExpc3Q6IGNwU2hvcExpc3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIHNob3dTaG9wTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnc2hvdydcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVNob3A6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFNob3AgPSB0aGlzLmRhdGEuc2hvcExpc3RbaW5kZXhdXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50U2hvcDogY3VycmVudFNob3AsXG4gICAgICAgIHNob3dTaG9wTGlzdFBvcDogJ2hpZGUnLFxuICAgICAgfSlcblxuICAgICAgdGhpcy5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgIH0sXG5cbiAgICAvLyDpgInmi6npobnnm65cbiAgICBjaG9vc2VQcm9qZWN0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRQcm9qZWN0ID0gdGhpcy5kYXRhLnByb2plY3RMaXN0RmlsdGVyW2luZGV4XVxuXG4gICAgICAvLyDliKTmlq3mmK/lkKblt7Lnu4/pgInmi6nkuobpobnnm65cbiAgICAgIGNvbnN0IGNob29zZVByb2plY3RzID0gdGhpcy5kYXRhLmNob29zZVByb2plY3RzXG4gICAgICBjb25zdCBmaW5kSW5kZXggPSBjaG9vc2VQcm9qZWN0cy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtID09PSBjdXJyZW50UHJvamVjdClcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coZmluZEluZGV4KVxuXG4gICAgICBpZiAoZmluZEluZGV4ID49IDApIHtcbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgY2hvb3NlUHJvamVjdHMuc3BsaWNlKGZpbmRJbmRleCwgMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcbiAgICAgICAgY2hvb3NlUHJvamVjdHMucHVzaChjdXJyZW50UHJvamVjdClcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3QgcHJvamVjdExpc3QgPSB0aGlzLmRhdGEucHJvamVjdExpc3RcbiAgICAgIC8vIHByb2plY3RMaXN0W2luZGV4XSA9IGN1cnJlbnRQcm9qZWN0XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0OiBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgW2Bwcm9qZWN0TGlzdEZpbHRlclske2luZGV4fV1gXTogY3VycmVudFByb2plY3QsXG4gICAgICAgIGNob29zZVByb2plY3RzXG4gICAgICB9LCAoKSA9PiBjb25zb2xlLmxvZyh0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHMpKVxuXG5cbiAgICAgIC8vIOmihOe6puaXtumXtFxuICAgICAgdGhpcy5jbGVhckFwcG9pbnRtZW50VGltZSgpXG4gICAgfSxcbiAgICBcbiAgICBjbGVhckFwcG9pbnRtZW50VGltZSgpIHtcbiAgICAgIGxldCB0aW1lTGlzdCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0XG4gICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sXG4gICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBmaWx0ZXJQcm9qZWN0KCkge1xuICAgICAgY29uc3QgY3VycmVudFBldCA9IHRoaXMuZGF0YS5jdXJyZW50UGV0XG4gICAgICBjb25zdCBoYWlyID0gY3VycmVudFBldC5oYWlyXG5cbiAgICAgIHRoaXMuZGF0YS5wcm9qZWN0TGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5hY3RpdmUgPSBmYWxzZSlcblxuICAgICAgY29uc3QgcHJvamVjdCA9IHRoaXMuZGF0YS5wcm9qZWN0TGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnByb2plY3RfcHJvcGVydHkgPT09IGhhaXIpXG5cbiAgICAgIGlmIChwcm9qZWN0Lmxlbmd0aCkge1xuICAgICAgICBsZXQgY3VycmVudFByb2plY3QgPSBwcm9qZWN0WzBdXG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcbiAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIGNob29zZVByb2plY3RzOiBbY3VycmVudFByb2plY3RdLFxuICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgY2hvb3NlUHJvamVjdHM6IFtdXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHByb2plY3RMaXN0RmlsdGVyOiBwcm9qZWN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjaG9vc2VQZXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFBldCA9IHRoaXMuZGF0YS5wZXRzW2luZGV4XVxuICAgICAgaWYgKGN1cnJlbnRQZXQucGV0X2lkID09PSB0aGlzLmRhdGEuY3VycmVudFBldC5wZXRfaWQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICAvLyDnrZvpgInpobnnm64gcHJvamVjdExpc3RGaWx0ZXJcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRQZXQsXG4gICAgICAgIGNob29zZVByb2plY3RzOiBbXSxcbiAgICAgIH0sICgpID0+IHRoaXMuZmlsdGVyUHJvamVjdCgpKVxuXG4gICAgICB0aGlzLmNsZWFyQXBwb2ludG1lbnRUaW1lKClcbiAgICB9LFxuXG4gICAgY2hvb3NlQmVhdXRpY2lhbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IHRoaXMuZGF0YS5iZWF1dGljaWFuTGlzdFtpbmRleF1cbiAgICAgIGlmIChjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkID09PSB0aGlzLmRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRCZWF1dGljaWFuOiBjdXJyZW50QmVhdXRpY2lhbixcbiAgICAgIH0pXG5cbiAgICAgIGxldCBiZWF1dGljaWFuSWQgPSBjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkXG4gICAgICBsZXQgZGF5ID0gdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXlcbiAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhiZWF1dGljaWFuSWQsIGRheSlcbiAgICB9LFxuXG5cbiAgICBjaG9vc2VEYXk6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudEFwcG9pbnRtZW50RGF5ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50RGF5TGlzdFtpbmRleF1cblxuICAgICAgaWYgKGN1cnJlbnRBcHBvaW50bWVudERheS5kYXkgPT09IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgICByZXR1cm5cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50RGF5OiBjdXJyZW50QXBwb2ludG1lbnREYXksXG4gICAgICB9KVxuXG4gICAgICBsZXQgYmVhdXRpY2lhbklkID0gdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWRcbiAgICAgIGxldCBkYXkgPSBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5XG4gICAgICB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoYmVhdXRpY2lhbklkLCBkYXkpXG4gICAgfSxcblxuICAgIF90b2FzdCh0ZXh0KSB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogdGV4dCxcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgIGljb246ICdub25lJ1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgY2hvb3NlVGltZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgZXZlcnlUaW1lID0gMzBcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IHRpbWUgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFtpbmRleF1cbiAgICAgIGlmICghdGltZS52YWxpZClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGxldCB0aW1lTGlzdCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0XG4gICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG5cbiAgICAgIGNvbnN0IGNob29zZVByb2plY3RzID0gdGhpcy5kYXRhLmNob29zZVByb2plY3RzXG4gICAgICBpZiAoIWNob29zZVByb2plY3RzLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvYXN0KCfor7fpgInmi6npooTnuqbpobnnm64nKVxuXG4gICAgICBjb25zdCBwcm9qZWN0VXNlVGltZSA9IGNob29zZVByb2plY3RzLnJlZHVjZSgoaW5pdCwgaXRlbSkgPT4gaXRlbS51c2VfdGltZSAvIDEgKyBpbml0LCAwKVxuXG4gICAgICBsZXQgdXNlVGltZU51bSA9IE1hdGguY2VpbChwcm9qZWN0VXNlVGltZSAvIGV2ZXJ5VGltZSlcbiAgICAgIGxldCB0aW1lTGlzdExlbmd0aCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0Lmxlbmd0aFxuICAgICAgaWYgKGluZGV4ICsgdXNlVGltZU51bSA+IHRpbWVMaXN0TGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdLFxuICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0LFxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbml7bpl7TkuI3otrMs6K+36YeN5paw6YCJ5oupLicpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBsZXQgc3RhcnQgPSAwXG4gICAgICBsZXQgdXNlVGltZSA9IFtdXG4gICAgICB3aGlsZSAoc3RhcnQgPCB1c2VUaW1lTnVtKSB7XG4gICAgICAgIGxldCBpdGVtID0gdGltZUxpc3RbaW5kZXggKyBzdGFydCsrXVxuICAgICAgICBpZighaXRlbS52YWxpZCkge1xuICAgICAgICAgIHRpbWVMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcbiAgICAgICAgICB1c2VUaW1lID0gW11cbiAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IHVzZVRpbWUsXG4gICAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdCxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbml7bpl7TkuI3otrMnKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0uY2hlY2tlZCA9IHRydWVcbiAgICAgICAgdXNlVGltZS5wdXNoKGl0ZW0udGltZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IHVzZVRpbWUsXG4gICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0XG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldEJlYXV0aWNpYW5BbmRQcm9qZWN0OiBmdW5jdGlvbiAoc2hvcElkKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgYXBwLmdldChgYXBwb2ludG1lbnQvZ2V0QmVhdXRpY2lhbkFuZFByb2plY3QvJHtzaG9wSWR9YCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IGNvbnRlbnQgPSAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5jb250ZW50KSB8fCB7fVxuXG4gICAgICAgIGNvbnRlbnQuZGF5cyA9IGNvbnRlbnQuZGF5cy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgbGV0IGRheSA9IGl0ZW0uc3BsaXQoJyMnKVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRlOiBkYXlbMF0sXG4gICAgICAgICAgICB3ZWVrOiBkYXlbMV0sXG4gICAgICAgICAgICBkYXk6IGRheVsyXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBjb250ZW50LnByb2plY3RzID0gY29udGVudC5wcm9qZWN0cyB8fCBbXVxuICAgICAgICBjb250ZW50LnByb2plY3RzLmZvckVhY2goaXRlbSA9PiBpdGVtLmFjdGl2ZSA9IGZhbHNlKVxuXG4gICAgICAgIC8vIOm7mOiupOmAieaLqeeahOmhueebrlxuICAgICAgICBsZXQgY3VycmVudFByb2plY3QgPSBjb250ZW50LnByb2plY3RzWzBdIHx8IHt9XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcblxuICAgICAgICBsZXQgY3VycmVudEJlYXV0aWNpYW4gPSBjb250ZW50LmJlYXV0aWNpYW5zWzBdIHx8IHt9XG4gICAgICAgIGxldCBjdXJyZW50QXBwb2ludG1lbnREYXkgPSBjb250ZW50LmRheXNbMF0gfHwge31cblxuICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgIGJlYXV0aWNpYW5MaXN0OiBjb250ZW50LmJlYXV0aWNpYW5zLFxuICAgICAgICAgIHByb2plY3RMaXN0OiBjb250ZW50LnByb2plY3RzLFxuICAgICAgICAgIHByb2plY3RfbW9yZTogJHByb2plY3RNb3JlLFxuICAgICAgICAgIGFwcG9pbnRtZW50RGF5TGlzdDogY29udGVudC5kYXlzLFxuICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgIGNob29zZVByb2plY3RzOiBbY3VycmVudFByb2plY3RdLFxuICAgICAgICAgIGN1cnJlbnRCZWF1dGljaWFuLFxuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheSxcbiAgICAgICAgfSlcblxuICAgICAgICBzZWxmLmdldFBldHMoKVxuXG4gICAgICAgIHNlbGYuZ2V0QXBwb2ludG1lbnRUaW1lcyhjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLCBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldFBldHMoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgICBhcHAuZ2V0KCdteVBldC9maW5kTXlQZXRzJykudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRQZXQgPSBkYXRhLmRhdGEuY29udGVudFswXVxuICAgICAgICBpZiAoIWN1cnJlbnRQZXQpXG4gICAgICAgICAgY3VycmVudFBldCA9IHt9XG5cbiAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICBwZXRzOiBkYXRhLmRhdGEuY29udGVudCxcbiAgICAgICAgICBjdXJyZW50UGV0LFxuICAgICAgICB9LCAoKSA9PiB0aGlzLmZpbHRlclByb2plY3QoKSlcbiAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgZ2V0QXBwb2ludG1lbnRUaW1lczogZnVuY3Rpb24gKGJlYXV0aWNpYW5JZCwgZGF5KSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEFwcG9pbnRtZW50VGltZXM6IFtdXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gYXBwLmdldCgnYXBwb2ludG1lbnQvZ2V0QXBwb2ludG1lbnRUaW1lLycgKyBiZWF1dGljaWFuSWQgKyAnLycgKyBkYXkpXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IGNvbnRlbnQgPSAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5jb250ZW50KSB8fCBbXVxuICAgICAgICAgIC8vIGZvciAodmFyIGkgaW4gWzAsIDAsIDAsIDBdKVxuICAgICAgICAgIC8vICAgY29udGVudC5wdXNoKHt9KVxuXG4gICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IGNvbnRlbnRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvLyDlj5HpgIHpooTnuqZcbiAgICBhcHBvaW50bWVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBmb3JtSWQgPSBldmVudC5kZXRhaWwuZm9ybUlkXG4gICAgICBjb25zdCBjaG9vc2VQcm9qZWN0cyA9IHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0c1xuICAgICAgaWYgKCFjaG9vc2VQcm9qZWN0cy5sZW5ndGgpXG4gICAgICAgIHJldHVybiB0aGlzLl90b2FzdCgn6K+36YCJ5oup6aKE57qm6aG555uuJylcblxuICAgICAgaWYgKCF0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50VGltZXMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9hc3QoJ+ivt+mAieaLqemihOe6puaXtumXtCcpXG4gICAgICBcbiAgICAgIC8vIOmihOe6pumhueebrlxuICAgICAgbGV0IHByb2plY3RJZHMgPSBjaG9vc2VQcm9qZWN0cy5tYXAoaXRlbSA9PiBpdGVtLnByb2plY3RfaWQpXG4gICAgICBwcm9qZWN0SWRzID0gcHJvamVjdElkcy5qb2luKCcsJylcblxuICAgICAgLy8g6aKE57qmXG4gICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgc2hvcF9pZDogdGhpcy5kYXRhLmN1cnJlbnRTaG9wLnNob3BfaWQsXG4gICAgICAgIHBldF9pZDogdGhpcy5kYXRhLmN1cnJlbnRQZXQucGV0X2lkLFxuICAgICAgICBiZWF1dGljaWFuX2lkOiB0aGlzLmRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCxcbiAgICAgICAgcHJvamVjdF9pZDogcHJvamVjdElkcyxcbiAgICAgICAgYXBwb2ludG1lbnRfZGF5OiB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSxcbiAgICAgICAgYXBwb2ludG1lbnRfdGltZTogdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudFRpbWVzLmpvaW4oJywnKSxcbiAgICAgICAgZnJvbTogJ3hjeCcsXG4gICAgICAgIGZvcm1JZDogZm9ybUlkLFxuICAgICAgfVxuICAgICAgYXBwLnBvc3QoJ2NhcnQvYXBwb2ludG1lbnQnLCBkYXRhKVxuICAgICAgICAudGhlbigoKSA9PiAgIHtcbiAgICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5oiQ5YqfIScpXG5cbiAgICAgICAgICB0aGlzLmdldEFwcG9pbnRtZW50VGltZXMoZGF0YS5iZWF1dGljaWFuX2lkLCBkYXRhLmFwcG9pbnRtZW50X2RheSlcbiAgICAgICAgICBcbiAgICAgICAgICBzZXRUaW1lb3V0KHggPT4gIHtcbiAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL3BheS9pbmRleCdcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfSwgMTAwMClcblxuICAgICAgICAgIC8vIOmAmuefpVxuICAgICAgICAgIC8vIGFwcC5hc2tOb3RpY2UoKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIHRoaXMuX3RvYXN0KGVycm9yLmRldGFpbCB8fCAn6aKE57qm5aSx6LSlIScpXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIGFkZFBldCgpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6ICcvcGFnZXMvcGV0L2luZGV4J1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgXG4gICAgICB3eC5nZXRMb2NhdGlvbih7XG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgIT09ICdbb2JqZWN0IE9iamVjdF0nKVxuICAgICAgICAgICAgZGF0YSA9IHt9XG5cbiAgICAgICAgICBhcHAuZ2V0KCdzaG9wL2dldExpc3QnLCB7bGF0aXR1ZGU6IGRhdGEubGF0aXR1ZGUgfHwgJycsIGxvbmdpdHVkZTogZGF0YS5sb25naXR1ZGUgfHwgJyd9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTaG9wID0gcmVzdWx0LmNvbnRlbnRbMF0gfHwge31cbiAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgIHNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgICAgY3BTaG9wTGlzdDogcmVzdWx0LmNvbnRlbnQsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyDliKTmlq1zaG9wX2lk5piv5ZCm5a2Y5ZyoXG4gICAgICAgICAgICBpZihzZWxmLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCkge1xuICAgICAgICAgICAgICBjdXJyZW50U2hvcCA9IHNlbGYuZGF0YS5jdXJyZW50U2hvcFxuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlbGYuZ2V0UGV0cygpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2hvcClcbiAgICAgICAgICAgICAgc2VsZi5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3eC5vcGVuU2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH0sXG4gIG9uTG9hZCgpIHtcbiAgICB0aGlzLmluaXQoKVxuICB9LFxuXG4gIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5kYXRhLnBldHMubGVuZ3RoKVxuICAgICAgdGhpcy5nZXRQZXRzKClcbiAgICAgIFxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGFcbiAgICAvLyDliqDovb1cbiAgICBpZiAoZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkICYmIGRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSkge1xuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCwgZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgIH1cbiAgICBcbiAgfSxcblxuICBvblRhYkl0ZW1UYXA6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH1cbiAgfSJdfQ==