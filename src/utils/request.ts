
import { message } from 'antd';
import axios, { AxiosResponse } from 'axios';

// const pveUrl = 'https://m.game2012.cn';
const pveUrl = process.env.REACT_APP_API;
// https://adminapi.darklight.shop/admin/battleList.json
// const baseUrl='http://nps.game2012.cn:19815/'
export interface I_error{
  status: false,
  message:any
}
const messageError=(res:AxiosResponse<any, any>, isShowErrorMessage:boolean) => {

  if (res.data?.errMsg){
    isShowErrorMessage&&message.error(res.data.errMsg)
    return false
  } else {
    return true
  }
}
// const baseUrl='http://nps.game2012.cn:19815/'
export const axiosRequest = async ({isShowErrorMessage=true, ...axiosParm }, baseUrl = pveUrl ) => {

  axios.interceptors.response.use(
    response => {
      if (response.status===200&&!messageError(response, isShowErrorMessage)){
        const error:I_error={
          status: false,
          message: response
        }
        console.error(error)

        return Promise.reject(error)
      }
      return response
    },
    error => {
      if (error?.response) {
        switch (error.response.status) {
          case 500:


        }
      }
      return Promise.reject(error?.response?.data)
      // 返回接口返回的错误信息
    })

  return axios({
    ...axiosParm,
    url: baseUrl + axiosParm.url,
    timeout: axiosParm.axiosTimeout?axiosParm.axiosTimeout*1000:60*1000,
    // data: qs.stringify({
    //   accessToken: token,
    //   pageSize: 50
    // }),
    withCredentials: false
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  })
}






