<template>
	<el-form size="medium" :inline="true" class="search-form" @submit.native.prevent>
		<el-input :placeholder="placeholder" v-model="key" @keyup.enter.native="onSearch" clearable class="input-with-select">
			<el-button slot="append" icon="el-icon-search" @click="onSearch" style="padding: 12px 12px;"></el-button>
		</el-input>

	</el-form>
</template>

<script>
	export default {
		props: ['placeholder'],
		data() {
			return {
				key: ''
			}
		},
		methods: {
			reset() {
				this.key = "";
			},

			onSearch() {
				this.$emit('on-search', this.key);
			}
		}
	}
</script>

<style scoped>
	.search-form {
		padding-top: 8px;
		margin-right: 10px;
		margin-left: -20px;
		width: 340px;
	}
	
	.search-form>>>.el-form-item {
		margin-bottom: 5px;
	}
</style>