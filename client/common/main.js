let pageMatchId = location.hash.match(/matchId=(\w+)/)
let EVENT = {};
const DOM = {
    musters: '#musterMatchDetailList',
    joins: '#joinMatchDetailList',
};
const app = {
    // 页面的比赛信息
    match: null,
    matchId: pageMatchId && pageMatchId[1],
    userType: undefined,
    // 用户信息
    user:{},
    // 初始化
    init: () => {
        app.loadMatchInfo();
        app.bindEvent();
    },
    loadMatchInfo: () => {
        if(!app.matchId){
            return
        }
        $('#joinMatchPanel').show();
        REQ.getMatchInfo(app.matchId).then(result => {
            let matchInfo = result.data && result.data[0];
            if(matchInfo){
                app.match = matchInfo;
                app.renderPageMatch();
            }
        })
    },
    renderPageMatch: function(){
        $('#matchDetail').html(
            renderJoinMatchList([app.match], '比赛信息', app.user.open_id)
        );
    },
    bindEvent: () => {
        Object.keys(EVENT).forEach(key => EVENT[key]())
    },
    hidePopWin: function () {
        $('#popWin .content').empty()
        $('#popWin').hide()
    },
    popMatchFormWin: function (onSubmit, matchInfo) {
        $('#popWin .content')
            .html(renderMatchForm(matchInfo))
            .css('display', 'flex')
        $('#popWin').css('display', 'flex')
        EVENT.submitMatch(onSubmit, matchInfo || {})
    },
    popUserFormWin: function () {
        if(!app.user.open_id){
            return alert('还没有登陆')
        }
        $('#popWin .content')
            .html(renderUserForm(app.user))
            .css('display', 'flex')
        $('#popWin').css('display', 'flex')
        EVENT.updateInfo()
    },
    popCancelMatchWin: match_id => {
        $('#popWin .content')
            .html(renderCancelInput(match_id))
            .css('display', 'flex')
        $('#popWin').css('display', 'flex')
    },
    getUserInfo: () => REQ.getInfo().then((result) => {
        if(failMsg(result)){
            return alert(failMsg(result))
        }
        app.user = result.data.p_user_info;
        $('.name').text(app.user.name + '，欢迎你');
        return result
    }).then(() => {
        app.renderMusterMatchList();
        app.renderJoinMatchList();
    }),
    renderMusterMatchList: function () {
        let {muster_match} = app.user
        if(muster_match){
            REQ.getMatchInfo(muster_match).then((result) => {
                if(failMsg(result)){
                    return
                }
                if(result.data){
                    app.muster_match = result.data;
                    $(DOM.musters).html(
                        renderMusterMatchList(app.muster_match, app.user.open_id)
                    ).show()
                    EVENT.editMatch()
                }
            })
        }else{
            $(DOM.musters).html('').hide()
        }
    },
    renderJoinMatchList: function () {
        let {join_match} = app.user;
        if(join_match){
            REQ.getMatchInfo(join_match).then((result) => {
                if(failMsg(result)){
                    return
                }
                if(result.data){
                    app.join_match = result.data;
                    $(DOM.joins).html(
                        renderJoinMatchList(result.data, '我参加的比赛', app.user.open_id)
                    ).show()
                }
            })
        }else{
            $(DOM.joins).html('').hide()
        }
    }
}
// 弹窗
EVENT.popWinMask = () =>
    $('#popWin .mask').click(app.hidePopWin)
// 登陆
EVENT.login = () =>
    $('.login').click((e) => {
        app.userType = $(e.target).data('skey')
        app.getUserInfo().then(() => {
            if(app.matchId){
                // 重新渲染页面比赛信息，报名状态
                app.renderPageMatch();
            }
        });
    });
// 更新用户信息
EVENT.editUserInfo = () =>
    $('#editUserInfo').click(app.popUserFormWin)
EVENT.updateInfo = () =>
    $('#update').click(() => {
        let phone = $('#phone').val() || app.user.phone;
        let real_name = $('#realName').val() || app.user.real_name;
        REQ.updateInfo(Object.assign({}, app.user, {
            phone,
            real_name
        })).then((result) => {
            if(failMsg(result)){
                return alert(failMsg(result))
            }
            app.getUserInfo()
            app.hidePopWin()
        })
    });
// 发起比赛
EVENT.muster = () =>
    $('#musterMatch').click(function () {
        app.popMatchFormWin(function (data) {
            REQ.musterMatch(data).then((result) => {
                if(failMsg(result)){
                    return alert(failMsg(result))
                }
                app.getUserInfo()
                app.hidePopWin()
            })
        })
    })
// 编辑比赛
EVENT.editMatch = () =>
    $('.editMatch').click(function (e) {
        let match_id = $(e.target).data('match')
        let originalInfo = app.muster_match.find(i => i.match_id == match_id)
        if(!originalInfo){
            return alert('比赛信息错误')
        }
        app.popMatchFormWin(function (data) {
            data.match_id = originalInfo.match_id
            REQ.editMatch(data).then((result) => {
                if(failMsg(result)){
                    return alert(failMsg(result))
                }
                app.getUserInfo()
                app.hidePopWin()
            })
        }, originalInfo)
    })
// 提交比赛表格
EVENT.submitMatch = (onSubmit, matchInfo) =>
    $('.matchForm').on('click', '.muster', (e) => {
        $form = $(e.delegateTarget)
        if(!app.user.open_id){
            return alert('请登录')
        }
        let type = $form.find('[name=matchType]:checked').val();
        let position = $form.find('#position').val();
        let date = $form.find('#matchDate').val();
        let maxNumbers = $form.find('#maxNumbers').val();
        let match_tips = $form.find('#match_tips').val();
        let data = {
            openId: app.user.open_id,
            type,
            maxNumbers,
            match_tips,
            position,
            date
        };
        console.log('data', data)
        onSubmit(data)
    })
// 取消比赛
EVENT.cancelMatch = () =>
    $('body').on('click', '.cancelMatch', function (e) {
        if(!app.user.open_id){
            return alert('未登陆')
        }
        let $e = $(e.target);
        let matchId = $e.data('match');
        let reason = $('#cancelInput').val().trim();
        if(!reason){
            return alert('请输入取消理由');
        }
        if(matchId){
            console.log('删除', matchId)
            return REQ.cancelMatch(matchId, reason).then(result => {
                if(failMsg(result)){
                    return alert(failMsg(result))
                }
                app.hidePopWin();
                app.getUserInfo();
            });
        }
    });
// 取消比赛
EVENT.deleteMatch = () =>
    $(DOM.musters).on('click', '.deleteMatch', function (e) {
        if(!app.user.open_id){
            return alert('未登陆')
        }
        let $e = $(e.target);
        let matchId = $e.data('match');
        if(!matchId){
            return alert('获取信息失败');
        }
        app.popCancelMatchWin(matchId);
    });
// 分享比赛
EVENT.shareMatch = () =>
    $(DOM.musters).on('click', '.shareMatch', function (e) {
        if(!app.user.open_id){
            return alert('未登陆')
        }
        let $e = $(e.target)
        let matchId = $e.data('match')
        if(matchId){
            window.location.hash = `matchId=${matchId}`
            window.location.reload()
        }
    });
// 报名比赛
EVENT.joinMatch = () =>
    $('body').on('click', '.joinMatch', function (e) {
        if(!app.user.open_id){
            return alert('请先登陆')
        }
        let $btn = $(e.target);
        let match_id = $btn.data('match');
        $btn.hide();
        if(match_id){
            REQ.joinMatch(match_id, app.user.open_id)
                .then(result => {
                    if(failMsg(result)){
                        $btn.show();
                        return alert(failMsg(result))
                    }
                    if(result.data === 1){
                        app.getUserInfo()
                        // app.loadMatchInfo()
                    }
                })
        }else{
            return alert('页面没有比赛信息')
        }
    });
// 取消报名比赛
EVENT.cancelJoinMatch = () =>
    $('body').on('click', '.cancelJoinMatch', function (e) {
        if(!app.user.open_id){
            return alert('请先登陆')
        }
        let $btn = $(e.target);
        let match_id = $btn.data('match');
        $btn.hide();
        if(match_id){
            REQ.regretMatch(match_id, app.user.open_id)
                .then(result => {
                    if(failMsg(result)){
                        $btn.show();
                        return alert(failMsg(result))
                    }
                    if(result.data === 1){
                        app.getUserInfo()
                        // app.loadMatchInfo()
                    }
                })
        }else{
            return alert('页面没有比赛信息')
        }
    });
// 初始化
app.init();