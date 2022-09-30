<template>
  <div class="questionBank_left_wrap">
      <!-- <div class="addTks" @click="addTk" >新增题库类目</div> -->
      <ul class="questionBank_left_Ui">
        <li v-for="(item,index) in listData" :key='index' @click="selectType(item)" >
          <img class="notImg" :src="require('../../../../assets/img/question/'+item.img+'.png')" alt="">
          <img class="activeImgs" :src="require('../../../../assets/img/question/'+item.active+'.png')" alt="">{{item.title}}
        </li>
      </ul>
  </div>
</template>

<script>
  export default {
    name:'questionBank_left',
    data () {
      return {
          listData:[
            { title:'单选题',
              type:'radio',
              topicId:1,
              img:'dx',
              active:'dx1',
              epiSelectEntityList:[],
              isAnswer:true
            },
            { title:'多选题',
              type:'checkbox',
              topicId:2,
              img:'dxs',
              active:'dxs1',
              epiSelectEntityList:[],
              isAnswer:true
            },
            {title:'问答题（单行）',topicId:4,type:'oneRow',img:'bj',active:'bj1',isAnswer:false},
            {title:'问答题（多行）',topicId:6,type:'multiRow',img:'tk',active:'tk1',isAnswer:false},
            {title:'地址',topicId:9,type:'site',img:'dz',active:'dz1',isAnswer:false},
            {title:'日期',topicId:8,type:'dateline',img:'rq',active:'rq1',isAnswer:false},
            {title:'图片',topicId:10,type:'img',img:'img',active:'imgs',isAnswer:false},
            {title:'说明文字',topicId:11,type:'explain',img:'sm',active:'sm1',isAnswer:false}
          ]
      }
    },
    methods:{
      selectType (item) {
        this.$emit('seleTopic',item)
      },
      addTk () {
        this.$emit('addTkType','')
      }
    },
    mounted () {

    }
    // require('../../assets/img/'+idx+'.png')
  }
</script>

<style scoped>
ul,li,img{
  margin: 0;
  padding: 0;
}
.questionBank_left_wrap{
  width: 100%;
  height:100%;
  padding: 10px 0;
  font-size: 12px;
}
.questionBank_left_Ui{
  list-style: none;
  padding: 0 18px;
}
.questionBank_left_Ui>li{
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid #DAE7F8;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
  color: #999999;
  white-space: nowrap;
}
.questionBank_left_Ui>li:hover{
  border-color: #2672ff;
  color: #2672ff;
}
.questionBank_left_Ui>li:hover .notImg{
  display: none;
}
.questionBank_left_Ui>li:hover .activeImgs{
  display: block;
}
.questionBank_left_Ui>li>.activeImgs{
  display: none;
}
.questionBank_left_Ui>li>img{
  width: 24px;
  height: 24px;
  margin-right: 7px;
  display: block;
}
/* 新增题库类目 */
.addTks{
  padding: 5px;
  height: 34px;
  line-height: 24px;
  text-align: center;
  margin: 0 18px;
  border: 1px solid #0091FF;
  cursor: pointer;
  border-radius: 5px;
  background: #0091FF;
  color: #fff;
}
.addTks:hover{
  border-color: #0091FF;
  /* color: #2672ff; */
}
</style>
