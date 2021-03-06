'use strict';
const moment = require('moment');
const {
    splitWord,
    matchStatus,
    statusName,
    isEditable,
    isJoinable
} = require('../tools/CONST');
const ctx_service = require('../service');

const getMatchUser  = async (ctx) => {
    const query = ctx.query;
    let match_id = query.id;
    if (!match_id){
        throw new Error('参数错误');
        return
    }
    if (ctx.state.$wxInfo.loginState !== 1) {
        throw new Error('登陆状态失败');
        return;
    }
    let data = ctx.state.$wxInfo.userinfo;
    let open_id = data.openId;
    // 查询当前登录用户信息
    let userInfo = await ctx_service.user.get({open_id});
    if (!userInfo) {
        throw new Error('请先登陆');
        return;
    }
    // 查询比赛信息
    let matchInfo = await ctx_service.match.get({match_id});
    if (!matchInfo) {
        throw new Error('无此比赛信息');
        return
    }
    return {match_id, open_id, userInfo, matchInfo}
};

class MatchController {
    async get(ctx) {
        const query = ctx.query;
        let match_id = query.id;
        if (!match_id){
            throw new Error('参数错误');
            return
        }
        try{
            match_id = JSON.parse(match_id)
        }catch (e){}
        let matchs = await ctx_service.match.getAll('match_id', match_id);
        if(!matchs || !matchs.length){
            throw new Error('没有比赛信息');
            return;
        }
        ctx.state.data = matchs;
    }

    async cancel(ctx){
        const res = await getMatchUser(ctx);
        if(!res){
            return
        }
        const {match_id, open_id, userInfo, matchInfo} = res;
        const canceled_reason = ctx.query.reason;

        if (matchInfo.leader != open_id){
            throw new Error('您不是比赛的发起者，不能取消比赛');
            return
        }

        if (!canceled_reason){
            throw new Error('取消比赛须提交取消理由');
            return
        }

        if (matchInfo.canceled == 1){
            throw new Error('比赛已经取消');
            return
        }

        if (!isEditable(matchInfo.status)){
            throw new Error('比赛不能取消');
            return
        }

        let cancelSuccess = await ctx_service.match.update(Object.assign({}, matchInfo, {
            status: matchStatus.CANCEL,
            canceled_reason
        }), {
            where:{match_id}
        });
        if (!cancelSuccess){
            throw new Error('取消失败');
            return
        }
        // 更新个人组队信息
        const userRet = await ctx_service.user.update({
            muster_match: userInfo.muster_match.split(splitWord).filter(i => i != match_id).join(splitWord),
            cancel_muster_match: (userInfo.cancel_muster_match || '') + (userInfo.cancel_muster_match && splitWord || '') + match_id
        }, {
            where: {open_id}
        });
        if (!userRet) {
            throw new Error('更新个人组队信息失败');
            return;
        }
        ctx.state.data = 1
    }

    async join(ctx) {
        const res = await getMatchUser(ctx);
        if(!res){
            return
        }
        const {match_id, open_id, userInfo, matchInfo} = res;

        // 检查用户的信息登记情况
        if(!userInfo.phone || !userInfo.real_name){
            throw new Error('报名前，请先登记信息');
            return
        }

        // 检查比赛情况
        if(!isJoinable(matchInfo.status)){
            throw new Error('此比赛不能报名了，因为'+statusName[matchInfo.status]);
            return
        }

        // 查询当前用户是否已经报名此比赛
        if (matchInfo.members.includes(userInfo.open_id)) {
            throw new Error('已经报名');
            return
        }

        // 更新比赛成员信息
        let numbers = matchInfo.members.split(splitWord).length;
        let status = numbers >= matchInfo.min_numbers ? matchStatus.ENOUGH : matchStatus.PENDING;
        status = numbers <= matchInfo.max_numbers ? matchStatus.FULL : matchStatus.PENDING;
        const updateMatchSuccess = await ctx_service.match.update({
            joinChangeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            status,
            members: (matchInfo.members || '') + (matchInfo.members ? splitWord : '') + open_id
        }, {
            where: {match_id}
        });
        if (!updateMatchSuccess) {
            throw new Error('抱歉，报名失败');
            return;
        }

        // 更新个人报名信息
        const updateUserSuccess = await ctx_service.user.update({
            join_match: (userInfo.join_match || '') + (userInfo.join_match && splitWord || '') + match_id,
            regret_join_match: userInfo.regret_join_match.split(splitWord).filter(i => i != match_id).join(splitWord)
        }, {
            where: {open_id}
        });
        if (!updateUserSuccess) {
            throw new Error('更新个人报名信息报错');
            return
        }
        ctx.state.data = 1
    }

    async regret(ctx) {
        const res = await getMatchUser(ctx);
        if(!res){
            return
        }
        const {match_id, open_id, userInfo, matchInfo} = res;

        // 查询当前用户是否已经报名此比赛
        if (!matchInfo.members.includes(userInfo.open_id)) {
            throw new Error('您还没有报名');
            return
        }
        // 判断比赛状态
        if (!isEditable(matchInfo.status)) {
            throw new Error('比赛不能取消参与,'+statusName[matchInfo.status]);
            return
        }

        // 更新比赛成员信息
        const updateMatchSuccess = await ctx_service.match.update({
            joinChangeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            members: matchInfo.members.split(splitWord).filter(item => item != open_id).join(splitWord)
        }, {
            where: {match_id}
        });
        if (!updateMatchSuccess) {
            throw new Error('抱歉，取消报名失败');
            return
        }

        // 更新个人报名信息
        const updateUserSuccess = await ctx_service.user.update({
            join_match: userInfo.join_match.split(splitWord).filter(item => item != match_id).join(splitWord),
            regret_join_match: (userInfo.regret_join_match || '') + (userInfo.regret_join_match && splitWord || '') + match_id
        }, {
            where: {open_id}
        });
        if (!updateUserSuccess) {
            throw new Error('更新个人报名信息报错');
            return
        }
        ctx.state.data = 1;
    }

    async muster(ctx) {
        if (ctx.state.$wxInfo.loginState !== 1) {
            throw new Error('登陆状态失败');
            return;
        }
        let open_id = ctx.state.$wxInfo.userinfo.openId;
        const data = ctx.query;
        // 参数校验
        if (!data.date || !data.position) {
            throw new Error('比赛数据缺失');
            return;
        }
        // 查询当前登录用户信息
        let userInfo = await ctx_service.user.get({open_id});
        if (!userInfo) {
            throw new Error('获取当前用户信息异常');
            return;
        }else{
            // 检查用户的信息登记情况
            if(!userInfo.phone || !userInfo.real_name){
                throw new Error('请先登记信息');
                return;
            }
        }
        // 创建比赛id
        const match_id = 'mid_' + Date.now();
        const ret = await ctx_service.match.add({
            // 比赛信息
            match_id,
            date: data.date,
            max_numbers: data.max_numbers,
            min_numbers: data.min_numbers,
            position: data.position,
            time: data.time,
            match_tips: data.match_tips,
            type: data.type,
            joinChangeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            infoChangeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            // 附属信息
            leader: open_id,
            status: matchStatus.PENDING,
            canceled_reason: '',
            members: open_id,
        });
        if (!ret) {
            throw new Error('创建比赛失败');
            return;
        }
        // 更新个人组队信息
        const userRet = await ctx_service.user.update({
            muster_match: (userInfo.muster_match || '') + (userInfo.muster_match && splitWord || '') + match_id,
            join_match: (userInfo.join_match || '') + (userInfo.join_match && splitWord || '') + match_id
        }, {
            where: {open_id}
        });
        if (!userRet) {
            throw new Error('更新个人组队信息失败');
            return;
        }
        ctx.state.data = 1;
    }
    async edit(ctx) {
        if (ctx.state.$wxInfo.loginState !== 1) {
            throw new Error('登陆状态失败');
            return;
        }
        let open_id = ctx.state.$wxInfo.userinfo.openId;
        const data = ctx.query;
        // 参数校验
        if (!data.date || !data.position || !data.match_id) {
            throw new Error('数据填写有误');
            return
        }
        // 查询当前登录用户信息
        const userInfo = await ctx_service.user.get({open_id});
        if (!userInfo) {
            throw new Error('获取当前用户信息异常');
            return
        }
        const match_id = data.match_id;
        // 查询比赛信息
        let matchInfo = await ctx_service.match.get({match_id});
        if (!matchInfo) {
            throw new Error('无此比赛信息');
            return
        }
        // 判断是否可以编辑
        if(!isEditable(matchInfo.status)){
            throw new Error('比赛不可编辑');
            return
        }
        // 更新
        const ret = await ctx_service.match.update({
            infoChangeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: data.type || 5,
            date: data.date,
            max_numbers: data.maxNumbers || 100,
            position: data.position,
        }, {
            where: {match_id}
        });
        if (!ret) {
            throw new Error('更新比赛信息失败');
            return
        }
        ctx.state.data = 1;
    }
}

module.exports = new MatchController();
