const {members} = require('../tools/wx_login');

class HomeController {
    async index() {
        await this.ctx.render('demo/index.html', {members});
    }
}

module.exports = new HomeController();
