const express = require('express')
const axios = require('axios')
const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get(`/actions`, (req, res) => {
    // console.log(req.query.method)
    var methodName = req.query.method
    var payload = req.query.payload
    var timeStamp = req.query.ts
    if(methodName && timeStamp){
        if( req.query.method === "IS-VALID-ENTRY" ){
            // Checking for valid entry
            try{
                var arr = JSON.parse(payload).entry
                console.log(arr)
                if(arr){
                    var f=0;
                    for (const n of arr){
                        if(isNaN(n)|| n==null)
                        {
                            f=1
                            break
                        }
                    }
                    if(f==0){
                        res.send(JSON.stringify({'valid':'success'}))
                    }else{
                        console.log('Invalid Input')
                        res.send(JSON.stringify({'valid':'Contain String'}))
                    }

                }else{
                    res.send(JSON.stringify({'valid':'No value'}))                   
                }
            }catch(err){
                // console.log('Contains String')
                res.send(JSON.stringify({'valid':'Invalid'}))                   

            }
                
        }
        else if ( req.query.method === "CALCULATE-STATS" ){
            try{
                var arr = JSON.parse(payload).entry
                if(arr){
                    //Calling to Python Server to get the statistics
                    var param = JSON.stringify({"entry":arr})
                    console.log(param)
                    axios.get('http://127.0.0.1:5000/stats', {params:{
                        entry : JSON.stringify(arr)
                    }})
                    .then(response => {
                        res.send(response.data)
                    })
                    .catch(error => {
                        res.send('Some error found')  
                    });
                }else{
                    res.send('No entry object')                    
                }
            }catch(err){
                res.send('Contains String')
            }
        }
        else if(req.query.method === "GEN-RAND"){
            // console.log('Sending data to python Server')
            //Calling Python server to generate random values
            axios.get('http://127.0.0.1:5000/generatenumber')
            .then(response => {
                var data={"data":response.data};
                console.log(data)
                res.send(JSON.stringify(data))
            })
            .catch(error => {
                console.log(error);
                res.send('Some error found')  
            });
        }
    }
    else{
        res.send('Wrong or Invalid Parameters')
    }
    });

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});