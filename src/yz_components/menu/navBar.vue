<template>
  <el-tabs class="narBar" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="(bar,index) in navBarList"
      :key="bar.name+index"
      :label="bar.name"
      :name="bar.name"
    ></el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
    name: 'navBar',
    props: ['selectedName', 'navBarList'],
    data() {
        return {
            activeName: this.selectedName,
        };
    },
    watch: {
        selectedName(newValue, oldValue) {
            this.activeName = this.selectedName;
        },
    },
    methods: {
        handleClick(tab) {
            this.$emit('changTab', tab.name);
        },
    },
};
</script>

<style scoped>
/*
    /deep/ 与 >>>为穿透
   详情见 https://blog.csdn.net/Alex81320/article/details/86234369
  */
.narBar {
    margin: 10px 30px;
    height: 56px;
    background: rgba(255, 255, 255, 1);
    /*border: 1px solid rgba(219, 219, 219, 1);*/
    /*border-radius: 3px;*/
}
>>> .el-tabs__header.is-top {
    margin: 0;
    height: 58px;
    padding: 0px;
}

>>> .el-tabs__nav-wrap.is-top {
    color: #a2a2a2 !important;
    height: 58px;
}

>>> .el-tabs__nav-scroll {
    margin: 10px 32px;
}

>>> .el-tabs__item {
    font-size: 16px;
    color: #a2a2a2;
}

>>> .el-tabs__item.is-active {
    color: #409eff;
}

>>> .el-tabs__item:hover {
    color: #6b7280;
}
>>> .el-tabs__nav-next,
>>> .el-tabs__nav-prev {
    line-height: 58px;
    font-size: 20px;
}
</style>
