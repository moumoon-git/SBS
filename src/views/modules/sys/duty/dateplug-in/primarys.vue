<template>
  <div>
    <div class="dutyCont texttear">
      <span>值班内容</span>
      <texttear
        ref="textOne"
        class="texttears"
      />
    </div>
    <!-- <div class="handling texttear">
      <span>处理情况</span>
      <texttear
        ref="textTwo"
        class="texttears"
      />
    </div>
    <div class="instructions texttear">
      <span>领导批示</span>
      <texttear
        ref="textThree"
        style="height:102px;overflow: hidden;border-radius: 5px;"
        class="texttears"
        :class="!activesFlag?'actives':''"
      />
    </div> -->
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Bus from '@/utils/bus';
import texttear from './inputBor/texttear';

export default {
  name: 'Primarys',
  components: {
    texttear,
  },
  data() {
    return {
      activesFlag: true,
    };
  },
  mounted() {

  },
  methods: {
    insertContent(content) {
      this.$refs.textOne.upVal({ data: content, readonly: false });
    },
    init() {
      const valObj = {
        duty: this.$refs.textOne.init(),
        // handling: this.$refs.textTwo.init(),
        // instructions: this.$refs.textThree.init(),
      };
      return valObj;
    },
    upVal(data) {
      // eslint-disable-next-line standard/object-curly-even-spacing
      this.activesFlag = data.readonly;
      this.$refs.textOne.upVal({ data: data.duty, readonly: data.readonly });
      // this.$refs.textTwo.upVal({ data: data.handling, readonly: data.readonly });
      // this.$refs.textThree.upVal({ data: data.instructions, readonly: data.readonly });
    },
  },
};
</script>

<style scoped lang="less">
.texttear{
  padding: 0 12px;
  font-size: 14px;
  font-weight: bolder;
}
.texttear>span{
  display: block;
  position: relative;
  margin-bottom: 3px;
  // padding-left: 10px;
}
.texttear>span:before{
  // content: "";
  // width: 5px;
  // height: 16px;
  // background: rgb(64, 158, 255);
  // position: absolute;
  // left: 0;
  // top: 2px;
}
.texttears{

}
.actives{
  /*border-top:1px solid #ccc;*/
  border-bottom: 1px solid #ccc !important;
}
</style>
