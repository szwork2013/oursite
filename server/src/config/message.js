export default {
  success: {
    msg: '成功',
    code: 200
  },
  noToken: {
    msg: '缺少token',
    code: 400
  },
  existUser: {
    msg: '用户已存在',
    code: 401
  },
  loginError: {
    msg: '用户名或者密码错误',
    code: 402
  },
  errorTokenFormat: {
    msg: 'token格式错误',
    code: 403
  },
  noContent: {
    msg: '不能为空',
    code: 410
  },
  noRecord: {
    msg: '没有找到该条记录',
    code: 405
  },
  noRegister: {
    msg: '未注册的用户',
    code: 406
  }
}
