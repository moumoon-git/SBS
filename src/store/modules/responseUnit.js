export default {
    namespaced: true,
    state:{
      unitArr: []
    },
    mutations:{
      addUnit(state,val){
        let hash = {}
        state.unitArr = state.unitArr.concat(val)
    const data2 = state.unitArr.reduce((preVal, curVal) => {
    hash[curVal.id]? '': hash[curVal.id] = true && preVal.push(curVal); 
    return preVal 
        }, [])
        state.unitArr = data2
      },
      resetArr(state,val){
          state.unitArr = val
      },
      deteteUnit(state,id) {
          state.unitArr.forEach((item) => {
              if(item.id === id) {
                  let index = state.unitArr.indexOf(item)
                  console.log('index',index)
                  state.unitArr.splice(index,1)
              }
          })
      }
      
    }
  }
  