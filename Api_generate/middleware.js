const e = require('../index')
const p = require('../auth')
const hat = require('hat')
const bcrypt = require('bcrypt')

const {request, response} = require('express');
const saltround = 10;

// Creating api and stoiring the api key
const Api = (request, response) => {
    const a = hat()
    const {id} = request.body
    bcrypt.hash(a, saltround, (err, hash) => {
        let values = [id, hash];
        p.pool.query('Insert into apistore (id,api_token) Values($1,$2)', values, (err, res) => {
            console.log(res)
            if (err) 
                console.log(err)
            
            response.status(201).send(`User signup ${id} with api ${a}`)
        })
    })
}

function hasAccess(result) {
    if (result) {
        console.log('Api token is right');
        return 'Api is right'
    } else 
        return 'Api is Wrong'
    
}

const validate = (req, response) => {
    console.log(req.body)
    const {id, api_token} = req.body
    let values = [id, api_token]
    // const api_token=req.body['api_token']
    p.pool.query('Select api_token from apistore where id=$1', [id], function (err, res) {
        if (err) {
            console.log(err);
        }
        var hash = res.rows[0].api_token;
        bcrypt.compare(api_token, hash, function (err, result) {
            const a = hasAccess(result)
            response.status(202).send(`${a}`)
        })
    })
}

const ApisignUp = (request, response) => {
    const {id, name, email, password} = request.body
    bcrypt.hash(password, saltround, (err, hash) => {
        let values = [hash, id, name, email];
        p.pool.query('Insert into comp (password,id,name,email) Values($1,$2,$3,$4)', values, (error, res) => {
            if (error) 
                throw error
            
            response.status(202).send(`User added successfully ${id}`)
        })
    })
}

const signup = (request, response) => {
    p.pool.query('Select * from comp Inner join apistore on apistore.id=comp.id', (error, results) => {
        if (error) 
            throw error
        
        response.status(200).json(results.rows)
    })
}


module.exports = {
    ApisignUp,
    Api,
    validate,
    signup
}
