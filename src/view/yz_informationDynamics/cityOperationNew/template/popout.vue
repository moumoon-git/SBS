<template>
    <div class="popout_wrap" v-if="popoutFlag" >
        <div>
            <div class="popout_top" >
                导出报告
                <img @click="closePopout" src="../../../../../static/img/close.png" alt="">
            </div>
            <div class="popout_content" >

                <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                <el-form-item label="责任编辑">
                    <el-select 
                        style="width:100%;"
                        v-model="selectValue" 
                        multiple 
                        :disabled="disabledFlag"
                        @focus="focus(0)">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                    <!-- <el-input v-model="formLabelAlign.name" ></el-input> -->
                </el-form-item>
                <el-form-item label="校对">
                    <el-select 
                        style="width:100%;"
                        v-model="selectValue1" 
                        multiple 
                        :disabled="disabledFlag"
                        @focus="focus(1)">
                        <el-option
                        v-for="item in options1"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="核签">
                    <el-select 
                        style="width:100%;"
                        v-model="selectValue2" 
                        multiple 
                        :disabled="disabledFlag"
                        @focus="focus(2)">
                        <el-option
                        v-for="item in options2"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报送">
                    <el-input v-model="formLabelAlign.submit" ></el-input>
                </el-form-item>
                <el-form-item label="单位落款">
                    <el-input v-model="formLabelAlign.unitsign" ></el-input>
                </el-form-item>
                <el-form-item label="报告日期选择">
                    <el-date-picker
                        v-model="dateValue"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                </el-form>

                <p>
                 备注：仅限周一至周五可选，若所选日期为周一，则将生成所选日前的周五、周六、周日三天报告；若选当周其他日期，生成报告为前一天数据所形成报告。   
                </p>

            </div>
            <div class="popout_bottom" >
                <el-button @click="closePopout" >取消</el-button>
                <el-button @click="educe" type="primary">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'popout',
    data (){
        return {
            options:[],
            options1:[],
            options2:[],
            selectValue:[],
            selectValue1:[],
            selectValue2:[],
            disabledFlag:false,
            popoutFlag:false,
            dateValue:'',
            dateStr:'',
            labelPosition: 'right',
            formLabelAlign: {
                unitsign: '',
                submit: ''
            }
        }
    },
    methods:{
        // 初始化
        loading(){
            this.formLabelAlign = {
                unitsign: '',
                submit: ''
            }
            this.options=[]
            this.options1=[]
            this.options2=[]
            this.selectValue=[]
            this.selectValue1=[]
            this.selectValue2=[]
            this.dateValue = ''
            this.dateStr = ''
        },
        educe(){
            let obj = {
                editor:this.headData(this.options,this.selectValue,0),
                proofreading:this.headData(this.options1,this.selectValue1,1),
                signOff:this.headData(this.options2,this.selectValue2,2),
                submit:this.formLabelAlign.submit,
                unitsign:this.formLabelAlign.unitsign,
                date:this.dateStr
            }
            for (let key in obj) {
                if(!obj[key]){
                    if(key=='submit'){
                        this.$message.error('"报送"不能为空');
                    }else if(key=='unitsign'){
                        this.$message.error('"单位落款"不能为空');
                    }else if(key=='date'){
                        this.$message.error('"日期"未选择');
                    }
                    return 
                }
            }
            this.$emit('educe',obj)
        },
        // 遍历数据
        headData(data,val,index){
            if(val.length==0){
                if(index == 0){
                    this.$message.error('"责任编制人"未选择');
                }else if(index == 1){
                    this.$message.error('"校对人"未选择');
                }else if(index == 2){
                    this.$message.error('"核签人"未选择');
                }
                return
            }
            let str = ''
            data.forEach(ele => {
                val.forEach(eles=>{
                    if(ele.id==eles){
                       str+=ele.name+' '
                    }
                })
            });
            console.log(str);
            return str
        },
        focus (index) {
            this.$emit('focus',index)
            document.getElementsByClassName('popoxwrap')[0].style.zIndex=99999
            setTimeout(()=>{
                document.getElementsByClassName('popoxwrap')[0].style.zIndex=99999
            })
        },
        closePopout() {
            this.popoutFlag = false
        }
    },
    watch:{
        dateValue(val){
            let dates = new Date(val)
            let str = dates.getFullYear()+'-'+((dates.getMonth()+1)<10?'0'+(dates.getMonth()+1):(dates.getMonth()+1))+'-'+((dates.getDate())<10?"0"+(dates.getDate()):(dates.getDate()))
            this.dateStr = str
        }
    }
}
</script>

<style scoped>
.popout_wrap{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .4);
    display: flex;
    align-items: center;
    justify-content: center;
}
.popout_wrap>div{
    width:720px;
    height:582px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 21px 3px rgba(0,0,0,0.27);
    border-radius:7px;
}
.popout_top{
    position: relative;
    height:56px;
    background:rgba(241,244,246,1);
    border-radius:7px 7px 0px 0px;
    padding: 15px 0 0 42px;
    box-sizing: border-box;
    text-align: left;
    font-size:18px;
}
.popout_top>img{
    position: absolute;
    top:13px;
    right: 14px; 
    width: 28px;
    height: 28px;
    cursor: pointer;
}
.popout_content{
    padding: 28px 42px 0;
    box-sizing: border-box;
}
.popout_content p {
    font-size:14px;
    font-weight:400;
    color:rgba(194,194,194,1);
    text-align: left;
}
.popout_content /deep/ .el-date-editor{
    width: 100%;
}
.popout_bottom{
    display: flex;
    justify-content: flex-end;
    padding-right:42px;
    box-sizing: border-box; 
}

</style>