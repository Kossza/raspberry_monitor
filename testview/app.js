//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var isloggedonindex, timeindex, doneindex, machineindex, ipindex;
var indexes;
const Http = new XMLHttpRequest();
const url='http://hun-filter-monitor.essentra.com:82/Machines';
const icons =  new Object();
icons.greencirc = '<img src="src/icon/greencirc.gif"/>';
icons.redcirc = '<img src="src/icon/redcirc.gif"/>';
icons.greenwifi = '<img src="src/icon/greenwifi.png"/>';
icons.redwifi = '<img src="src/icon/redwifi.png"/>'
function getdata(){

Http.open("GET", url);
Http.send();
var readed;
Http.onreadystatechange = (e) => {
   document.getElementById("MyClockDisplay").innerHTML = Http.responseText;
   //console.table(Http.responseText)
   if(Http.responseText.length !=0 && Http.responseText.substr(Http.responseText.length -1) == ']'){
       try{ 
           readed = JSON.parse(Http.responseText);
           indexes = Object.keys(readed[0]);
           isloggedonindex = Object.keys(readed[0]).indexOf("isloggedon");
           timeindex = Object.keys(readed[0]).indexOf("time");
           doneindex = Object.keys(readed[0]).indexOf("done");
           buildTableheader(Object.keys(readed[0]));
           buildtable(readed,icons);
       } catch (error){
           console.error(error)
       }
       //console.table(JSON.parse(data));
 


   };  
}
setTimeout(getdata, 1000);
};
getdata();
function buildTableheader(data){
    var res = [];
    var table = document.getElementById('tableheader')
    data.forEach((item,index) => {
        switch(item){
            case "isloggedon":
                item = "MES On";
                break;
            case "time":
                item = "Connection";
                break;
            case "cutspeedreq":
                item = "Speed target";
                break;
            case "wasteratio":
                item = "Waste%";
                break;
            case "cutspeed":
                item = "Actual Speed";
                break;
        }
        if(item != 'globalwaste'){
       res += ("<th>" + item +"</th>")
    }
    });
    table.innerHTML = res;
};
function buildtable(data,icons){
    var rows = [];
    var table = document.getElementById('myTable');
    data.forEach((item,index) => {
        rows += ("<tr>")
        var curritem = Object.values(item);
       curritem.forEach((item,index) => {
        // if(typeof(item)=="string"){
        //     curritem[index] = '"' + item + '"'
        //   } else if(typeof(item) == "object"){
        //     curritem[index] = 'null'
        //   }
          if(index == isloggedonindex){
            if (curritem[isloggedonindex] == 1){
                curritem[isloggedonindex] = icons.greencirc;
            }else if (curritem[isloggedonindex] == 0){
                curritem[isloggedonindex] = icons.redcirc;
            }
        };
        if(index == timeindex){
            var oldDate = new Date(curritem[timeindex]);
            var res = Math.abs((new Date() - oldDate) / 1000);
            if(res <= 10){
                curritem[timeindex] = '<div class="tooltip">' + icons.greenwifi + '<span class="tooltiptext"> IP:'+ curritem[indexes.indexOf('IP')] +'</span> </div>';
                }else{
                    curritem[timeindex] = icons.redwifi;
                }
            };
        if(index == doneindex){
            var numb;
            if(curritem[doneindex] != null){
                numb = Number.parseFloat(curritem[doneindex]).toFixed(2);
            } else{
                numb = 0;
            };
            var prog = '<div style="width: 100%;  background-color: #ddd;"><div style="width:' + numb + '%; font-weight: bold; height: 30px;  background-color: #04AA6D;">' + numb + '%</div></div>'
            //+'">60%</meter>'
            curritem[doneindex] = prog;
        };
        if(index == indexes.indexOf('wasteratio')){
            var numb;
            if(curritem[index] != null){
                numb = Number.parseFloat(curritem[index]).toFixed(2);
            } else{
                numb = 0;
            };
            var max = curritem[indexes.indexOf('globalwaste')]*100
            var fill = 0;
            if(numb/max *100 <= 100){
                fill =numb/max *100;
            } else {
                fill = 100;
            };
            if(numb > max){
            var prog = '<div style="width: 100%;  background-color: #ddd;"><div style="width:' + fill + '%; font-weight: bold; height: 30px;  background-color: red;">' + numb + '%</div></div>'
            } else{
                prog = '<div style="width: 100%;  background-color: #ddd;"><div style="width:' + fill + '%; font-weight: bold; height: 30px;  background-color: green;">' + numb + '%</div></div>' 
            }
            curritem[index] = prog;
        };
        if(index == indexes.indexOf('machine')){
            curritem[index] = '<a href="http://' + curritem[indexes.indexOf('IP')] +':1880/ui" class="row-link" target="_blank" rel="noopener noreferrer">'+ curritem[index] +'</a>'
        };
        if(index == indexes.indexOf('Alert')){
            if(curritem[index] != 0){
                curritem[index] = '<div style="width: 100%;  background-color:red; font-weight: bold; color: white;"> Hiányos Állásidő! </div>';
            }else{
                curritem[index] = '';
            }
        };
        if(index== indexes.indexOf('trayfillAverage')){
           var diffpercent = Math.abs((1- curritem[index]/curritem[indexes.indexOf('requiredfill')]))*100;
           var diff = curritem[index] - curritem[indexes.indexOf('requiredfill')];
           if(diff>0)diff=diff+'+';
           if(diffpercent < 0.5 ){
               curritem[index] = '<div style="width: 100%; font-weight: bold; color: green;">'+ diff +'</div>';
           } else {
            curritem[index] = '<div style="width: 100%; font-weight: bold; color: red;">'+ diff +'</div>';
           }
        };       
        if(indexes.indexOf('globalwaste') != index )     
           rows += ("<td>" + curritem[index] + "</td>");
       })
       rows += ("</tr>")
    });
    table.innerHTML = rows;
};


