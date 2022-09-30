<template>
    <div class="distributionControlBayonet">
       <ul class="bayonet">
      <li class="bayonetTitle">
        <span class="bayonetTip">卡口分组</span>
      </li>
      <li
        v-for="(item,index) in bayonetData"
        :key="index"
        @click="setListCheck(index)"
      >
        <div class="bayonetOperation">
          <p>{{item.name}}</p>
        </div>
      </li>
    </ul>
    </div>
</template>

<script>
    export default {
        props: ['bayonetData','id'],
        data() {
            return {
                
            }
        },
    methods: {
        // 复选框点击人员触发行为
    setListCheck(idx) {
      var check = this.bayonetData[idx].check;
      this.bayonetData[idx].check = check === true ? false : true;
      this.$forceUpdate();
    },
             // 删除选中
    delDistributionControlBayonet(id) {
         var that = this;
      var ids = []
      if (id) {
        ids.push(`${id}`)
      }else{
          that.bayonetData = this.bayonetData.filter(function(i) {
            return i.check;
        });
        that.bayonetData.map(v => {
            ids.push(`${id}`)
          });
      }
      that.$confirm("此操作将永久删除该布控, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that
          .$http({
            url: that.$http.adornUrl(`/vcm/vcmSuspectTask/deleteBayonet`),
            method: "post",
            data: that.$http.adornData({
              id: that.id,
              bayoneLists: ids,
            })
            // data: that.$http.adornData(id)
          })
          .then(({ data }) => {
            if (data && data.code === 0) {
              that.$parent.initList();
            } else {
              that.$message.error(data.msg);
            }
          });
      });
    },
        },
    }
</script>

<style lang="scss" scoped>
.distributionControlBayonet {
  .bayonet {
    padding: 0;
    list-style: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 385px;
    overflow-x: auto;
    li {
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
      &:last-child() {
        border-bottom: none;
      }
    }
    .bayonetTitle {
      padding: 0;
      padding-right: 15px;
      box-sizing: border-box;
      background-color: burlywood;
      display: flex;
      justify-content: space-between;
      .bayonetTip {
        padding: 0 15px;
        box-sizing: border-box;
        display: inline-block;
        background-color: cornflowerblue;
        border-radius: 3px;
      }
    }
    .bayonetOperation{
        display: flex;
        justify-content: space-between;
    }
  }
}
</style>