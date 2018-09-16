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
    min_numbers: '10',
    max_numbers: '30',
    position: '天河',
    type: '5',
    date: '2016-09-01',
    time: '12:01',
    match_tips: '',
    cancel_reason: '',
    // 状态
    disabled: false,
    loading: false,
    toCancel: false,
  },
  onLoad: function (options) {
    console.log('表格页面收到id', options.id)
    if (options.id){
      showBusy('正获取比赛信息');
      REQ.getMatchInfo({
        id: options.id
      }).then(res => {
        wx.hideToast();
        let info = res && res[0];
        if (info){
          this.setData({
            toCancel: options.type && options.type == 'cancel',
            match_id: info.match_id,
            date: info.date,
            max_numbers: info.max_numbers,
            min_numbers: info.min_numbers,
            position: info.position && JSON.parse(info.position),
            time: info.time,
            match_tips: info.match_tips,
            type: info.type
          });
        }
      }, () => {
        showModel('error', '获取比赛信息失败，请重新进入本页面');
        this.setData({
            disabled: true
        });
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
  pickLocation: function(){
    if(this.data.toCancel){
      return;
    }
    wx.chooseLocation({
      success: (res) => {
        console.log('position', res)
        this.setData({
          position: res
        });
      },
    });
  },
  submit: function(e){
    if(this.submitting || this.data.toCancel){
      return;
    }
    this.submitting = true;
    let info = this.data;
    let reqMethod = info.match_id ? "editMatch" : "musterMatch";
    let name = info.match_id ? "提交" : "修改";
    let data = {
      date: info.date,
      max_numbers: info.max_numbers,
      min_numbers: info.min_numbers,
      position: JSON.stringify(info.position),
      time: info.time,
      match_tips: info.match_tips,
      type: info.type
    };
    if (info.match_id){
      data.match_id = info.match_id;
    }
    console.log('submit ', data)
    this.setData({
      loading: true
    });
    showBusy('正在请求');
    return REQ[reqMethod](data).then((e, d, a) => {
      console.log(11, e, d, a);
      this.submitting = false;
      this.setData({
        loading: false
      });
      showSuccess(`${name}成功`);
      this.navigateBack();
    }, (e) => {
      console.log(22, e);
      this.submitting = false;
      this.setData({
        loading: false
      });
      showModel(`${name}失败`, e);
    })
  },
    navigateBack: function(){
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
          error: () => showModel(`error`, '返回失败')
        });
      }, 1000);
    },
    submitting:false,
    submitCancel: function (e) {
        if(this.submitting){
            return;
        }
        this.submitting = true;
        setTimeout(() => { // 延时执行,让bindInput的方法先执行
            let info = this.data;
            if(!info.cancel_reason){
                return showModel(`错误`, '请输入取消理由');
            }
            showBusy('正在请求');
            this.setData({
                loading: true
            });
            let data = {
                reason: info.cancel_reason,
                id: info.match_id
            };
            return REQ.cancelMatch(data).then(() => {
                this.submitting = false;
                this.setData({
                    loading: false
                });
                showSuccess(`取消比赛成功`);
                this.navigateBack();
            }, (e) => {
                this.submitting = false;
                this.setData({
                    loading: false
                });
                showModel(`取消比赛失败`, e);
            })
        }, 100);
    }
});