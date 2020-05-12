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
    toastShow: false,
    addressList: [],
    isReceive: false,
    receiveFee: 20,
    lastAddressId: ''
  },

  setReceiveAddress: function setReceiveAddress(e) {
    console.log(e);
  },
  selectAddress: function selectAddress(e) {
    var index = e.currentTarget.dataset.index / 1;

    var addressList = this.data.addressList;
    var address = this.data.addressList[index];

    if (address.checked) address.checked = false;else address.checked = true;

    if (this.data.lastAddressId !== '') {
      var lastAddress = this.data.addressList[this.data.lastAddressId];
      lastAddress.checked = false;
    }

    this.setData({
      lastAddressId: index,
      addressList: addressList
    });
  },
  getAddressList: function getAddressList(e) {
    var _this = this;

    //  const value = e.detail.value
    //  if (value === false)
    //   return

    //   this.setData({
    //     isReceive: value
    //   })

    var app = getApp();
    if (!app.getSessionId()) return;

    app.get('center/addressList').then(function (data) {
      var addressList = data.data.content || [];
      addressList.forEach(function (item) {
        return item.checked = false;
      });
      _this.setData({
        addressList: addressList
      });
    });
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
        _this2 = this;

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
      return console.log(_this2.data.chooseProjects);
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
    var _this3 = this;

    var index = event.currentTarget.dataset.index;
    var currentPet = this.data.pets[index];
    if (currentPet.pet_id === this.data.currentPet.pet_id) return;

    // 筛选项目 projectListFilter
    this.setData({
      currentPet: currentPet,
      chooseProjects: []
    }, function () {
      return _this3.filterProject();
    });

    this.clearAppointmentTime();
  },

  setToast: function setToast(msg) {
    var _this4 = this;

    this.setData({
      toastMsg: msg,
      toastShow: true
    }, function () {
      return setTimeout(function () {
        _this4.setData({
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

      var receiveFee = content.receiveFee;

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
        defaultBeautician: defaultBeautician,
        receiveFee: receiveFee.fee / 1
      });

      self.getPets();

      self.getAppointmentTimes(currentBeautician.beautician_id, currentAppointmentDay.day);
    }).catch(function (e) {
      console.log(e);
    });
  },

  getPets: function getPets() {
    var _this5 = this;

    var app = getApp();
    var self = this;

    app.get('myPet/findMyPets').then(function (data) {
      var currentPet = data.data.content[0];
      if (!currentPet) currentPet = {};

      self.setData({
        pets: data.data.content,
        currentPet: currentPet
      }, function () {
        return _this5.filterProject();
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
    var _this6 = this;

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
      formId: formId,
      address: (this.data.addressList.filter(function (item) {
        return item.checked;
      }).pop() || {}).my_address_id || 0
    };

    app.post('cart/appointment', data).then(function () {
      _this6._toast('预约成功!');

      _this6.getAppointmentTimes(data.beautician_id, data.appointment_day);

      setTimeout(function (x) {
        wx.switchTab({
          url: '/pages/pay/index'
        });
      }, 1000);

      // 通知
      // app.askNotice()
    }).catch(function (error) {
      _this6._toast(error.detail || '预约失败!');
    });
  },

  addPet: function addPet() {
    wx.navigateTo({
      url: '/pages/pet/index'
    });
  },
  addAddress: function addAddress() {
    wx.navigateTo({
      url: '/pages/address/index'
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

    // if (!this.data.addressList.length)
    this.getAddressList();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyIkcHJvamVjdE1vcmUiLCJkYXRhIiwiY3VycmVudFBldCIsInBldHMiLCJwcm9qZWN0X21vcmUiLCJ0b2FzdFRleHQiLCJzaG93VG9hc3QiLCJzaG9wTGlzdCIsImNwU2hvcExpc3QiLCJzaG93U2hvcExpc3RQb3AiLCJjdXJyZW50U2hvcCIsImJlYXV0aWNpYW5MaXN0IiwiY3VycmVudEJlYXV0aWNpYW4iLCJwcm9qZWN0TGlzdCIsInByb2plY3RMaXN0RmlsdGVyIiwiY3VycmVudFByb2plY3QiLCJjaG9vc2VQcm9qZWN0cyIsImFwcG9pbnRtZW50RGF5TGlzdCIsImN1cnJlbnRBcHBvaW50bWVudERheSIsImFwcG9pbnRtZW50VGltZUxpc3QiLCJjdXJyZW50QXBwb2ludG1lbnRUaW1lcyIsImRlZmF1bHRCZWF1dGljaWFuIiwidG9hc3RNc2ciLCJ0b2FzdFNob3ciLCJhZGRyZXNzTGlzdCIsImlzUmVjZWl2ZSIsInJlY2VpdmVGZWUiLCJsYXN0QWRkcmVzc0lkIiwic2V0UmVjZWl2ZUFkZHJlc3MiLCJlIiwiY29uc29sZSIsImxvZyIsInNlbGVjdEFkZHJlc3MiLCJpbmRleCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwiYWRkcmVzcyIsImNoZWNrZWQiLCJsYXN0QWRkcmVzcyIsInNldERhdGEiLCJnZXRBZGRyZXNzTGlzdCIsImFwcCIsImdldEFwcCIsImdldFNlc3Npb25JZCIsImdldCIsInRoZW4iLCJjb250ZW50IiwiZm9yRWFjaCIsIml0ZW0iLCJvblNoYXJlQXBwTWVzc2FnZSIsInRpdGxlIiwicGF0aCIsImltYWdlVXJsIiwiaGFuZGxlclNlYXJjaCIsImV2ZW50IiwidmFsdWUiLCJkZXRhaWwiLCJmaWx0ZXIiLCJzaG9wX25hbWUiLCJtYXRjaCIsIlJlZ0V4cCIsInNob3dTaG9wTGlzdCIsImNob29zZVNob3AiLCJnZXRCZWF1dGljaWFuQW5kUHJvamVjdCIsInNob3BfaWQiLCJjaG9vc2VQcm9qZWN0IiwiZmluZEluZGV4IiwiYWN0aXZlIiwic3BsaWNlIiwicHVzaCIsImNsZWFyQXBwb2ludG1lbnRUaW1lIiwidGltZUxpc3QiLCJmaWx0ZXJQcm9qZWN0IiwiaGFpciIsInByb2plY3QiLCJwcm9qZWN0X3Byb3BlcnR5IiwibGVuZ3RoIiwiY2hvb3NlUGV0IiwicGV0X2lkIiwic2V0VG9hc3QiLCJtc2ciLCJzZXRUaW1lb3V0IiwiY2hvb3NlQmVhdXRpY2lhbiIsImJlYXV0aWNpYW5faWQiLCJzaG93TG9hZGluZyIsImJlYXV0aWNpYW5JZCIsImRheSIsImdldEFwcG9pbnRtZW50VGltZXMiLCJjaG9vc2VEYXkiLCJfdG9hc3QiLCJ0ZXh0Iiwid3giLCJkdXJhdGlvbiIsImljb24iLCJjaG9vc2VUaW1lIiwiZXZlcnlUaW1lIiwidGltZSIsInZhbGlkIiwicHJvamVjdFVzZVRpbWUiLCJyZWR1Y2UiLCJpbml0IiwidXNlX3RpbWUiLCJ1c2VUaW1lTnVtIiwiTWF0aCIsImNlaWwiLCJ0aW1lTGlzdExlbmd0aCIsInN0YXJ0IiwidXNlVGltZSIsInNob3BJZCIsInNlbGYiLCJkYXlzIiwibWFwIiwic3BsaXQiLCJkYXRlIiwid2VlayIsInByb2plY3RzIiwiYmVhdXRpY2lhbnMiLCJwb3AiLCJmZWUiLCJnZXRQZXRzIiwiY2F0Y2giLCJhcHBvaW50bWVudCIsImZvcm1JZCIsInByb2plY3RJZHMiLCJwcm9qZWN0X2lkIiwiam9pbiIsImFwcG9pbnRtZW50X2RheSIsImFwcG9pbnRtZW50X3RpbWUiLCJmcm9tIiwibXlfYWRkcmVzc19pZCIsInBvc3QiLCJzd2l0Y2hUYWIiLCJ1cmwiLCJlcnJvciIsImFkZFBldCIsIm5hdmlnYXRlVG8iLCJhZGRBZGRyZXNzIiwiZ2V0TG9jYXRpb24iLCJjb21wbGV0ZSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwicmVzdWx0IiwiZmFpbCIsIm9wZW5TZXR0aW5nIiwic3VjY2VzcyIsInJlcyIs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QixJQUF3Q2xGLEtBQUtpQixxQkFBTCxDQUEyQm9FLEdBQXZFLEVBQTRFO0FBQzFFLFdBQUtDLG1CQUFMLENBQXlCdEYsS0FBS1csaUJBQUwsQ0FBdUJ1RSxhQUFoRCxFQUErRGxGLEtBQUtpQixxQkFBTCxDQUEyQm9FLEdBQTFGO0FBQ0Q7QUFFRixHOztBQUVEa0UsZ0JBQWMsd0JBQVc7QUFDdkIsU0FBS3BELElBQUw7QUFDRCIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCAkcHJvamVjdE1vcmUgPSAn6YCJ5oup6aG555uuJ1xuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6aKE57qmJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjRThFOEU4JyxcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaycsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1mbGV4JzogJ0BtaW51aS93eGMtZmxleCcsXG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICAgICd3eGMtbWFzayc6ICdAbWludWkvd3hjLW1hc2snLFxuICAgICAgICAnd3hjLXBvcHVwJzogJ0BtaW51aS93eGMtcG9wdXAnLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgICAgJ3d4Yy10b2FzdCc6ICdAbWludWkvd3hjLXRvYXN0JyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIGN1cnJlbnRQZXQ6e30sXG4gICAgICBwZXRzOiBbXSxcbiAgICAgIHByb2plY3RfbW9yZTogJHByb2plY3RNb3JlLFxuICAgICAgdG9hc3RUZXh0OiAnJyxcbiAgICAgIHNob3dUb2FzdDogZmFsc2UsXG4gICAgICBzaG9wTGlzdDogW10sXG4gICAgICBjcFNob3BMaXN0OiBbXSxcbiAgICAgIHNob3dTaG9wTGlzdFBvcDogJ2hpZGUnLFxuICAgICAgY3VycmVudFNob3A6IHt9LFxuICAgICAgYmVhdXRpY2lhbkxpc3Q6IFtdLFxuICAgICAgY3VycmVudEJlYXV0aWNpYW46IHt9LFxuICAgICAgcHJvamVjdExpc3Q6IFtdLFxuICAgICAgcHJvamVjdExpc3RGaWx0ZXI6IFtdLFxuICAgICAgY3VycmVudFByb2plY3Q6IHt9LFxuICAgICAgY2hvb3NlUHJvamVjdHM6IFtdLCAvLyDlt7Lnu4/pgInmi6nnmoTpobnnm65cbiAgICAgIGFwcG9pbnRtZW50RGF5TGlzdDogW10sXG4gICAgICBjdXJyZW50QXBwb2ludG1lbnREYXk6ICcnLFxuICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogW10sXG4gICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sIC8vIOmihOe6pueahOaXtumXtFxuICAgICAgZGVmYXVsdEJlYXV0aWNpYW46IDAsIC8vIOm7mOiupOeuoeWutlxuICAgICAgdG9hc3RNc2c6ICcnLFxuICAgICAgdG9hc3RTaG93OiBmYWxzZSxcbiAgICAgIGFkZHJlc3NMaXN0OiBbXSxcbiAgICAgIGlzUmVjZWl2ZTogZmFsc2UsXG4gICAgICByZWNlaXZlRmVlOiAyMCxcbiAgICAgIGxhc3RBZGRyZXNzSWQ6ICcnLFxuICAgIH0sXG5cbiAgICBzZXRSZWNlaXZlQWRkcmVzcyhlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH0sXG5cbiAgICBzZWxlY3RBZGRyZXNzKGUpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXggLyAxXG5cbiAgICAgIGNvbnN0IGFkZHJlc3NMaXN0ID0gIHRoaXMuZGF0YS5hZGRyZXNzTGlzdFxuICAgICAgY29uc3QgYWRkcmVzcyA9IHRoaXMuZGF0YS5hZGRyZXNzTGlzdFtpbmRleF1cblxuICAgICAgaWYgKGFkZHJlc3MuY2hlY2tlZClcbiAgICAgICAgYWRkcmVzcy5jaGVja2VkID0gZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgYWRkcmVzcy5jaGVja2VkID0gdHJ1ZVxuXG4gICAgICBpZih0aGlzLmRhdGEubGFzdEFkZHJlc3NJZCAhPT0gJycpIHtcbiAgICAgICAgY29uc3QgbGFzdEFkZHJlc3MgPSB0aGlzLmRhdGEuYWRkcmVzc0xpc3RbdGhpcy5kYXRhLmxhc3RBZGRyZXNzSWRdXG4gICAgICAgIGxhc3RBZGRyZXNzLmNoZWNrZWQgPSBmYWxzZVxuICAgICAgfVxuXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGxhc3RBZGRyZXNzSWQ6IGluZGV4LFxuICAgICAgICBhZGRyZXNzTGlzdFxuICAgICAgfVxuICAgICAgKVxuICAgIH0sXG5cbiAgICBnZXRBZGRyZXNzTGlzdChlKSB7XG4gICAgLy8gIGNvbnN0IHZhbHVlID0gZS5kZXRhaWwudmFsdWVcbiAgICAvLyAgaWYgKHZhbHVlID09PSBmYWxzZSlcbiAgICAvLyAgIHJldHVyblxuXG4gICAgLy8gICB0aGlzLnNldERhdGEoe1xuICAgIC8vICAgICBpc1JlY2VpdmU6IHZhbHVlXG4gICAgLy8gICB9KVxuXG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGlmICghYXBwLmdldFNlc3Npb25JZCgpKVxuICAgICAgICByZXR1cm5cblxuICAgICAgYXBwLmdldCgnY2VudGVyL2FkZHJlc3NMaXN0JykudGhlbihkYXRhID0+IHtcbiAgICAgICAgY29uc3QgYWRkcmVzc0xpc3QgPSBkYXRhLmRhdGEuY29udGVudCB8fCBbXVxuICAgICAgICBhZGRyZXNzTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgYWRkcmVzc0xpc3RcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGU6ICdDQVTnjKvnmoTkuJbnlYwnLFxuICAgICAgICBwYXRoOiAnL3BhZ2VzL2FydGljbGUvaW5kZXgnLFxuICAgICAgICBpbWFnZVVybDogJ2h0dHBzOi8vYXBpLm1kc2hpamllLmNvbS9zdGF0aWMvc2hhcmUucG5nJ1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIGhhbmRsZXJTZWFyY2g6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IHZhbHVlID0gZXZlbnQuZGV0YWlsLnZhbHVlXG4gICAgICBsZXQgc2hvcExpc3QgPSB0aGlzLmRhdGEuc2hvcExpc3RcbiAgICAgIGxldCBjcFNob3BMaXN0ID0gc2hvcExpc3QuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnNob3BfbmFtZS5tYXRjaChuZXcgUmVnRXhwKHZhbHVlKSlcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGNwU2hvcExpc3Q6IGNwU2hvcExpc3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIHNob3dTaG9wTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnc2hvdydcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVNob3A6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFNob3AgPSB0aGlzLmRhdGEuc2hvcExpc3RbaW5kZXhdXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50U2hvcDogY3VycmVudFNob3AsXG4gICAgICAgIHNob3dTaG9wTGlzdFBvcDogJ2hpZGUnLFxuICAgICAgfSlcblxuICAgICAgdGhpcy5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgIH0sXG5cbiAgICAvLyDpgInmi6npobnnm65cbiAgICBjaG9vc2VQcm9qZWN0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRQcm9qZWN0ID0gdGhpcy5kYXRhLnByb2plY3RMaXN0RmlsdGVyW2luZGV4XVxuXG4gICAgICAvLyDliKTmlq3mmK/lkKblt7Lnu4/pgInmi6nkuobpobnnm65cbiAgICAgIGNvbnN0IGNob29zZVByb2plY3RzID0gdGhpcy5kYXRhLmNob29zZVByb2plY3RzXG4gICAgICBjb25zdCBmaW5kSW5kZXggPSBjaG9vc2VQcm9qZWN0cy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtID09PSBjdXJyZW50UHJvamVjdClcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coZmluZEluZGV4KVxuXG4gICAgICBpZiAoZmluZEluZGV4ID49IDApIHtcbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgY2hvb3NlUHJvamVjdHMuc3BsaWNlKGZpbmRJbmRleCwgMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcbiAgICAgICAgY2hvb3NlUHJvamVjdHMucHVzaChjdXJyZW50UHJvamVjdClcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3QgcHJvamVjdExpc3QgPSB0aGlzLmRhdGEucHJvamVjdExpc3RcbiAgICAgIC8vIHByb2plY3RMaXN0W2luZGV4XSA9IGN1cnJlbnRQcm9qZWN0XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0OiBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgW2Bwcm9qZWN0TGlzdEZpbHRlclske2luZGV4fV1gXTogY3VycmVudFByb2plY3QsXG4gICAgICAgIGNob29zZVByb2plY3RzXG4gICAgICB9LCAoKSA9PiBjb25zb2xlLmxvZyh0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHMpKVxuXG5cbiAgICAgIC8vIOmihOe6puaXtumXtFxuICAgICAgdGhpcy5jbGVhckFwcG9pbnRtZW50VGltZSgpXG4gICAgfSxcbiAgICBcbiAgICBjbGVhckFwcG9pbnRtZW50VGltZSgpIHtcbiAgICAgIGxldCB0aW1lTGlzdCA9IHRoaXMuZGF0YS5hcHBvaW50bWVudFRpbWVMaXN0XG4gICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW10sXG4gICAgICAgIGFwcG9pbnRtZW50VGltZUxpc3Q6IHRpbWVMaXN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBmaWx0ZXJQcm9qZWN0KCkge1xuICAgICAgY29uc3QgY3VycmVudFBldCA9IHRoaXMuZGF0YS5jdXJyZW50UGV0XG4gICAgICBjb25zdCBoYWlyID0gY3VycmVudFBldC5oYWlyXG5cbiAgICAgIHRoaXMuZGF0YS5wcm9qZWN0TGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5hY3RpdmUgPSBmYWxzZSlcblxuICAgICAgY29uc3QgcHJvamVjdCA9IHRoaXMuZGF0YS5wcm9qZWN0TGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnByb2plY3RfcHJvcGVydHkgPT09IGhhaXIpXG5cbiAgICAgIGlmIChwcm9qZWN0Lmxlbmd0aCkge1xuICAgICAgICBsZXQgY3VycmVudFByb2plY3QgPSBwcm9qZWN0WzBdXG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFjdGl2ZSA9IHRydWVcbiAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIGNob29zZVByb2plY3RzOiBbY3VycmVudFByb2plY3RdLFxuICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgY2hvb3NlUHJvamVjdHM6IFtdXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHByb2plY3RMaXN0RmlsdGVyOiBwcm9qZWN0XG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBjaG9vc2VQZXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFBldCA9IHRoaXMuZGF0YS5wZXRzW2luZGV4XVxuICAgICAgaWYgKGN1cnJlbnRQZXQucGV0X2lkID09PSB0aGlzLmRhdGEuY3VycmVudFBldC5wZXRfaWQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICAvLyDnrZvpgInpobnnm64gcHJvamVjdExpc3RGaWx0ZXJcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRQZXQsXG4gICAgICAgIGNob29zZVByb2plY3RzOiBbXSxcbiAgICAgIH0sICgpID0+IHRoaXMuZmlsdGVyUHJvamVjdCgpKVxuXG4gICAgICB0aGlzLmNsZWFyQXBwb2ludG1lbnRUaW1lKClcbiAgICB9LFxuXG4gICAgc2V0VG9hc3QobXNnKSB7XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIHRvYXN0TXNnOiBtc2csXG4gICAgICAgICAgdG9hc3RTaG93OiB0cnVlLFxuICAgICAgICB9LCAoKSA9PiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIHRvYXN0TXNnOiAnJyxcbiAgICAgICAgICB0b2FzdFNob3c6IGZhbHNlLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0sIDIwMDApKVxuICAgIH0sXG5cbiAgICBjaG9vc2VCZWF1dGljaWFuOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRCZWF1dGljaWFuID0gdGhpcy5kYXRhLmJlYXV0aWNpYW5MaXN0W2luZGV4XVxuICAgICAgaWYgKGN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQgPT09IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkKVxuICAgICAgICByZXR1cm5cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudEJlYXV0aWNpYW46IGN1cnJlbnRCZWF1dGljaWFuLFxuICAgICAgfSlcblxuICAgICAgbGV0IHNob3dMb2FkaW5nID0gdHJ1ZVxuICAgICAgbGV0IGJlYXV0aWNpYW5JZCA9IGN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWRcbiAgICAgIGlmICh0aGlzLmRhdGEuZGVmYXVsdEJlYXV0aWNpYW4gPiAwICYmIGJlYXV0aWNpYW5JZCAhPSB0aGlzLmRhdGEuZGVmYXVsdEJlYXV0aWNpYW4pIHtcbiAgICAgICAgdGhpcy5zZXRUb2FzdCgn5oiR5Y+v5Lul5o+Q5L6b5pyN5Yqh77yM5L2G5oiR5LiN5piv5oKo55qE5LiT5bGe566h5a62JylcbiAgICAgICAgc2hvd0xvYWRpbmcgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgZGF5ID0gdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXlcbiAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhiZWF1dGljaWFuSWQsIGRheSwgc2hvd0xvYWRpbmcpXG4gICAgfSxcblxuXG4gICAgY2hvb3NlRGF5OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRBcHBvaW50bWVudERheSA9IHRoaXMuZGF0YS5hcHBvaW50bWVudERheUxpc3RbaW5kZXhdXG5cbiAgICAgIGlmIChjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5ID09PSB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheTogY3VycmVudEFwcG9pbnRtZW50RGF5LFxuICAgICAgfSlcblxuICAgICAgbGV0IGJlYXV0aWNpYW5JZCA9IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkXG4gICAgICBsZXQgZGF5ID0gY3VycmVudEFwcG9pbnRtZW50RGF5LmRheVxuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGJlYXV0aWNpYW5JZCwgZGF5KVxuICAgIH0sXG5cbiAgICBfdG9hc3QodGV4dCkge1xuICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgdGl0bGU6IHRleHQsXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVRpbWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGV2ZXJ5VGltZSA9IDMwXG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCB0aW1lID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3RbaW5kZXhdXG4gICAgICBpZiAoIXRpbWUudmFsaWQpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICBsZXQgdGltZUxpc3QgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFxuICAgICAgdGltZUxpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2hlY2tlZCA9IGZhbHNlKVxuXG4gICAgICBjb25zdCBjaG9vc2VQcm9qZWN0cyA9IHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0c1xuICAgICAgaWYgKCFjaG9vc2VQcm9qZWN0cy5sZW5ndGgpXG4gICAgICAgIHJldHVybiB0aGlzLl90b2FzdCgn6K+36YCJ5oup6aKE57qm6aG555uuJylcblxuICAgICAgY29uc3QgcHJvamVjdFVzZVRpbWUgPSBjaG9vc2VQcm9qZWN0cy5yZWR1Y2UoKGluaXQsIGl0ZW0pID0+IGl0ZW0udXNlX3RpbWUgLyAxICsgaW5pdCwgMClcblxuICAgICAgbGV0IHVzZVRpbWVOdW0gPSBNYXRoLmNlaWwocHJvamVjdFVzZVRpbWUgLyBldmVyeVRpbWUpXG4gICAgICBsZXQgdGltZUxpc3RMZW5ndGggPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdC5sZW5ndGhcbiAgICAgIGlmIChpbmRleCArIHVzZVRpbWVOdW0gPiB0aW1lTGlzdExlbmd0aCkge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSxcbiAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdCxcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5pe26Ze05LiN6LazLOivt+mHjeaWsOmAieaLqS4nKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgbGV0IHN0YXJ0ID0gMFxuICAgICAgbGV0IHVzZVRpbWUgPSBbXVxuICAgICAgd2hpbGUgKHN0YXJ0IDwgdXNlVGltZU51bSkge1xuICAgICAgICBsZXQgaXRlbSA9IHRpbWVMaXN0W2luZGV4ICsgc3RhcnQrK11cbiAgICAgICAgaWYoIWl0ZW0udmFsaWQpIHtcbiAgICAgICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG4gICAgICAgICAgdXNlVGltZSA9IFtdXG4gICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiB1c2VUaW1lLFxuICAgICAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3QsXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5pe26Ze05LiN6LazJylcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpdGVtLmNoZWNrZWQgPSB0cnVlXG4gICAgICAgIHVzZVRpbWUucHVzaChpdGVtLnRpbWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiB1c2VUaW1lLFxuICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdFxuICAgICAgfSlcblxuICAgIH0sXG5cbiAgICBnZXRCZWF1dGljaWFuQW5kUHJvamVjdDogZnVuY3Rpb24gKHNob3BJZCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgIGFwcC5nZXQoYGFwcG9pbnRtZW50L2dldEJlYXV0aWNpYW5BbmRQcm9qZWN0LyR7c2hvcElkfWApLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCBjb250ZW50ID0gKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuY29udGVudCkgfHwge31cblxuICAgICAgICBjb25zdCByZWNlaXZlRmVlID0gY29udGVudC5yZWNlaXZlRmVlXG5cbiAgICAgICAgY29udGVudC5kYXlzID0gY29udGVudC5kYXlzLm1hcChpdGVtID0+IHtcbiAgICAgICAgICBsZXQgZGF5ID0gaXRlbS5zcGxpdCgnIycpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGU6IGRheVswXSxcbiAgICAgICAgICAgIHdlZWs6IGRheVsxXSxcbiAgICAgICAgICAgIGRheTogZGF5WzJdXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnRlbnQucHJvamVjdHMgPSBjb250ZW50LnByb2plY3RzIHx8IFtdXG4gICAgICAgIGNvbnRlbnQucHJvamVjdHMuZm9yRWFjaChpdGVtID0+IGl0ZW0uYWN0aXZlID0gZmFsc2UpXG5cbiAgICAgICAgLy8g6buY6K6k6YCJ5oup55qE6aG555uuXG4gICAgICAgIGxldCBjdXJyZW50UHJvamVjdCA9IGNvbnRlbnQucHJvamVjdHNbMF0gfHwge31cbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gdHJ1ZVxuXG4gICAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IGNvbnRlbnQuYmVhdXRpY2lhbnNbMF0gfHwge31cbiAgICAgICAgXG4gICAgICAgIGxldCBkZWZhdWx0QmVhdXRpY2lhbiA9IChjb250ZW50LmRlZmF1bHRCZWF1dGljaWFuIHx8IDApIC8gMVxuICAgICAgICBpZiAoZGVmYXVsdEJlYXV0aWNpYW4gPiAwKSB7XG4gICAgICAgICAgY3VycmVudEJlYXV0aWNpYW4gPSBjb250ZW50LmJlYXV0aWNpYW5zLmZpbHRlcihpdGVtID0+IGl0ZW0uYmVhdXRpY2lhbl9pZCA9PSBkZWZhdWx0QmVhdXRpY2lhbikucG9wKClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJyZW50QXBwb2ludG1lbnREYXkgPSBjb250ZW50LmRheXNbMF0gfHwge31cblxuICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgIGJlYXV0aWNpYW5MaXN0OiBjb250ZW50LmJlYXV0aWNpYW5zLFxuICAgICAgICAgIHByb2plY3RMaXN0OiBjb250ZW50LnByb2plY3RzLFxuICAgICAgICAgIHByb2plY3RfbW9yZTogJHByb2plY3RNb3JlLFxuICAgICAgICAgIGFwcG9pbnRtZW50RGF5TGlzdDogY29udGVudC5kYXlzLFxuICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgIGNob29zZVByb2plY3RzOiBbY3VycmVudFByb2plY3RdLFxuICAgICAgICAgIGN1cnJlbnRCZWF1dGljaWFuLFxuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheSxcbiAgICAgICAgICBkZWZhdWx0QmVhdXRpY2lhbixcbiAgICAgICAgICByZWNlaXZlRmVlOiByZWNlaXZlRmVlLmZlZSAvIDFcbiAgICAgICAgfSlcblxuICAgICAgICBzZWxmLmdldFBldHMoKVxuXG4gICAgICAgIHNlbGYuZ2V0QXBwb2ludG1lbnRUaW1lcyhjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLCBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldFBldHMoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgICBhcHAuZ2V0KCdteVBldC9maW5kTXlQZXRzJykudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRQZXQgPSBkYXRhLmRhdGEuY29udGVudFswXVxuICAgICAgICBpZiAoIWN1cnJlbnRQZXQpXG4gICAgICAgICAgY3VycmVudFBldCA9IHt9XG5cbiAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICBwZXRzOiBkYXRhLmRhdGEuY29udGVudCxcbiAgICAgICAgICBjdXJyZW50UGV0LFxuICAgICAgICB9LCAoKSA9PiB0aGlzLmZpbHRlclByb2plY3QoKSlcbiAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgZ2V0QXBwb2ludG1lbnRUaW1lczogZnVuY3Rpb24gKGJlYXV0aWNpYW5JZCwgZGF5LCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW11cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBhcHAuZ2V0KCdhcHBvaW50bWVudC9nZXRBcHBvaW50bWVudFRpbWUvJyArIGJlYXV0aWNpYW5JZCArICcvJyArIGRheSwgJycsIHNob3dMb2FkaW5nKVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBjb250ZW50ID0gKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuY29udGVudCkgfHwgW11cbiAgICAgICAgICAvLyBmb3IgKHZhciBpIGluIFswLCAwLCAwLCAwXSlcbiAgICAgICAgICAvLyAgIGNvbnRlbnQucHVzaCh7fSlcblxuICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiBjb250ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5Y+R6YCB6aKE57qmXG4gICAgYXBwb2ludG1lbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgZm9ybUlkID0gZXZlbnQuZGV0YWlsLmZvcm1JZFxuICAgICAgY29uc3QgY2hvb3NlUHJvamVjdHMgPSB0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHNcbiAgICAgIGlmICghY2hvb3NlUHJvamVjdHMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9hc3QoJ+ivt+mAieaLqemihOe6pumhueebricpXG5cbiAgICAgIGlmICghdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudFRpbWVzLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvYXN0KCfor7fpgInmi6npooTnuqbml7bpl7QnKVxuICAgICAgXG4gICAgICAvLyDpooTnuqbpobnnm65cbiAgICAgIGxldCBwcm9qZWN0SWRzID0gY2hvb3NlUHJvamVjdHMubWFwKGl0ZW0gPT4gaXRlbS5wcm9qZWN0X2lkKVxuICAgICAgcHJvamVjdElkcyA9IHByb2plY3RJZHMuam9pbignLCcpXG5cbiAgICAgIC8vIOmihOe6plxuICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIHNob3BfaWQ6IHRoaXMuZGF0YS5jdXJyZW50U2hvcC5zaG9wX2lkLFxuICAgICAgICBwZXRfaWQ6IHRoaXMuZGF0YS5jdXJyZW50UGV0LnBldF9pZCxcbiAgICAgICAgYmVhdXRpY2lhbl9pZDogdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQsXG4gICAgICAgIHByb2plY3RfaWQ6IHByb2plY3RJZHMsXG4gICAgICAgIGFwcG9pbnRtZW50X2RheTogdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXksXG4gICAgICAgIGFwcG9pbnRtZW50X3RpbWU6IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnRUaW1lcy5qb2luKCcsJyksXG4gICAgICAgIGZyb206ICd4Y3gnLFxuICAgICAgICBmb3JtSWQ6IGZvcm1JZCxcbiAgICAgICAgYWRkcmVzczogKCh0aGlzLmRhdGEuYWRkcmVzc0xpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jaGVja2VkKS5wb3AoKSB8fCB7fSkubXlfYWRkcmVzc19pZCB8fCAwKVxuICAgICAgfVxuXG4gICAgICBhcHAucG9zdCgnY2FydC9hcHBvaW50bWVudCcsIGRhdGEpXG4gICAgICAgIC50aGVuKCgpID0+ICAge1xuICAgICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbmiJDlip8hJylcblxuICAgICAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhkYXRhLmJlYXV0aWNpYW5faWQsIGRhdGEuYXBwb2ludG1lbnRfZGF5KVxuICAgICAgICAgIFxuICAgICAgICAgIHNldFRpbWVvdXQoeCA9PiAge1xuICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvcGF5L2luZGV4J1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9LCAxMDAwKVxuXG4gICAgICAgICAgLy8g6YCa55+lXG4gICAgICAgICAgLy8gYXBwLmFza05vdGljZSgpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgdGhpcy5fdG9hc3QoZXJyb3IuZGV0YWlsIHx8ICfpooTnuqblpLHotKUhJylcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgYWRkUGV0KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogJy9wYWdlcy9wZXQvaW5kZXgnXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBhZGRBZGRyZXNzKCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogJy9wYWdlcy9hZGRyZXNzL2luZGV4J1xuICAgICAgfSkgICBcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgXG4gICAgICB3eC5nZXRMb2NhdGlvbih7XG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgIT09ICdbb2JqZWN0IE9iamVjdF0nKVxuICAgICAgICAgICAgZGF0YSA9IHt9XG5cbiAgICAgICAgICBhcHAuZ2V0KCdzaG9wL2dldExpc3QnLCB7bGF0aXR1ZGU6IGRhdGEubGF0aXR1ZGUgfHwgJycsIGxvbmdpdHVkZTogZGF0YS5sb25naXR1ZGUgfHwgJyd9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTaG9wID0gcmVzdWx0LmNvbnRlbnRbMF0gfHwge31cbiAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgIHNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgICAgY3BTaG9wTGlzdDogcmVzdWx0LmNvbnRlbnQsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyDliKTmlq1zaG9wX2lk5piv5ZCm5a2Y5ZyoXG4gICAgICAgICAgICBpZihzZWxmLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCkge1xuICAgICAgICAgICAgICBjdXJyZW50U2hvcCA9IHNlbGYuZGF0YS5jdXJyZW50U2hvcFxuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlbGYuZ2V0UGV0cygpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2hvcClcbiAgICAgICAgICAgICAgc2VsZi5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3eC5vcGVuU2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH0sXG4gIG9uTG9hZCgpIHtcbiAgICB0aGlzLmluaXQoKVxuICB9LFxuXG4gIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5kYXRhLnBldHMubGVuZ3RoKVxuICAgICAgdGhpcy5nZXRQZXRzKClcblxuICAgIC8vIGlmICghdGhpcy5kYXRhLmFkZHJlc3NMaXN0Lmxlbmd0aClcbiAgICB0aGlzLmdldEFkZHJlc3NMaXN0KClcbiAgICAgIFxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGFcbiAgICAvLyDliqDovb1cbiAgICBpZiAoZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkICYmIGRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSkge1xuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCwgZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgIH1cbiAgICBcbiAgfSxcblxuICBvblRhYkl0ZW1UYXA6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH1cbiAgfSJdfQ==