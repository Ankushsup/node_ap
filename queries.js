const { request,response } = require('express');
const e = require('./index')
const saltaround = 10;

const Pool = require('pg').Pool

const pool =new Pool({

    user: 'anku',
    host: 'localhost',
    database:'pets',
    password:'root',
    port: 5432,
})

const Signup=(request,response)=>{
    const{id,name,email,password} =request.body
    pool.query('Insert into comp (id,name,email,password) Values($1,$2,$3,$4)',
    [id,name,email,password],
    (error,results)=>{
        if(error) throw error
        response.status(202).send(`User added sucessfully ${id}`);
    })
}

const getuser=(request,response)=>{
    pool.query('Select * From comp order by id asc',
    (error,results)=>
    {
        if(error) throw error
        response.status(200).json(results.rows)
    })
}

const deleted=(request,response)=>{
    const id = parseInt(request.params.id)

    pool.query('Delete from comp where id=$1',[id],
    (error,results)=>{
        if(error) throw error
        response.status(202).send(`User deleted with Id ${id}`)
    })
}

module.exports={
    Signup,
    getuser,
    deleted
}