'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    '__code__': {
      readme: ''
    },

    userInfo: {},
    authed: false,
    loading: false,
    noPhone: false
  },

  onShow: function onShow() {
    var _this2 = this;

    this.setData({
      userInfo: {},
      authed: false,
      loading: false,
      noPhone: false
    }, function () {
      var noPhone = !!getApp().globalData.userInfo.noPhone;
      _this2.setData({
        authed: !!getApp().getSessionId(),
        noPhone: noPhone
      });
    });
  },

  getPhoneNumber: function getPhoneNumber(res) {
    var _this3 = this;

    var _this = this;
    if (!res.detail.iv) {
      wx.showToast({
        title: '获取手机号失败，请重试',
        icon: 'none'
      });
      return;
    }

    var app = getApp();

    // res.detail
    // encryptedData: "3aKTLbNlVjSNSQiMO7pKpmB6OkRD5u8h8jL+y2Ap2vBymLUsNV6qzKpOG+t0TeasWEKqki2U9+g477mFicGq0PIZ0DE8tBpSK7Bft+vgG2ZUwBE2F/Xz28baZcFVShIgxo1HbUDVBCI25M3LTXeMqnnFuA2EoGbMtvu4tTzD6cbqPZpESuLlQM6o1QkwYu73fzumV6Vna6iUlt5psUuioA=="
    // errMsg: "getPhoneNumber:ok"
    // iv: "mYO48TOme5wPMw1e7RS4Sg=="

    var userInfo = this.data.userInfo;
    if (Object.keys(this.data.userInfo).length <= 1) {
      this.setData({
        userInfo: getApp().getUserInfo()
      });

      userInfo = getApp().getUserInfo();
    }

    app.post('bind/bindMe', {
      enc_detail: JSON.stringify(res.detail),
      user_info: JSON.stringify(userInfo)
    }).then(function (data) {
      app.globalData.noPhone = false;
      var userInfo = _this3.data.userInfo;
      userInfo.noPhone = false;

      // 隐藏
      _this3.setData({
        noPhone: false
      });

      app.setUserInfo(userInfo);

      wx.navigateBack();
    });
  },
  getUserInfo: function getUserInfo(res) {
    var _this4 = this;

    if (!res.detail.iv) {
      wx.showToast({
        title: '用户授权失败，请重试',
        icon: 'none'
      });
      return;
    }

    var app = getApp();

    app.login(JSON.stringify(res.detail)).then(function (data) {
      // data 为session_id
      if (!res.detail.userInfo) {
        return wx.showToast({
          title: '用户授权失败，请重试',
          icon: 'none'
        });
      }

      // 获取了用户信息
      var userInfo = res.detail.userInfo;
      userInfo.noPhone = data.noPhone;

      _this4.setData({
        authed: true,
        noPhone: data.noPhone,
        userInfo: userInfo
      });

      app.setUserInfo(userInfo);

      // 有手机号，直接返回
      if (!data.noPhone) {
        app.globalData.noPhone = false;
        wx.navigateBack();
      }
    }).catch(function (e) {
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    });
  },

  handlerPhone: function handlerPhone(event) {
    var value = event.detail.value;
    this.setData({
      phone: value
    });
  },
  handlerSmsCode: function handlerSmsCode(event) {
    var value = event.detail.value;
    this.setData({
      smsCode: value
    });
  },
  login: function login() {
    var app = getApp();
    if (!this.data.smsCode || !/^\d{6}$/.test(this.data.smsCode)) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none'
      });
      return;
    }

    app.get('bind/bindMe', { code: this.data.smsCode, phone: this.data.phone, user_info: this.data.userInfo }).then(function (data) {
      return setTimeout(function () {
        return wx.switchTab({
          url: '/pages/appointment/index'
        });
      }, 500);
    }).catch(function (error) {
      return wx.showToast({
        title: error.detail || '登录失败，请重试',
        icon: 'none'
      });
    });
  },
  sendCode: function sendCode() {
    var _this5 = this;

    var app = getApp();

    if (!this.data.phone || !/^1\d{10}$/.test(this.data.phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      });
      return;
    }

    this.setData({
      start: true
    });

    var intervalCounts = 60;

    this.setData({
      startText: intervalCounts-- + 's'
    });

    var interval = setInterval(function (x) {
      _this5.setData({
        startText: intervalCounts-- + 's'
      });

      if (intervalCounts == -1) {
        clearInterval(interval);
        _this5.setData({
          start: false,
          startText: '发送验证码'
        });
      }
    }, 1000);

    app.get('sms/send/' + this.data.phone).then(function (data) {
      wx.showToast({ title: '验证码已发送，请注意查收', icon: 'none' });
    }).catch(function (error) {
      return wx.showToast({ title: error.detail || '登录失败，请重试', icon: 'none' });
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwidXNlckluZm8iLCJhdXRoZWQiLCJsb2FkaW5nIiwibm9QaG9uZSIsIm9uU2hvdyIsInNldERhdGEiLCJnZXRBcHAiLCJnbG9iYWxEYXRhIiwiZ2V0U2Vzc2lvbklkIiwiZ2V0UGhvbmVOdW1iZXIiLCJyZXMiLCJfdGhpcyIsImRldGFpbCIsIml2Iiwid3giLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJhcHAiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZ2V0VXNlckluZm8iLCJwb3N0IiwiZW5jX2RldGFpbCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1c2VyX2luZm8iLCJ0aGVuIiwic2V0VXNlckluZm8iLCJuYXZpZ2F0ZUJhY2siLCJsb2dpbiIsImNhdGNoIiwiaGFuZGxlclBob25lIiwiZXZlbnQiLCJ2YWx1ZSIsInBob25lIiwiaGFuZGxlclNtc0NvZGUiLCJzbXNDb2RlIiwidGVzdCIsImdldCIsImNvZGUiLCJzZXRUaW1lb3V0Iiwic3dpdGNoVGFiIiwidXJsIiwiZXJyb3IiLCJzZW5kQ29kZSIsInN0YXJ0IiwiaW50ZXJ2YWxDb3VudHMiLCJzdGFydFRleHQiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0lBLFFBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ0pDLGNBQVUsRUFETjtBQUVKQyxZQUFRLEtBRko7QUFHSkMsYUFBUyxLQUhMO0FBSUpDLGFBQVM7QUFKTCxHOztBQU9OQyxVQUFRLGtCQUFZO0FBQUE7O0FBQ2xCLFNBQUtDLE9BQUwsQ0FBYTtBQUNYTCxnQkFBVSxFQURDO0FBRVhDLGNBQVEsS0FGRztBQUdYQyxlQUFTLEtBSEU7QUFJWEMsZUFBUztBQUpFLEtBQWIsRUFLRyxZQUFNO0FBQ1AsVUFBTUEsVUFBVSxDQUFDLENBQUNHLFNBQVNDLFVBQVQsQ0FBb0JQLFFBQXBCLENBQTZCRyxPQUEvQztBQUNBLGFBQUtF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QTREO0FBQzFEdEIsU0FBR0MsU0FBSCxDQUFhO0FBQ1hDLGVBQU8sU0FESTtBQUVYQyxjQUFNO0FBRkssT0FBYjtBQUlBO0FBQ0Q7O0FBRUQsU0FBS1osT0FBTCxDQUFhO0FBQ1gwQyxhQUFPO0FBREksS0FBYjs7QUFJQSxRQUFJQyxpQkFBaUIsRUFBckI7O0FBRUEsU0FBSzNDLE9BQUwsQ0FBYTtBQUNYNEMsaUJBQWNELGdCQUFkO0FBRFcsS0FBYjs7QUFJQSxRQUFJRSxXQUFXQyxZQUFZLGFBQUs7QUFDOUIsYUFBSzlDLE9BQUwsQ0FBYTtBQUNYNEMsbUJBQWNELGdCQUFkO0FBRFcsT0FBYjs7QUFJQSxVQUFJQSxrQkFBa0IsQ0FBQyxDQUF2QixFQUEwQjtBQUN4Qkksc0JBQWNGLFFBQWQ7QUFDQSxlQUFLN0MsT0FBTCxDQUFhO0FBQ1gwQyxpQkFBTyxLQURJO0FBRVhFLHFCQUFXO0FBRkEsU0FBYjtBQUlEO0FBQ0YsS0FaYyxFQVlaLElBWlksQ0FBZjs7QUFjQS9CLFFBQUlzQixHQUFKLGVBQW9CLEtBQUt6QyxJQUFMLENBQVVxQyxLQUE5QixFQUNHUixJQURILENBQ1EsZ0JBQVE7QUFDWmQsU0FBR0MsU0FBSCxDQUFhLEVBQUNDLE9BQU8sY0FBUixFQUF3QkMsTUFBTSxNQUE5QixFQUFiO0FBQ0QsS0FISCxFQUlHZSxLQUpILENBSVM7QUFBQSxhQUFTbEIsR0FBR0MsU0FBSCxDQUFhLEVBQUNDLE9BQU82QixNQUFNakMsTUFBTixJQUFnQixVQUF4QixFQUFvQ0ssTUFBTSxNQUExQyxFQUFiLENBQVQ7QUFBQSxLQUpUO0FBS0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+eZu+W9lScsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI0U4RThFOCcsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICd3eGMtYXZhdGFyJzogJ0BtaW51aS93eGMtYXZhdGFyJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIHVzZXJJbmZvOiB7fSxcbiAgICAgIGF1dGhlZDogZmFsc2UsXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIG5vUGhvbmU6IGZhbHNlXG4gICAgfSxcblxuICAgIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgdXNlckluZm86IHt9LFxuICAgICAgICBhdXRoZWQ6IGZhbHNlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbm9QaG9uZTogZmFsc2VcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgY29uc3Qgbm9QaG9uZSA9ICEhZ2V0QXBwKCkuZ2xvYmFsRGF0YS51c2VySW5mby5ub1Bob25lXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgYXV0aGVkOiAhIWdldEFwcCgpLmdldFNlc3Npb25JZCgpLFxuICAgICAgICAgIG5vUGhvbmVcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGdldFBob25lTnVtYmVyKHJlcykge1xuICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgIGlmICghcmVzLmRldGFpbC5pdikge1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgIHRpdGxlOiAn6I635Y+W5omL5py65Y+35aSx6LSl77yM6K+36YeN6K+VJyxcbiAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnN0IGFwcCA9IGdldEFwcCgpXG5cbiAgICAgIC8vIHJlcy5kZXRhaWxcbiAgICAgIC8vIGVuY3J5cHRlZERhdGE6IFwiM2FLVExiTmxWalNOU1FpTU83cEtwbUI2T2tSRDV1OGg4akwreTJBcDJ2QnltTFVzTlY2cXpLcE9HK3QwVGVhc1dFS3FraTJVOStnNDc3bUZpY0dxMFBJWjBERTh0QnBTSzdCZnQrdmdHMlpVd0JFMkYvWHoyOGJhWmNGVlNoSWd4bzFIYlVEVkJDSTI1TTNMVFhlTXFubkZ1QTJFb0diTXR2dTR0VHpENmNicVBacEVTdUxsUU02bzFRa3dZdTczZnp1bVY2Vm5hNmlVbHQ1cHNVdWlvQT09XCJcbiAgICAgIC8vIGVyck1zZzogXCJnZXRQaG9uZU51bWJlcjpva1wiXG4gICAgICAvLyBpdjogXCJtWU80OFRPbWU1d1BNdzFlN1JTNFNnPT1cIlxuXG4gICAgICBsZXQgdXNlckluZm8gPSB0aGlzLmRhdGEudXNlckluZm9cbiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmRhdGEudXNlckluZm8pLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgdXNlckluZm86IGdldEFwcCgpLmdldFVzZXJJbmZvKClcbiAgICAgICAgfSlcblxuICAgICAgICB1c2VySW5mbyA9IGdldEFwcCgpLmdldFVzZXJJbmZvKClcbiAgICAgIH1cblxuICAgICAgYXBwLnBvc3QoJ2JpbmQvYmluZE1lJywge1xuICAgICAgICBlbmNfZGV0YWlsOiBKU09OLnN0cmluZ2lmeShyZXMuZGV0YWlsKSxcbiAgICAgICAgdXNlcl9pbmZvOiBKU09OLnN0cmluZ2lmeSh1c2VySW5mbylcbiAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGFwcC5nbG9iYWxEYXRhLm5vUGhvbmUgPSBmYWxzZVxuICAgICAgICBsZXQgdXNlckluZm8gPSB0aGlzLmRhdGEudXNlckluZm9cbiAgICAgICAgdXNlckluZm8ubm9QaG9uZSA9IGZhbHNlXG5cbiAgICAgICAgLy8g6ZqQ6JePXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgbm9QaG9uZTogZmFsc2VcbiAgICAgICAgfSlcblxuICAgICAgICBhcHAuc2V0VXNlckluZm8odXNlckluZm8pXG5cbiAgICAgICAgd3gubmF2aWdhdGVCYWNrKClcbiAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgZ2V0VXNlckluZm8ocmVzKSB7XG4gICAgICBpZiAoIXJlcy5kZXRhaWwuaXYpIHtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICB0aXRsZTogJ+eUqOaIt+aOiOadg+Wksei0pe+8jOivt+mHjeivlScsXG4gICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBhcHAgPSBnZXRBcHAoKVxuXG4gICAgICBhcHAubG9naW4oSlNPTi5zdHJpbmdpZnkocmVzLmRldGFpbCkpLnRoZW4oZGF0YSA9PiB7IC8vIGRhdGEg5Li6c2Vzc2lvbl9pZFxuICAgICAgICBpZiAoIXJlcy5kZXRhaWwudXNlckluZm8pIHtcbiAgICAgICAgICByZXR1cm4gd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIHRpdGxlOiAn55So5oi35o6I5p2D5aSx6LSl77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgIGljb246ICdub25lJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAvLyDojrflj5bkuobnlKjmiLfkv6Hmga9cbiAgICAgICAgY29uc3QgdXNlckluZm8gPSByZXMuZGV0YWlsLnVzZXJJbmZvXG4gICAgICAgIHVzZXJJbmZvLm5vUGhvbmUgPSBkYXRhLm5vUGhvbmVcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgYXV0aGVkOiB0cnVlLFxuICAgICAgICAgIG5vUGhvbmU6IGRhdGEubm9QaG9uZSxcbiAgICAgICAgICB1c2VySW5mb1xuICAgICAgICB9KVxuXG4gICAgICAgICBhcHAuc2V0VXNlckluZm8odXNlckluZm8pXG5cbiAgICAgICAgLy8g5pyJ5omL5py65Y+377yM55u05o6l6L+U5ZueXG4gICAgICAgIGlmICghZGF0YS5ub1Bob25lKSB7XG4gICAgICAgICAgYXBwLmdsb2JhbERhdGEubm9QaG9uZSA9IGZhbHNlXG4gICAgICAgICAgd3gubmF2aWdhdGVCYWNrKClcbiAgICAgICAgfVxuXG4gICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICB0aXRsZTogJ+eZu+W9leWksei0pe+8jOivt+mHjeivlScsXG4gICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG5cbiAgICAgIFxuXG4gICAgICBcbiAgICB9LCAgXG4gICAgaGFuZGxlclBob25lOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCB2YWx1ZSA9IGV2ZW50LmRldGFpbC52YWx1ZVxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgcGhvbmU6IHZhbHVlXG4gICAgICB9KVxuICAgIH0sXG4gICAgaGFuZGxlclNtc0NvZGU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbGV0IHZhbHVlID0gZXZlbnQuZGV0YWlsLnZhbHVlXG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBzbXNDb2RlOiB2YWx1ZVxuICAgICAgfSlcbiAgICB9LFxuICAgIGxvZ2luOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcbiAgICAgIGlmICghdGhpcy5kYXRhLnNtc0NvZGUgfHwgIS9eXFxkezZ9JC8udGVzdCh0aGlzLmRhdGEuc21zQ29kZSkpIHtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICB0aXRsZTogJ+mqjOivgeeggemUmeivrycsXG4gICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgYXBwLmdldCgnYmluZC9iaW5kTWUnLCB7Y29kZTogdGhpcy5kYXRhLnNtc0NvZGUsIHBob25lOiB0aGlzLmRhdGEucGhvbmUsIHVzZXJfaW5mbzogdGhpcy5kYXRhLnVzZXJJbmZvfSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xuICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvYXBwb2ludG1lbnQvaW5kZXgnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICwgNTAwKSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+XG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIHRpdGxlOiBlcnJvci5kZXRhaWwgfHwgJ+eZu+W9leWksei0pe+8jOivt+mHjeivlScsXG4gICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICB9KSlcbiAgICB9LFxuICAgIHNlbmRDb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgYXBwID0gZ2V0QXBwKClcblxuICAgICAgaWYgKCF0aGlzLmRhdGEucGhvbmUgfHwgIS9eMVxcZHsxMH0kLy50ZXN0KHRoaXMuZGF0YS5waG9uZSkpIHtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICB0aXRsZTogJ+aJi+acuuWPt+agvOW8j+mUmeivrycsXG4gICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgc3RhcnQ6IHRydWVcbiAgICAgIH0pXG5cbiAgICAgIGxldCBpbnRlcnZhbENvdW50cyA9IDYwXG5cbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHN0YXJ0VGV4dDogYCR7aW50ZXJ2YWxDb3VudHMtLX1zYFxuICAgICAgfSlcblxuICAgICAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoeCA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgc3RhcnRUZXh0OiBgJHtpbnRlcnZhbENvdW50cy0tfXNgXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGludGVydmFsQ291bnRzID09IC0xKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcbiAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgc3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgc3RhcnRUZXh0OiAn5Y+R6YCB6aqM6K+B56CBJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sIDEwMDApXG5cbiAgICAgIGFwcC5nZXQoYHNtcy9zZW5kLyR7dGhpcy5kYXRhLnBob25lfWApXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgIHd4LnNob3dUb2FzdCh7dGl0bGU6ICfpqozor4HnoIHlt7Llj5HpgIHvvIzor7fms6jmhI/mn6XmlLYnLCBpY29uOiAnbm9uZSd9KVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gd3guc2hvd1RvYXN0KHt0aXRsZTogZXJyb3IuZGV0YWlsIHx8ICfnmbvlvZXlpLHotKXvvIzor7fph43or5UnLCBpY29uOiAnbm9uZSd9KSlcbiAgICB9LFxuICB9Il19