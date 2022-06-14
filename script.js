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
