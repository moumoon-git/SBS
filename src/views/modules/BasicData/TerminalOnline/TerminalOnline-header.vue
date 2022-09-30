<template>
    <div class="TerminalOnlineHeader">
        <header>
            <p class="title">终端在线总数</p>
            <div>
                <el-button @click="add" type="primary" class="button">新增</el-button>
                <el-button type="danger" @click="batchDel">批量删除</el-button>
            </div>
        </header>

        
    </div>
</template>

<script>
    export default {
        name: 'TerminalOnlineHeader',
        methods: {
            // 新增
            add() {
                this.$emit('addHandle','新增')
            },
            // 批量删除
            batchDel(){
                this.$emit('batchDelHandle')
            }
        },
        
    }
</script>

<style lang="scss">
.TerminalOnlineHeader{
    header{
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .title{
            font-weight: bold;
        }
        .button{
            background-color: #00a9f2;
            color: white;
        }
         .el-button:focus, .el-button:hover{
    
        }
    }
}
</style>