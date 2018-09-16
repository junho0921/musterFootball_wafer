const statusName = {
  1: '还没凑够同伴哦',
  2: '足够同伴了',
  3: '满员',
  4: '取消',
  5: '已过期'
};
// 判断比赛是否可以编辑
const isEditable = function(status){
  return status == 1 || status == 2 || status == 3;
};
// 判断比赛是否可以继续邀请成员
const isJoinable = function(status){
  return status == 1 || status == 2;
};
const REQ_DURATION = 3 * 1000;

const ROLE = {
  visitor: 0,
  leader: 1,
  member: 2
};
const STORE_KEY = {
  muster_member: '101',
  muster_setting: '102',
  join_member: '103',
  role: '201'
};

module.exports = {
  isEditable,
  isJoinable,
  statusName,
  STORE_KEY,
  ROLE,
  REQ_DURATION
};