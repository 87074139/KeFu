var express = require('express');
var router = express.Router();
var questionModel = require('../model/question');
var common = require('../utils/common')
router.get('/', function (req, res, next) {
    var email = req.query.email;
    var question = req.query.question;

    //严重邮箱有效性

    // if(email)
    if (!common.validateEmail(email)) {
        return res.send({ "id": "", "code": 500, "msg": "email error" });
    }
    if (email && question) {


        questionModel.addQuestion(email, question, function (err, data) {
            if (err) {
                return res.send({ "id": "", "code": 500 });
            }
            //发送邮件
            common.sendEmailToCustomer(email, i18n.__("Submit the Question successfully"), "this is your question id:" + data._id, function (err, info) {
                // console.log(err)
                if (err) {
                    console.log("insert question error;" + err);
                }
            });
            // sendMail(email,"you have new ticket","this is your question id:"+data._id);
            return res.send({ "id": data._id, "code": 200 });

        });
    } else {
        return res.send({ "id": "", "code": 500, "msg": "data error" });
    }
});

router.get('/query', function (req, res, next) {
    var email = req.query.email;

    questionModel.queryQuestion(email, null, 30, function (err, data) {
        if (err) {
            return res.send({ "data": data, code: 1, msg: "data is null" });
        }
        return res.send({ "data": data, code: 0, msg: "" });
    });

});

router.get('/query/all', function (req, res, next) {

    status = req.query.status;

    questionModel.queryQuestionFromAdmin(status, 30, function (err, data) {
        if (err) {
            return res.send({ "data": data, code: 1, msg: "data is null" });
        }
        return res.send({ "data": data, code: 0, msg: "" });
    });

});

router.get('/close', function (req, res, next) {
    var id = req.query.id;

    questionModel.finishQuestion(id, function (err, data) {
        if (err) {
            return res.send({ "status": 500 });
        }
        return res.send({ "status": 1 });
    });

});

router.get('/list', function (req, res, next) {

    res.render('./client/list');
});

router.get('/reply', function (req, res, next) {

    res.render('./client/reply')


});
router.get('/reply/query', function (req, res, next) {
    id = req.query.id;
    page = req.query.page || 1;
    size = req.query.size || 10;

    questionModel.queryReply(id, page, size, null, function (err, data) {
        if (err) {
            return res.send({ "status": 500, "data": [] });
        }
        return res.send({ "status": 1, "data": data });
    });

});
router.get('/reply/add', function (req, res, next) {
    id = req.query.id;
    content = req.query.content;
    // qid,from_uid,to_uid,content,chat_type,image

    questionModel.addReply(id, 0, 0, content, "text", "", function (err, data) {
        if (err) {
            return res.send({ "status": 500, "data": [] });
        }
        return res.send({ "status": 1, "data": data });
    });

});
module.exports = router;