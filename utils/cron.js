var schedule = require('node-schedule');
var redis = require('../utils/redis');
function scheduleCronstyle(){
    schedule.scheduleJob('0 */1 * * * *', function(){
        redis.setNX("cron","1",function(err,res){

            if(!err && res>0) {
                console.log('scheduleCronstyle:' + new Date());


                

                setTimeout(function(){
                    redis.del('cron',function(err,res){

                    })
                },5)
                
            }

        }) 
            
        
        
    }); 
}

scheduleCronstyle();