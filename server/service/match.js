'use strict';
const moment = require('moment');
const {mysql} = require('../qcloud');

// 数据库表名
const TABLE_NAME = 'matchs';

class MatchService {
    /**
     * 查询
     * @param {Object} options 查询条件
     * @return {Object} result
     */
    async get(options) {
        return mysql(TABLE_NAME)
            .select('*')
            .where(options.where)
            .catch(e => {
                throw new Error(`get ${TABLE_NAME} fail\n${e}`)
            });
    }

    /**
     * 查询一系列的
     * @param {Object} options 查询条件
     * @return {Object} result
     */
    async getAll(key, value) {
        return mysql(TABLE_NAME)
            .select('*')
            .whereIn(key, value)
            .catch(e => {
                throw new Error(`get ${TABLE_NAME} fail\n${e}`)
            });
    }

    /**
     * 增加
     * @param {Object} item
     * @return {Boolean} result 是否增加成功
     */
    async add(item) {
        item.created_by = moment().format('YYYY-MM-DD HH:mm:ss');
        return mysql(TABLE_NAME)
            .insert(item)
            .catch(e => {
                throw new Error(`add ${TABLE_NAME} fail\n${e}`)
            });
    }

    /**
     * 更新
     * @param {Object} item
     * @return {Boolean} result 是否修改成功
     */
    async update(item, options) {
        item.updated_by = moment().format('YYYY-MM-DD HH:mm:ss');
        return mysql(TABLE_NAME)
            .update(item)
            .where(options.where)
            .catch(e => {
                throw new Error(`update ${TABLE_NAME} fail\n${e}`)
            });
    }
}

module.exports = new MatchService();
