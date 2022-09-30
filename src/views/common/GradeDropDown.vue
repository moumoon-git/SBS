<template>
  <div class="GradeDropDown">
    <el-cascader
      v-model="selVal"
      :options="optionsVal"
      :props="{
        checkStrictly: true,
        emitPath: false,
        value: 'id',
        label: 'platformName'
      }"
      :show-all-levels="false"
      @change="selectChange"
    >
    </el-cascader>
  </div>
</template>

<script>
  export default {
    name: 'GradeDropDown',

    props: {
    // 使用全部平台
    platShow: {
      type: Boolean,
      default: false,
    },
    // 默认点击全部还是点击本平台
    mergeNode: {
      type: Boolean,
      default: false,
    },
      placeholder: {
        type: String,
        default: '请选择',
      },
      region: {
        type: Boolean,
        default: false,
      }
    },

    data(){
      return{
        selVal: -1,
        optionsVal: [],
        platformRoot: -1,
        optionsData: {
          checkStrictly: true,
          emitPath: false,
          value: 'id',
          label: 'platformName' // 'townName'
        },
      };
    },

    mounted() {
      this.getData()
    },

    methods: {
      selectChange(value) {
        this.$emit('operationChange', this.platformRoot === value, value)
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', value,this.selVal);
      },
      dfs_iterator(tree, cb) {
        let stack = [...tree]
        while(stack.length) {
          let node = stack.pop();
          cb(node)
          if(node.children) {
            // dfs需要反转
            stack.push(...node.children.reverse())
          }
        }
      },

      getData() {
        if (this.region) {
          this.$api.getJurisdiction().then((res) => {
            this.optionsVal = res.list;
            this.optionsData = {
              checkStrictly: true,
              emitPath: false,
              value: 'id',
              label: 'townName'
            }
          });
        } else {
        this.$http({
          url: this.$http.adornUrl('/sys/platform/getPlatformTree'),
          method: 'get',
        }).then((res) => {
          this.platformRoot = res.data.data[0].id;
          if (this.platShow) {
            if (this.mergeNode) {
              this.optionsVal = [
                {
                  id: -1,
                  platformName: '全部',
                  platformTitle: '全部',
                },
                res.data.data[0],
              ];
            } else {
              this.optionsVal = [
                {
                  id: -1,
                  platformName: '全部',
                  platformTitle: '全部',
                  children: res.data.data,
                }];
            }
          } else { // selectChange为接口返回第一个平台
            this.optionsVal = res.data.data;
          }
          this.selVal = this.platformRoot;
          this.selectChange(this.selVal);
        });
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.GradeDropDown {
  text-align: center;
  padding-top: 12px;
}
</style>
