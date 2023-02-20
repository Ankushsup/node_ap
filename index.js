const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express();
const dotenv = require('dotenv')
const db=require('./queries')
const time=require('./Api_generate/api1')
const auth= require('./auth')
const api = require('./Api_generate/middleware');
const { response, request } = require('express');
const port=3000

module.exports={
    app,
    jwt,
    bodyParser
}

dotenv.config();

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended:true
    })
)


app.get('/',(request,response)=>{
    response.json({'Node':"Welcome"})

})

app.listen(port,()=>{
    console.log('App is running')
})



app.post('/times',time.compare,(request,response)=>{
    console.log('yes');
    response.send(202)

})

// app.post('/api/signup',api.ApisignUp)
app.post('/api/sign',api.Api)

app.post('/api/validates',api.validate)

app.get('/api/validates',api.signup)


//app signup 

app.get('/users/login',db.getuser)

app.delete('/users/:id',db.deleted)

app.post('/users/signup',db.Signup)

app.post('/auth/Signup',auth.Signup)

app.post('/auth/validate',auth.validate)

app.get('/auth/Tknvalidate',auth.verify)


//Mulilevel authentication
const MLA= require('./Role based authorization/signup')

app.get('/MLA',MLA.admin)
app.post('/MLA/signup',MLA.signup)
app.post('/MLA/login',MLA.login)
app.put('/MLA/login',MLA.login)

app.post('/MLA/sign',MLA.auth,MLA.admin)
app.delete('/MLA/sign',MLA.auth,MLA.admin)

app.post('/MLA/signuser',MLA.auth)
