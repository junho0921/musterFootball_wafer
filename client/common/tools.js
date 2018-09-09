

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

const statusName = {
  1: '还没凑够同伴哦',
  2: '足够同伴了',
  3: '满员',
  4: '取消',
  5: '已过期'
};

module.exports = {
  showBusy,
  showSuccess,
  showModel,
  statusName
}