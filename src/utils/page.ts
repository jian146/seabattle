export const getPageList=<T>(list:T[],pageSize:number,currentPage:number)=>{
    const allPage= parseInt((list.length / pageSize) as any)+(list.length%pageSize>0?1:0)
    if (currentPage===allPage){
        //最后一页
        return list.slice(pageSize*(currentPage-1), list.length)
      } else {
        return list.slice(pageSize*(currentPage-1), pageSize*(currentPage))
      }
  }