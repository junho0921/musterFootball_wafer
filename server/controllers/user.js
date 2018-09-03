'use strict';
const moment = require('moment');
const ctx_service = require('../service');

class UserController {
    async login() {
        const { ctx } = this;
        if (ctx.state.$wxInfo.loginState !== 1) {
            // ctx.body = new Error('登陆状态失败');
            ctx.state.code = -1;
            return;
        }
        let data = ctx.state.$wxInfo.userinfo;
        console.log('data', data);
        const open_id = data.open_id;
        // 维护一套用户信息数据库，区别与微信cSessionInfo数据库
        let userInfo = await ctx_service.user.get({open_id});
        const last_login_time = moment().format('YYYY-MM-DD HH:mm:ss');
        if (!userInfo) {
            userInfo = {
                open_id,
                phone: '',
                wx_img: data.user_info.wx_img || '',
                name: data.user_info.name || '未知用户',
                last_login_time,
                real_name: '',
                join_match: '',
                match_tips: '',
                regret_join_match: '',
                cancel_muster_match: '',
                muster_match: ''
            };
            const ret = await ctx_service.user.add(userInfo);
            if (!ret) {
                ctx.body = new Error('注册用户信息失败');
                return;
            }
        } else {
            // 更新用户的登陆时间
            ctx_service.user.update({
                last_login_time
            }, {
                where: {open_id}
            });
        }
        data.p_user_info = userInfo;
        // 必须返回auth中间件的数据，这样才能被微信识别skey
        ctx.state.data = data;
        // ctx.body = data;
    }

    async update() {
        const { ctx } = this;
        if (ctx.state.$wxInfo.loginState !== 1) {
            ctx.body = new Error('登录态校验失败');
            return;
        }
        const {open_id} = ctx.state.$wxInfo.userinfo;
        const data = ctx.request.body;
        const ret = await ctx_service.user.update({
            phone: data.phone || 888,
            real_name: data.real_name || ''
        }, {
            where: {open_id}
        });
        if (ret) {
            ctx.body = 1;
        } else {
            ctx.body = new Error('保存失败');
        }
    }
}

module.exports = new UserController();
