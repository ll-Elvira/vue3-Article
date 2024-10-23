import request from '@/utils/request'
import { CancelToken } from '@/utils/request.js'

//注册接口
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', {
    username,
    password,
    repassword
  })
}

//登录接口
const source1 = CancelToken.source()
//config.cancelToken = source.token
export { source1 }
export const userLoginService = ({ username, password }) => {
  console.log('登录请求之前')
  //console.log(source1)
  return request.post('/api/login', {
    username,
    password
    //cancelToken: source1.token
  })
}

//获取用户基本信息
export const userGetInfoService = () => {
  return request.get('/my/userinfo')
}

//更新用户基本信息
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

//更新用户头像
export const userUploadAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

//更新用户密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
