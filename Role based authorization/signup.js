const {request, response, query} = require('express');
const e = require('../index')
const bcrypt = require('bcrypt')
const p = require('../auth')
const jwt = require('jsonwebtoken')
const saltround = 10;

const signup = (request, response) => {
    const {id, name, role, password} = request.body
    bcrypt.hash(password, saltround, (err, hash) => {
        let values = [hash, id, name, role];
        p.pool.query('Insert into comp (password,id,name,role) Values($1,$2,$3,$4)', values, (err, res) => {
            try {
                response.status(202).send(`User signup`)
                // ${id} name ${name} role ${role}`)
            } catch (err) {
                console.log(err);
            }
        })
    })
}


const tk = (id) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        exp: Math.floor(Date.now() / 1000 + (10 * 60)),
        Id: id
    }
    const date = new Date();
    console.log(`Token generated at :- ${
        date.getHours()
    }`)
    token = jwt.sign(data, jwtSecretKey);
    return token;
}

const login = (request, res) => {
    const {name, password} = request.body
    console.log(request.body)
    p.pool.query('select password,id from comp where name =$1', [name], function (err, response) {
        try {
            var hash = response.rows[0].password;
            bcrypt.compare(password, hash, function (err, result) {
                if (result) {
                    Token = tk(response.rows[0].id)
                    console.log(Token)
                    res.status(202).send(JSON.stringify(Token))
                }
            });
            next();
        } catch (err) {
            console.log(`The error is ${err}`)
        }
    })
}

const auth = (request, response, next) => {
    const {name, role, password} = request.body
    console.log(request.body)
    if (role == 'admin') {
        p.pool.query('Select * from comp', (error, result) => {
            request.res = result.rows;
            if (error) 
                throw error
            
            next();
        })

    } else if (role == 'user') {
        p.pool.query('Select * from apistore', (error, result) => {
            if (error) 
                throw error;
            
            next();
            response.status(202).json(`Unauthorized user`)
        })
    }

}

const admin = (request, response) => {
    console.log(request.res)
    const {id, task} = request.body
    if (task == 'G') {

        p.pool.query('Select * from comp', (error, result) => {
            if (error) 
                throw error;
            response.status(202).json(result.rows)
        })
    } else if (task == 'D') {
        p.pool.query('Delete from comp where id = $1 ', [id], (error, result) => {
            console.log('ye')
            if (error) 
                throw error;
            

            response.status(202).send(`User deleted where id ${id}`)
        })
    }
}

const user = (request, response) => {
    const {id, api_token} = request.body
    if (id == 102) {
        var k = p.pool.query(`Select * from apistore`, response.status(202).send(`${k}`))
    } else if (id == 103) {
        if (api_token) {
            let values = [api_token, id]
            p.pool.query('Update apistore set api_token=$1 where id=$2', values, (err, res) => {
                if (err) 
                    throw err;
                
                response.status(202).send(`Token Update ${id}`)
            })
        }

    }
}
module.exports = {
    signup,
    login,
    auth,
    admin,
    user
}
