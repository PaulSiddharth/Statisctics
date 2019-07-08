<template>
  <div class="left">
    <h3>Enter List : 
      <span><input v-model="numberList" placeholder="Enter comma seperated list of numbers"></span>
    </h3>
    <p>Enter comma seperated list of numbers and enter more than 1 number</p>
    <button type="button" @click="generateNumber">Generate Random Numbers</button>
    <button type="button" @click="calculateStats" class="stats">Calculate Statistics</button>
    <hr>
    <ul v-if="showStats==1">
      <li v-bind="orgData">Orginal Data: {{orgData}}</li>
      <li v-bind="mean">Mean: {{mean}}</li>
      <li v-bind="median">Median: {{median}}</li>
      <li v-bind="variance">Variance: {{variance}}</li>
      <li v-bind="standard">Standard Dev: {{standard}}</li>
    </ul>
    <p v-if="showStats==2">Please Enter Valid Numbers and Check again</p>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import Vue from 'vue'


export default {
  name: 'home',
  components: {
    
  },
  data(){
    return{
      numberList:"",
      showStats:0,
      orgData:0,
      mean:0,
      variance:0,
      median:0,
      standard:0,
      // BASE_URL: 
    }
  },
  methods:{
    generateNumber(){
      var that= this
      this.$http
        .get(`http://localhost:8000/actions`, {
           headers: { 
            //  'Access-Control-Allow-Origin':'*',
            // 'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin' : '*',
      // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
            // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, Accept',
            // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
             },

          params: {
            method: 'GEN-RAND',
            ts: that.getTimeStamp()
          }
        })
        .then(function (data) {
          this.numberList=data.body.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTimeStamp(){
      var now = new Date;
      var utc_timestamp = Date.UTC(now.getFullYear(),now.getMonth(), now.getDate() , 
            now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
      
      return utc_timestamp;
    },
    calculateStats(){
      var arr=[]
      if(typeof(this.numberList)!="object")
      { 
         var element = this.numberList.split(',')
        if(element.length<2){
          console.log('Add more number')
          this.showStats=2
          return
        }
        element.forEach(function(item){
          if (isNaN(item)){
            arr.push(item)
          }
          else{
            arr.push(parseInt(item))
          }
        })
      }else{
        arr=this.numberList
      }
      var check = JSON.stringify({"entry": arr})
      var that= this
      this.$http
        .get(`http://localhost:8000/actions`, {
           headers: { 
             "content-type": "application/json"
             },

          params: {
            method: 'IS-VALID-ENTRY',
            payload: check,
            ts: that.getTimeStamp()
          }
        })
        .then(function (data) {
          if(data.body.valid=="success"){
            that.getStats(check);
          }else{
            that.showStats=2
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getStats(arr){
      var that= this
      this.$http
        .get(`http://localhost:8000/actions`, {
           headers: { 
             "content-type": "application/json"
             },

          params: {
            method: 'CALCULATE-STATS',
            payload: arr,
            ts: that.getTimeStamp()
          }
        })
        .then(function (data,err) {
          if(Object.keys(data.body).length>0){
            that.showStats=1
            var result=data.body
            that.mean=result.mean
            that.median=result.median
            that.standard=result.deviation
            that.variance=result.mode
            that.orgData=JSON.parse(arr).entry
          }
          else{
            that.showStats=2
          }
          
        })
        .catch(err => {
         
        })
    }
  }
}
</script>
<style scoped>
h3 {
  margin: 20px 0 0;
}
p {
  margin: 10px 0 20px;
  font-size: 12px;
}
button{
  border: none;
  padding: 10px;
  text-align: center;
  border-radius: 4px;
  margin-right: 20px;
  margin-bottom: 20px;
}
input{
  width: 25%;
}
.left{
  text-align: left;
}
.stats{
    background: blue;
    color: white;
}

</style>

