const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
	let errors = {};
	
	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isLength(data.name, { min: 2, max: 10 })) {
    errors.name = '名字的长度小于2位且不能超过10位！';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = '名字不能为空！';
  }

  if (Validator.isEmpty(data.email)) {
    errors.name = '邮箱不能为空！';
  }

  if (!Validator.isEmail(data.email)) {
    errors.name = '邮箱格式错误！';
  }

  if (Validator.isEmpty(data.password)) {
    errors.name = '密码不能为空！';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 16 })) {
    errors.name = '密码长度为6-16位！';
	}

	// if (Validator.equals(data.password, data.password2) {
  //   errors.name = '两次密码不一致！';
	// }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};
