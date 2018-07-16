var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});


client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

function fuzzyQuery(content, callback) {
    client.search(
        {
            index: 'test',
            from:0,
            size:40,
            q: content,
            body: {
             
            sort: [
                {
                    log_time: {
                    "order" : "desc",
                  }
                }
              ]
            }

        }
        //     {
        //     index: 'twitter',
        //     type: 'tweets',
        //     body: {
        //       query: {
        //         match: {
        //           body: 'elasticsearch'
        //         }
        //       }
        //     }
        //   }
        , function (err, response) {
            console.log(err);
            if(!err) {
                if(response.hits.total>0) {
                    // for (const tweet of response.hits.hits) {
                    //     console.log('tweet:', tweet);
                    // }
                    callback(err, response.hits.hits);
                } else {
                    callback(err, []);
                }
            } else {
                callback(err, []);
            }
            
            
            
            //   return response.hits.hits;
        }
    )


}


exports.fuzzyQuery = fuzzyQuery;