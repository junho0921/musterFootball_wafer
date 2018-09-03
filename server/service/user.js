'use strict';
const moment = require('moment');
// 数据库表名
const TABLE_NAME = 'user_info';

class UserService {
    /**
     * 获取
     */
    async get(options) {
        const { app } = this;
        return await app.mysql.get(TABLE_NAME, options);
    }
    /**
     * 增加
     * @param {Object} item
     */
    async add(item) {
        const { app } = this;
        item.created_by = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = await app.mysql.insert(TABLE_NAME, item);
        return result && result.affectedRows === 1;
    }

    /**
     * 更新
     * @param {Object} item
     */
    async update(item, options) {
        const { app } = this;
        item.updated_by = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = await app.mysql.update(TABLE_NAME, item, options);
        return result && result.affectedRows === 1;
    }

    /**
     * 查询
     * @param {Object} options 查询条件
     * @return {Array<Object>} result
     */
    async find(options) {
        const { app } = this;
        options.limit = options.limit || 100;
        return await app.mysql.select(TABLE_NAME, options);
    }
}

module.exports = new UserService();
