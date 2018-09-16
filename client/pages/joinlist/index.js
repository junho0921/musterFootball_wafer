var REQ = require('../../common/request.js');
let {
  showBusy,
  showSuccess,
  showModel,
  isNotRegister
} = require('../../common/tools.js');
const {
  statusName,
  isMatchUnfull
} = require('../../common/const.js');

Page({
  data: {
    list: [],
  },
  onLoad: function (options) {
    let {open_id} = global.userInfo;
    if(!open_id){
      return showModel('没有用户信息');
    }
    if(!options.id){
      return showModel('没有比赛信息');
    }
    this.mid = options.id;
    this.userId = open_id;
  },
  onShow: function () {
    if (this.mid) {
      this.get();
    } else {
      return showModel('没有比赛信息')
    }
  },
  get: function () {
    let id = this.mid;
    console.log('id', id);
    console.log(';this.data', this.data)
    showBusy('加载信息中');
    REQ.getMatchDetail({
      id: id.split(',')
    })
      .then(res => {
        wx.hideToast();
        console.log('joinMatchs', res);
        res.forEach(item => {
          item.isJoined = item.members.includes(this.userId);
        });
        this.setData({ list: res });
        // 记录在全局，提供访问成员信息
        global.joinMatchs = res;
      }, () => {
        showModel('获取比赛信息失败');
      })
  },
  requesting: false,
  regretMatch: function(e){
    // 检查是否已经注册
    if(isNotRegister()){
      return;
    }
    if(this.requesting){
      return;
    }
    let { id } = e.currentTarget.dataset;
    if (id) {
      console.log('regretMatch', id);
      showBusy('请求中');
      this.requesting = true;
      REQ.regretMatch({
        id
      }).then(res => {
        this.requesting = true;
        showSuccess('取消报名成功');
        this.get();
      }, res => {
        this.requesting = true;
        return showModel('error', '取消报名失败');
      })
    }else{
      return showModel('error', '获取比赛信息失败');
    }
  },
  joinMatch: function(e){
    // 检查是否已经注册
    if(isNotRegister()){
      return;
    }
    if(this.requesting){
      return;
    }
    let { id } = e.currentTarget.dataset;
    if (id) {
      console.log('joinMatch', id);
      showBusy('请求中');
      this.requesting = true;
      REQ.joinMatch({
        id
      }).then(res => {
        this.requesting = true;
        showSuccess('取消报名成功');
        this.get();
      }, res => {
        this.requesting = true;
        return showModel('error', '取消报名失败');
      })
    }else{
      return showModel('error', '获取比赛信息失败');
    }
  },
});