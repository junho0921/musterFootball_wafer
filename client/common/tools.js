

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
const toRegisterPage = () => wx.navigateRedirect({
  url: 'pages/user/index',
  success: () => wx.hideToast(),
  error: () => wx.hideToast(),
});
const isNotRegister = () => {
  let {userInfo} = global;
  if(!userInfo){
    return true;
  }else{
    if(!userInfo.real_name || !userInfo.phone){
      return true;
    }
  }
};

module.exports = {
  showBusy,
  showSuccess,
  showModel,
  isNotRegister,
  toRegisterPage
};