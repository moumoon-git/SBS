<template>
	<el-dialog :visible.sync="visible" :width="width" center :top="top" :close-on-click-modal="false" @close="closeDialog">
		<div slot="title" class="dialog-header">{{ title }}</div>
		<slot name="form"></slot>
	</el-dialog>
</template>

<script>
	export default {
		props: ['width', 'title', 'top'],
		data() {
			return {
				visible: false
			}
		},
		methods: {
			closeDialog() {
				this.$emit('closeDialog');
			}
		}
	}
</script>

<style>
	.el-dialog {
		border-radius: 8px;
	}
</style>

<style scoped>
	/* 对话框头部样式 */
	.dialog-header {
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		margin: -20px -20px -20px -20px;
		/* background-color: #609ee9; */
		padding: 15px 20px;
		font-size: 18px;
	}
</style>
