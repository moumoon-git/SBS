<template>
	<div>
		<el-button type="success" size="medium" icon="el-icon-top-right" style="display: inline-block;" @click="LinkageTypeBtn"
		 v-if='linkageReport && linkageBtn'>上报</el-button>
	</div>
</template>
<script>
	export default {
		props: ['LinkageType', 'arrayID', 'reportType'],
		name: "Report",
		data() {
			return {
				dialogVisible: false,
				arrId: [],
				linkageReport: true,
        linkageBtn:false,
			}
		},
		watch: {
			arrayID(data) {
				this.arrId = data;
			}
		},
		created() {
			this.linkageReport = window.g.linkageReport;
		  this.linkageBtn=this.$store.state.modular.linkage;
		},
		methods: {
			LinkageTypeBtn() {
				if (this.arrId.length == 0) {
					this.$message({
						message: '请勾选数据',
						type: 'warning'
					});
					return;
				}
				let ids = []
				for (let i in this.arrId) {
					ids.push(this.arrId[i].id)
				}
        this.$confirm('确认上报？', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let data = {
            arrId: ids,
            linkageType: this.LinkageType,
            type: this.reportType
          }
          let CallbackReload = this;
          this.$http('/emergency/preparation/report/reporting', data,CallbackReload).then(res => {
            this.$message({
              message: '上报成功',
              type: 'success'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消上报'
          })
        })
			},
		},
	}
</script>

<style scoped>

</style>
