var express = require('express');
var router = express.Router();
var AppConfig = require('../config');
var qiniu = require('qiniu');
var upload = require('../utils/fileuploads');
var commonUtil = require('../utils/common');

router.get('/error', function(req, res, next) {
    res.render('./error');
  });

router.get('/', function(req, res, next) {
//   res.render('./server/index');
   return  res.redirect('/admin')
});



// router.get('/client', function(req, res, next) {
//     res.render('./client/index');
// });
// router.get('/client/offline', function(req, res, next) {
//     res.render('./client/offline');
// });


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

router.post('/upload', upload.single('file'), function (req, res, next) {
  if (req.file) {
      // res.send('文件上传成功')
      // console.log(req.file);
      
      commonUtil.saveImageToPath(req.file.path,req.file.filename);
      var d = new Date();
      
      res.send({"path":"/upload/"+d.getFullYear()+d.getMonth()+"/"+req.file.filename})
  }
});



module.exports = router;
