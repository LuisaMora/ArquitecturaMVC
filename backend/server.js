import session from "express-session";
import cookieParser from "cookie-parser";
import express from "express";
import mysql from "mysql";
import cors from "cors";
import bodyParser from "body-parser";
//const express = require("express");
//const mysql= require('mysql');
//const cors =require('cors');
//const {check,validationResult}=require('express-validator')

const app= express();

app.use(cors({
    origin:["http://localhost:3000"],
    methods:["POST","GET"],
    credentials:true
}));
app.use(bodyParser.json())
app.use(express.json())
app.use(session ({
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{ 
        secure:false,
        maxAge:1000*60*60*24
    }
}));
app.use(cookieParser());


const db =mysql.createConnection({
  host:"localhost", 
  user:"root", 
  password:"Furiosa1234#",
  database:"gasto_web"
})

app.get('/',(req,res)=>{
    if (req.session.idUsuario){
        return res.json({valid:true,idUsuario:req.session.idUsuario})
    }else{
        return res.json({valid:false})
    }
})
app.post('/signup',(req,res)=>{
    const sql = "INSERT INTO usuarios (`nombre`,`correo`,`contraseña`) VALUES (?)";
    const values=[
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql,[values],(err,data)=>{
        if(err){
            return res.json("Error"); 
        }
        return res.json(data);
    })
})

app.post('/login',(req,res)=>{
    
    const sql ="SELECT * FROM usuarios WHERE `correo`= ? AND `contraseña` = ?";
    db.query(sql,[req.body.email,req.body.password],(err,result)=>{
        if(err){
            return res.json({Message:"Error"});
        }
        if(result.length > 0){
            req.session.idUsuario=result[0].idUsuario;
            console.log(req.session.idUsuario)
            console.log("entro")
            return res.json({Login:true});
        }else{
            return res.json({Login:false});
        }
    })
})


app.listen(8081,()=>{
    console.log("listening")
})