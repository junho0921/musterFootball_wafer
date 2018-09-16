const splitWord = ',';
const statusName = {
  1: '不够成员',
  2: '足够成员',
  3: '已满员',
  4: '已取消',
  5: '已过期'
};
const matchStatus = {
	'PENDING':1,
	'ENOUGH':2,
	'FULL': 3,
	'CANCEL':4,
	'PASS':5
};
const isEditable = status => {
	return status == matchStatus.PENDING || status == matchStatus.ENOUGH || status == matchStatus.FULL;
};
const isJoinable = status => {
	return status == matchStatus.PENDING || status == matchStatus.ENOUGH;
};

module.exports = {
    splitWord,
    matchStatus,
    statusName,
    isEditable,
    isJoinable
};