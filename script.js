function init_KM(appId, response, events){
    window.Applozic.ALSocket.init(appId, response, events);
}
function getGroupList() {
    Applozic.ALApiService.loadGroups({
        data: {
            baseUrl: KM_BASE_URL,
        },
        success: function (response) {
            // most recent group will come at last in response
            console.log(response.response);
        },
    })
}

function sendAttachment(groupId, file) {
    var message = {
        "contentType": 1,
        "type": 5,
        "message": "",
        "groupId": groupId,
        "metadata": {},
        "source": 1
    };
    window.Applozic.ALApiService.sendAttachmentToAWS({
        data: {
            file: file,
            messagePxy: message
        },
        success: function (result) {
            console.log("send attachment response: ", result);
        },
        error: function () {}
    });
}


// The file name of encrypted media from user's end will have "AWS-ENCRYPTED-" prepended to it name. 
// You can use this to identify if a media is encrypted or not. 
// for encrypted media, pass the blobkey in the function below. This returns the url of the media file.
function getURLFromBlobKey(blobKey, callback) {
    var params = '?key=' + blobKey;
    window.Applozic.ALApiService.ajax({
        type: 'GET',
        global: false,
        url: KM_BASE_URL + '/rest/ws/file/url' + params,
        success: function (res) {
            callback(null, res);
        },
        error: function (err) {
            callback(err);
        },
        skipEncryption: true
    })
};


function sendDeliveryReport(messageKey) {
    Applozic.ALApiService.sendDeliveryUpdate({
        data: {
            key: messageKey
        }
    });
}

// TODO this is not used anywhere
function sendReadReport(groupId) {
    Applozic.ALApiService.conversationReadUpdate({
        data: `groupId=${groupId}`,
        success: function (result) {
            console.log(result);
        },
        error: function () {}
    });
}

function sendTypingStatus(typingStatus1, typingStatus2, userId, groupId){
    window.Applozic.ALSocket.sendTypingStatus(typingStatus1, typingStatus2, userId, groupId);
}

function getLatestMessageList() {
    Applozic.ALApiService.getMessages({
        data: {
            startIndex: 0,
            mainPageSize: 60
        },
        success: function (response) {
            console.log(response);
        },
        error: function () {}
    });
}

function getMessageListByGroupId(groupId) {
    Applozic.ALApiService.getMessages({
        data: {
            startIndex: 0,
            groupId: groupId,
            pageSize: 30
        },
        success: function (response) {
            console.log(response);
        },
        error: function () {}
    });
}


function getUserDetailsByUserList(userIdList) {
    Applozic.ALApiService.getUserDetail({
        data: userIdList,
        success: function (response) {
            console.log(response);
        },
        error: function () {}
    });
}

function subscribeToTypingChannelByGroupId(groupId) {
    if (socketConnected) {
        console.log("subscribing to typing event for groupId: " + groupId);
        window.Applozic.ALSocket.subscibeToTypingChannel(groupId);
    }
}

function sendMessage(groupId, message){
    Applozic.ALApiService.sendMessage({
        data: {
            message: {
                "type": 5,
                "contentType": 0,
                "message": String(message),
                "groupId": String(groupId),
                "metadata": {},
                "source": 1
            }
        },
        success: function (response) { console.log(response); },
        error: function () { }
    });
}


function onConnectFailed(resp) {
    console.log("onConnectFailed triggered");
    if (navigator.onLine) {
        console.log("reconnecting");
        window.Applozic.ALSocket.reconnect();
    }
}
function subscribeToTypingChannel(groupId){
    window.Applozic.ALSocket.subscibeToTypingChannel(groupId);
}

function unsubscribeToTypingChannel(){
    window.Applozic.ALSocket.unsubscibeToTypingChannel();
}

function subscribeToSupportChannel(){
    window.Applozic.ALSocket.subscribeToSupportChannel();
}
function unsubscribeToSupportChannel(){
    window.Applozic.ALSocket.unsubscribeToSupportChannel();
}
// anybody, (agent/user) when goes online, offline, or away, this will get triggered.
//  KM_USER_STATUS: {
    //     OFFLINE: 0,
    //     ONLINE: 1,
    //     AWAY: 2,
    //     NOT_AWAY: 3,
    // 
// },
function userStatusUpdateHandler(resp){
    console.log('onUserStatusUpdate', JSON.parse(resp.body)["message"]);
}

function updateAgentStatus(statusId){
    Applozic.ALSocket.sendStatus(statusId)
}

// you can identify the messages with help of message keys
function onMessageRead (resp) {
    // will trigger when the end user reads the message sent by you
    console.log('message read', resp)
}
function onMessageDelivered (resp) {
    // will trigger when the sent message gets delivered
    console.log('message read', resp)
}


// added event handlers for events which are not configured
function onMessageHandler(message){
    let messageType = message.type;
    console.log(message);
    let MESSAGE_TYPE_ACTION_MAP = {
        "APPLOZIC_25": function(message){
            // user online offline status changed
            console.log('here');
            console.log(message);
        },
    }

    let action  = MESSAGE_TYPE_ACTION_MAP[messageType];
    if(!action) return;
    console.log(messageType);
    action(message);
}
