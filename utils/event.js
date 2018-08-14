
var event = require('events');
var common = require('../utils/common');

var EventEmitter = event.EventEmitter;
var life = new EventEmitter();
//添加事件监听（on 或addListener)
//一个事件最多能绑定十个监听器 当超过十个监听器 会有d警告
//可以对最多的监听器进行设置
life.setMaxListenters = 11;//将最大监听数提高到了11个
// //添加ask事件

function addEventEmailSend() {

    life.on('emailSend',function(email,title,content,callback){
        common.sendEmailToCustomer(email,title,content,callback);
    })
    life.on('test',function(who){
        console.log(who + '.............called')
    })
}
addEventEmailSend()
function runEventEmailSend(email,title,content,callback) {
    life.emit('emailSend',email,title,content,callback);
}
function runTest() {
    life.emit('test',"event init");
}

module.exports.runTest = runTest;
module.exports.runEventEmailSend = runEventEmailSend;



// function 

// life.on('ask', function (who) {
//     console.log(who + '.....1');
// })
// life.on('ask', function (who) {
//     console.log(who + ".....2")
// })
// function test(who) {
//     console.log(who + '.....3');
// }
// life.on('ask', test);

// life.on('ans', function () {
//     console.log('ans.....1');
// })
// // 移除事件 移除事件时 只能移除事件的回调函数为具名函数的事件 
// life.removeListener('ask', test);


// //life.removeAllListeners();//删除了全部事件 包括ask和ans

// life.removeAllListeners('ask');//删除了ask事件 
// // 触发事件
// life.emit('ask', 'charlene');//执行该函数 存在返回值 返回值为布尔值 表示是否被监听

// life.emit('ans');
// // 方法listeners可以检测当前监听的数量
// console.log("------------"+life.listeners('ask').length);
// //EventEmitter.listenerCount也可以检测当前监听的数量 
// console.log(EventEmitter.listenerCount(life, 'ask'));

