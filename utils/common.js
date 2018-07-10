var http=require('http');
var userModel = require('../model/users')
function setAdminUser() {
    console.log(globalConfig.admin)
}

/**
 * Only allows the page to be accessed if the user is an admin.
 * Requires use of `loadUser` middleware.
 */
function requireAdmin(req, res, next) {
    if (!req.session.username ) {
      next(new Error("Permission denied."));
      return;
    }
    res.set("username",req.session.username)
    next();
  }
  

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
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

exports.getClientIp = getClientIp;
exports.getIpLocation = getIpLocation;
exports.setAdminUser  = setAdminUser;
exports.requireAdmin = requireAdmin;