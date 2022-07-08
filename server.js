var nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3');
const jsonSql = require('json-sql')();

const PORT = process.env.PORT || 4000;

function jsontosql(rawcode){
  var keys = Object.keys(rawcode)
  var values  = Object.values(rawcode)        
  values.forEach((item,index) => {
    if(typeof(item)=="string"){
        values[index] = '"' + item + '"'
      } else if(typeof(item) == "object"){
        values[index] = 'null'
      }
  });
  var ret = new Object();
  ret.keys = keys;
  ret.values = values;
  return ret;
};

function jsontosqlupdate(rawcode){
  var keys = Object.keys(rawcode)
  var values  = Object.values(rawcode) 
  var updata = [];       
  values.forEach((item,index) => {
    if(typeof(item)=="string"){
        values[index] = '"' + item + '"'
      } else if(typeof(item) == "object"){
        values[index] = 'null'
      }
  });
  keys.forEach((item,index) => {
    updata.push(item + " = " + values[index])
  });
  return updata;
};

app.use(express.static('testview'));
app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/testview/index.html')
})
app.get('/app.js', (req,res)=>{
  res.sendFile(__dirname + '/testview/app.js')
})
app.get('/src/icon/greencirc.gif', (req,res)=>{
  res.sendFile(__dirname + '/testview/src/icon/greencirc.gif')
})
app.get('/src/icon/redcirc.gif', (req,res)=>{
  res.sendFile(__dirname + '/testview/src/icon/redcirc.gif')
})
app.get('/src/icon/redwifi.png', (req,res)=>{
  res.sendFile(__dirname + '/testview/src/icon/redwifi.png')
})
app.get('/src/icon/greenwifi.png', (req,res)=>{
  res.sendFile(__dirname + '/testview/src/icon/greenwifi.png')
})
app.get('/bootstrap.min.css', (req,res)=>{
  res.sendFile(__dirname + '/testview/bootstrap.min.css')
})
app.listen(PORT, ()=>{
    console.log('server running on port ${PORT}')
})
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.log(`Error Occured - ${err.message}`);
  } else {
    console.log('DataBase Connected');
  }
});
var query = 'CREATE TABLE Machines ( cutcounter INTEGER, cutspeed INTEGER, cutspeedreq INTEGER, done FLOAT, filtcounter INTEGER, isloggedon BOOLANE, item TEXT, machine VARCHAR(10), newtrayfillAverage INTEGER, operator TEXT, productionSpeed INTEGER, time INTEGER, TowSignal INTEGER, requiredfill INTEGER, traycount INTEGER, trayfillActual INTEGER, trayfillAverage INTEGER, waste INTEGER, wasteratio FLOAT, IP TEXT, globalwaste FLOAT, Alert INTEGER, version TEXT);';
  // Running Query
  db.run(query, (err) => {
    if (err) {
      console.log('Some Error Occured');
    } else {
      console.log('Table Created');
    }
  });

app.use(
  express.urlencoded({
    extended: true,
  })
);
var result;
var table = [];

app.post('/Machines', (req, res) => {
  //console.log(req.body);
  res.writeHead(200);
  res.end('Got It!');
  var qwe = JSON.stringify(req.body);

 // console.log(req.body);
 // console.log('this is the parsed: ' + qwe);
 // var logarray = '{"' + req.body.machine + '": [' + qwe + ']}'
  var pas = JSON.parse(qwe)
  // console.table(pas);
  table = pas;
  query = 'SELECT * FROM Machines WHERE machine LIKE "%' + req.body.machine + '%"'
   db.all(query, (err, rows) => {
    if (err) {
      console.log('Some Error Occured');
    } else {
      if(rows.length != 0){
        query= 'UPDATE Machines SET ' + jsontosqlupdate(pas) + ' WHERE machine = "' + req.body.machine + '"'
      db.run(query, (err) => {
        if (err) {
          console.log('Some Error Occured');
        }
      });
      } else {
        query = "INSERT INTO Machines (" + jsontosql(pas).keys + ") VALUES (" + jsontosql(pas).values + ")"
        db.run(query, (err) => {
          if (err) {
            console.log('Some Error Occured');
          }
        });
      }
    }
  })
});

  //console.log(sql.query)
app.get('/Machines', (req,res)=>{
  db.all("SELECT machine, time, isloggedon, item, cutspeed, cutspeedreq, wasteratio, operator, Alert, requiredfill, trayfillAverage, done, IP, version, globalwaste FROM Machines ORDER BY isloggedon DESC, machine", (err, rows) => {
    if (err) {
      console.log('Some Error Occured');
    } else {
      if(rows.length != 0){
        res.end(JSON.stringify(rows));
      }
    }
  });
  console.log('sent')
  db.close
});