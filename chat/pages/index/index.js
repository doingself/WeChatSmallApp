//index.js
//获取应用实例
const app = getApp()

const Paho = require('../../utils/paho-mqtt.js')

let client = null;

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    init: function() {
        /**
         * IoT 初始化
         */
        console.log("+++++++++ init 1")
        client = new Paho.Client('10.10.16.61', 1883, "clientId");
        console.log("+++++++++ init 2")

        client.connect({
            userName: "test",
            password: "test",
            useSSL: true,
            keepAliveInterval: 60,
            onSuccess: function() {
                console.log("+++++++++ init 3")
                client.subscribe("okf/msg/#", {
                    qos: 1
                });
            }
        });

        console.log("+++++++++ init 4")
    },
    msg_callback: function() {
        console.log("+++++++++ msg_callback 1")
        let that = this;
        /**
         * IoT 消息回调
         */
        client.onMessageArrived = function(msg) {
            console.log("+++++++++ msg_callback 2")
            console.log(msg.topic, msg.payloadString);
            that.setData({
                msg: msg.payloadString,
            })
            console.log("+++++++++ msg_callback 3")
        }
    },
    publish_msg: function(topic, msg) {
        /**
         * IoT 发送消息
         */
        var message = new Paho.Message(msg);
        message.destinationName = topic;
        message.qos = 1;
        client.send(message);
    },
    formSubmit: function(e) {
        let msg = e.detail.value.msg;
        this.publish_msg("okf/msg/test", msg);
    },
    onLoad: function() {
        console.log("+++++++++ onLoad 1")

        this.init();
        this.msg_callback();
        console.log("+++++++++ onLoad 2")

    },
    //事件处理函数
    bindViewTap: function(e) {
        console.log("+++++++++ bindViewTap")
        console.log(e)
        this.publish_msg("okf/msg/test", "hahaha bindViewTap");
    },
    getUserInfo: function(e) {
        console.log("+++++++++ getUserInfo")
        console.log(e)

        this.publish_msg("okf/msg/test", "hahaha getUserInfo");
    }
})