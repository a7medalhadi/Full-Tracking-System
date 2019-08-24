const express = require('express');
const Location = require('../models/location');
const mongoose = require('mongoose');
const checkAuth = require('../middle/checkauth')
const Router = express.Router();

Router.post('/',checkAuth,(req , res , next)=>{
    const lat = req.body.lat ;
    const long = req.body.long ;
    const speed = req.body.speed ;
    const cnum = req.body.cnum ;
    const from = req.body.from ;
    const to = req.body.to;
 
    const location = new Location({
        _id : mongoose.Types.ObjectId(),
        lat : lat ,
        long : long,
        speed : speed,
        cnum : cnum,
        from : from,
        to : to
    })
    location.save()
    .then(result=>{
        res.status(200).json({
            message : 'location inserted successfuly'
        })
    }) 
    .catch(err=>{
        res.status(500).json({
            error : err
        })
    })
})

Router.patch('/:cnum',(req , res , next)=>{
    const cnum = req.params.cnum;

    Location.update({ cnum : cnum } , { $set : {lat : req.body.lat , long : req.body.long} })
    .exec()
    .then(result=>{
        res.status(200).json({
            message : "location updated"
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})

Router.get('/',(req , res , next)=>{
    Location.find().exec()
    .then(result=>{
        res.status(200).json({
           result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})

module.exports = Router