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

    if (this.data.lastAddressId !== '' && this.data.lastAddressId != index) {
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
    var _this5 = this;

    var index = event.currentTarget.dataset.index;
    var currentBeautician = this.data.beauticianList[index];
    if (currentBeautician.beautician_id === this.data.currentBeautician.beautician_id) return;

    this.setData({
      currentBeautician: currentBeautician
    });

    var showLoading = true;
    var beauticianId = currentBeautician.beautician_id;
    if (this.data.defaultBeautician > 0 && beauticianId != this.data.defaultBeautician) {
      var defaultBeautician = this.data.beauticianList.filter(function (item) {
        return item.beautician_id == _this5.data.defaultBeautician;
      }).pop();
      var name = defaultBeautician.name;
      this.setToast('我可以提供服务， 但您的专属管家是' + name + '哟');
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
    var _this6 = this;

    var app = getApp();
    var self = this;

    app.get('myPet/findMyPets').then(function (data) {
      var currentPet = data.data.content[0];
      if (!currentPet) currentPet = {};

      self.setData({
        pets: data.data.content,
        currentPet: currentPet
      }, function () {
        return _this6.filterProject();
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
    var _this7 = this;

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
      _this7._toast('预约成功!');

      _this7.getAppointmentTimes(data.beautician_id, data.appointment_day);

      setTimeout(function (x) {
        wx.switchTab({
          url: '/pages/pay/index'
        });
      }, 1000);

      // 通知
      // app.askNotice()
    }).catch(function (error) {
      _this7._toast(error.detail || '预约失败!');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyIkcHJvamVjdE1vcmUiLCJkYXRhIiwiY3VycmVudFBldCIsInBldHMiLCJwcm9qZWN0X21vcmUiLCJ0b2FzdFRleHQiLCJzaG93VG9hc3QiLCJzaG9wTGlzdCIsImNwU2hvcExpc3QiLCJzaG93U2hvcExpc3RQb3AiLCJjdXJyZW50U2hvcCIsImJlYXV0aWNpYW5MaXN0IiwiY3VycmVudEJlYXV0aWNpYW4iLCJwcm9qZWN0TGlzdCIsInByb2plY3RMaXN0RmlsdGVyIiwiY3VycmVudFByb2plY3QiLCJjaG9vc2VQcm9qZWN0cyIsImFwcG9pbnRtZW50RGF5TGlzdCIsImN1cnJlbnRBcHBvaW50bWVudERheSIsImFwcG9pbnRtZW50VGltZUxpc3QiLCJjdXJyZW50QXBwb2ludG1lbnRUaW1lcyIsImRlZmF1bHRCZWF1dGljaWFuIiwidG9hc3RNc2ciLCJ0b2FzdFNob3ciLCJhZGRyZXNzTGlzdCIsImlzUmVjZWl2ZSIsInJlY2VpdmVGZWUiLCJsYXN0QWRkcmVzc0lkIiwic2V0UmVjZWl2ZUFkZHJlc3MiLCJlIiwiY29uc29sZSIsImxvZyIsInNlbGVjdEFkZHJlc3MiLCJpbmRleCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwiYWRkcmVzcyIsImNoZWNrZWQiLCJsYXN0QWRkcmVzcyIsInNldERhdGEiLCJnZXRBZGRyZXNzTGlzdCIsImFwcCIsImdldEFwcCIsImdldFNlc3Npb25JZCIsImdldCIsInRoZW4iLCJjb250ZW50IiwiZm9yRWFjaCIsIml0ZW0iLCJvblNoYXJlQXBwTWVzc2FnZSIsInRpdGxlIiwicGF0aCIsImltYWdlVXJsIiwiaGFuZGxlclNlYXJjaCIsImV2ZW50IiwidmFsdWUiLCJkZXRhaWwiLCJmaWx0ZXIiLCJzaG9wX25hbWUiLCJtYXRjaCIsIlJlZ0V4cCIsInNob3dTaG9wTGlzdCIsImNob29zZVNob3AiLCJnZXRCZWF1dGljaWFuQW5kUHJvamVjdCIsInNob3BfaWQiLCJjaG9vc2VQcm9qZWN0IiwiZmluZEluZGV4IiwiYWN0aXZlIiwic3BsaWNlIiwicHVzaCIsImNsZWFyQXBwb2ludG1lbnRUaW1lIiwidGltZUxpc3QiLCJmaWx0ZXJQcm9qZWN0IiwiaGFpciIsInByb2plY3QiLCJwcm9qZWN0X3Byb3BlcnR5IiwibGVuZ3RoIiwiY2hvb3NlUGV0IiwicGV0X2lkIiwic2V0VG9hc3QiLCJtc2ciLCJzZXRUaW1lb3V0IiwiY2hvb3NlQmVhdXRpY2lhbiIsImJlYXV0aWNpYW5faWQiLCJzaG93TG9hZGluZyIsImJlYXV0aWNpYW5JZCIsInBvcCIsIm5hbWUiLCJkYXkiLCJnZXRBcHBvaW50bWVudFRpbWVzIiwiY2hvb3NlRGF5IiwiX3RvYXN0IiwidGV4dCIsInd4IiwiZHVyYXRpb24iLCJpY29uIiwiY2hvb3NlVGltZSIsImV2ZXJ5VGltZSIsInRpbWUiLCJ2YWxpZCIsInByb2plY3RVc2VUaW1lIiwicmVkdWNlIiwiaW5pdCIsInVzZV90aW1lIiwidXNlVGltZU51bSIsIk1hdGgiLCJjZWlsIiwidGltZUxpc3RMZW5ndGgiLCJzdGFydCIsInVzZVRpbWUiLCJzaG9wSWQiLCJzZWxmIiwiZGF5cyIsIm1hcCIsInNwbGl0IiwiZGF0ZSIsIndlZWsiLCJwcm9qZWN0cyIsImJlYXV0aWNpYW5zIiwiZmVlIiwiZ2V0UGV0cyIsImNhdGNoIiwiYXBwb2ludG1lbnQiLCJmb3JtSWQiLCJwcm9qZWN0SWRzIiwicHJvamVjdF9pZCIsImpvaW4iLCJhcHBvaW50bWVudF9kYXkiLCJhcHBvaW50bWVudF90aW1lIiwiZnJvbSIsIm15X2FkZHJlc3NfaWQiLCJwb3N0Iiwic3dpdGNoVGFiIiwidXJsIiwiZXJyb3IiLCJhZGRQZXQiLCJuYXZpZ2F0ZVRvIiwiYWRkQWRkcmVzcyIsImdldExvY2F0aW9uIiwiY29tcGxldGUiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInJlc3VsdCIsImZhaWwiLCJvcGVuU2V0dGluZyIsInN1Y2Nlc3Mi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akI7QUFKWSxTQUFmO0FBTUQ7QUF0Q1ksS0FBZjtBQXdDSCxHO0FBQ0RJLFEsb0JBQVM7QUFDUCxTQUFLakQsSUFBTDtBQUNELEc7OztBQUVEa0QsVUFBUSxrQkFBWTtBQUNsQixRQUFJLENBQUMsS0FBS3ZKLElBQUwsQ0FBVUUsSUFBVixDQUFleUUsTUFBcEIsRUFDRSxLQUFLNEMsT0FBTDs7QUFFRjtBQUNBLFNBQUtoRixjQUFMOztBQUVBLFFBQU12QyxPQUFPLEtBQUtBLElBQWxCO0FBQ0E7QUFDQSxRQUFJQSxLQUFLVyxpQkFBTCxDQUF1QnVFLGFBQXZCLElBQXdDbEYsS0FBS2lCLHFCQUFMLENBQTJCc0UsR0FBdkUsRUFBNEU7QUFDMUUsV0FBS0MsbUJBQUwsQ0FBeUJ4RixLQUFLVyxpQkFBTCxDQUF1QnVFLGFBQWhELEVBQStEbEYsS0FBS2lCLHFCQUFMLENBQTJCc0UsR0FBMUY7QUFDRDtBQUVGLEc7O0FBRURpRSxnQkFBYyx3QkFBVztBQUN2QixTQUFLbkQsSUFBTDtBQUNEIiwiZmlsZSI6ImluZGV4Lnd4cCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0ICRwcm9qZWN0TW9yZSA9ICfpgInmi6npobnnm64nXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWc6IHtcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfpooTnuqYnLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNFOEU4RTgnLFxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJyxcbiAgICAgIHVzaW5nQ29tcG9uZW50czoge1xuICAgICAgICAnd3hjLWZsZXgnOiAnQG1pbnVpL3d4Yy1mbGV4JyxcbiAgICAgICAgJ3d4Yy1pY29uJzogJ0BtaW51aS93eGMtaWNvbicsXG4gICAgICAgICd3eGMtYXZhdGFyJzogJ0BtaW51aS93eGMtYXZhdGFyJyxcbiAgICAgICAgJ3d4Yy1tYXNrJzogJ0BtaW51aS93eGMtbWFzaycsXG4gICAgICAgICd3eGMtcG9wdXAnOiAnQG1pbnVpL3d4Yy1wb3B1cCcsXG4gICAgICAgICd3eGMtZWxpcCc6ICdAbWludWkvd3hjLWVsaXAnLFxuICAgICAgICAnd3hjLXRvYXN0JzogJ0BtaW51aS93eGMtdG9hc3QnLFxuICAgICAgfVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgY3VycmVudFBldDp7fSxcbiAgICAgIHBldHM6IFtdLFxuICAgICAgcHJvamVjdF9tb3JlOiAkcHJvamVjdE1vcmUsXG4gICAgICB0b2FzdFRleHQ6ICcnLFxuICAgICAgc2hvd1RvYXN0OiBmYWxzZSxcbiAgICAgIHNob3BMaXN0OiBbXSxcbiAgICAgIGNwU2hvcExpc3Q6IFtdLFxuICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnaGlkZScsXG4gICAgICBjdXJyZW50U2hvcDoge30sXG4gICAgICBiZWF1dGljaWFuTGlzdDogW10sXG4gICAgICBjdXJyZW50QmVhdXRpY2lhbjoge30sXG4gICAgICBwcm9qZWN0TGlzdDogW10sXG4gICAgICBwcm9qZWN0TGlzdEZpbHRlcjogW10sXG4gICAgICBjdXJyZW50UHJvamVjdDoge30sXG4gICAgICBjaG9vc2VQcm9qZWN0czogW10sIC8vIOW3sue7j+mAieaLqeeahOmhueebrlxuICAgICAgYXBwb2ludG1lbnREYXlMaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheTogJycsXG4gICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiBbXSxcbiAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSwgLy8g6aKE57qm55qE5pe26Ze0XG4gICAgICBkZWZhdWx0QmVhdXRpY2lhbjogMCwgLy8g6buY6K6k566h5a62XG4gICAgICB0b2FzdE1zZzogJycsXG4gICAgICB0b2FzdFNob3c6IGZhbHNlLFxuICAgICAgYWRkcmVzc0xpc3Q6IFtdLFxuICAgICAgaXNSZWNlaXZlOiBmYWxzZSxcbiAgICAgIHJlY2VpdmVGZWU6IDIwLFxuICAgICAgbGFzdEFkZHJlc3NJZDogJycsXG4gICAgfSxcblxuICAgIHNldFJlY2VpdmVBZGRyZXNzKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfSxcblxuICAgIHNlbGVjdEFkZHJlc3MoZSkge1xuICAgICAgY29uc3QgaW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleCAvIDFcblxuICAgICAgY29uc3QgYWRkcmVzc0xpc3QgPSAgdGhpcy5kYXRhLmFkZHJlc3NMaXN0XG4gICAgICBjb25zdCBhZGRyZXNzID0gdGhpcy5kYXRhLmFkZHJlc3NMaXN0W2luZGV4XVxuXG4gICAgICBpZiAoYWRkcmVzcy5jaGVja2VkKVxuICAgICAgICBhZGRyZXNzLmNoZWNrZWQgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICBhZGRyZXNzLmNoZWNrZWQgPSB0cnVlXG5cbiAgICAgIGlmKHRoaXMuZGF0YS5sYXN0QWRkcmVzc0lkICE9PSAnJyAmJiB0aGlzLmRhdGEubGFzdEFkZHJlc3NJZCAhPSBpbmRleCkge1xuICAgICAgICBjb25zdCBsYXN0QWRkcmVzcyA9IHRoaXMuZGF0YS5hZGRyZXNzTGlzdFt0aGlzLmRhdGEubGFzdEFkZHJlc3NJZF1cbiAgICAgICAgbGFzdEFkZHJlc3MuY2hlY2tlZCA9IGZhbHNlXG4gICAgICB9XG5cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgbGFzdEFkZHJlc3NJZDogaW5kZXgsXG4gICAgICAgIGFkZHJlc3NMaXN0XG4gICAgICB9XG4gICAgICApXG4gICAgfSxcblxuICAgIGdldEFkZHJlc3NMaXN0KGUpIHtcbiAgICAvLyAgY29uc3QgdmFsdWUgPSBlLmRldGFpbC52YWx1ZVxuICAgIC8vICBpZiAodmFsdWUgPT09IGZhbHNlKVxuICAgIC8vICAgcmV0dXJuXG5cbiAgICAvLyAgIHRoaXMuc2V0RGF0YSh7XG4gICAgLy8gICAgIGlzUmVjZWl2ZTogdmFsdWVcbiAgICAvLyAgIH0pXG5cbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgaWYgKCFhcHAuZ2V0U2Vzc2lvbklkKCkpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBhcHAuZ2V0KCdjZW50ZXIvYWRkcmVzc0xpc3QnKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBjb25zdCBhZGRyZXNzTGlzdCA9IGRhdGEuZGF0YS5jb250ZW50IHx8IFtdXG4gICAgICAgIGFkZHJlc3NMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBhZGRyZXNzTGlzdFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgb25TaGFyZUFwcE1lc3NhZ2UoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogJ0NBVOeMq+eahOS4lueVjCcsXG4gICAgICAgIHBhdGg6ICcvcGFnZXMvYXJ0aWNsZS9pbmRleCcsXG4gICAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9hcGkubWRzaGlqaWUuY29tL3N0YXRpYy9zaGFyZS5wbmcnXG4gICAgICB9XG4gICAgfSxcblxuXG4gICAgaGFuZGxlclNlYXJjaDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgdmFsdWUgPSBldmVudC5kZXRhaWwudmFsdWVcbiAgICAgIGxldCBzaG9wTGlzdCA9IHRoaXMuZGF0YS5zaG9wTGlzdFxuICAgICAgbGV0IGNwU2hvcExpc3QgPSBzaG9wTGlzdC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uc2hvcF9uYW1lLm1hdGNoKG5ldyBSZWdFeHAodmFsdWUpKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3BTaG9wTGlzdDogY3BTaG9wTGlzdFxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgc2hvd1Nob3BMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBzaG93U2hvcExpc3RQb3A6ICdzaG93J1xuICAgICAgfSlcbiAgICB9LFxuXG4gICAgY2hvb3NlU2hvcDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50U2hvcCA9IHRoaXMuZGF0YS5zaG9wTGlzdFtpbmRleF1cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRTaG9wOiBjdXJyZW50U2hvcCxcbiAgICAgICAgc2hvd1Nob3BMaXN0UG9wOiAnaGlkZScsXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmdldEJlYXV0aWNpYW5BbmRQcm9qZWN0KGN1cnJlbnRTaG9wLnNob3BfaWQpXG4gICAgfSxcblxuICAgIC8vIOmAieaLqemhueebrlxuICAgIGNob29zZVByb2plY3Q6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudFByb2plY3QgPSB0aGlzLmRhdGEucHJvamVjdExpc3RGaWx0ZXJbaW5kZXhdXG5cbiAgICAgIC8vIOWIpOaWreaYr+WQpuW3sue7j+mAieaLqeS6humhueebrlxuICAgICAgY29uc3QgY2hvb3NlUHJvamVjdHMgPSB0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHNcbiAgICAgIGNvbnN0IGZpbmRJbmRleCA9IGNob29zZVByb2plY3RzLmZpbmRJbmRleChpdGVtID0+IGl0ZW0gPT09IGN1cnJlbnRQcm9qZWN0KVxuICAgICAgXG4gICAgICBjb25zb2xlLmxvZyhmaW5kSW5kZXgpXG5cbiAgICAgIGlmIChmaW5kSW5kZXggPj0gMCkge1xuICAgICAgICBjdXJyZW50UHJvamVjdC5hY3RpdmUgPSBmYWxzZVxuICAgICAgICBjaG9vc2VQcm9qZWN0cy5zcGxpY2UoZmluZEluZGV4LCAxKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gdHJ1ZVxuICAgICAgICBjaG9vc2VQcm9qZWN0cy5wdXNoKGN1cnJlbnRQcm9qZWN0KVxuICAgICAgfVxuXG4gICAgICAvLyBjb25zdCBwcm9qZWN0TGlzdCA9IHRoaXMuZGF0YS5wcm9qZWN0TGlzdFxuICAgICAgLy8gcHJvamVjdExpc3RbaW5kZXhdID0gY3VycmVudFByb2plY3RcblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudFByb2plY3Q6IGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICBbYHByb2plY3RMaXN0RmlsdGVyWyR7aW5kZXh9XWBdOiBjdXJyZW50UHJvamVjdCxcbiAgICAgICAgY2hvb3NlUHJvamVjdHNcbiAgICAgIH0sICgpID0+IGNvbnNvbGUubG9nKHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0cykpXG5cblxuICAgICAgLy8g6aKE57qm5pe26Ze0XG4gICAgICB0aGlzLmNsZWFyQXBwb2ludG1lbnRUaW1lKClcbiAgICB9LFxuICAgIFxuICAgIGNsZWFyQXBwb2ludG1lbnRUaW1lKCkge1xuICAgICAgbGV0IHRpbWVMaXN0ID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3RcbiAgICAgIHRpbWVMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmNoZWNrZWQgPSBmYWxzZSlcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSxcbiAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGZpbHRlclByb2plY3QoKSB7XG4gICAgICBjb25zdCBjdXJyZW50UGV0ID0gdGhpcy5kYXRhLmN1cnJlbnRQZXRcbiAgICAgIGNvbnN0IGhhaXIgPSBjdXJyZW50UGV0LmhhaXJcblxuICAgICAgdGhpcy5kYXRhLnByb2plY3RMaXN0LmZvckVhY2goaXRlbSA9PiBpdGVtLmFjdGl2ZSA9IGZhbHNlKVxuXG4gICAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5kYXRhLnByb2plY3RMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0ucHJvamVjdF9wcm9wZXJ0eSA9PT0gaGFpcilcblxuICAgICAgaWYgKHByb2plY3QubGVuZ3RoKSB7XG4gICAgICAgIGxldCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RbMF1cbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgICAgY2hvb3NlUHJvamVjdHM6IFtjdXJyZW50UHJvamVjdF0sXG4gICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBjaG9vc2VQcm9qZWN0czogW11cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgcHJvamVjdExpc3RGaWx0ZXI6IHByb2plY3RcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVBldDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCBjdXJyZW50UGV0ID0gdGhpcy5kYXRhLnBldHNbaW5kZXhdXG4gICAgICBpZiAoY3VycmVudFBldC5wZXRfaWQgPT09IHRoaXMuZGF0YS5jdXJyZW50UGV0LnBldF9pZClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIC8vIOetm+mAiemhueebriBwcm9qZWN0TGlzdEZpbHRlclxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgY3VycmVudFBldCxcbiAgICAgICAgY2hvb3NlUHJvamVjdHM6IFtdLFxuICAgICAgfSwgKCkgPT4gdGhpcy5maWx0ZXJQcm9qZWN0KCkpXG5cbiAgICAgIHRoaXMuY2xlYXJBcHBvaW50bWVudFRpbWUoKVxuICAgIH0sXG5cbiAgICBzZXRUb2FzdChtc2cpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgdG9hc3RNc2c6IG1zZyxcbiAgICAgICAgICB0b2FzdFNob3c6IHRydWUsXG4gICAgICAgIH0sICgpID0+IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgdG9hc3RNc2c6ICcnLFxuICAgICAgICAgIHRvYXN0U2hvdzogZmFsc2UsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSwgMjAwMCkpXG4gICAgfSxcblxuICAgIGNob29zZUJlYXV0aWNpYW46IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgICBsZXQgY3VycmVudEJlYXV0aWNpYW4gPSB0aGlzLmRhdGEuYmVhdXRpY2lhbkxpc3RbaW5kZXhdXG4gICAgICBpZiAoY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCA9PT0gdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQpXG4gICAgICAgIHJldHVyblxuXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QmVhdXRpY2lhbjogY3VycmVudEJlYXV0aWNpYW4sXG4gICAgICB9KVxuXG4gICAgICBsZXQgc2hvd0xvYWRpbmcgPSB0cnVlXG4gICAgICBsZXQgYmVhdXRpY2lhbklkID0gY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZFxuICAgICAgaWYgKHRoaXMuZGF0YS5kZWZhdWx0QmVhdXRpY2lhbiA+IDAgJiYgYmVhdXRpY2lhbklkICE9IHRoaXMuZGF0YS5kZWZhdWx0QmVhdXRpY2lhbikge1xuICAgICAgICBjb25zdCBkZWZhdWx0QmVhdXRpY2lhbiA9IHRoaXMuZGF0YS5iZWF1dGljaWFuTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLmJlYXV0aWNpYW5faWQgPT0gdGhpcy5kYXRhLmRlZmF1bHRCZWF1dGljaWFuKS5wb3AoKVxuICAgICAgICBjb25zdCBuYW1lID0gZGVmYXVsdEJlYXV0aWNpYW4ubmFtZVxuICAgICAgICB0aGlzLnNldFRvYXN0KCfmiJHlj6/ku6Xmj5DkvpvmnI3liqHvvIwg5L2G5oKo55qE5LiT5bGe566h5a625pivJyArIG5hbWUgKyAn5ZOfJylcbiAgICAgICAgc2hvd0xvYWRpbmcgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgZGF5ID0gdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXlcbiAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhiZWF1dGljaWFuSWQsIGRheSwgc2hvd0xvYWRpbmcpXG4gICAgfSxcblxuXG4gICAgY2hvb3NlRGF5OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgICAgbGV0IGN1cnJlbnRBcHBvaW50bWVudERheSA9IHRoaXMuZGF0YS5hcHBvaW50bWVudERheUxpc3RbaW5kZXhdXG5cbiAgICAgIGlmIChjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5ID09PSB0aGlzLmRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheTogY3VycmVudEFwcG9pbnRtZW50RGF5LFxuICAgICAgfSlcblxuICAgICAgbGV0IGJlYXV0aWNpYW5JZCA9IHRoaXMuZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkXG4gICAgICBsZXQgZGF5ID0gY3VycmVudEFwcG9pbnRtZW50RGF5LmRheVxuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGJlYXV0aWNpYW5JZCwgZGF5KVxuICAgIH0sXG5cbiAgICBfdG9hc3QodGV4dCkge1xuICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgdGl0bGU6IHRleHQsXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGNob29zZVRpbWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGV2ZXJ5VGltZSA9IDMwXG4gICAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICAgIGxldCB0aW1lID0gdGhpcy5kYXRhLmFwcG9pbnRtZW50VGltZUxpc3RbaW5kZXhdXG4gICAgICBpZiAoIXRpbWUudmFsaWQpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICBsZXQgdGltZUxpc3QgPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdFxuICAgICAgdGltZUxpc3QuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2hlY2tlZCA9IGZhbHNlKVxuXG4gICAgICBjb25zdCBjaG9vc2VQcm9qZWN0cyA9IHRoaXMuZGF0YS5jaG9vc2VQcm9qZWN0c1xuICAgICAgaWYgKCFjaG9vc2VQcm9qZWN0cy5sZW5ndGgpXG4gICAgICAgIHJldHVybiB0aGlzLl90b2FzdCgn6K+36YCJ5oup6aKE57qm6aG555uuJylcblxuICAgICAgY29uc3QgcHJvamVjdFVzZVRpbWUgPSBjaG9vc2VQcm9qZWN0cy5yZWR1Y2UoKGluaXQsIGl0ZW0pID0+IGl0ZW0udXNlX3RpbWUgLyAxICsgaW5pdCwgMClcblxuICAgICAgbGV0IHVzZVRpbWVOdW0gPSBNYXRoLmNlaWwocHJvamVjdFVzZVRpbWUgLyBldmVyeVRpbWUpXG4gICAgICBsZXQgdGltZUxpc3RMZW5ndGggPSB0aGlzLmRhdGEuYXBwb2ludG1lbnRUaW1lTGlzdC5sZW5ndGhcbiAgICAgIGlmIChpbmRleCArIHVzZVRpbWVOdW0gPiB0aW1lTGlzdExlbmd0aCkge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiBbXSxcbiAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdCxcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5pe26Ze05LiN6LazLOivt+mHjeaWsOmAieaLqS4nKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgbGV0IHN0YXJ0ID0gMFxuICAgICAgbGV0IHVzZVRpbWUgPSBbXVxuICAgICAgd2hpbGUgKHN0YXJ0IDwgdXNlVGltZU51bSkge1xuICAgICAgICBsZXQgaXRlbSA9IHRpbWVMaXN0W2luZGV4ICsgc3RhcnQrK11cbiAgICAgICAgaWYoIWl0ZW0udmFsaWQpIHtcbiAgICAgICAgICB0aW1lTGlzdC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jaGVja2VkID0gZmFsc2UpXG4gICAgICAgICAgdXNlVGltZSA9IFtdXG4gICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiB1c2VUaW1lLFxuICAgICAgICAgICAgYXBwb2ludG1lbnRUaW1lTGlzdDogdGltZUxpc3QsXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl90b2FzdCgn6aKE57qm5pe26Ze05LiN6LazJylcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpdGVtLmNoZWNrZWQgPSB0cnVlXG4gICAgICAgIHVzZVRpbWUucHVzaChpdGVtLnRpbWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIGN1cnJlbnRBcHBvaW50bWVudFRpbWVzOiB1c2VUaW1lLFxuICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiB0aW1lTGlzdFxuICAgICAgfSlcblxuICAgIH0sXG5cbiAgICBnZXRCZWF1dGljaWFuQW5kUHJvamVjdDogZnVuY3Rpb24gKHNob3BJZCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgIGFwcC5nZXQoYGFwcG9pbnRtZW50L2dldEJlYXV0aWNpYW5BbmRQcm9qZWN0LyR7c2hvcElkfWApLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCBjb250ZW50ID0gKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuY29udGVudCkgfHwge31cblxuICAgICAgICBjb25zdCByZWNlaXZlRmVlID0gY29udGVudC5yZWNlaXZlRmVlXG5cbiAgICAgICAgY29udGVudC5kYXlzID0gY29udGVudC5kYXlzLm1hcChpdGVtID0+IHtcbiAgICAgICAgICBsZXQgZGF5ID0gaXRlbS5zcGxpdCgnIycpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGU6IGRheVswXSxcbiAgICAgICAgICAgIHdlZWs6IGRheVsxXSxcbiAgICAgICAgICAgIGRheTogZGF5WzJdXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnRlbnQucHJvamVjdHMgPSBjb250ZW50LnByb2plY3RzIHx8IFtdXG4gICAgICAgIGNvbnRlbnQucHJvamVjdHMuZm9yRWFjaChpdGVtID0+IGl0ZW0uYWN0aXZlID0gZmFsc2UpXG5cbiAgICAgICAgLy8g6buY6K6k6YCJ5oup55qE6aG555uuXG4gICAgICAgIGxldCBjdXJyZW50UHJvamVjdCA9IGNvbnRlbnQucHJvamVjdHNbMF0gfHwge31cbiAgICAgICAgY3VycmVudFByb2plY3QuYWN0aXZlID0gdHJ1ZVxuXG4gICAgICAgIGxldCBjdXJyZW50QmVhdXRpY2lhbiA9IGNvbnRlbnQuYmVhdXRpY2lhbnNbMF0gfHwge31cbiAgICAgICAgXG4gICAgICAgIGxldCBkZWZhdWx0QmVhdXRpY2lhbiA9IChjb250ZW50LmRlZmF1bHRCZWF1dGljaWFuIHx8IDApIC8gMVxuICAgICAgICBpZiAoZGVmYXVsdEJlYXV0aWNpYW4gPiAwKSB7XG4gICAgICAgICAgY3VycmVudEJlYXV0aWNpYW4gPSBjb250ZW50LmJlYXV0aWNpYW5zLmZpbHRlcihpdGVtID0+IGl0ZW0uYmVhdXRpY2lhbl9pZCA9PSBkZWZhdWx0QmVhdXRpY2lhbikucG9wKClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJyZW50QXBwb2ludG1lbnREYXkgPSBjb250ZW50LmRheXNbMF0gfHwge31cblxuICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgIGJlYXV0aWNpYW5MaXN0OiBjb250ZW50LmJlYXV0aWNpYW5zLFxuICAgICAgICAgIHByb2plY3RMaXN0OiBjb250ZW50LnByb2plY3RzLFxuICAgICAgICAgIHByb2plY3RfbW9yZTogJHByb2plY3RNb3JlLFxuICAgICAgICAgIGFwcG9pbnRtZW50RGF5TGlzdDogY29udGVudC5kYXlzLFxuICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgIGNob29zZVByb2plY3RzOiBbY3VycmVudFByb2plY3RdLFxuICAgICAgICAgIGN1cnJlbnRCZWF1dGljaWFuLFxuICAgICAgICAgIGN1cnJlbnRBcHBvaW50bWVudERheSxcbiAgICAgICAgICBkZWZhdWx0QmVhdXRpY2lhbixcbiAgICAgICAgICByZWNlaXZlRmVlOiByZWNlaXZlRmVlLmZlZSAvIDFcbiAgICAgICAgfSlcblxuICAgICAgICBzZWxmLmdldFBldHMoKVxuXG4gICAgICAgIHNlbGYuZ2V0QXBwb2ludG1lbnRUaW1lcyhjdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkLCBjdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9KVxuXG4gICAgfSxcblxuICAgIGdldFBldHMoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgICBhcHAuZ2V0KCdteVBldC9maW5kTXlQZXRzJykudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRQZXQgPSBkYXRhLmRhdGEuY29udGVudFswXVxuICAgICAgICBpZiAoIWN1cnJlbnRQZXQpXG4gICAgICAgICAgY3VycmVudFBldCA9IHt9XG5cbiAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICBwZXRzOiBkYXRhLmRhdGEuY29udGVudCxcbiAgICAgICAgICBjdXJyZW50UGV0LFxuICAgICAgICB9LCAoKSA9PiB0aGlzLmZpbHRlclByb2plY3QoKSlcbiAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgZ2V0QXBwb2ludG1lbnRUaW1lczogZnVuY3Rpb24gKGJlYXV0aWNpYW5JZCwgZGF5LCBzaG93TG9hZGluZyA9IHRydWUpIHtcbiAgICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjdXJyZW50QXBwb2ludG1lbnRUaW1lczogW11cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBhcHAuZ2V0KCdhcHBvaW50bWVudC9nZXRBcHBvaW50bWVudFRpbWUvJyArIGJlYXV0aWNpYW5JZCArICcvJyArIGRheSwgJycsIHNob3dMb2FkaW5nKVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBjb250ZW50ID0gKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuY29udGVudCkgfHwgW11cbiAgICAgICAgICAvLyBmb3IgKHZhciBpIGluIFswLCAwLCAwLCAwXSlcbiAgICAgICAgICAvLyAgIGNvbnRlbnQucHVzaCh7fSlcblxuICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICBhcHBvaW50bWVudFRpbWVMaXN0OiBjb250ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5Y+R6YCB6aKE57qmXG4gICAgYXBwb2ludG1lbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IGFwcCA9IGdldEFwcCgpXG4gICAgICBsZXQgZm9ybUlkID0gZXZlbnQuZGV0YWlsLmZvcm1JZFxuICAgICAgY29uc3QgY2hvb3NlUHJvamVjdHMgPSB0aGlzLmRhdGEuY2hvb3NlUHJvamVjdHNcbiAgICAgIGlmICghY2hvb3NlUHJvamVjdHMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9hc3QoJ+ivt+mAieaLqemihOe6pumhueebricpXG5cbiAgICAgIGlmICghdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudFRpbWVzLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvYXN0KCfor7fpgInmi6npooTnuqbml7bpl7QnKVxuICAgICAgXG4gICAgICAvLyDpooTnuqbpobnnm65cbiAgICAgIGxldCBwcm9qZWN0SWRzID0gY2hvb3NlUHJvamVjdHMubWFwKGl0ZW0gPT4gaXRlbS5wcm9qZWN0X2lkKVxuICAgICAgcHJvamVjdElkcyA9IHByb2plY3RJZHMuam9pbignLCcpXG5cbiAgICAgIC8vIOmihOe6plxuICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIHNob3BfaWQ6IHRoaXMuZGF0YS5jdXJyZW50U2hvcC5zaG9wX2lkLFxuICAgICAgICBwZXRfaWQ6IHRoaXMuZGF0YS5jdXJyZW50UGV0LnBldF9pZCxcbiAgICAgICAgYmVhdXRpY2lhbl9pZDogdGhpcy5kYXRhLmN1cnJlbnRCZWF1dGljaWFuLmJlYXV0aWNpYW5faWQsXG4gICAgICAgIHByb2plY3RfaWQ6IHByb2plY3RJZHMsXG4gICAgICAgIGFwcG9pbnRtZW50X2RheTogdGhpcy5kYXRhLmN1cnJlbnRBcHBvaW50bWVudERheS5kYXksXG4gICAgICAgIGFwcG9pbnRtZW50X3RpbWU6IHRoaXMuZGF0YS5jdXJyZW50QXBwb2ludG1lbnRUaW1lcy5qb2luKCcsJyksXG4gICAgICAgIGZyb206ICd4Y3gnLFxuICAgICAgICBmb3JtSWQ6IGZvcm1JZCxcbiAgICAgICAgYWRkcmVzczogKCh0aGlzLmRhdGEuYWRkcmVzc0xpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jaGVja2VkKS5wb3AoKSB8fCB7fSkubXlfYWRkcmVzc19pZCB8fCAwKVxuICAgICAgfVxuXG4gICAgICBhcHAucG9zdCgnY2FydC9hcHBvaW50bWVudCcsIGRhdGEpXG4gICAgICAgIC50aGVuKCgpID0+ICAge1xuICAgICAgICAgIHRoaXMuX3RvYXN0KCfpooTnuqbmiJDlip8hJylcblxuICAgICAgICAgIHRoaXMuZ2V0QXBwb2ludG1lbnRUaW1lcyhkYXRhLmJlYXV0aWNpYW5faWQsIGRhdGEuYXBwb2ludG1lbnRfZGF5KVxuICAgICAgICAgIFxuICAgICAgICAgIHNldFRpbWVvdXQoeCA9PiAge1xuICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvcGF5L2luZGV4J1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9LCAxMDAwKVxuXG4gICAgICAgICAgLy8g6YCa55+lXG4gICAgICAgICAgLy8gYXBwLmFza05vdGljZSgpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgdGhpcy5fdG9hc3QoZXJyb3IuZGV0YWlsIHx8ICfpooTnuqblpLHotKUhJylcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgYWRkUGV0KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogJy9wYWdlcy9wZXQvaW5kZXgnXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBhZGRBZGRyZXNzKCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogJy9wYWdlcy9hZGRyZXNzL2luZGV4J1xuICAgICAgfSkgICBcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgXG4gICAgICB3eC5nZXRMb2NhdGlvbih7XG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgIT09ICdbb2JqZWN0IE9iamVjdF0nKVxuICAgICAgICAgICAgZGF0YSA9IHt9XG5cbiAgICAgICAgICBhcHAuZ2V0KCdzaG9wL2dldExpc3QnLCB7bGF0aXR1ZGU6IGRhdGEubGF0aXR1ZGUgfHwgJycsIGxvbmdpdHVkZTogZGF0YS5sb25naXR1ZGUgfHwgJyd9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGRhdGEuZGF0YVxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTaG9wID0gcmVzdWx0LmNvbnRlbnRbMF0gfHwge31cbiAgICAgICAgICAgIHNlbGYuc2V0RGF0YSh7XG4gICAgICAgICAgICAgIHNob3BMaXN0OiByZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgICAgY3BTaG9wTGlzdDogcmVzdWx0LmNvbnRlbnQsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyDliKTmlq1zaG9wX2lk5piv5ZCm5a2Y5ZyoXG4gICAgICAgICAgICBpZihzZWxmLmRhdGEuY3VycmVudFNob3Auc2hvcF9pZCkge1xuICAgICAgICAgICAgICBjdXJyZW50U2hvcCA9IHNlbGYuZGF0YS5jdXJyZW50U2hvcFxuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTaG9wXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlbGYuZ2V0UGV0cygpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2hvcClcbiAgICAgICAgICAgICAgc2VsZi5nZXRCZWF1dGljaWFuQW5kUHJvamVjdChjdXJyZW50U2hvcC5zaG9wX2lkKVxuICAgICAgICAgIH0pLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3eC5vcGVuU2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH0sXG4gIG9uTG9hZCgpIHtcbiAgICB0aGlzLmluaXQoKVxuICB9LFxuXG4gIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5kYXRhLnBldHMubGVuZ3RoKVxuICAgICAgdGhpcy5nZXRQZXRzKClcblxuICAgIC8vIGlmICghdGhpcy5kYXRhLmFkZHJlc3NMaXN0Lmxlbmd0aClcbiAgICB0aGlzLmdldEFkZHJlc3NMaXN0KClcbiAgICAgIFxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGFcbiAgICAvLyDliqDovb1cbiAgICBpZiAoZGF0YS5jdXJyZW50QmVhdXRpY2lhbi5iZWF1dGljaWFuX2lkICYmIGRhdGEuY3VycmVudEFwcG9pbnRtZW50RGF5LmRheSkge1xuICAgICAgdGhpcy5nZXRBcHBvaW50bWVudFRpbWVzKGRhdGEuY3VycmVudEJlYXV0aWNpYW4uYmVhdXRpY2lhbl9pZCwgZGF0YS5jdXJyZW50QXBwb2ludG1lbnREYXkuZGF5KVxuICAgIH1cbiAgICBcbiAgfSxcblxuICBvblRhYkl0ZW1UYXA6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH1cbiAgfSJdfQ==