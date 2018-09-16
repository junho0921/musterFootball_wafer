var REQ = require('../../common/request.js');
let {
  showBusy,
  showSuccess,
  showModel
} = require('../../common/tools.js');

Page({
  data: {
    leader: [],
    list: [],
  },
  onLoad: function (options) {
    this.setMembers(options);
    this.setLeader(options);
  },
  setMatch: function (options) {
    console.log(1111, options, global);
    let id = options.id;
    let matchs = global.matchs;
    let info = matchs && matchs.find(item => item.match_id == id);
    if (!info){
      info = global.joinMatchs && global.joinMatchs.find(item => item.match_id == id);
    }
    if (info) {
      this.setData({
        list: info.members
      });
    } else {
      showModel('error', '获取用户信息失败');
    }
    console.log('用户信息', this.data)
  },
  setLeader: function (options) {
    let leader = options.leader;
    if(!leader){
      return;
    }
    REQ.getMembersInfo({
      id: leader.split(',')
    }).then(res => {
      if(res && res.length){
        this.setData({
          leader: res
        });
      }else{
        return showModel('error', '获取队长信息失败');
      }
    });
  },
  setMembers: function (options) {
    console.log('setMembers', options);
    let membersId = options.mid;
    if (!membersId){
      return showModel('error', '获取用户信息失败');
    }
    REQ.getMembersInfo({
      id: membersId.split(',')
    }).then(res => {
      if(res && res.length){
        this.setData({
          list: res
        });
      }else{
        return showModel('error', '获取用户信息失败');
      }
    });
  },
  get: () => {
    // let members_openIds = matchs.reduce((sum, item) => {
    //     if(item.leader){
    //         sum = sum.concat(item.leader)
    //     }
    //     if(item.members){
    //         item.members = item.members.split(splitWord);
    //         sum = sum.concat(item.members);
    //     }
    //     return sum;
    // }, []);
    // let membersInfo = await ctx_service.user.getAll('open_id', members_openIds);
    // matchs.forEach(item => {
    //     item.leader = Object.assign({}, membersInfo.find(i => i.open_id == item.leader));
    //     if(item.members){
    //         item.members = item.members.map(id => {
    //             let info = Object.assign({}, membersInfo.find(i => i.open_id == id));
    //             return info;
    //         })
    //     }
    // });
  }
});