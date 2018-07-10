var express = require('express');
var router = express.Router();
var AppConfig = require('../config');
var qiniu = require('qiniu');
var requireAdmin = require('../utils/common').requireAdmin

router.get('/',requireAdmin, function(req, res, next) {
    res.render('./server/index');
  });

  router.get('/users', function(req, res, next) {
    res.render('./server/users');
});

router.get('/setup', function(req, res, next) {
    res.render('./server/setup');
});
router.get('/login', function(req, res, next) {
    res.render('./server/login');
});
router.get('/question',requireAdmin, function(req, res, next) {
    res.render('./server/question');
});
router.get('/question/reply', function(req, res, next) {
    res.render('./server/reply');
});

var questionModel = require('../model/question');
router.get('/question/reply/add',function(req,res,next){
    id          = req.query.id;
    content     = req.query.content;
    // qid,from_uid,to_uid,content,chat_type,image

    questionModel.addReplyFromAdmin(id,1,0,content,"text","",function(err,data){
        if(err) {
            return res.send({"status":500,"data":[]});
        }
        return res.send({"status":1,"data":data});
    });

});

router.get('/question/close', function(req, res, next) {
    var id = req.query.id ;
    
    questionModel.finishQuestion(id,function(err,data){
        if(err) {
            return res.send({"status":500});
        }
        return res.send({"status":1});
    });

});
var userModel = require('../model/users')
router.get('/auth', function(req, res, next) {
    
    var password = req.query.password
    var username = req.query.username

    console.log(global.globalConfig.config.admin)
    if(!password){
        return res.send({code:500,msg:"参数不全"});
    }
     var adminConfig = global.globalConfig.config.admin
     var loginStatus = 0
    for(a in adminConfig) {
        // console.log(adminConfig[a].username)
        if ( adminConfig[a].username === username && adminConfig[a].password === password ) {
            req.session.username = username;   
            console.log() 
            loginStatus = 1
        }
    }

    // userModel.login(username,password,function(err,res){

    //     console.log(err)
    //     if(!err) {
    //         req.session.username = username;
    //     } else {
    //         req.session.username = "";
    //     }

    // })

    // res.send({code:200,msg:"参数不全"});
    // res.end();
    if (loginStatus == 1) {
        req.session.error = ""
        return res.redirect("/admin/question")
    } else {
        // return res.send({code:500,msg:"用户名或者密码不对"});
        req.session.error = "用户名或者密码不对"
        return res.redirect("/admin/login")
    }
   
    
});

router.get('/logout',requireAdmin,function(req,res,next){
    req.session.username = ""
    return res.redirect("/admin/login")
})

module.exports = router;