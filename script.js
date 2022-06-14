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

// TODO this is sending data to GCP. Check how to send to S3
function sendAttachment(params) {
    var file = document.getElementById("attachment-file").files[0];
    /* Below is the example of file object
      File {
        name: "test.html",
        lastModified: 1512376706000
        lastModifiedDate: Mon Dec 04 2017 14: 08: 26 GMT + 0530(IST) { }
        size: 865
        type: "text/html"
        webkitRelativePath: ""
         }*/
    var message = {
        "type": 5,
        "message": "",
        "to": userId, //optional, remove it if sending group message
        "groupId": groupId, //optional, remove it if sending 1-1 message
        "metadata": {},
        "source": 1
    };
    window.Applozic.ALApiService.sendAttachment({
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