const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const Router = express.Router()

Router.post('/signup' , (req ,res , next)=>{
    User.find({email : req.body.email}).exec()
    .then(user=>{
        if(user.length >= 1){
            return res.status(409).json({
                message : "email exists"
            })
        } else {
            bcrypt.hash(req.body.password , 10 ,(err , hash)=>{
                if(err){
                    res.status(500).json({
                        error : err
                    }) 
                } else {
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        from : req.body.from,
                        to: req.body.to,
                        cnum: req.body.cnum,
                        password : hash
                    });
        
                    user.save()
                    .then(result=>{
                        console.log(result)
                        res.status(201).json({
        
                            message : 'user created successfuly'
                        })
                    })
                    .catch(err=>{
                        res.status(500).json({
                            error : err
                        })
                    })
                }
            })
        } 
    })

})
Router.get('/',(req , res , next)=>{
    User.find().exec()
    .then(result=>{
        res.status(200).json({
           users : result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})


Router.post('/login',(req , res ,next)=>{
    User.find({email : req.body.email}).exec()
    .then(user=>{
        if(user.length<1){
            return res.status(402).json({
                message : 'auth faild(email)'
            })
        } else { 
            bcrypt.compare(req.body.password , user[0].password , (err , result)=>{
                if(err){
                    return res.status(401).json({
                        error : err
                    })
                } else {
                    if(result){
                        const token = jwt.sign({
                            email : user[0].email ,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn : '2400h'
                        }
                    );
                        res.status(200).json({
                            message : 'auth succesful',
                            from : user[0].from,
                            to : user[0].to,
                            cnum:user[0].cnum,
                            token : token
                        })
                    } else {
                        res.status(401).json({
                            message : 'auth faild(pass)',
                        })
                    }
                }
            })
        }
    })
    .catch()
})

Router.delete('/:userId',(req , res , next)=>{
    User.remove({ _id : req.body.userId}).exec()
    .then(result=>{
        res.status(200).json({
            message : "user deleted"
        })
    }) 
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})



module.exports = Router