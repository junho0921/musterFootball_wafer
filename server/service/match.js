'use strict';
const moment = require('moment');

// 数据库表名
const TABLE_NAME = 'matchs';

class MatchService {
    /**
     * 查询
     * @param {Object} options 查询条件
     * @return {Array<Object>} result
     */
    async find(options) {
        const { app } = this;
        return await app.mysql.select(TABLE_NAME, options);
    }

    /**
     * 查询一条
     * @param {Object} options 查询条件
     * @return {Object} result
     */
    async get(options) {
        const { app } = this;
        return await app.mysql.get(TABLE_NAME, options);
    }

    /**
     * 增加
     * @param {Object} item
     * @return {Boolean} result 是否增加成功
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
     * @return {Boolean} result 是否修改成功
     */
    async update(item, options) {
        const { app } = this;
        item.updated_by = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = await app.mysql.update(TABLE_NAME, item, options);
        return result && result.affectedRows === 1;
    }

    /**
     * 删除
     * @param {Object} item
     * @return {Boolean} result 是否删除成功
     */
    async delete(item) {
        const { app } = this;
        const result = await app.mysql.delete(TABLE_NAME, item);
        return result && result.affectedRows === 1;
    }
}

module.exports = new MatchService();
