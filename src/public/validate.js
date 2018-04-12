export const validPhone = (rule, value, callback) => { //电话号码验证
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  if (!value) {
    callback(new Error('请输入电话号码'));
  } else if (!reg.test(value)) {
    callback(new Error('请输入正确的11位手机号码'));
  } else {
    callback();
  }
};

export const validCost = (rule, value, callback) => { //金额验证，非负数字
  if (!value) {
    callback(new Error('请输入金额'));
  }
  if (Number.isNaN(value) || !(value > 0)) {
    callback(new Error('请输入正确的金额'));
  } else {
    callback();
  }
};

export const validInteger = (rule, value, callback) => { //人口、户数，正整数
  if (!value) {
    callback(new Error('请输入数字'));
  }
  if (!Number.isInteger(value) || !(value > 0)) {
    callback(new Error('请输入正确的数值'));
  } else {
    callback();
  }
};

export const validPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'));
  }
  if (value.length < 6 || value.length > 16) {
    callback(new Error('请输入6到16位密码'));
  }else{
    callback();
  }
};
