const renderMusterMatchList = (json, open_id) => (
    `<h2>我组织的比赛</h2>
    <ul>
        ${json.map(item => (
        `<li class="matchItem">
            ${renderMatchInfo(item)}
            ${item.canceled == 0 && (
            `<button class="deleteMatch" data-match="${item.match_id}">取消比赛</button>
            <button class="shareMatch" data-match="${item.match_id}">邀请同伴</button>
            <button class="editMatch" data-match="${item.match_id}">编辑比赛</button>`) || ''}
            ${matchJoinControl(item, open_id)}
        </li>`
    )).join('')}
    </ul>`
);
const renderJoinMatchList = (json, title, open_id) => (
    `<h2>${title || '比赛信息'}</h2>
    <ul>
        ${json.map(item => (
        `<li class="matchItem">
            ${renderMatchInfo(item)}
            ${matchJoinControl(item, open_id)}
        </li>`
    )).join('')}
    </ul>`
);

const matchJoinControl = (item, open_id) => item.canceled == 0 && (item.members && item.members.find(item => item.open_id == open_id) ?
    `<button class="cancelJoinMatch" data-match="${item.match_id}">取消报名</button>`:
    `<button class="joinMatch" data-match="${item.match_id}">我也参加</button>`) || '';

const renderMatchInfo = item => (`
    <div class="${item.canceled == 1 && 'canceled' || ''}">
        <div>比赛类型: ${item.type}</div>
        <div>地点: ${item.position}</div>
        <div>时间: ${item.date}</div>
        <div>最大人数: ${item.max_numbers}</div>
        <div>发起人: ${item.leader && renderUserSpan(item.leader)}</div>
        <div>报名人: ${item.members && item.members.length && item.members.map(renderUserSpan).join('')}</div>
        ${item.canceled_reason ? `<div>取消理由: ${item.canceled_reason}</div>` : ''}
    </div>
`);

const renderMatchForm = (data = {type: 5}) => (
    `<div class="matchForm" data-id="${data.match_id || ''}">
        <div>
            <span>比赛类型</span>
            <label><input name="matchType" type="radio" value="5" ${data.type == 5 && 'checked'}/>五人 </label>
            <label><input name="matchType" type="radio" value="7" ${data.type == 7 && 'checked'}/>七人 </label>
            <label><input name="matchType" type="radio" value="11" ${data.type == 11 && 'checked'}/>十一人 </label>
        </div>
        <label>
            <span>地点</span>
            <input type="text" placeholder="请输入地址" id="position" value="${data.position || ''}">
        </label>
        <label>
            <span>时间</span>
            <input type="date" placeholder="请输入时间" id="matchDate" value="${data.date || '2018-09-01'}">
        </label>
        <label>
            <span>最大人数</span>
            <input type="number" placeholder="请输入最大人数" id="maxNumbers" value="${data.max_numbers || ''}">
        </label>
        <label>
            <span>比赛提示</span>
            <input type="text" placeholder="请输入提示语" id="match_tips" value="${data.match_tips || ''}">
        </label>
        <button class="muster">提交</button>
    </div>`
);

const renderUserForm = (data = {}) => (
    `<div class="updateForm">
        <span>联系方式</span>
        <label>
            <h3>真实姓名</h3>
            <input type="text" placeholder="请输入真实姓名" id="realName" value="${data.real_name || ''}"/>
        </label>
        <label>
            <h3>电话号码（只对队长可见）</h3>
            <input type="number" placeholder="请输入手机号" id="phone" value="${data.phone || ''}"/>
        </label>
        <button id="update">提交</button>
    </div>`
);

const renderUserSpan = info => (
    `<div class="userSpan">
        <img src="${info.wx_img}" alt="">
        <p>${info.name}</p>
    </div>`
);

const renderCancelInput = (match_id) => (
    `<div class="renderCancelInput">
        <h3>请输入取消理由</h3>
        <h5>让您的队员知道为什么</h5>
        <input type="text" placeholder="" id="cancelInput"/>
        <button class="cancelMatch" data-match="${match_id}">删除</button>
    </div>`
);
