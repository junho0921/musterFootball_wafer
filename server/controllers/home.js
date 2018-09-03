
class HomeController {
    async index() {
        await this.ctx.render('demo/index.html');
    }
}

module.exports = new HomeController();
