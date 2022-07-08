const axios = require('axios');
var data;
function showTime(){
axios
  .get('http://hun-filter-monitor.essentra.com:82/Machine')
  .then( res => {
    console.log(`statusCode: ${res.status}`);
    console.table(res.data);
    //document.getElementById("MyClockDisplay").innerHTML = res.data
  })
  .catch(error => {
    console.error(error);
  });
};
showTime();
