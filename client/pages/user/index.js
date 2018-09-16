var REQ = require('../../common/request.js');
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
    }
  },
  submitting:false,
  submit: function (e) {
    if(this.submitting){
      return;
    }
    this.submitting = true;
    setTimeout(() => { // 延时执行,让bindInput的方法先执行
      let info = this.data;
      if(!info.real_name){
        return showModel(`错误`, '没有填写姓名');
      }
      if(!info.phone){
        return showModel(`错误`, '没有填写电话');
      }
      showBusy('正在请求');
      this.setData({
        loading: true
      });
      let data = {
        real_name: info.real_name,
        phone: info.phone,
      };
      return REQ.updateInfo(data).then(() => {
        this.submitting = false;
        this.setData({
          loading: false
        });
        showSuccess(`修改成功，正返回`);
        this.navigateBack();
      }, (e) => {
        this.submitting = false;
        this.setData({
          loading: false
        });
        showModel(`修改失败`, e);
      })
    }, 100);
  },
  navigateBack: function(){
    setTimeout(() => {
        wx.navigateBack({
            delta: 1,
            error: () => showModel(`error`, '返回失败')
        });
    }, 1000);
  },
});