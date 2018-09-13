/**
 * @fileOverview 演示会话服务和 WebSocket 信道服务的使用方式
 */

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var REQ = require('../../common/request.js');
// 引入配置
var config = require('../../config');

let {
  showBusy,
  showSuccess,
  showModel
} = require('../../common/tools.js');
let {
  ROLE,
  STORE_KEY,
  statusName
} = require('../../common/const.js');


/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据，我们把服务地址显示在页面上
   */
  data: {
    loginUrl: config.service.loginUrl,
    userInfo: null,
    matchId: '',
    newMembersMsg: [],
    newSettingMsg: [],
    role: ROLE.visitor,
    leaderRole: ROLE.leader,
    memberRole: ROLE.member
  },

  onLoad: function(){
  },

  setRole: function (e) {
    let { role } = e.currentTarget.dataset;
    if (role) {
      this.setData({
        role
      });
      this.login();
    }
  },

  /**
   * 点击「登录」按钮，测试登录功能
   */
  bindGetUserInfo: function (e) {
    const session = qcloud.Session.get()

    if (session) {
      showBusy('正在登录');
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res.p_user_info, logged: true });
          showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          showModel('登录错误', err.message)
        }
      })
    } else {
      this.login();
    }
  },

  login: function(){
    showBusy('正在登录');
      // 首次登录
    qcloud.login({
      success: res => {
        this.setData({ userInfo: res.p_user_info, logged: true });
        global.userInfo = res.p_user_info;
        console.log('global', global);
        showSuccess('登录成功');
        this.getNews();
      },
      fail: err => {
        console.error(err)
        showModel('登录错误', err.message)
      }
    })
  },


  /**
   * 点击「清除会话」按钮
   */
  clearSession() {
    // 清除保存在 storage 的会话信息
    qcloud.clearSession();
    showSuccess('会话已清除');
  },

  previewImage() {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  getUserInfo(){
    REQ.getUserInfo().then(res => console.log(11, res))
  },

  getNews(){
    let info = this.data.userInfo;
    if(!info){
      return;
    }
    if(this.data.role === ROLE.leader && info.muster_match){
      this.getMatch(info.muster_match).then((res) => {
        let newMembersMsg = this.contractMember(res, STORE_KEY.muster_member);
        console.log({
          newMembersMsg
        });
        this.setData({ newMembersMsg });
      });
    }else if(this.data.role === ROLE.member && info.join_match){
      this.getMatch(info.join_match).then(res => {
        let newMembersMsg = this.contractMember(res, STORE_KEY.join_member);
        let newSettingMsg = this.contractMatchSetting(res, STORE_KEY.muster_setting);
        console.log({
          newMembersMsg,
          newSettingMsg
        });
        this.setData({
          newMembersMsg,
          newSettingMsg
        });
      });
    }
  },
  getMatch(id){
    return REQ.getMatchDetail({
      id: id.split(',')
    })
  },
  contractMatchSetting(newList, keyName){
    let pastList = [];
    let newMsg = [];
    try{
      pastList = JSON.parse(wx.getStorageSync(keyName));
    }catch (e){}
    newList.forEach(item => {
      let passItem = pastList.find(i => i.match_id == item.match_id);
      let newSettingMsg = [];
      if(passItem){
        this.contractDetail(newSettingMsg, item, passItem, 'date');
        this.contractDetail(newSettingMsg, item, passItem, 'time');
        this.contractDetail(newSettingMsg, item, passItem, 'position');
        this.contractDetail(newSettingMsg, item, passItem, 'tips');
      }
      if(newSettingMsg.length){
        newMsg.push(`${item.date}的比赛有设置变更了:${newSettingMsg.join(',')}`);
      }
    });
    try{
      wx.setStorageSync(keyName, JSON.stringify(newList));
    }catch (e){}
    return newMsg;
  },
  contractDetail: function (newSettingMsg, item, passItem, key) {
    let newVal = item[key];
    let pastVal = item[key];
    if(typeof newVal === 'object'){
      newVal = JSON.stringify(newVal);
    }
    if(typeof pastVal === 'object'){
      pastVal = JSON.stringify(pastVal);
    }
    if(newVal != pastVal){
      newSettingMsg.push(key);
    }
  },
  contractMember(newList, keyName){
    let pastList = [];
    let newMsg = [];
    try{
      pastList = JSON.parse(wx.getStorageSync(keyName));
    }catch (e){}
    newList.forEach(item => {
      let passItem = pastList.find(i => i.match_id == item.match_id);
      if(passItem && item.members != passItem.members){
        newMsg.push(`${item.date}的比赛有成员变更了`);
      }
    });
    try{
      wx.setStorageSync(keyName, JSON.stringify(newList));
    }catch (e){}
    return newMsg;
  },
});
