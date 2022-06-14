const baseUrl = 'https://chat.kommunicate.io'

function getGroupList() {
    Applozic.ALApiService.loadGroups({
        data: {
            baseUrl: baseUrl,
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
