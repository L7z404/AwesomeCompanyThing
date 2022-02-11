//Stuff
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const gid = require('guid');
var path = require('path');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));



//Databasethings
const sql = require('mssql/msnodesqlv8');
const { stringify } = require('nodemon/lib/utils');
const config = {
    database: 'AwesomeCompany',
    server: 'SHADOWHEAVEN\\SQLEXPRESS',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};
const pool = new sql.ConnectionPool(config);




//routes
app.get('/', function (req, res) {
    res.render('index.html');
})



app.get('/Employee', function (req, res) {
    //Clusterfuck
    sql.connect(config, function (err) {
        if (err) console.log(err);
        let sqlRequest = new sql.Request();
        let sqlQuery = 'SELECT * FROM Employee';
        sqlRequest.query(sqlQuery, function (err, data) {
            if (err) console.log(err)
            // res.send(data.recordset);
            res.render("viewEmployee.html", { data: data })
            sql.close();
        });
    });
});

app.get('/Employee/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        let sqlRequest = new sql.Request();
        const empid = req.params.id;
        employeeid = empid.toString();
        let sqlQuery = `DELETE FROM Employee WHERE EmployeeId ='${employeeid}'`;
        sqlRequest.query(sqlQuery, function (err, data) {
            if (err) console.log(err)
            // res.send(data.recordset);
            res.render("deleted.html")
            sql.close();
        });
    });
});


app.get('/addEmp', function (req, res) {
    res.render('addEmployee.html')
})

app.post('/saveEmp', function (req, res) {
    var guid = gid.create()
    var GUID = guid.value;
    // var GUID = 1;
    var name = req.body.nombre;
    var dob = req.body.fecha;
    var phone = req.body.telefono;
    var email = req.body.correo;
    var salary = req.body.salary;
    var marital_status = req.body.mstat;
    
    
    sql.connect(config, function (err) {
        if (err) console.log(err);
        let sqlRequest = new sql.Request();
        let sqlQuery = `INSERT INTO Employee(EmployeeId,name,dob,phone,email,salary,marital_status) VALUES('${GUID}','${name}','${dob}','${phone}','${email}','${salary}','${marital_status}')`;
        sqlRequest.query(sqlQuery, function (err, data) {
            if (err) console.log(err)
            // res.send(data.recordset);
            res.render("added.html");
            sql.close();
        });
    });
});





//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(
    `Server started on port ${PORT}\nClick to open in browser: http://localhost:${PORT}`
));



