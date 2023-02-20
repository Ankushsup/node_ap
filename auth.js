const {request, response} = require('express');
const e = require('./index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltround = 10;

const Pool = require('pg').Pool

const pool = new Pool({
    user: 'anku',
    host: 'localhost',
    database: 'pets',
    password: 'root',
    port: 5432
})

function hasAccess(results) {
    if (results) {
        console.log("Acess granted");
    } else 
        console.log("No access");
    
}

const team = (id) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        exp: Math.floor(Date.now() / 1000) + (60),
        date: Date(),
        Id: id
    }
    const date = new Date();
    console.log(`Token Generated at :- ${
        date.getHours()
    }`)
    token = jwt.sign(data, jwtSecretKey);
    return token;
}

const validate = (req, res) => {
    console.log(req.body)
    const name = req.body['name']
    const password = req.body['password']
    pool.query('select password,id from comp where name=$1', [name], function (err, response) {
        if (err) 
            throw err;
        
        var hash = response.rows[0].password;
        bcrypt.compare(password, hash, function (err, result) {
            hasAccess(result);
            TKN = team(response.rows[0].id)
            console.log(TKN)
            res.status(202).send(JSON.stringify(TKN))
        });
    });
}

const Signup = (request, response) => {
    const {id, name, email, password} = request.body

    bcrypt.hash(password, saltround, (err, hash) => {
        let values = [hash, id, name, email];
        pool.query('Insert into comp (password,id,name,email) Values($1,$2,$3,$4)', values, (error, res) => {
            if (error) 
                throw error
            response.status(203).send(`User signup ${id}`)
        });
    });
}

const verify = (request, response) => {
    const auth = request.headers['authorization']
    const token = auth.split(' ')[1]
    console.log(token)

    if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        response.json({Login: true, data: decode});
    } else {
        response.json({Login: False, data: 'error'});
    }
}


module.exports = {
    Signup,
    validate,
    verify,
    pool
}
