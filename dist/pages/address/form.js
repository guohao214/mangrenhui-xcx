'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    areaList: [],
    address: {
      uname: '',
      phone: '',
      address_code: '',
      address_prefix: '',
      address: ''
    },
    my_address_id: 0,
    isEdit: false,
    region: [],
    area: '',
    area_name: ''
  },
  onLoad: function onLoad(options) {
    var _this = this;

    var my_address_id = (options.id || 0) / 1 || 0;
    this.setData({
      my_address_id: my_address_id,
      isEdit: !!my_address_id
    }, function () {
      return _this.getDetail();
    });
  },

  regionChange: function regionChange(event) {
    var _event$detail = event.detail,
        value = _event$detail.value,
        code = _event$detail.code;


    var area_name = value.join('-');
    var area = code.join('-');

    this.setData({
      region: value,
      'address.address_prefix': area_name,
      'address.address_code': area
    });
  },
  getDetail: function getDetail() {
    var self = this;

    if (this.data.isEdit) {
      getApp().get('center/addressDetail/' + this.data.my_address_id).then(function (data) {
        var address = data.data.content;
        var areaList = address.address_code.split('-');
        self.setData({
          address: address,
          region: address.address_prefix.split('-'),
          areaList: areaList
        });
      });
    }
  },


  onShow: function onShow() {},

  bindChangeName: function bindChangeName(e) {
    var k = e.detail.value;
    this.setData({
      'address.uname': k
    });
  },
  bindChangePhone: function bindChangePhone(e) {
    var k = e.detail.value;
    this.setData({
      'address.phone': k
    });
  },
  bindChangeAddress: function bindChangeAddress(e) {
    var k = e.detail.value;
    this.setData({
      'address.address': k
    });
  },
  deletePet: function deletePet() {
    var dialogComponent = this.data.lastComponent = this.selectComponent('.wxc-cancel-pet');
    dialogComponent && dialogComponent.show();
  },
  cancelDeletePet: function cancelDeletePet() {
    var dialogComponent = this.data.lastComponent = this.selectComponent('.wxc-cancel-pet');
    dialogComponent && dialogComponent.hide();
  },
  confirmDeletePet: function confirmDeletePet() {
    getApp().post('center/deleteAddress/' + this.data.my_address_id).then(function (data) {
      wx.navigateBack();
    });
  },
  addAddress: function addAddress() {
    var app = getApp();

    var url = 'center/addAddress';
    if (this.data.isEdit) url = 'center/updateAddress/' + this.data.my_address_id;

    var address = this.data.address;
    if (!address.uname.trim()) {
      return app.showToast('请输入联系人');
    }

    if (!address.phone) {
      return app.showToast('请输入手机号');
    }

    if (!address.address.trim()) {
      return app.showToast('请输入详细地址');
    }

    if (!address.address_code.trim()) {
      return app.showToast('请选择区域');
    }

    app.post(url, address).then(function (data) {
      wx.navigateBack();
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm0ud3hwIl0sIm5hbWVzIjpbImRhdGEiLCJhcmVhTGlzdCIsImFkZHJlc3MiLCJ1bmFtZSIsInBob25lIiwiYWRkcmVzc19jb2RlIiwiYWRkcmVzc19wcmVmaXgiLCJteV9hZGRyZXNzX2lkIiwiaXNFZGl0IiwicmVnaW9uIiwiYXJlYSIsImFyZWFfbmFtZSIsIm9uTG9hZCIsIm9wdGlvbnMiLCJpZCIsInNldERhdGEiLCJnZXREZXRhaWwiLCJyZWdpb25DaGFuZ2UiLCJldmVudCIsImRldGFpbCIsInZhbHVlIiwiY29kZSIsImpvaW4iLCJzZWxmIiwiZ2V0QXBwIiwiZ2V0IiwidGhlbiIsImNvbnRlbnQiLCJzcGxpdCIsIm9uU2hvdyIsImJpbmRDaGFuZ2VOYW1lIiwiZSIsImsiLCJiaW5kQ2hhbmdlUGhvbmUiLCJiaW5kQ2hhbmdlQWRkcmVzcyIsImRlbGV0ZVBldCIsImRpYWxvZ0NvbXBvbmVudCIsImxhc3RDb21wb25lbnQiLCJzZWxlY3RDb21wb25lbnQiLCJzaG93IiwiY2FuY2VsRGVsZXRlUGV0IiwiaGlkZSIsImNvbmZpcm1EZWxldGVQZXQiLCJwb3N0Iiwid3giLCJuYXZpZ2F0ZUJhY2siLCJhZGRBZGRyZXNzIiwiYXBwIiwidXJsIiwidHJpbSIsInNob3dUb2FzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBY0lBLFFBQU07QUFDSkMsY0FBUyxFQURMO0FBRUpDLGFBQVM7QUFDUEMsYUFBTyxFQURBO0FBRVBDLGFBQU8sRUFGQTtBQUdQQyxvQkFBYyxFQUhQO0FBSVBDLHNCQUFnQixFQUpUO0FBS1BKLGVBQVM7QUFMRixLQUZMO0FBU0pLLG1CQUFlLENBVFg7QUFVSkMsWUFBUSxLQVZKO0FBV0pDLFlBQU8sRUFYSDtBQVlKQyxVQUFNLEVBWkY7QUFhSkMsZUFBVztBQWJQLEc7QUFlUkMsVUFBUSxnQkFBVUMsT0FBVixFQUFtQjtBQUFBOztBQUN6QixRQUFNTixnQkFBZ0IsQ0FBQ00sUUFBUUMsRUFBUixJQUFjLENBQWYsSUFBb0IsQ0FBcEIs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QUwsRUFBMkI7QUFDekIsYUFBT0YsSUFBSUcsU0FBSixDQUFjLFFBQWQsQ0FBUDtBQUNEOztBQUVELFFBQUksQ0FBQ2hELFFBQVFFLEtBQWIsRUFBb0I7QUFDbEIsYUFBTzJDLElBQUlHLFNBQUosQ0FBYyxRQUFkLENBQVA7QUFDRDs7QUFFRCxRQUFJLENBQUNoRCxRQUFRQSxPQUFSLENBQWdCK0MsSUFBaEIsRUFBTCxFQUE2QjtBQUMzQixhQUFPRixJQUFJRyxTQUFKLENBQWMsU0FBZCxDQUFQO0FBQ0Q7O0FBRUQsUUFBSSxDQUFDaEQsUUFBUUcsWUFBUixDQUFxQjRDLElBQXJCLEVBQUwsRUFBa0M7QUFDaEMsYUFBT0YsSUFBSUcsU0FBSixDQUFjLE9BQWQsQ0FBUDtBQUNEOztBQUVESCxRQUFJSixJQUFKLENBQVNLLEdBQVQsRUFBYzlDLE9BQWQsRUFBdUJ3QixJQUF2QixDQUE0QixnQkFBUTtBQUNsQ2tCLFNBQUdDLFlBQUg7QUFDRCxLQUZEO0FBR0QiLCJmaWxlIjoiZm9ybS53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5oiR55qE5Zyw5Z2AJyxcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjRThFOEU4JyxcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaycsXG4gICAgICB1c2luZ0NvbXBvbmVudHM6IHtcbiAgICAgICAgJ3d4Yy1kaWFsb2cnOiAnQG1pbnVpL3d4Yy1kaWFsb2cnLFxuICAgICAgICAnd3hjLWFibm9yJzogJ0BtaW51aS93eGMtYWJub3InLFxuICAgICAgICAnd3hjLWVsaXAnOiAnQG1pbnVpL3d4Yy1lbGlwJyxcbiAgICAgICAgJ3d4Yy1mbGV4JzogJ0BtaW51aS93eGMtZmxleCcsXG4gICAgICAgICd3eGMtaWNvbic6ICdAbWludWkvd3hjLWljb24nLFxuICAgICAgICAnd3hjLWF2YXRhcic6ICdAbWludWkvd3hjLWF2YXRhcicsXG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBhcmVhTGlzdDpbXSxcbiAgICAgIGFkZHJlc3M6IHtcbiAgICAgICAgdW5hbWU6ICcnLFxuICAgICAgICBwaG9uZTogJycsXG4gICAgICAgIGFkZHJlc3NfY29kZTogJycsXG4gICAgICAgIGFkZHJlc3NfcHJlZml4OiAnJyxcbiAgICAgICAgYWRkcmVzczogJycsXG4gICAgICB9LFxuICAgICAgbXlfYWRkcmVzc19pZDogMCxcbiAgICAgIGlzRWRpdDogZmFsc2UsXG4gICAgICByZWdpb246W10sXG4gICAgICBhcmVhOiAnJyxcbiAgICAgIGFyZWFfbmFtZTogJydcbiAgfSxcbiAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIGNvbnN0IG15X2FkZHJlc3NfaWQgPSAob3B0aW9ucy5pZCB8fCAwKSAvIDEgfHwgMFxuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBteV9hZGRyZXNzX2lkLFxuICAgICAgaXNFZGl0OiAhIW15X2FkZHJlc3NfaWRcbiAgICB9LCAoKSA9PiB0aGlzLmdldERldGFpbCgpKVxuICB9LFxuXG4gIHJlZ2lvbkNoYW5nZShldmVudCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHZhbHVlLFxuICAgICAgY29kZVxuICAgIH0gPSBldmVudC5kZXRhaWxcblxuICAgIGNvbnN0IGFyZWFfbmFtZSA9IHZhbHVlLmpvaW4oJy0nKTtcbiAgICBjb25zdCBhcmVhID0gY29kZS5qb2luKCctJyk7XG5cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgcmVnaW9uOiB2YWx1ZSxcbiAgICAgICdhZGRyZXNzLmFkZHJlc3NfcHJlZml4JzphcmVhX25hbWUsXG4gICAgICAnYWRkcmVzcy5hZGRyZXNzX2NvZGUnOmFyZWEsXG4gICAgfSlcbiAgfSxcblxuICBnZXREZXRhaWwoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcblxuICAgIGlmICh0aGlzLmRhdGEuaXNFZGl0KSB7XG4gICAgICBnZXRBcHAoKS5nZXQoJ2NlbnRlci9hZGRyZXNzRGV0YWlsLycgKyB0aGlzLmRhdGEubXlfYWRkcmVzc19pZCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgY29uc3QgYWRkcmVzcyA9IGRhdGEuZGF0YS5jb250ZW50XG4gICAgICAgIGNvbnN0IGFyZWFMaXN0ID0gYWRkcmVzcy5hZGRyZXNzX2NvZGUuc3BsaXQoJy0nKVxuICAgICAgICBzZWxmLnNldERhdGEoe1xuICAgICAgICAgIGFkZHJlc3MsXG4gICAgICAgICAgcmVnaW9uOiBhZGRyZXNzLmFkZHJlc3NfcHJlZml4LnNwbGl0KCctJyksXG4gICAgICAgICAgYXJlYUxpc3RcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICB9LFxuXG4gIGJpbmRDaGFuZ2VOYW1lKGUpIHtcbiAgICBjb25zdCBrID0gZS5kZXRhaWwudmFsdWVcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgJ2FkZHJlc3MudW5hbWUnOiBrXG4gICAgfSlcbiAgfSxcblxuICBiaW5kQ2hhbmdlUGhvbmUoZSkge1xuICAgIGNvbnN0IGsgPSBlLmRldGFpbC52YWx1ZVxuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAnYWRkcmVzcy5waG9uZSc6IGtcbiAgICB9KVxuICB9LFxuXG4gIGJpbmRDaGFuZ2VBZGRyZXNzKGUpIHtcbiAgICBjb25zdCBrID0gZS5kZXRhaWwudmFsdWVcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgJ2FkZHJlc3MuYWRkcmVzcyc6IGtcbiAgICB9KVxuICB9LFxuXG4gIGRlbGV0ZVBldCgpIHtcbiAgICBsZXQgZGlhbG9nQ29tcG9uZW50ID0gdGhpcy5kYXRhLmxhc3RDb21wb25lbnQgPSB0aGlzLnNlbGVjdENvbXBvbmVudCgnLnd4Yy1jYW5jZWwtcGV0JylcbiAgICBkaWFsb2dDb21wb25lbnQgJiYgZGlhbG9nQ29tcG9uZW50LnNob3coKTtcbiAgfSxcblxuICBjYW5jZWxEZWxldGVQZXQoKSB7XG4gICAgbGV0IGRpYWxvZ0NvbXBvbmVudCA9IHRoaXMuZGF0YS5sYXN0Q29tcG9uZW50ID0gdGhpcy5zZWxlY3RDb21wb25lbnQoJy53eGMtY2FuY2VsLXBldCcpXG4gICAgZGlhbG9nQ29tcG9uZW50ICYmIGRpYWxvZ0NvbXBvbmVudC5oaWRlKCk7XG4gIH0sXG5cbiAgY29uZmlybURlbGV0ZVBldCgpIHtcbiAgICBnZXRBcHAoKS5wb3N0KCdjZW50ZXIvZGVsZXRlQWRkcmVzcy8nICsgdGhpcy5kYXRhLm15X2FkZHJlc3NfaWQpLnRoZW4oZGF0YSA9PiB7XG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soKVxuICAgIH0pXG4gIH0sXG5cblxuICBhZGRBZGRyZXNzKCkge1xuICAgIGxldCBhcHAgPSBnZXRBcHAoKVxuXG4gICAgbGV0IHVybCA9ICdjZW50ZXIvYWRkQWRkcmVzcydcbiAgICBpZiAodGhpcy5kYXRhLmlzRWRpdClcbiAgICAgIHVybCA9ICdjZW50ZXIvdXBkYXRlQWRkcmVzcy8nICsgdGhpcy5kYXRhLm15X2FkZHJlc3NfaWRcblxuICAgIGNvbnN0IGFkZHJlc3MgPSB0aGlzLmRhdGEuYWRkcmVzc1xuICAgIGlmICghYWRkcmVzcy51bmFtZS50cmltKCkpIHtcbiAgICAgIHJldHVybiBhcHAuc2hvd1RvYXN0KCfor7fovpPlhaXogZTns7vkuronKVxuICAgIH1cblxuICAgIGlmICghYWRkcmVzcy5waG9uZSkge1xuICAgICAgcmV0dXJuIGFwcC5zaG93VG9hc3QoJ+ivt+i+k+WFpeaJi+acuuWPtycpXG4gICAgfVxuXG4gICAgaWYgKCFhZGRyZXNzLmFkZHJlc3MudHJpbSgpKSB7XG4gICAgICByZXR1cm4gYXBwLnNob3dUb2FzdCgn6K+36L6T5YWl6K+m57uG5Zyw5Z2AJylcbiAgICB9XG5cbiAgICBpZiAoIWFkZHJlc3MuYWRkcmVzc19jb2RlLnRyaW0oKSkge1xuICAgICAgcmV0dXJuIGFwcC5zaG93VG9hc3QoJ+ivt+mAieaLqeWMuuWfnycpXG4gICAgfVxuXG4gICAgYXBwLnBvc3QodXJsLCBhZGRyZXNzKS50aGVuKGRhdGEgPT4ge1xuICAgICAgd3gubmF2aWdhdGVCYWNrKClcbiAgICB9KVxuICB9LFxuXG59Il19