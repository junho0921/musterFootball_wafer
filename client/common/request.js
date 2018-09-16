// 引入 QCloud 小程序增强 SDK
const qcloud = require('../vendor/wafer2-client-sdk/index');
const config = require('../config.js');
const {
  REQ_DURATION,
  statusName
} = require('./const.js');
const REQ = {};
// let concurrent_req = {};
const objToJSON = data =>
  typeof data === 'object' ? Object.keys(data).map(key => {
    let value = data[key];
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    return `${key}=${value}`;
  }).join('&') : '';
const requestWidthUserInfo = url => data => new Promise((resolve, reject) => {
  // let count = concurrent_req[url] || 0 ;
  // if(data.maxConcurrent > (count+1)){
  //   console.log(`${url}并发请求过多`);
  //   return;
  // }
  // concurrent_req[url] = count+1;
  let timer = setTimeout(() => {
    resolve({ code: -1, msg: '请求超时' });
  }, data && data.timeout || REQ_DURATION);
  let _url = `${url}?${objToJSON(data)}`;
  console.log('请求url = ', _url);
  qcloud.request({
    url:_url,
    success: (res) => {
      if (res.data && res.data.code == 0){
        resolve(res.data.data);
      }else{
        reject(res.data && res.data.error || '服务器错误')
      }
    },
    fail: (e) => {
      reject(JSON.stringify(e.message))
    },
    complete: () => {
      clearTimeout(timer);
      // concurrent_req[url] -= 1;
    }
  });
});
const requestWithoutUserInfo = url => data => new Promise((resolve, reject) => {
  let timer = setTimeout(() => {
    resolve({ code: -1, msg: '请求超时' });
  }, data && data.timeout || REQ_DURATION);
  let _url = `${url}?${objToJSON(data)}`;
  console.log('请求url = ', _url);
  wx.request({
    url: _url,
    success: (res) => {
      if (res.data && res.data.code == 0) {
        resolve(res.data.data);
      } else {
        reject(res.data && res.data.msg || '服务器错误')
      }
    },
    fail: (e) => {
      reject(JSON.stringify(e))
    },
    complete: () => {
      clearTimeout(timer);
    }
  });
});

// 更新用户信息
REQ.updateInfo = requestWidthUserInfo(config.service.update);
// 获取用户信息
REQ.getUserInfo = requestWidthUserInfo(config.service.getUser);
// 获取用户信息
REQ.getMembersInfo = requestWidthUserInfo(config.service.getMembers);
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
REQ.getMatchInfo = requestWithoutUserInfo(config.service.getMatch);
// 获取比赛信息(预处理数据)
REQ.getMatchDetail = function () {
  return REQ.getMatchInfo.apply(this, arguments).then(res => {
    let isSuccess = true;
    try {
      res.forEach(item => {
        item.statusName = statusName[item.status];
      });
      res.forEach(item => {
        item.position = JSON.parse(item.position);
      });
    } catch (e) {
      isSuccess = false;
      console.log('解释比赛信息错误', e);
    }
    return isSuccess ? res : Promise.reject({ code: -1, msg: '解释比赛信息错误' });
  })

};

module.exports = REQ;