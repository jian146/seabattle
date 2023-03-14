import { notification } from "antd"

export const errorLog=( model:string, error:unknown,isShowMes=true)=>{
    console.error(model+'异常:', error)
    notification.error({
        message: 'Error',
        description: (error as Error).message
      })
  
  }
  