const deepCopy = (obj = {}) => {
  //变量先置空
  let newobj: any = null;

  //判断是否需要继续进行递归
  if (typeof obj == 'object' && obj !== null) {
    newobj = obj instanceof Array ? [] : {};
    //进行下一层递归克隆
    for (var i in obj) {
      newobj[i] = deepCopy((obj as any)[i]);
    }
    //如果不是对象直接赋值
  } else newobj = obj;

  return newobj;
};
