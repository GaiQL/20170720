"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
let config = require('config');
// var Dotenv = require('dotenv');
// var mongoose = require('mongoose');
// import { Request, Response, NextFunction } from 'express';  // import @types?
//...
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const lusca_1 = __importDefault(require("lusca"));
const path_1 = __importDefault(require("path"));
const compression_1 = __importDefault(require("compression"));
const ejs_1 = __importDefault(require("ejs"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
// http://ju.outofmemory.cn/entry/99459  passport好文；
const passport_1 = __importDefault(require("passport"));
// import ueditor from 'ueditor';
let ueditor = require('ueditor');
// var express = require('express');
// var router = express.Router();
const passportConfig = __importStar(require("./congfig/passport"));
const Fn_Add = __importStar(require("./controllers/add"));
const Fn_Home = __importStar(require("./controllers/index"));
const Fn_Login = __importStar(require("./controllers/login"));
const fs_1 = __importDefault(require("fs"));
var app = express_1.default();
let listener = app.listen(2000);
dotenv_1.default.config({ path: ".env.example" });
let MongoStore = connect_mongo_1.default(express_session_1.default);
mongoose_1.default.connect('mongodb://localhost/myblog'); //连接上 myblog 数据库
mongoose_1.default.Promise = require('bluebird'); //Promise化
mongoose_1.default.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
mongoose_1.default.connection.on("open", function () {
    console.log("数据库连接成功");
});
app.use(cookie_parser_1.default('secret'));
app.use(compression_1.default());
// app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
app.engine('html', ejs_1.default.renderFile);
app.set('views', __dirname + '/public');
app.set('view engine', 'html');
passport_1.default.use(passportConfig.LocalStrategyMethod());
// app.use(express.static('public'));
app.use(body_parser_1.default.urlencoded({ extended: true })); //解析UTF-8的编码的数据。  会使用querystring库解析URL编码的数据
app.use(body_parser_1.default.json()); //解析json数据
app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { maxAge: 31557600000 }));
app.use('/img', express_1.default.static('img'));
// 潦草的跨域解决方案， cors设置白名单限制；
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:9098');
    res.header("Access-Control-Allow-Headers", "X_Requested_With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.setHeader('Access-Control-Allow-Credentials', 'true'); //设置为true，可以跨域带上cookie申请端
    next();
});
app.use("/ueditor/ue", ueditor(path_1.default.join(__dirname, 'public'), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    console.log(req.query);
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
        var date = new Date();
        console.log(req.ueditor.filename);
        var imgname = req.ueditor.filename;
        var img_url = '/images/ueditor/';
        // res.setHeader('Content-Type', 'MIME');
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    else {
        // res.setHeader('Content-Type', 'application/json');
        fs_1.default.readFile('./dist/public/ueditor/ueditor.config.json', (err, data) => {
            if (err) {
                next(err);
            }
            res.jsonp(JSON.parse(data.toString()));
        });
        // res.jsonp({"imageActionName": "uploadimage"});
        // res.end();
        // res.jsonp('/ueditor/ueditor.config.json');
    }
}));
app.use(express_session_1.default({
    secret: 'Random',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 5000000 },
    rolling: true,
    store: new MongoStore({
        url: 'mongodb://127.0.0.1:27017/session',
        touchAfter: 24 * 3600
    })
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/save', Fn_Login.save);
app.get('/login', Fn_Login.loginGet);
app.post('/login.do', Fn_Login.login);
// app.use( passportConfig.isAuthenticated );
app.get('/', Fn_Home.Index);
app.get('/homepage.do', Fn_Home.Home);
app.get('/add', Fn_Add.Add);
app.get('/find', Fn_Add.findAll);
app.get('/findOne', Fn_Add.findOne);
app.get('/findTime', Fn_Add.findTime);
app.use('/order', require('./router/order'));
app.use('/bd', require('./router/db'));
app.use('/doctor', require('./router/doctor'));
app.use('/image', require('./router/image'));
app.use('/hospital', require('./router/hospital'));
app.use('/area', require('./router/area'));
app.use('/product', require('./router/product'));
// 错误处理
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        //是ajax请求返回这个  500信息  不是的话交给下一个 500信息处理
        res.status(500).send({ error: 'Something failed!' });
    }
    else {
        next(err);
    }
}
function errorHandler(err, req, res, next) {
    // res.status(500);
    res.send({
        status: 500,
        message: err,
        data: null
    });
    res.end();
}
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
var dbConfig = config;
// db.connect(dbConfig, ...);
// console.log( dbConfig );
//
// console.log( process.env.NODE_ENV );
//
//
// console.log( process.env["MONGODB_URI"] );
// console.log( );
// console.log( listener.address() )
// if (config.has('optionalFeature.detail')) {
//   var detail = config.get('optionalFeature.detail');
//   //...
// }'
exports.default = app;
//# sourceMappingURL=app.js.map