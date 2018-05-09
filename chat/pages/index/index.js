//index.js
//获取应用实例
const app = getApp()

const Paho = require('../../utils/paho-mqtt.js')

const socket = require('../../utils/WebSocket.js');

let client = null;
// let serip = "baidu.com";
// let serip = "10.10.16.69";
// let serport = 1883;
// let serip = "test.haha.com";
// let serport = 443;
let serip = "test.haha.com";
let serport = 443;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    console.log("+++++++++ onLoad");
  },

  // MARK: MQTT
  connectMqtt: function () {

    /**
     * IoT 初始化
     */
    console.log("+++++++++ connectMqtt 1-6 start")
    console.log("+++++++++ connectMqtt 1")
    client = new Paho.Client(serip, serport, "clientId");
    console.log("+++++++++ connectMqtt 2")

    client.connect({
      userName: "test",
      password: "test",
      useSSL: true,
      keepAliveInterval: 60,
      onSuccess: function () {
        console.log("+++++++++ connectMqtt 3")
        client.subscribe("okf/msg/#", {
          qos: 1
        });
      }
    });

    console.log("+++++++++ connectMqtt 4")

    let that = this;
    /**
     * IoT 消息回调
     */
    client.onMessageArrived = function (msg) {
      console.log("+++++++++ connectMqtt 5")
      console.log(msg.topic, msg.payloadString);
      that.setData({
        msg: msg.payloadString,
      })
      console.log("+++++++++ connectMqtt 6")
    }
    console.log("+++++++++ connectMqtt 1-6 end")
  },
  publishMqttMsg: function () {
    /**
     * IoT 发送消息
     */
    let topic = "haha/topicTest"
    let msg = "hello mqtt by publish mqtt msg"

    var message = new Paho.Message(msg);
    message.destinationName = topic;
    message.qos = 1;
    client.send(message);
  },

  // MARK: WebSocket
  connectWebsocket: function () {
    console.log("++++++++ connectWebsocket")
    // 连接
    socket.connectSocket();
  },
  sendWebsocketMsg: function () {

    var jsonObj = { "from": 1, "to": 2, "body": "hello" };

    var jsonStr = JSON.stringify(jsonObj);
    // var jsonObj = JSON.parse(jsonStr);

    // 发送 socket
    socket.sendSocketMessage(jsonStr);
  },
  closeWebsocket: function(){
    socket.closeSocketConnect();
  },
  // MARK: Request
  testrequest: function (e) {
    console.log("++++++++ test request")
    wx.request({
      // Nginx
      //url: 'https://test.haha.com/test',
      url: 'http://127.0.0.1:8080/ssm/aa',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // success
        console.log(res)
      }
    })
  }
})