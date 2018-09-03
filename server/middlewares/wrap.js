'use strict';

/**
 * 统一响应内容格式
 */
module.exports = () => {
  return async function (ctx, next) {
    await next();

    const now = new Date();
    const body = ctx.body;
    const ret = {
      time: parseInt(now.getTime() / 1000),
      code: 0,
      data: body,
      msg: ''
    };
    if (body instanceof Error) {
      ret.code = body.code || 1;
      ret.data = null
      ret.msg = body.message || '数据读取错误';
    }
    // 设置缓存时长
    ctx.set('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
    ctx.set('Date', now.toUTCString());
    ctx.set('Last-Modified', now.toUTCString());
    ctx.set('Expires', 'Mon, 26 Jul 1997 05:00:00 GMT');

    ctx.status = 200;
    ctx.body = JSON.stringify(ret);
  };
};
