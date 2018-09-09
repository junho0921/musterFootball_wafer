// 引入 QCloud 小程序增强 SDK
const qcloud = require('../vendor/wafer2-client-sdk/index');
const config = require('../config.js');
const REQ = {};
const objToJSON = data => 
  typeof data === 'object' ? Object.keys(data).map(key => {
    let value = data[key];
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    return `${key}=${value}`;
  }).join('&') : '';
const requestWidthUserInfo = url => data => new Promise((resolve, reject) => {
  qcloud.request({
    url: `${url}?${objToJSON(data)}`,
    success: (res) => {
      if (res.data && res.data.code == 0){
        resolve(res.data.data);
      }else{
        reject(res.data && res.data.error || '服务器错误')
      }
    },
    fail: (e) => {
      reject(JSON.stringify(e.message))
    }
  });
});
const requestWidthoutUserInfo = url => data => new Promise((resolve, reject) => {
  wx.request({
    url: `${url}?${objToJSON(data)}`,
    success: (res) => {
      if (res.data && res.data.code == 0) {
        resolve(res.data.data);
      } else {
        reject(res.data && res.data.msg || '服务器错误')
      }
    },
    fail: (e) => {
      reject(JSON.stringify(e))
    }
  });
});

// 更新用户信息
REQ.updateInfo = requestWidthUserInfo(config.service.update);
// 获取用户信息
REQ.getUserInfo = requestWidthUserInfo(config.service.getUser);
// 发起比赛
REQ.musterMatch = requestWidthUserInfo(config.service.muster);
// 取消比赛
REQ.cancelMatch = requestWidthUserInfo(config.service.cancel);
// 编辑比赛
REQ.editMatch = requestWidthUserInfo(config.service.edit);
// 成员参加比赛
REQ.joinMatch = requestWidthUserInfo(config.service.join);
// 成员取消比赛
REQ.regretMatch = requestWidthUserInfo(config.service.regret);
// 获取比赛信息
REQ.getMatchInfo = requestWidthoutUserInfo(config.service.getMatch);

const REQ_DURATION = 3 * 1000;
const REQ_TIMER = () => new Promise((r) =>
  setTimeout(() => {
    r({ code: -1, msg: '请求超时' });
  }, REQ_DURATION)
);
Object.keys(REQ).forEach(key => {
    let item = REQ[key];
    REQ[key] = function () {
        return Promise.race([item.apply(this, arguments), REQ_TIMER()]);
    };
});

const failMsg = result => {
    if(!result || result.code != 0){
        return result && result.msg || '服务器错误';
    }
};

module.exports = REQ;