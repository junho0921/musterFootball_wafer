var REQ = require('../../common/request.js');
var appG = require('../../common/global.js');
let {
  showBusy,
  showSuccess,
  showModel
} = require('../../common/tools.js');

Page({
  data: {
  },
  onLoad: function (options) {
    let id = options.id;
    if (id){
      console.log('id', id);
      this.setData({list: id});
    }else{
      showModel('没有id')
    }
  },
});