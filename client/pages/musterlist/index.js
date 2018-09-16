var REQ = require('../../common/request.js');
let {
  showBusy,
  showSuccess,
  showModel,
} = require('../../common/tools.js');
const {
  statusName,
  isJoinable
} = require('../../common/const.js');

Page({
  data: {
    list: [],
  },
  onLoad: function(options){
    this.mid = options.id;
  },
  onShow: function () {
    if (this.mid){
      this.get();
    }else{
      showModel('没有id')
    }
  },
  get: function(){
    let id = this.mid;
    console.log('id', this.mid);
    console.log(';this.data', this.data)
    showBusy('加载信息中');
    REQ.getMatchDetail({
      id: id.split(',')
    })
    .then(res => {
      wx.hideToast();
      console.log('matchs', res);
      this.setData({ list: res });
      // 记录在全局，提供访问成员信息
      global.matchs = res;
    }, () => {
      showModel('获取比赛信息失败');
    })
  },
    shareMatch(){
        wx.showShareMenu({
            withShareTicket: true,
            success: (e) => {
                console.log('share success', e)
            },
            error: (e) => {
                console.log('share error', e)
            }
        })
    }
});