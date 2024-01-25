const express = require('express');
const router = express.Router();
const path = require('path');

router.
    get("/home", (req, res)=>{
        res.render('index1');
    }).get("/account", (req, res)=>{
        res.render('account');
    });


module.exports = router;