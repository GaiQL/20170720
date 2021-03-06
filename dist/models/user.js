"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
// unique: true  唯一 value;
// 拿到数据后会用定义的类型去存储，但是有些不能转换，boolean
// ---------只有在 Schema 中定义过的字段才可以被存储。
var userSchema = new mongoose_1.default.Schema({
    // email: { type: String, unique: true },
    account: String,
    password: String,
    key: Number,
    checkStatusValue: String,
    accountTypeValue: String,
    checkStatus: Number,
    hospitalLogo: String,
    hospitalName: String,
    ziZhi: Array,
    hospStyle: Number,
    authFileUrl: String,
    hospAddress: String,
    openTimeStart: String,
    openTimeOver: String,
    goodatProject: String,
    hospName: String,
    hospType: String,
    provinceId: Number,
    provinceName: String,
    cityId: Number,
    cityName: String,
    areaId: Number,
    areaName: String,
    lat: String,
    lon: String,
    bdName: String,
    typeName: String,
    hospInfo: String,
    hospLogo: String,
    hospPhotos: String,
    contactTelephone: String,
    contactMobile: String,
    contactName: String,
    contactQQ: String,
    contactEmail: String,
    accountType: Number,
    bankAccount: String,
    bankName: String,
    bankInfo: String,
    accountHolder: String,
    promiseList: [{
            promiseId: Number,
            promiseTitle: String
        }]
}, { timestamps: true });
userSchema.pre('save', function (next) {
    const user = this;
    //   ???????????  握草，就想不明白为什么this.account会报错！！！！！！  他说this类型是 mongoose.Document?????  // console.log( this.account )
    //  this的类型不应该是 UserModelIF 么；
    if (!this.isModified("password"))
        return next();
    bcrypt_nodejs_1.default.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt_nodejs_1.default.hash(user.password, salt, undefined, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
let ComparePassword = function (candidatePassword, callback) {
    bcrypt_nodejs_1.default.compare(candidatePassword, this.password, (err, isMatch) => {
        callback(err, isMatch);
    });
};
// 返回的数据对象的方法；
userSchema.methods.comparePassword = ComparePassword;
var model = mongoose_1.default.model('user', userSchema);
exports.default = model;
//# sourceMappingURL=user.js.map