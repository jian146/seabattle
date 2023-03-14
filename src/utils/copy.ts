import { message } from "antd"
import copy from "copy-to-clipboard"

/**
 * @description 复制文字到粘贴板
 * @param text 文字
 * @param e svg图阻止冒泡
 */
 export const copyText = (text: string, e?: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e?.stopPropagation()
    copy(text)
    message.success('copy success')
  }