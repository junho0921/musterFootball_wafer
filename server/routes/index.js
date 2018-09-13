/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'   // 定义所有路由的前缀都已 /weapp 开头
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口 /weapp/login
router.get('/login', authorizationMiddleware, controllers.user.login);
// 用户信息
router.get('/user/get', validationMiddleware, controllers.user.get);
router.get('/user/getAll', validationMiddleware, controllers.user.getUser);
router.get('/user/update', validationMiddleware, controllers.user.update);
// 比赛
router.get('/match/muster', validationMiddleware, controllers.match.muster);
router.get('/match/edit', validationMiddleware, controllers.match.edit);
router.get('/match/cancel', validationMiddleware, controllers.match.cancel);
router.get('/match/join', validationMiddleware, controllers.match.join);
router.get('/match/regret', validationMiddleware, controllers.match.regret);
router.get('/match/get', controllers.match.get);

module.exports = router;
