'use strict';
const moment = require('moment');
const ctx_service = require('../service');

class UserController {
    async login(ctx) {
        if (ctx.state.$wxInfo.loginState !== 1) {
            throw new Error('登陆状态失败');
            return;
        }
        let data = ctx.state.$wxInfo.userinfo;
        const open_id = data.userinfo.openId;
        // 维护一套用户信息数据库，区别与微信cSessionInfo数据库
        let userInfo = await ctx_service.user.get({open_id});
        const last_login_time = moment().format('YYYY-MM-DD HH:mm:ss');
        if (!userInfo) {
            userInfo = {
                open_id,
                phone: 0,
                wx_img: data.userinfo.avatarUrl || '',
                name: data.userinfo.nickName || '未知用户',
                last_login_time,
                real_name: '',
                join_match: '',
                regret_join_match: '',
                cancel_muster_match: '',
                muster_match: ''
            };
            const ret = await ctx_service.user.add(userInfo);
            if (!ret) {
                throw new Error('注册用户信息失败');
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
    }

    async get(ctx) {
        if (ctx.state.$wxInfo.loginState !== 1) {
            throw new Error('登陆状态失败');
            return;
        }
        const open_id = ctx.state.$wxInfo.userinfo.openId;
        if(open_id){
            let data = await ctx_service.user.get({ open_id });
            ctx.state.data = data;
        }else{
            throw new Error('用户信息获取失败');
            return;
        }
    }

    async update(ctx) {
        if (ctx.state.$wxInfo.loginState !== 1) {
            throw new Error('登陆状态失败');
            return;
        }
        const data = ctx.query;
        const open_id = ctx.state.$wxInfo.userinfo.openId;
        const ret = await ctx_service.user.update({
            phone: data.phone,
            real_name: data.real_name
        }, {
            where: {open_id}
        });
        if (ret) {
            ctx.state.data = 1;
        } else {
            throw new Error('保存失败');
            return;
        }
    }
}

module.exports = new UserController();
