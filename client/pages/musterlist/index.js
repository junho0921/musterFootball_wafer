var REQ = require('../../common/request.js');
let {
  showBusy,
  showSuccess,
  showModel,
  statusName
} = require('../../common/tools.js');

Page({
  data: {
    list: [],
  },
  onLoad: function (options) {
    let id = options.id;
    if (id){
      console.log('id', id);
      showBusy('加载信息中');
      this.get(id);
    }else{
      showModel('没有id')
    }
  },
  get: function(id){
    console.log(';this.data', this.data)
    REQ.getMatchInfo({
      id: id.split(',')
    })
    .then(res => {
      try {
        res.forEach(item => {
          item.statusName = statusName[item.status];
        })
        res.forEach(item => {
          item.position = JSON.parse(item.position);
        })
      } catch (e) {
        console.log('e', e);
      }
      console.log('matchs', res);
      this.setData({ list: res });
      // 记录在全局，提供访问成员信息
      global.matchs = res;
    })
  }
});