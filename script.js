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

// Not used anywhere in example
// Use this at client side only (i.e. on customers end)
function createGroup({success, error}){
    Applozic.ALApiService.createGroup({
        data:
        {
            group: {
                "groupName": "Support",
                "type": 10,      
                "metadata": {
                    "KM_CONVERSATION_TITLE": "Support",
                    "HIDE": "true",
                    "SKIP_ROUTING": "false",
                    "KM_CHAT_CONTEXT": "{}"
                }
            }
        }, success: function (response) {
            console.log("group created, groupId" + response.response.id);
            console.log(response);
            currGroupId = response.response.id;

            if (socketConnected) {
                console.log("subscribing to typing event for groupId: " + currGroupId);
                window.Applozic.ALSocket.subscibeToTypingChannel(currGroupId);
            }
            success && success(response);
        },
        error: function () {
            
        }
    });
}
