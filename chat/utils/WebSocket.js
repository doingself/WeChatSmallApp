var socketOpen = false
var socketMsgQueue = []

// 连接
function connectSocket(res) {
    console.log('连接 socket');

    if (socketOpen == false){
        wx.connectSocket({
            url: "ws://127.0.0.1:8080/ssm/websocket.do",
            data: {
                x: '123'
            },
            header: {
                'content-type': 'application/json'
            },
            method: "GET"
        })
    }

    wx.onSocketOpen(function(res) {
        console.log('onSocketOpen WebSocket连接已打开！');
        socketOpen = true
        for (var i = 0; i < socketMsgQueue.length; i++) {
            sendSocketMessage(socketMsgQueue[i])
        }
        socketMsgQueue = []
    })

    wx.onSocketError(function(res) {
        socketOpen = false;
        console.log('onSocketError WebSocket连接打开失败，请检查！')
    })

    wx.onSocketMessage(function(res) {
        console.log('onSocketMessage 收到服务器内容：' + res.data)
    })

    wx.onSocketClose(function(res) {
        socketOpen = false;
        console.log('onSocketClose WebSocket 已关闭！')
    })
}

// 发送消息
function sendSocketMessage(msg) {
    console.log('发送消息 - '+msg)
    if (socketOpen) {
        wx.sendSocketMessage({
            data: msg
        })
    } else {
        socketMsgQueue.push(msg)
    }
}

// 关闭
function closeSocketConnect(res) {
    console.log('关闭 socket');
    //必须在 WebSocket 打开期间调用 wx.closeSocket 才能关闭。
    if (socketOpen) {
        wx.closeSocket()
    }
}

module.exports = {
    connectSocket: connectSocket,
    sendSocketMessage: sendSocketMessage,
    closeSocketConnect: closeSocketConnect
}
