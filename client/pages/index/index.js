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
  },

  onLoad: function(){
    this.login();
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
        showSuccess('登录成功')
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
  }

});
