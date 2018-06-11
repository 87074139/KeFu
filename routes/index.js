var express = require('express');
var router = express.Router();
var AppConfig = require('../config');
var qiniu = require('qiniu');

router.get('/error', function(req, res, next) {
    res.render('./error');
  });

router.get('/', function(req, res, next) {
  res.render('./server/index');
});

router.get('/admin', function(req, res, next) {
  res.render('./server/index');
});

router.get('/client', function(req, res, next) {
    res.render('./client/index');
});
router.get('/client/offline', function(req, res, next) {
    res.render('./client/offline');
});
router.get('/admin/users', function(req, res, next) {
    res.render('./server/users');
});

router.get('/admin/setup', function(req, res, next) {
    res.render('./server/setup');
});
router.get('/admin/login', function(req, res, next) {
    res.render('./server/login');
});
router.get('/admin/question', function(req, res, next) {
    res.render('./server/question');
});
router.get('/admin/question/reply', function(req, res, next) {
    res.render('./server/reply');
});

var questionModel = require('../model/question');
router.get('/admin/question/reply/add',function(req,res,next){
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

router.get('/admin/question/close', function(req, res, next) {
    var id = req.query.id ;
    
    questionModel.finishQuestion(id,function(err,data){
        if(err) {
            return res.send({"status":500});
        }
        return res.send({"status":1});
    });

});

router.get('/uptoken', function(req, res, next) {
    var mac = new qiniu.auth.digest.Mac(AppConfig.QINIU.accessKey, AppConfig.QINIU.secretKey);
    var options = {
        scope: 'kefu',
        expires: 7200,
        mimeLimit:"image/*"
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    res.send({"uptoken":uploadToken});
});


router.get('/admin/auth', function(req, res, next) {
    
    var password = req.query.password
    console.log(password)
    if(!password){
        return res.send({code:500,msg:"参数不全"});
    }
    // res.send({code:200,msg:"参数不全"});
    // res.end();
    res.redirect("/admin")
    
});

module.exports = router;
