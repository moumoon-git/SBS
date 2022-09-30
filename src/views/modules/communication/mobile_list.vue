<template>
    <div>

       <div class="wrap">

         <!--      联系人架构-->
         <header class="header">
           <el-row class="header_top">
             <!--          图标-->
             <el-col :span="6">
               <img class="lxr" src="../../../assets/img/human.png" alt="">
             </el-col>
             <!--          选择区域-->
             <el-col :span="12" id="area">
               <el-select v-model="value" placeholder="请选择">
                 <el-option
                   v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                   style="color:#444">
                 </el-option>
               </el-select>
             </el-col>
             <!--          刷新-->
             <el-col :span="6" class="flush" >
               <div @click="flushs" style="display: flex;align-items: center;color:#444;">
                 <img class="flush_img" src="../../../assets/img/flush.png" alt="">刷新
               </div>
             </el-col>
           </el-row>
<!--           <div class="human_list">-->
<!--             <button :class="boxFlag?'Btn_active':''" @click="ptlxr" >联系人分组</button>-->
<!--             <button :class="boxFlag?'':'Btn_active'" @click="ptlxr" >应急分组</button>-->
<!--           </div>-->

         </header>

         <!--      树形架构-->
         <div id="tree">
<!--           <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
           <el-input
             placeholder="输入关键字进行过滤"
             v-model="filterText">
           </el-input>

           <el-tree
             class="filter-tree"
             :data="data"
             :props="defaultProps"
             default-expand-all
             :filter-node-method="filterNode"
             @node-click="chlidrenSele"
             ref="tree">
           </el-tree>
         </div>

       </div>

    </div>
</template>

<script>
  // 引入中间件
  import Bus from '../../../utils/bus.js'
  export default {
    name: 'mobile_list',
    data () {
      return {
        // 切换样式和内容盒子
        boxFlag: true,
        // 选项
      // {
      //   value: '选项1',
      //   label: '黄金糕'
      // }
        options: [ ],
        value: '本级单位',
      //  树形架构
        filterText: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }

      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 切换样式和内容盒子
      ptlxr () {
        this.boxFlag = !this.boxFlag
        // console.log(this.boxFlag)
      },
      flushs(){
      //  刷新
        // console.log("刷新")
        this.httpHuman()
      },
      chlidrenSele (data) {
        // console.log(data)
        data.url = '/mail/mailcontactor/list'
        Bus.$emit('listVal', data)
      },
      httpHuman () {
        var that = this
      // 获取联系人分组
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/list'),
          method: 'get'
        }).then(({ data }) => {
          if (data.code === 0) {
            // console.log(data.data)
            that.data = data.data
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    },
    mounted () {
      this.httpHuman()
    }

  }
</script>

<style scoped lang="less">
  .wrap{
    display: flex;
    flex-direction: column;
    height: 100%;
  }

.header{
  display: flex;
  flex-direction: column;
}
.lxr{
  height: 50px;
  width: 50px;
  margin: auto;
  display: block;
}

.human_list{
  flex: 1;
  display: flex;
  background: #fff;
  justify-content: center;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  button{
     padding:5px 10px;
     border: none;
     border: 1px solid rgb(155,208,228);
     outline: none;
     cursor: pointer;
   }
    button:nth-child(1){
      border-radius: 5px 0 0 5px;
      background: #fff;
    }
    button:nth-child(2){
      border-radius:0 5px 5px 0;
      background: #fff;
    }
    .Btn_active{
      background:rgb(14,142,190) !important;
    }
}
.header_top{
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #444;
}
#area /deep/ .el-select>.el-input{
  display: flex;
  flex-flow:row-reverse;
  justify-content: center;
  align-items: center;
}
#area /deep/ .el-input__suffix{
  position: static;
  height: 30px ;
}
#area /deep/ .el-select .el-input .el-select__caret{
  background: #fff;
  border-radius: 50%;
  height: 80%;
  color: rgb(152,212,234);
  font-weight: bold;
}

#area /deep/ .el-input__inner{
  border: none;
  outline: none;
  box-shadow: none;
  background: rgb(14,142,190);
  color: #fff;
  padding: 0;
  width: 60%;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
}

.flush{
  color: #fff;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.flush>img{
  margin-right: 10px;
  background-color: black;
}



/*树形架构*/
  #tree{
    flex: 1;
    height: 636px;
    overflow: auto;
  }
  #tree /deep/  .el-tree{
    position: static;
    height: 100%;
    overflow: auto;
  }
#tree /deep/ .el-tree-node__content{
  height: 40px !important;
}
#tree /deep/ .el-tree-node__label{
  font-size: 20px;
}

.filter-tree /deep/  .el-tree-node__expand-icon{
  color: transparent;
  position: absolute;
  right:20px;
  top: 0;
  bottom: 0;
  margin: auto ;
  width: 23px;
  height: 23px;
  background: url("../../../assets/img/right.png");
  background-size: 100% 100%;
}

  .filter-tree /deep/ .el-tree-node__expand-icon.expanded{
    transform: rotate(-90deg);
  }
  .filter-tree /deep/ .el-tree-node__expand-icon.is-leaf{
    background-size: 0 0;
  }
  .filter-tree /deep/ .el-tree-node__content{
    position: relative;
  }


  .filter-tree /deep/ .el-tree-node__label{
    margin-left: 20px;
    font-size: 14px;
    color: rgb(59,64,113);
  }
  .el-tree{
    background: rgb(232,242,244);
  }

  .filter-tree /deep/ .el-tree-node:focus>.el-tree-node__content {
    background-color:  rgb(212,222,224);
  }
  .filter-tree /deep/ .el-tree-node__content:hover {
    background-color: rgb(212,222,224);
  }
/deep/ #area[data-v-24d6b405] .el-input__inner{
  color: #444;
  background: none;
}
/deep/ #area[data-v-24d6b405] .el-select .el-input .el-select__caret{
  border: 1px solid #ddd;
}
/deep/ .el-tree[data-v-24d6b405] {
    background: none; 
}
</style>
