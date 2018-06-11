var config = {
    "title" : "客服系统",
    "chatOpen" : true,
    "port"  : 9010,
    "languageDefault" : "en",
    "langFile" : "language",
    "mongodbUrl" : "mongodb://192.168.100.251:11037/kefu",
    "email" : {
        "smtp_server" : "smtp.sina.com",
        "smtp_username" : "joyfort6@sina.com",
        "smtp_password" : "joyfort"
    },

    "maintain" : false,
    
    
};

exports.config = config;