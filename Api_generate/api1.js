const e = require('../index')
const p = require('../auth')
const hat = require('hat')
const bcrypt = require('bcrypt')

const {request, response} = require('express');
const saltround = 10;

const compare = (request, response, next) => {
    const id = request.body['id']
    p.pool.query('Select exptime from apistore where id=$1', [id], function (err, result) {
        if (err) 
            throw err;        
        exp_date = new Date(result.rows[0].exptime)
        var a = result.rows[0].exptime;
        curr_date = new Date()
        console.log(`${
            curr_date.getTime()
        } +${
            exp_date.getTime()
        }`)
        console.log(`${a}`);
        if (curr_date.getTime() < exp_date.getTime()) { // response.status(203).send(`Active`)

            next();
        } else {
            response.status(202).send(`Not active`)
        }

    });
}

// Signup users

const securesign = (request, response) => {
    const {id, name, email, password} = request.body
    bcrypt.hash(password, saltround, (err, hash) => {
        let values = [hash, id, name, email];
        p.pool.query('Insert into comp (password,id,name,email) Values($1,$2,$3,$4)', values, (err, res) => {
            try {
                res.status(202).send(`User signup ${id} name ${name}`)
            } catch (err) {
                console.log(err);
            }
        })
    })
}


module.exports = {
    compare,
    securesign
}
