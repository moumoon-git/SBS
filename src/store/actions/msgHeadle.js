export default {
  //修改state 的msgHeadleData数据
  async msgHeadleDatas (context,val) {
    context.commit('msgHeadleData',val)
  }
}
