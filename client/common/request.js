const REQ = {};
const fetchByLogin = function(){
    // 为了测试，添加用户类型type
    if(typeof arguments[0] === 'string'){
        arguments[0]+= arguments[0].includes('?') ? '&' : '?';
        arguments[0]+= `skey=${app.userType}`;
    }
    return window.fetch.apply(this, arguments);
};
// 成员参加比赛
REQ.joinMatch = (matchId) =>
    fetchByLogin(`/api/match/join?id=${matchId}`)
        .then((response) => {
            //返回 object 类型
            return response.json();
        });
// 成员取消比赛
REQ.regretMatch = (matchId) =>
    fetchByLogin(`/api/match/regret?id=${matchId}`)
        .then((response) => {
            //返回 object 类型
            return response.json();
        });
// 获取用户信息
REQ.getInfo = () =>
    fetchByLogin(`/api/user/login`)
        .then(res => res.json());
// 更新用户信息
REQ.updateInfo = (userInfo) =>
    fetchByLogin('/api/user/update', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    }).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 发起比赛
REQ.musterMatch = data =>
    fetchByLogin('/api/match/muster', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 编辑比赛
REQ.editMatch = data =>
    fetchByLogin('/api/match/edit', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 获取比赛信息
REQ.getMatchInfo = (idList) =>
    fetch(`/api/match/get?id=${JSON.stringify(idList.split(','))}`).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 取消比赛
REQ.cancelMatch = (matchId, reason) =>
    fetchByLogin(`/api/match/cancel?id=${matchId}&reason=${reason}`).then((response) => {
        //返回 object 类型
        return response.json();
    });

const REQ_DURATION = 3 * 1000;
const REQ_TIMER = () => new Promise((r) =>
    window.setTimeout(() => {
        r({code:1, msg: '请求超时'});
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