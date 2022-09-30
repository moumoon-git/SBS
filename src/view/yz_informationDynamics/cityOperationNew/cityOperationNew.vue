<template>
    <div class="cityOperationNewWrap" >
        <!-- 导航栏 -->
        <div class="cityOperation_tab" >
            <el-tabs v-model="activeName" >
                <el-tab-pane label="城市运行管理" name="General">
                    <cityDev ref="cityDev" :cityListDatas="cityListData" @outOffinif=cityOutOffinif @cityMonthVal=cityMonthVal ></cityDev>
                </el-tab-pane>
                <el-tab-pane label="空气质量" name="airQuality">
                    <skyTemplat ref="skyTemplat" :litsData="qualityData" @outOffinfo=outOffinfo ></skyTemplat>
                </el-tab-pane>
                <el-tab-pane label="天气情况" name="weather">
                    <skyTemplat2 :litsData="weatherData" @outOffinfo=weatherOutOffinfo ref="skyTemplat2" ></skyTemplat2>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 页脚 -->
        <div class="foolter" >
            <div class="paging" >
                 <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="limt"
                    layout="prev, pager, next, jumper"
                    :total="totalElements">
                </el-pagination>
            </div>

            <div class="btnWrap" >
                <el-button type="primary" @click="issue" >下发填报任务</el-button>
                <el-button type="primary" @click="saveData" >保存</el-button>
            </div>
        </div>
    
    <div>
        <popout ref="popout" @focus="focusLxr" @educe="educeRequery" ></popout>
    </div>

    <selectMansDialog ref="selectMansDialog"
        selectTitle="选择联系人"
        :selectData="outerVisible"
        @close='outerVisible = false'
        @closeDialog="outerVisible = false"
        @addMans='change'>
    </selectMansDialog>   
    
    </div>
</template>

<script>
import selectMansDialog from "@/view/yz_eventManagement/eventReports/dialog/selectMansDialog"
import cityDev from './template/cityDev'
import skyTemplat from './template/skyTemplat'
import skyTemplat2 from './template/skyTemplat'
import popout from './template/popout'

export default {
    name:'cityOperationNew',
    data () {
        return{
            outerVisible:false,
            activeName: 'General',
            currentPage:1,
            totalElements:0,
            limt:10,
            cityListData:[],
            qualityData:[],
            weatherData:[],
            dateStr:'',
            issueFlag:false,
            selectIndex:0
        }
    },
    components:{
        cityDev,
        skyTemplat,
        skyTemplat2,
        popout,
        selectMansDialog
    },
    methods:{
        // 初始化
        loading(){
            let date = new Date()
            let str = date.getFullYear()+'-' +((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))
            this.dateStr = str
            this.currentPage = 1
        },
        // 导出报告
        educeRequery(params){
            let str = ''
            for (const key in params) {
                str+=(key+'='+params[key]+'&')
            }
            window.open(window.g.ApiUrl + '/eos/appCity/outputWord?'+str.substring(0,str.length-1))+`&Authorization=${localStorage.getItem("token")? localStorage.getItem("token"): ""}`
        },
        // 下发短信
        issue(){
            this.issueFlag = true
            this.outerVisible = true
        },
        focusLxr(index){
            this.selectIndex = index
            this.outerVisible = true
        },
        // 分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.requeryListWaters()
        },
        // 选择联系人
        change(checkboxGroup,mansList){
            console.log(checkboxGroup,mansList)
            if(this.issueFlag){
                // 下发短信
                this.issueFlag = false
                this.appReportH5Sms(checkboxGroup)
            }else{
                if(this.selectIndex == 0){
                this.$refs.popout.options = JSON.parse(JSON.stringify(mansList))
                    this.$refs.popout.selectValue = JSON.parse(JSON.stringify(checkboxGroup))
                }else if(this.selectIndex == 1){
                this.$refs.popout.options1 = JSON.parse(JSON.stringify(mansList))
                    this.$refs.popout.selectValue1 = JSON.parse(JSON.stringify(checkboxGroup))
                }else if(this.selectIndex == 2){
                this.$refs.popout.options2 = JSON.parse(JSON.stringify(mansList))
                    this.$refs.popout.selectValue2 = JSON.parse(JSON.stringify(checkboxGroup))
                }
            }
            this.outerVisible = false
            this.$refs.selectMansDialog.getChechbox()
            this.$refs.selectMansDialog.checkboxGroup = []
            this.$refs.selectMansDialog.checkboxData = []
            this.$refs.selectMansDialog.mansList = []
        },
        // 下发短信请求
        appReportH5Sms(data){
            let type = this.activeName 
            let parmas = {
                contactorIds:data,
                type
            }
            this.$api.appCityReportH5Sms(parmas).then(res =>{
                console.log(res.data)
                if (res.errorcode !== 0){
                    return
                }
            })
        },
        // 城市运行导出报表
        cityOutOffinif() {
            console.log('城市运行导出报表')
            this.$refs.popout.popoutFlag = true
            this.$refs.popout.loading()
        },
        cityMonthVal (data) {
            this.dateStr = data
            this.requeryListWaters()
        },
        // 空气质量
        outOffinfo () {
            console.log('空气质量')
            this.$refs.popout.popoutFlag = true
            this.$refs.popout.loading()
        },
        weatherOutOffinfo () {
            console.log('天气质量')
            this.$refs.popout.popoutFlag = true
            this.$refs.popout.loading()
        },
        // 城市
        requeryListWaters(){
            let parmas = {
                page:this.currentPage,
                size:this.limt,
                date:this.dateStr
            }
            this.$api.listWaters(parmas).then(res =>{
                console.log(res.data)
                this.cityListData = res.data.data
                this.totalElements = res.data.totalElements
                if (res.errorcode !== 0){
                    return
                }
            })
        },
        //空气
        requeryListQuality(){
            let parmas = {
                page:this.currentPage,
                size:this.limt
            }
            this.$api.listQuality(parmas).then(res =>{
                this.qualityData = res.data.data
                this.totalElements = res.data.totalElements
                if (res.errorcode !== 0){
                    return
                }
            })
        },
        // 空气保存接口
        listQualitysaveOrUpdates(data){
            data.forEach(ele=>{
                this.$api.listQualitysaveOrUpdate({data:ele}).then(res =>{this.infoTs(res)})
            })
        },
        //空气
        requeryListWeather(){
            let parmas = {
                page:this.currentPage,
                size:this.limt
            }
            this.$refs.skyTemplat2.titleName = '天气情况'
            this.$api.listWeather(parmas).then(res =>{
                this.weatherData = res.data.data
                this.totalElements = res.data.totalElements
                if (res.errorcode !== 0){
                    return
                }
            })
        },
        // 天气
        saveOrUpdateweathers(data){
            data.forEach(ele=>{
                this.$api.saveOrUpdateweather({data:ele}).then(res =>{this.infoTs(res)})
            })
        },
        // 城市
        savewaterOrUpdates(data) {
                this.$api.savewaterOrUpdate({data}).then(res =>{this.infoTs(res)})
        },
        infoTs(res){
            if(res.errorcode != 0){
                this.$message.error(res.msg);
                return
            }
            this.$message({
                message: '保存成功',
                type: 'success'
            });
        },
        // 保存
        saveData(){
            // 城市运行保存
            if(this.activeName == 'General' ){
                this.savewaterOrUpdates(this.$refs.cityDev.cityListDatas)
            }else if(this.activeName == 'airQuality'){
            // 空气质量
                this.listQualitysaveOrUpdates(this.$refs.skyTemplat.changeData)
            }else{
                this.saveOrUpdateweathers(this.$refs.skyTemplat2.changeData)
            }
        },
    },
    mounted(){
        this.loading()
        document.getElementsByClassName('cityOperationNewWrap')[0].parentNode.style.height='100%'
        document.getElementsByClassName('el-pagination__jump')[0].firstChild.nodeValue = '跳至'
        this.requeryListWaters()
    },
    watch:{
        activeName(newVal,oldVal){
            this.loading()
            if( newVal === 'weather'){
                this.limt = 5
                this.requeryListWeather()
            }else if (newVal === 'airQuality'){
                this.limt = 5
                this.requeryListQuality()
            }else{
                this.limt = 10
                this.requeryListWaters()
            }
        }
    }
}
</script>

<style scoped>
.cityOperationNewWrap{
    height: calc(100% - 10px);
    display: flex;
    flex-direction: column;
}
.foolter{
    flex: 1;
    background: #fff;
    padding: 20px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin:0 10px;
    width: calc(100% - 20px);
    border-radius:0 0 3px 3px  ;
}
.cityOperation_tab{
    height: 80%;
}
/* 修改tab样式 */
.cityOperation_tab /deep/ .el-tabs{
    display: flex;
    flex-direction: column;
    height: 100%;
}
.cityOperationNewWrap /deep/ .el-tabs__header{
    background: #fff;
    padding-left: 16px;
    box-sizing: border-box;
    margin-bottom: 10px;
}
.cityOperationNewWrap /deep/ .el-tabs__item{
    font-size: 17px;
    color: #666666;
}
.cityOperationNewWrap /deep/ .el-tabs__item.is-active{
    color: #323232;
    font-weight: 600;
}
.cityOperationNewWrap /deep/ .el-tabs__nav-wrap::after{
    display: none;
}
.cityOperation_tab /deep/ .el-tabs__content{
    flex: 1;
    background: #fff;
    margin:0 10px;
    width: calc(100% - 20px);
    border-radius:3px 3px 0 0 ;
}
.cityOperation_tab /deep/ .el-tab-pane{
    width: 100%;
    height: 100%;
}
/* 分页 */
.foolter /deep/ .el-pager li,.foolter /deep/ .btn-next,.foolter /deep/ .btn-prev{
    background: #fff;
    border:1px solid rgba(221,222,225,1);
    font-size: 12px;
    border-radius:3px;
    font-weight: 400;
    padding: 0px;
    line-height: 4px;
    width: 42px;
    height: 42px;
    line-height: 42px;
    text-align: center;
}
.foolter /deep/ .el-pagination__jump{
    margin-left: 9px;
}
.foolter /deep/ .el-pagination__editor.el-input{
    width: 42px;
    height: 42px;
    padding: 0;
    margin: 0 8px;
}
.foolter /deep/ .el-pager .more::before {
    line-height: 2px;
}
.foolter /deep/ .el-pagination__editor.el-input .el-input__inner{
    width: 42px;
    height: 42px;
    padding: 0;
}
.paging{
    padding-right: 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
}
.foolter /deep/ .el-button+.el-button{
    margin-left: 15px;
}


</style>

