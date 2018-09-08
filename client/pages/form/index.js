var REQ = require('../../common/request.js');
let {
  showBusy,
  showSuccess,
  showModel
} = require('../../common/tools.js');

Page({
  data: {
    // 表格数据
    match_id: '',
    max_numbers: '30',
    position: '天河',
    type: '5',
    date: '2016-09-01',
    // todo server add
    time: '12:01',
    matchTips: '',
    // 状态
    disabled: false,
    loading: false
  },
  onLoad: function (options) {
    if (options.id){
      REQ.getMatchInfo({
        id: options.id
      }).then(res => {
        let info = res && res[0];
        if (info){
          this.setData({
            match_id: info.match_id,
            date: info.date,
            max_numbers: info.max_numbers,
            position: info.position,
            type: info.type
          });
        }
      })
    }
  },
  bindInput: function (e) {
    let { key } = e.currentTarget.dataset;
    if (key && this.data.hasOwnProperty(key)) {
      this.setData({
        [key]: e.detail.value
      });
      console.log('this.data', this.data)
    }
  },
  submit: function(e){
    let info = this.data;
    let reqMethod = info.match_id ? "editMatch" : "musterMatch";
    let name = info.match_id ? "提交" : "修改";
    let data = {
      date: info.date,
      max_numbers: info.max_numbers,
      position: info.position,
      type: info.type
    };
    if (info.match_id){
      data.match_id = info.match_id;
    }
    this.setData({
      loading: true
    });
    showBusy('正在请求');
    return REQ[reqMethod](data).then((e, d, a) => {
      console.log(11, e, d, a);
      this.setData({
        loading: false
      });
      showSuccess(`${name}成功`);
    }, (e) => {
      console.log(22, e);
      this.setData({
        loading: false
      });
      showModel(`${name}失败`, e);
    })
  }
});