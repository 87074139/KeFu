var express = require('express');
var router = express.Router();
var AppConfig = require('../config');
var qiniu = require('qiniu');
var requireAdmin = require('../utils/common').requireAdmin;
var elasticsearchFuzzyQeury = require('../utils/elasticsearch');

router.get('/', requireAdmin, function (req, res, next) {
    res.render('./server/index');
});
router.get('/log', requireAdmin, function (req, res, next) {
    res.render('./server/log');
});
router.get('/log/query', requireAdmin, function (req, res, next) {
    var content = req.query.content;

    var data = [];
    elasticsearchFuzzyQeury.fuzzyQuery(content, function (err, response) {
        if (err) {
            return res.send({ "data": [], code: 1, msg: "error" });
        } else {
            return res.send({ "data": response, code: 0, msg: "" });
        }

        // return res.send({ "status": 1, "data": response });
    });

    // res.render('./server/log');
});
router.get('/users', function (req, res, next) {
    res.render('./server/users');
});

router.get('/setup', function (req, res, next) {
    res.render('./server/setup');
});
router.get('/login', function (req, res, next) {
    res.render('./server/login');
});
router.get('/question', requireAdmin, function (req, res, next) {
    res.render('./server/question');
});
router.get('/question/reply', function (req, res, next) {
    res.render('./server/reply');
});

var questionModel = require('../model/question');
var common = require('../utils/common');
router.get('/question/reply/add', function (req, res, next) {
    id = req.query.id;
    content = req.query.content;
    // qid,from_uid,to_uid,content,chat_type,image
    if (id && content) {


        questionModel.addReplyFromAdmin(id, 1, 0, content, "text", "", function (err, data) {
            if (err) {
                return res.send({ "status": 500, "data": [] });
            }

            //回复成功 发送邮件告知
            questionModel.queryQuestionById(id, function (err, data) {

                if (err) {
                    return res.send({ "status": 500, "data": [] });
                }
                console.log("------------")
                if (data[0]) {
                    // console.log(data[0].email,i18n.__('Your question has been updated'),i18n.__('Your question has been updated'))
                    common.sendEmailToCustomer(data[0].email, i18n.__('Your question has been updated'), i18n.__('Your question has been updated') + "<br>" + common.getHost(req) + "/question/reply?id=" + id, function (err, info) { })
                }
                console.log("------------")
                return res.send({ "status": 1, "data": data });
            })
        });
    } else {
        return res.send({ "status": 500, "data": [],"msg":"data error" });
    }
});

router.get('/question/close', function (req, res, next) {
    var id = req.query.id;

    questionModel.finishQuestion(id, function (err, data) {
        if (err) {
            return res.send({ "status": 500 });
        }
        return res.send({ "status": 1 });
    });

});
var userModel = require('../model/users')
router.get('/auth', function (req, res, next) {

    var password = req.query.password
    var username = req.query.username

    console.log(global.globalConfig.config.admin)
    if (!password) {
        return res.send({ code: 500, msg: "参数不全" });
    }
    var adminConfig = global.globalConfig.config.admin
    var loginStatus = 0
    for (a in adminConfig) {
        // console.log(adminConfig[a].username)
        if (adminConfig[a].username === username && adminConfig[a].password === password) {
            req.session.username = username;
            res.cookie('username', username, { expires: new Date(Date.now() + 86400000), httpOnly: true });
            res.cookie('loginStatus', 1, { expires: new Date(Date.now() + 86400000), httpOnly: true });
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

router.get('/logout', requireAdmin, function (req, res, next) {

    res.cookie('loginStatus', 0, { expires: new Date(Date.now() + 86400000), httpOnly: true });
    res.clearCookie("username");
    return res.redirect("/admin/login")
})

module.exports = router;