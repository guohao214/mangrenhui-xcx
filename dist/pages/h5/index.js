'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({

  data: {
    url: '',
    oriUrl: ''
  },

  onLoad: function onLoad(options) {
    var url = options.url;
    if (!url) return;

    this.setData({
      oriUrl: url
    });

    url = decodeURIComponent(url);
    console.log('url...', url);
    this.setData({
      url: url
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Lnd4cCJdLCJuYW1lcyI6WyJkYXRhIiwidXJsIiwib3JpVXJsIiwib25Mb2FkIiwib3B0aW9ucyIsInNldERhdGEiLCJkZWNvZGVVUklDb21wb25lbnQiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBT0lBLFFBQU07QUFDSkMsU0FBSyxFQUREO0FBRUpDLFlBQVE7QUFGSixHOztBQUtOQyxRLGtCQUFPQyxPLEVBQVM7QUFDZCxRQUFJSCxNQUFNRyxRQUFRSCxHQUFsQjtBQUNBLFFBQUksQ0FBQ0EsR0FBTCxFQUNFOztBQUVGLFNBQUtJLE9BQUwsQ0FBYTtBQUNYSCxjQUFRRDtBQURHLEtBQWI7O0FBSUFBLFVBQU1LLG1CQUFtQkwsR0FBbkIsQ0FBTjtBQUNBTSxZQUFRQyxHQUFSLENBQVksUUFBWixFQUFzQlAsR0FBdEI7QUFDQSxTQUFLSSxPQUFMLENBQWE7QUFDWEo7QUFEVyxLQUFiO0FBR0QiLCJmaWxlIjoiaW5kZXgud3hwIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+WFheWAvOacjeWKoeWNj+iuricsXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI0U4RThFOCcsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snLFxuICAgIH0sXG5cbiAgICBkYXRhOiB7XG4gICAgICB1cmw6ICcnLFxuICAgICAgb3JpVXJsOiAnJyxcbiAgICB9LFxuICAgIFxuICAgIG9uTG9hZChvcHRpb25zKSB7XG4gICAgICBsZXQgdXJsID0gb3B0aW9ucy51cmxcbiAgICAgIGlmICghdXJsKVxuICAgICAgICByZXR1cm5cblxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgb3JpVXJsOiB1cmxcbiAgICAgIH0pXG5cbiAgICAgIHVybCA9IGRlY29kZVVSSUNvbXBvbmVudCh1cmwpXG4gICAgICBjb25zb2xlLmxvZygndXJsLi4uJywgdXJsKVxuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgdXJsXG4gICAgICB9KVxuICAgIH1cbiAgfSJdfQ==