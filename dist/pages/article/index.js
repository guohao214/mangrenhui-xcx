'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({

  onTabItemTap: function onTabItemTap() {
    wx.navigateToMiniProgram({
      appId: 'wx590bd4cbd9876b1e'
    });
  },

  onShareAppMessage: function onShareAppMessage() {
    return {
      title: 'CAT猫的世界',
      path: '/pages/article/index',
      imageUrl: 'https://api.mdshijie.com/static/share.png'
    };
  },


  data: {
    '__code__': {
      readme: ''
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJvblRhYkl0ZW1UYXAiLCJ3eCIsIm5hdmlnYXRlVG9NaW5pUHJvZ3JhbSIsImFwcElkIiwib25TaGFyZUFwcE1lc3NhZ2UiLCJ0aXRsZSIsInBhdGgiLCJpbWFnZVVybCIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFRRUEsZ0JBQWMsd0JBQVc7QUFDdkJDLE9BQUdDLHFCQUFILENBQXlCO0FBQ3ZCQyxhQUFPO0FBRGdCLEtBQXpCO0FBR0QsRzs7QUFFREMsbUIsK0JBQW9CO0FBQ2xCLFdBQU87QUFDTEMsYUFBTyxTQURGO0FBRUxDLFlBQU0sc0JBRkQ7QUFHTEMsZ0JBQVU7QUFITCxLQUFQO0FBS0QsRzs7O0FBRURDLFFBQU07QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJpbmRleC53eHAiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfllYblk4HorqLpmIUnLFxuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjRThFOEU4JyxcbiAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snLFxuICAgIHVzaW5nQ29tcG9uZW50czoge31cbiAgfSxcblxuICBvblRhYkl0ZW1UYXA6IGZ1bmN0aW9uKCkge1xuICAgIHd4Lm5hdmlnYXRlVG9NaW5pUHJvZ3JhbSh7XG4gICAgICBhcHBJZDogJ3d4NTkwYmQ0Y2JkOTg3NmIxZSdcbiAgICB9KVxuICB9LFxuXG4gIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogJ0NBVOeMq+eahOS4lueVjCcsXG4gICAgICBwYXRoOiAnL3BhZ2VzL2FydGljbGUvaW5kZXgnLFxuICAgICAgaW1hZ2VVcmw6ICdodHRwczovL2FwaS5tZHNoaWppZS5jb20vc3RhdGljL3NoYXJlLnBuZydcbiAgICB9XG4gIH0sXG5cbiAgZGF0YToge31cbn0iXX0=