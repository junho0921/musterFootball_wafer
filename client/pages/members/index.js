var REQ = require('../../common/request.js');
let {
  showBusy,
  showSuccess,
  showModel
} = require('../../common/tools.js');

Page({
  data: {
    list: [],
  },
  onLoad: function (options) {
    console.log(1111, options, global);
    let id = options.id;
    let matchs = global.matchs;
    let info = matchs && matchs.find(item => item.match_id == id);
    if (!info){
      info = global.joinMatchs && global.joinMatchs.find(item => item.match_id == id);
    }
    if (info) {
      this.setData({
        list: info.members
      });
    } else {
      showModel('获取用户信息失败', '');
    }
    console.log('用户信息', this.data)
  }
});