<!--
 * @Author: qinjiaqi
 * @Date: 2020-10-10 14:00:00
 * @LastEditTime: 2021-01-11 10:32:01
 * @LastEditors: Please set LastEditors
 * @Description: 传真传达弹窗
-->
<template>
  <div style="width:100%;height:633px;">
    <!-- <pdf :src="$window.g.ApiUrl+'/fax/'+pdfPathName"></pdf> -->
    <iframe
        :src="pdfPathName"
        id="iframe"
        width="435px"
        height="100%"
        frameborder="0"
        scrolling="no"
    ></iframe>
  </div>
</template>

<script>
import pdf from 'vue-pdf';
import qs from 'qs';
export default {
    data() {
        return {
            $window:'',
            pdfPathName: '',
        };
    },
    components: {
        pdf,
    },
    props: ['faxName', 'faxTitle', 'faxWorkunit', 'faxApproval', 'approvalTime'],
    mounted() {
        this.$window=window
        this.$http({
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                
            },
            url: window.g.ApiUrl + '/eos/event/approval/exportEventApproval',
            data: qs.stringify({
                "json":JSON.stringify({
                    vc_leader_workunit: this.faxWorkunit,
                    vc_event_title: this.faxTitle,
                    vc_leadername: this.faxName,
                    txt_approval: this.faxApproval,
                    approval_time : this.approvalTime,
                })
            })
            
        }).then(res => {
            console.log('pdf预览 res', res);
            if(res.headers){
                res=res.data
            }
            if(res.errorcode==0){
                //this.pdfPathName=window.g.ApiUrl+'/eos/communication/pdf/preview?filename='+res.data.pdfPathName
                sessionStorage.setItem('EventApprovalAssets',JSON.stringify(res.data))
            }
        });
        this.pdfPathName=window.g.FileUrl + (sessionStorage.getItem('faxPdfPath') ? sessionStorage.getItem('faxPdfPath') : "") + '?timeStamp=' + new Date().getTime()//window.g.ApiUrl+sessionStorage.getItem('faxPdfPath')
    },
};
</script>