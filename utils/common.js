var http=require('http');
var userModel = require('../model/users')
var config = require('../config/config').config
var fs = require('fs')
var sendMail   = require('../utils/mail');
var Url = require('url')

function getHost(req) {
    return req.protocol+"://"+req.hostname;
}



function getFilePath() {
    var d = new Date();
    var f = config.upload.path+d.getFullYear()+d.getMonth();
    fs.mkdir(f,function(err){
        if(err){
            console.log('创建文件夹出错！');
        }else{
            console.log(f+'文件夹-创建成功！');
            
        }
    })
    console.log(f)
    return f;
}
function saveImageToPath(image,filename) {
    fs.copyFile(image,getFilePath()+"/"+filename,function(err) {
        console.log("saveImageToPath:"+err)
    });
    
}

/**
 * Only allows the page to be accessed if the user is an admin.
 * Requires use of `loadUser` middleware.
 */
function requireAdmin(req, res, next) {
    if (!req.cookies.username ) {
      next(new Error("Permission denied."));
      return;
    }
    res.set("username",req.cookies.username)
    next();
  }
  

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function validateEmail(email) {
    var reg = new RegExp("([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})");
    var r = email.match(reg)
    console.log(r);
    if(r!=null) return true;
    return false;
}


function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

function getIpLocation(ip,callback) {
    http.get('http://ip.taobao.com/service/getIpInfo.php?ip='+ip,function(req,res){
        var html='';
        req.on('data',function(data){
            html+=data;
        });
        req.on('end',function(){
            console.info(html);
            var json = JSON.parse(html);
            if(json.code == 0){
                return callback(null,json.data.region + json.data.city);
            }else{
                return callback(json.data,null);
            }

        });
    });
}

function sendEmailToCustomer(email,title,content,callback) {
    if(validateEmail(email)) {
        sendMail(email,title,content,callback)
    } else {
        callback("email not right",[])
    }
    
}
exports.getClientIp = getClientIp;
exports.getIpLocation = getIpLocation;
// exports.setAdminUser  = setAdminUser;
exports.requireAdmin = requireAdmin;
exports.saveImageToPath = saveImageToPath;
exports.sendEmailToCustomer=sendEmailToCustomer;
exports.getHost = getHost;
exports.validateEmail=validateEmail;