var express = require('express');
var router = express.Router();
import { Request,Response,NextFunction } from 'express';
import multer from 'multer';

let storage = multer.diskStorage({
  destination: 'img/doctors' ,
  filename: function (req, file, cb) {

    let postfix = '.' + file.mimetype.split('/')[1];
    cb( null, file.fieldname + '-' + Date.now() + postfix )

  }
})

let upload = multer({
  storage,
  //   指定限制可以帮助保护您的站点免遭拒绝服务（DoS）攻击。
  limits:{
    fieldNameSize:100,
    fieldSize:512000,
    // 最大数量的非文件字段  没有非文件字段，是不是可以设置成0？....
    fields:100,
    // 对于多部分表单，最大文件大小
    fileSize:512000,
    // 对于多部分表单，文件字段的最大数量
    files:100,
    // 对于多部分表单，最大数量的部分（字段+文件）
    parts:512100
  }
});
// let upload = multer({ dest: 'img/doctors/' });
// .single  单
// .array   多

import * as Fn_goodItem from '../controllers/goodItem';
import * as Fn_doctor from '../controllers/doctor';

// 医美擅长项目
router.get( '/saveGoodItem.do',Fn_goodItem.save );
router.get( '/firstTypeList.do',Fn_goodItem.find );
// save doctor
router.post( '/addDoctor.do',Fn_doctor.save_examine,Fn_doctor.save );
// find doctor
router.post( '/ListDoctor.do',Fn_doctor.find_examine,Fn_doctor.find );
// change doctor top status
router.post( '/editDoctorIsTop.do',Fn_doctor.editDoctorIsTop_examine,Fn_doctor.editDoctorIsTop );
// look a doctor details
router.post( '/findByDoctorId.do',Fn_doctor.findOne_examine,Fn_doctor.findOne );
// eidt doctor'
router.post( '/editDoctor.do',Fn_doctor.save_examine,Fn_doctor.editDoctor );
// delete doctor
router.post( '/deleteDoctor.do',Fn_doctor.findOne_examine,Fn_doctor.deleteDoctor );
// save image
router.post( '/uploadDoctorImg.do',upload.single( 'file' ),Fn_doctor.save_Img );
// reject reason
router.post( '/rejectReason.do',Fn_doctor.findOne_examine,Fn_doctor.rejectReason );
// delete image
router.post( '/deleteDoctorImg.do',Fn_doctor.delete_Img_examine,Fn_doctor.delete_Img );

module.exports = router;
