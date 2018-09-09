var REQ = require('../../common/request.js');
var appG = require('../../common/global.js');
let {
  showBusy,
  showSuccess,
  showModel
} = require('../../common/tools.js');

Page({
  data: {
    real_name: '',
    phone: '',
    // 状态
    disabled: false,
    loading: false
  },
  onLoad: function (options) {
    console.log(1111, global);
    let info = global.userInfo;
    if (info){
      this.setData({
        real_name: info.real_name,
        phone: info.phone,
      });
    }else{
      showModel('获取用户信息失败');
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
  submit: function (e) {
    let info = this.data;
    let data = {
      real_name: info.real_name,
      phone: info.phone,
    };
    this.setData({
      loading: true
    });
    showBusy('正在请求');
    return REQ.updateInfo(data).then((e, d, a) => {
      this.setData({
        loading: false
      });
      showSuccess(`修改成功`);
    }, (e) => {
      this.setData({
        loading: false
      });
      showModel(`修改失败`, e);
    })
  }
});