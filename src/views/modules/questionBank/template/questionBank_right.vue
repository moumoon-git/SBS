<template>
  <div class="questionBank_right_wrap">
      <!-- 标题 -->
     <div class="formTitle">
       <el-form ref="form" :model="form" label-width="80px">
         <el-form-item label="题库名称">
           <el-input v-model="form.name"></el-input>
         </el-form-item>

         <el-form-item label="题库类型">
           <el-radio-group v-model="radio">
             <el-radio :label="item.id" v-for="(item, index) in typeLists" :key="index" >{{item.typeName}}</el-radio>
           </el-radio-group>
         </el-form-item>

         <el-form-item label="题库描述">
           <el-input v-model="form.keyWrod"></el-input>
         </el-form-item>

       </el-form>
     </div>
    <!-- 编辑内容 -->
    <div class="editContent">
<!--      <div class="category_wrap">-->
<!--        <div class="category_title_wrap">-->
<!--          <div class="category_title" contenteditable="true">类目标题</div>-->
<!--&lt;!&ndash;          <div class="del_category" v-show="wrapFlag" >&ndash;&gt;-->
<!--&lt;!&ndash;            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAB+UlEQVRIS+2WTYiNURjHfz8RphEbWciGUiIWaBBDNhYWspGSlVKKxEKxIUWJUhY2FiSSraymlMXIZBQpG2ZliFj5nPExHj23d6brut7r3hs299S7eDvP+f+e8/H8z5G/3CzTj4hJwHpgVp24YfV+o/waAa4AO0pEDqpnyyCNAJ+AjDkJvKsSWgDsA/rVde0AvgKD6ppakYj4DDxQV5UCImIDcAyYWSdwGZCzeFqnbykw8pu+58ABdciIyJ+5wCiQWbXbuoApwA11SwKiyGKJ+qVd9YiYA7wAHqorEvANeA/srdnIVlkLgTPAPbUnAbeAja2qlYw7rR5KQDdwBDgM9BVfq7xdwCJgJ3BNHavUQURktd4GjqtHW1WPiJvAZqBb/Zg6/w8QERW4mqes0tKb1O8l/38+g4jI/Zim9hbi24FLwHL1cURMB54BF9Tcw0ygKcAQMFWdVwxOkRPAJrWvOO+vgOtqwjuA6CzRz5UcEZ1TVO5F/2KJBoEudXFRpXuA88BqdSAiZgBvgMvq7kaV3AMMAOfU/UXwbGCy+nLc6NLr04eqzG4+8Fr9UMT0ZwKFh+WLZMKu07jy8k8H3QrcSWtp4l7IS34bcBG4q64dHzvx8IqIDLiaWTchXBv6FuhVH/0CKKa4srj88xlT+uqrUR4DngCn1OHqvh/RkcIuH5fZ+wAAAABJRU5ErkJggg==" alt="">&ndash;&gt;-->
<!--&lt;!&ndash;            删除类目&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--        </div>-->

<!--        <div class="topicBig_wrap">-->

<!--          <div class="topic_wrap" type="radio">-->
<!--          	&lt;!&ndash; 内容div &ndash;&gt;-->
<!--          	<div class="topic_content_wrap">-->
<!--          		<div class="topic_sort"></div>-->
<!--          		<div class="topic_content">-->
<!--          			<div class="topic_content_title" contenteditable="true">-->
<!--          				单选框-->
<!--          			</div>-->
<!--          			<div class="topic_content_title radio " additional='false'>-->
<!--          				<div contenteditable="true">选项1</div>-->
<!--          				<div class="delSingle">-->
<!--          					<div class="delSingleImg">-->
<!--          						<img class="deleOne" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAADXklEQVRYR82YTWhUVxiG3/eMY1qoCWJFoSVQpaLoQko1k2mSVtBUyLJJsLgIZhK10IIb3XTdjd0UKqQmM5ZAQ0tMly4MQmN+JhO1hYISUbEgLioqYlqoaZzzljN6J/fe2NwxqfXe3fn5vvPc7+/8EM/59U3pLWPxIYAGAFsE1EJYVVJD/EHgFoBpAOPW4Gx3HX97niVYyeTBQSVmatEGi08BpUtLV/YJYB4GJ6pv4XR7O4tRYpGKc5PabaWvCWyOUrbYuICrhvwsU89zi837V6Bvf9IrxVfxFYWDkiLBK4El6TT1Jv7CkQO7+OhZMs9c6NSo1moFzgjasUCItBTGAJyBwaQFrte8hgdu3sM/sdoAb8OiHkCLiEZIJqyD4EU+RktnE+8uHAv1PIUZFRR2kTPTj8UEPz9Yx2uVWKR3SpsSRX0h4KNw3BG8ysdoCkMFLOTcZKvgYEKW4U1Z7O9uYKESkPCcvnGlaDAAaIN/zFnKzKLJ774AULagb2B1KKCQHEkatHbU8f5SYDyZ/imtmbMYgvRBQI/hya4UD3t9ZSCXTQCGAwFMjhSTaD70LueWA+PJnrykZGIOw34oF+gAmr3sKwG5OvPwTV0OpjZvJhPYuVzLhH+kZKkiLvjd50pCzW1uc3WqBJQtaB+svvcJS5bppcZMlDWfxJTygUA3/LgrxR+eAOU1Dug9nx+HMmnTFqV4OeO5vD0toHVeBye60mxgbkwblNCNMi1prcGWSlN7qVCuJBiLaV+dkhLcyNykDkvq8RQLON+dNsFMWOqqEXK5vEYEvV/2DPmJA/pO0v55d/FYJs0vXxBDQG0ur6OCjvuABhzQz5LeKXcaNmZSHA+lageFrSAWbAMVgQtWxJViEv3+EpIrqEFWbhsqfSR/YXZSdyG9XnaZ4fruFO947eyEHQaxp6KFIyYRHO6sx96ntQd9Ba2j1e9lMfIes3k9AlTldVZXs6p9G/927Z683khCt/8LmLIVityeaeSvrj14WStnZjTry7TZGALFzWWxC+o4pn2gMBI8n0nzJRbGuG0dLuVitbmWgOJ2/IjdAc1ZKVZH2PK+FadDvoOK3TXIQcXqoui5LuoqLWnMgP/PVdqDitVjg//8E5vnGD9UrB6swqdFd23CCjS/qCe9fwBiJGybvpXr+wAAAABJRU5ErkJggg==" alt="">-->
<!--          						<img class="deleTow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC5ElEQVRYR82YTUgVURTHf+c9SjcG9kFBEGQUSS0iKMrUWpQFLlMoXESbLNDRTW1aRIs2BeIbhbJNBEmBtnSRtLB8WSQFQZFUGESLoi/IjRbOifumec6bXs34NLizu3PPx/+e73uF+X49uh6Pg0AtQjXKOqDit5gphHcoL4EsKe7QLm/no0ISETdrmlqaEdpQaoBkfKAIYyi9ZBlgQGbj9MULdnU/Sg+wOU5YzP4EQjuO3P0X3d8BXdNypugGTuTOuRifoMBVKujkuEwXE1lckaurUIaAHUWYPGAUYQiPh8BrvvEtR1dJJbCRFLtRGoE6IFVExjhCI458iu79CcgHc7+Ii8zpbpPmLG3yKpHBenUTs1wADheJO+PC+iioQkDGTd9zYKKWmURowZFHiYBEiVzdhdIPVEW2xllGfdh9hYBcvYLSWsAkjJCiiTb5UhKYgKlXV+AxiLIvIr8PR04G/+YAmWyC4YIANmDKaKBVfi4ITMDcp0uYyemYA+UHekOQfT4gv848j8TNJGl2Ltgy0ZMYS83yOOK+CbJsNXXKB5TRI8DNEK9J9JqSYybOnH5MjUUC/SgdcssH5GoWZU9IziAd0hwnd0H7GR0AmvIyhAc4Uit0aRVp3oTQeqSpTpzapaLyS4LpeUGdUlJsEDJqIvxySO49OqQwE0pVGseX0RFgb4jslAF0A2gJme4MjlyKk7Uo+66eRrkYktUvuPoEZXv+p1JHp2Tza5Oq0xxD2UKqaBuIx+bhIbygnOsFJaRbzQgzGjLGU2Mh009WhgCtoVM+5tcZHQYOxGtNQCEM43AIxNQe6NbVCB9CnJ8NINN1y/I/v1LGefmRW3fpWtK8T6AqOYmwDUee5RjO6VKWMxNinrESkGUuszCoLUt76wqjda3D5JxVzdUAsm78sG5A891m0Qgb1G6rhnwDyrprkO86iy6Kc66z6CodgLLqsSE83VjzHBMGZdWDVXQW9Htfw/960vsFSo6PtNAUejcAAAAASUVORK5CYII=" alt="">-->
<!--          					</div>-->
<!--          					<div class="Additional">-->
<!--          						<img class="AdditionalImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC0UlEQVRYR+2YP2hTURTGv++mreji1NEOioNLB1shibRYCkUFwe4dpH2pg6OooOAgiFA7urRJRDc3BUFQ1KE1aYQGoYMVxcU1IBRKS9rmffJe/jR9bV6a50u79G6Xe869v3fO/c699xFNWjKnXtp4SmBA0PFm9gHGN0EuiXiYiPId/SZ4sagzWxvKAzgZYKFWXWwZXvMFSmc1I2iy1ZkD25N5X6DUghYgRcsLsEDYrwMv1sBR4ACAc5XhTX+gjL0Ios81FvLWRdMfNlA6W5oRWMvCEZA3wntGyFFTaQN3RfTCVmfNiW5uT1T6axCWA6XMcB3CPIBpK86/9XPsAirXGc0diLTJnxBi9VC7gFJZvQc0EujLAznxiRXn/arrLqB0VmvbFZgFSH8CrePnVJ968osVc6Xutj0iZKs6SGh2Ih65GTZQyqd8HAE50W57hFJZDYMYMcTL8Si/N0txW4Eq15E8oA7nfCsWcfrWEFf9oNoKlM4oIWq2BtDJ89YFfjs0oGRGk6RmqgAy7E9E6dyZGra2RujQgZ7PqbvUhZ5arRJGIT2o9ckxm/jh9BmBXVzFL++eCi1CqayuA3oF4FgzJW2Ps2AMLtWrL0ygj4CG9w9TsSSnrBjvVf1CA0pmSrdJTrcGxC0Al604P4UO5B5+OQ3ZJZyt7RmDAUhjNUjysWy4B7IBZEfwNRHlUv1HhBahvSJz6CrzQv03ELDz5kn2AOp2VQquM5Vt7foRApDPluSHloGcPSVbnyuzFs0WT40PsrDvSt3YcEWGgy0DOfOV1WeuAHhmxfmmmQp3bGpvygw3KSxFujB1o5+/AwE1A/CO+6nMa3sE1OxJ7kRoA0D1cbhMyHnQhdoEM1qVNsicFWOs0QJMLWgRUvmHwgE0grMTcTZ82TCZ01Xaeluu/G1vKx1d7HPU1DBCrowdKOERpN669IVG51RgAfMyuOM957yL/ANR2ltEdONtlQAAAABJRU5ErkJggg==" alt="">-->
<!--          						<img class="AdditionalActive" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACfUlEQVRYR+2YPWgUURCAvzkjoo1VSi2UFDYpNIUpFEUIKgjap1UL8VYUFRQsBBFiiuxpk3R2dhEEQVELT1DBQ7BQUdLYHgiCeGjMPZns3mVv/97tz3nNvW7ZmXnfzryZebOCbS2YSSrcwXAA2GoTz/F+FfgA3MCRx5JqoGZ2Aw0M23NslFWlDZxIB3LNInAmq+UC8g0b0Gtgv79BE1gusFmSqh6FPf7LVRvQO2CfL9zAkanSgUJRGAFFPBzrIc0mwxVgEtgcUNLYbvOffwGfcoasBdRZY56L8r3HRgTIqzMv/1Nqf2GN6R6oCFDNPMEwk/PL86jdxpFrXcUIkGs0FJ0KrKn9Lc8uFp1g6F/hiKa6t2KATMDYEo6cLR3INcnlYwTkhWXAHnLNEWAG4T5V+WgN8UCBtEwIDWAMaDLGLs7Jz1SoAQOdRljqAgh7qcr74QG5Rq8jei3prCkcUY8lr4F6aOhANTOOYWfg808B1wMhm8Xwef1ZaLOJr5EzVZqH7pqTtHkAbLFm0oZAE+FQT/aVBuSaZ4CmeNY1hyNXA+2hpDq0YC4hzGek+QscxZHn5QN5VfYwMBGA0sY4G3i+1W3IBu2Lb7kgOtZsrNJCFueaoWdZGKo4UPjmqRk87m/TElyT7fpRHCjtSD7NA6Rn6oVv9TfCDqqiF7t+K3W8nPCDNgezA6k5L/uOUeEe5+WhNQt7D3U4ZN5sL8xRlZV8QFaCkEBaloVER0Drf1NSRnL10J/AcKiDYD1rRPqQ14bcSe03ODKdpKNAwT7Th+3CIqmTjQIdBx4BlcJb2QxoauvflKqsJHvI61cKdTNmtrdt0e/7FkKdNpcjfS5k4R90IoA7WOF3BwAAAABJRU5ErkJggg==" alt="">-->
<!--          						<div class="AdditionalTitle">-->
<!--          							<div>-->
<!--          								追加空格-->
<!--          							</div>-->
<!--          						</div>-->
<!--          					</div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          			&lt;!&ndash; 要进行的操作 &ndash;&gt;-->
<!--          			<div class="handle">-->
<!--          				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQ0lEQVRoQ+2aMW7CQBBF/8AVcgAXweIAOUDS5gCpU0FLnAOEHMAWLanoOUTgAHRUNhIHCC0dYhCWkJBlIq13bWzru96dnfnzZrRjraCkrxfoO4BXAfYKLJNIZmUcJWUY9T90CsHg2rYKhkkoP67Pcx6A/6kPUPxlHVVglUTyVPsAHkf63OngN8/R4xEvm4ksXAbhPAMMwDA9zEBWMCJEhAwVIEKWgrELESEiZKkAEbIUkF2oNgj1R+odAM8yo+n2/wYaJ/a7WMeh7M62UoT8QMcAvlwYr9DGdxzJWPIG8AqdsDpKgDfxA93CETpW3hTYrMC8BQHk/MMpIMZdtqQINb6IL9I1uo26zD+HekM1eReqzV3IMHM3l7MGDJVkDbAGDJHJLidCRIgIWSpAhCwFZBdqHUKNf2qQzthNfuxxQaqq5zYn5rRAmnVrK8sAAAAASUVORK5CYII=" alt="">添加选项-->
<!--          			</div>-->
<!--          		</div>-->
<!--              <select class="selecteds_dl" >-->
<!--                <option value ="volvo">Volvo</option>-->
<!--                <option value ="volvo">Volvo</option>-->
<!--                <option value ="volvo">Volvo</option>-->
<!--              </select>-->
<!--            </div>-->
<!--          	&lt;!&ndash; 进行拖拽和删除操作的div &ndash;&gt;-->
<!--          	<div class="operations">-->
<!--              <div class="saveTipic_dl" >-->
<!--                <img  class="notActiveImgs" src="../../../../assets/img/question/save_1.png" alt="">-->
<!--                <img  class="dragActiveImgs" src="../../../../assets/img/question/save_2.png" alt="">-->
<!--                <div class="dragChild">-->
<!--                	<div class="dragChilds">-->
<!--                		保存-->
<!--                		<div class="dragTriangle"></div>-->
<!--                	</div>-->
<!--                </div>-->
<!--              </div>-->
<!--          		<div class="drag">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">-->
<!--          			<div class="dragChild">-->
<!--          				<div class="dragChilds">-->
<!--          					长按拖动题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          		<div class="del">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">-->
<!--          			<div class="delChild">-->
<!--          				<div class="delChilds">-->
<!--          					删除题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 是否为必填项 &ndash;&gt;-->
<!--          	<div class="mustFillIn">-->
<!--          		必填<input type="checkbox" class="checke">-->
<!--          	</div>-->
<!--          </div>-->

<!--          <div class="topic_wrap" type="checkbox">-->
<!--          	&lt;!&ndash; 内容div &ndash;&gt;-->
<!--          	<div class="topic_content_wrap">-->
<!--          		<div class="topic_sort"></div>-->
<!--          		<div class="topic_content">-->
<!--          			<div class="topic_content_title" contenteditable="true">-->
<!--          				复选框-->
<!--          			</div>-->
<!--          			<div class="topic_content_title checkbox " additional='false'>-->
<!--          				<div contenteditable="true">选项1</div>-->
<!--          				<div class="delSingle">-->
<!--          					<div class="delSingleImg">-->
<!--          						<img class="deleOne" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAADXklEQVRYR82YTWhUVxiG3/eMY1qoCWJFoSVQpaLoQko1k2mSVtBUyLJJsLgIZhK10IIb3XTdjd0UKqQmM5ZAQ0tMly4MQmN+JhO1hYISUbEgLioqYlqoaZzzljN6J/fe2NwxqfXe3fn5vvPc7+/8EM/59U3pLWPxIYAGAFsE1EJYVVJD/EHgFoBpAOPW4Gx3HX97niVYyeTBQSVmatEGi08BpUtLV/YJYB4GJ6pv4XR7O4tRYpGKc5PabaWvCWyOUrbYuICrhvwsU89zi837V6Bvf9IrxVfxFYWDkiLBK4El6TT1Jv7CkQO7+OhZMs9c6NSo1moFzgjasUCItBTGAJyBwaQFrte8hgdu3sM/sdoAb8OiHkCLiEZIJqyD4EU+RktnE+8uHAv1PIUZFRR2kTPTj8UEPz9Yx2uVWKR3SpsSRX0h4KNw3BG8ysdoCkMFLOTcZKvgYEKW4U1Z7O9uYKESkPCcvnGlaDAAaIN/zFnKzKLJ774AULagb2B1KKCQHEkatHbU8f5SYDyZ/imtmbMYgvRBQI/hya4UD3t9ZSCXTQCGAwFMjhSTaD70LueWA+PJnrykZGIOw34oF+gAmr3sKwG5OvPwTV0OpjZvJhPYuVzLhH+kZKkiLvjd50pCzW1uc3WqBJQtaB+svvcJS5bppcZMlDWfxJTygUA3/LgrxR+eAOU1Dug9nx+HMmnTFqV4OeO5vD0toHVeBye60mxgbkwblNCNMi1prcGWSlN7qVCuJBiLaV+dkhLcyNykDkvq8RQLON+dNsFMWOqqEXK5vEYEvV/2DPmJA/pO0v55d/FYJs0vXxBDQG0ur6OCjvuABhzQz5LeKXcaNmZSHA+lageFrSAWbAMVgQtWxJViEv3+EpIrqEFWbhsqfSR/YXZSdyG9XnaZ4fruFO947eyEHQaxp6KFIyYRHO6sx96ntQd9Ba2j1e9lMfIes3k9AlTldVZXs6p9G/927Z683khCt/8LmLIVityeaeSvrj14WStnZjTry7TZGALFzWWxC+o4pn2gMBI8n0nzJRbGuG0dLuVitbmWgOJ2/IjdAc1ZKVZH2PK+FadDvoOK3TXIQcXqoui5LuoqLWnMgP/PVdqDitVjg//8E5vnGD9UrB6swqdFd23CCjS/qCe9fwBiJGybvpXr+wAAAABJRU5ErkJggg==" alt="">-->
<!--          						<img class="deleTow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC5ElEQVRYR82YTUgVURTHf+c9SjcG9kFBEGQUSS0iKMrUWpQFLlMoXESbLNDRTW1aRIs2BeIbhbJNBEmBtnSRtLB8WSQFQZFUGESLoi/IjRbOifumec6bXs34NLizu3PPx/+e73uF+X49uh6Pg0AtQjXKOqDit5gphHcoL4EsKe7QLm/no0ISETdrmlqaEdpQaoBkfKAIYyi9ZBlgQGbj9MULdnU/Sg+wOU5YzP4EQjuO3P0X3d8BXdNypugGTuTOuRifoMBVKujkuEwXE1lckaurUIaAHUWYPGAUYQiPh8BrvvEtR1dJJbCRFLtRGoE6IFVExjhCI458iu79CcgHc7+Ii8zpbpPmLG3yKpHBenUTs1wADheJO+PC+iioQkDGTd9zYKKWmURowZFHiYBEiVzdhdIPVEW2xllGfdh9hYBcvYLSWsAkjJCiiTb5UhKYgKlXV+AxiLIvIr8PR04G/+YAmWyC4YIANmDKaKBVfi4ITMDcp0uYyemYA+UHekOQfT4gv848j8TNJGl2Ltgy0ZMYS83yOOK+CbJsNXXKB5TRI8DNEK9J9JqSYybOnH5MjUUC/SgdcssH5GoWZU9IziAd0hwnd0H7GR0AmvIyhAc4Uit0aRVp3oTQeqSpTpzapaLyS4LpeUGdUlJsEDJqIvxySO49OqQwE0pVGseX0RFgb4jslAF0A2gJme4MjlyKk7Uo+66eRrkYktUvuPoEZXv+p1JHp2Tza5Oq0xxD2UKqaBuIx+bhIbygnOsFJaRbzQgzGjLGU2Mh009WhgCtoVM+5tcZHQYOxGtNQCEM43AIxNQe6NbVCB9CnJ8NINN1y/I/v1LGefmRW3fpWtK8T6AqOYmwDUee5RjO6VKWMxNinrESkGUuszCoLUt76wqjda3D5JxVzdUAsm78sG5A891m0Qgb1G6rhnwDyrprkO86iy6Kc66z6CodgLLqsSE83VjzHBMGZdWDVXQW9Htfw/960vsFSo6PtNAUejcAAAAASUVORK5CYII=" alt="">-->
<!--          					</div>-->
<!--          					<div class="Additional">-->
<!--          						<img class="AdditionalImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC0UlEQVRYR+2YP2hTURTGv++mreji1NEOioNLB1shibRYCkUFwe4dpH2pg6OooOAgiFA7urRJRDc3BUFQ1KE1aYQGoYMVxcU1IBRKS9rmffJe/jR9bV6a50u79G6Xe869v3fO/c699xFNWjKnXtp4SmBA0PFm9gHGN0EuiXiYiPId/SZ4sagzWxvKAzgZYKFWXWwZXvMFSmc1I2iy1ZkD25N5X6DUghYgRcsLsEDYrwMv1sBR4ACAc5XhTX+gjL0Ios81FvLWRdMfNlA6W5oRWMvCEZA3wntGyFFTaQN3RfTCVmfNiW5uT1T6axCWA6XMcB3CPIBpK86/9XPsAirXGc0diLTJnxBi9VC7gFJZvQc0EujLAznxiRXn/arrLqB0VmvbFZgFSH8CrePnVJ968osVc6Xutj0iZKs6SGh2Ih65GTZQyqd8HAE50W57hFJZDYMYMcTL8Si/N0txW4Eq15E8oA7nfCsWcfrWEFf9oNoKlM4oIWq2BtDJ89YFfjs0oGRGk6RmqgAy7E9E6dyZGra2RujQgZ7PqbvUhZ5arRJGIT2o9ckxm/jh9BmBXVzFL++eCi1CqayuA3oF4FgzJW2Ps2AMLtWrL0ygj4CG9w9TsSSnrBjvVf1CA0pmSrdJTrcGxC0Al604P4UO5B5+OQ3ZJZyt7RmDAUhjNUjysWy4B7IBZEfwNRHlUv1HhBahvSJz6CrzQv03ELDz5kn2AOp2VQquM5Vt7foRApDPluSHloGcPSVbnyuzFs0WT40PsrDvSt3YcEWGgy0DOfOV1WeuAHhmxfmmmQp3bGpvygw3KSxFujB1o5+/AwE1A/CO+6nMa3sE1OxJ7kRoA0D1cbhMyHnQhdoEM1qVNsicFWOs0QJMLWgRUvmHwgE0grMTcTZ82TCZ01Xaeluu/G1vKx1d7HPU1DBCrowdKOERpN669IVG51RgAfMyuOM957yL/ANR2ltEdONtlQAAAABJRU5ErkJggg==" alt="">-->
<!--          						<img class="AdditionalActive" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACfUlEQVRYR+2YPWgUURCAvzkjoo1VSi2UFDYpNIUpFEUIKgjap1UL8VYUFRQsBBFiiuxpk3R2dhEEQVELT1DBQ7BQUdLYHgiCeGjMPZns3mVv/97tz3nNvW7ZmXnfzryZebOCbS2YSSrcwXAA2GoTz/F+FfgA3MCRx5JqoGZ2Aw0M23NslFWlDZxIB3LNInAmq+UC8g0b0Gtgv79BE1gusFmSqh6FPf7LVRvQO2CfL9zAkanSgUJRGAFFPBzrIc0mwxVgEtgcUNLYbvOffwGfcoasBdRZY56L8r3HRgTIqzMv/1Nqf2GN6R6oCFDNPMEwk/PL86jdxpFrXcUIkGs0FJ0KrKn9Lc8uFp1g6F/hiKa6t2KATMDYEo6cLR3INcnlYwTkhWXAHnLNEWAG4T5V+WgN8UCBtEwIDWAMaDLGLs7Jz1SoAQOdRljqAgh7qcr74QG5Rq8jei3prCkcUY8lr4F6aOhANTOOYWfg808B1wMhm8Xwef1ZaLOJr5EzVZqH7pqTtHkAbLFm0oZAE+FQT/aVBuSaZ4CmeNY1hyNXA+2hpDq0YC4hzGek+QscxZHn5QN5VfYwMBGA0sY4G3i+1W3IBu2Lb7kgOtZsrNJCFueaoWdZGKo4UPjmqRk87m/TElyT7fpRHCjtSD7NA6Rn6oVv9TfCDqqiF7t+K3W8nPCDNgezA6k5L/uOUeEe5+WhNQt7D3U4ZN5sL8xRlZV8QFaCkEBaloVER0Drf1NSRnL10J/AcKiDYD1rRPqQ14bcSe03ODKdpKNAwT7Th+3CIqmTjQIdBx4BlcJb2QxoauvflKqsJHvI61cKdTNmtrdt0e/7FkKdNpcjfS5k4R90IoA7WOF3BwAAAABJRU5ErkJggg==" alt="">-->
<!--          						<div class="AdditionalTitle">-->
<!--          							<div>-->
<!--          								追加空格-->
<!--          							</div>-->
<!--          						</div>-->
<!--          					</div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          			&lt;!&ndash; 要进行的操作 &ndash;&gt;-->
<!--          			<div class="handle">-->
<!--          				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQ0lEQVRoQ+2aMW7CQBBF/8AVcgAXweIAOUDS5gCpU0FLnAOEHMAWLanoOUTgAHRUNhIHCC0dYhCWkJBlIq13bWzru96dnfnzZrRjraCkrxfoO4BXAfYKLJNIZmUcJWUY9T90CsHg2rYKhkkoP67Pcx6A/6kPUPxlHVVglUTyVPsAHkf63OngN8/R4xEvm4ksXAbhPAMMwDA9zEBWMCJEhAwVIEKWgrELESEiZKkAEbIUkF2oNgj1R+odAM8yo+n2/wYaJ/a7WMeh7M62UoT8QMcAvlwYr9DGdxzJWPIG8AqdsDpKgDfxA93CETpW3hTYrMC8BQHk/MMpIMZdtqQINb6IL9I1uo26zD+HekM1eReqzV3IMHM3l7MGDJVkDbAGDJHJLidCRIgIWSpAhCwFZBdqHUKNf2qQzthNfuxxQaqq5zYn5rRAmnVrK8sAAAAASUVORK5CYII=" alt="">添加选项-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 进行拖拽和删除操作的div &ndash;&gt;-->
<!--          	<div class="operations">-->
<!--          		<div class="drag">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">-->
<!--          			<div class="dragChild">-->
<!--          				<div class="dragChilds">-->
<!--          					长按拖动题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          		<div class="del">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">-->
<!--          			<div class="delChild">-->
<!--          				<div class="delChilds">-->
<!--          					删除题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 是否为必填项 &ndash;&gt;-->
<!--          	<div class="mustFillIn">-->
<!--          		必填<input type="checkbox" class="checke">-->
<!--          	</div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 单行填空 &ndash;&gt;-->
<!--          <div class="topic_wrap" type="oneRow">-->
<!--          	&lt;!&ndash; 内容div &ndash;&gt;-->
<!--          	<div class="topic_content_wrap">-->
<!--          		<div class="topic_sort"></div>-->
<!--          		<div class="topic_content">-->
<!--          			<div class="topic_content_title" contenteditable="true">-->
<!--          				单行填空-->
<!--          			</div>-->
<!--          			<div style="width: 100%;height: 25px;border: 1px solid #ccc;margin-top: 10px;"></div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 进行拖拽和删除操作的div &ndash;&gt;-->
<!--          	<div class="operations">-->
<!--          		<div class="drag">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">-->
<!--          			<div class="dragChild">-->
<!--          				<div class="dragChilds">-->
<!--          					长按拖动题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          		<div class="del">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">-->
<!--          			<div class="delChild">-->
<!--          				<div class="delChilds">-->
<!--          					删除题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 是否为必填项 &ndash;&gt;-->
<!--          	<div class="mustFillIn">-->
<!--          		必填<input type="checkbox" class="checke">-->
<!--          	</div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 多行填空 &ndash;&gt;-->
<!--          <div class="topic_wrap" type="multiRow">-->
<!--          	&lt;!&ndash; 内容div &ndash;&gt;-->
<!--          	<div class="topic_content_wrap">-->
<!--          		<div class="topic_sort"></div>-->
<!--          		<div class="topic_content">-->
<!--          			<div class="topic_content_title" contenteditable="true">-->
<!--          				多行填空-->
<!--          			</div>-->
<!--          			<div style="width: 100%;height: 80px;border: 1px solid #ccc;margin-top: 10px;"></div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 进行拖拽和删除操作的div &ndash;&gt;-->
<!--          	<div class="operations">-->
<!--          		<div class="drag">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">-->
<!--          			<div class="dragChild">-->
<!--          				<div class="dragChilds">-->
<!--          					长按拖动题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          		<div class="del">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">-->
<!--          			<div class="delChild">-->
<!--          				<div class="delChilds">-->
<!--          					删除题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 是否为必填项 &ndash;&gt;-->
<!--          	<div class="mustFillIn">-->
<!--          		必填<input type="checkbox" class="checke">-->
<!--          	</div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 地址 &ndash;&gt;-->
<!--          <div class="topic_wrap" type="site">-->
<!--          	&lt;!&ndash; 内容div &ndash;&gt;-->
<!--          	<div class="topic_content_wrap">-->
<!--          		<div class="topic_sort"></div>-->
<!--          		<div class="topic_content">-->
<!--          			<div class="topic_content_title" contenteditable="true">-->
<!--          				地址-->
<!--          			</div>-->
<!--          			<div style="width: 100%;height: 20px;display: flex;margin-top: 10px;">-->
<!--          				<div class="dzs">请选择</div>-->
<!--          				<div class="dzs">请选择</div>-->
<!--          				<div class="dzs">请选择</div>-->
<!--          			</div>-->
<!--          			<div class="dzx">请输入详细地址</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 进行拖拽和删除操作的div &ndash;&gt;-->
<!--          	<div class="operations">-->
<!--          		<div class="drag">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">-->
<!--          			<div class="dragChild">-->
<!--          				<div class="dragChilds">-->
<!--          					长按拖动题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          		<div class="del">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">-->
<!--          			<div class="delChild">-->
<!--          				<div class="delChilds">-->
<!--          					删除题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 是否为必填项 &ndash;&gt;-->
<!--          	<div class="mustFillIn">-->
<!--          		必填<input type="checkbox" class="checke">-->
<!--          	</div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 日期 &ndash;&gt;-->
<!--          <div class="topic_wrap" type="dateline">-->
<!--          	&lt;!&ndash; 内容div &ndash;&gt;-->
<!--          	<div class="topic_content_wrap">-->
<!--          		<div class="topic_sort"></div>-->
<!--          		<div class="topic_content">-->
<!--          			<div class="topic_content_title" contenteditable="true">-->
<!--          				日期-->
<!--          			</div>-->
<!--          			<div class="dzx">请选择日期<img src="" alt=""></div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 进行拖拽和删除操作的div &ndash;&gt;-->
<!--          	<div class="operations">-->
<!--          		<div class="drag">-->
<!--         			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">-->
<!--          			<div class="dragChild">-->
<!--          				<div class="dragChilds">-->
<!--          					长按拖动题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          		<div class="del">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">-->
<!--          			<div class="delChild">-->
<!--          				<div class="delChilds">-->
<!--          					删除题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 是否为必填项 &ndash;&gt;-->
<!--          	<div class="mustFillIn">-->
<!--          		必填<input type="checkbox" class="checke">-->
<!--          	</div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 图片 &ndash;&gt;-->
<!--          <div class="topic_wrap" type="img">-->
<!--          	&lt;!&ndash; 内容div &ndash;&gt;-->
<!--          	<div class="topic_content_wrap">-->
<!--          		<div class="topic_sort"></div>-->
<!--          		<div class="topic_content">-->
<!--          			<div class="topic_content_title" contenteditable="true">-->
<!--          				请选择以下图片-->
<!--          			</div>-->
<!--          			<div class="q_option_img">-->
<!--          				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAD1UlEQVR4Xu2dsWoUURSGz1nYZisJaucLaKHBB9DCRmHBZu62prHRdEGwyqaNlkHQxjQuzJ3CYlARBC0CluIzpBCMiNVOt0dmcZPZyeza3/OlS3nO/efe//vvmR0Vh3+TyeRiv9/fMbOrIvJDRL6GEA4dtkLUW9FlWQ6qqjoSkc1W7dshhANv/XAngDzPx6q6215oMztW1ZshhBNPIvAogHeqeq9rkVX1UZZlLxBAwh0oiuKzmd3uKtHM9kaj0Tjh8s+V5m4HQADLGkAAjX6wAzjY+9gB2AHwAA0NcARwBDjY9xslcgRwBHAEcASQAyw0gAfAA+ABFh0gB3CgBUwgJhATiAnEBGICO447PAAegOvg1DWACcQEYgIxgZhATCAmcN4BomCi4NRt33J9mEBMICYQE4gJxARiAjGBbQ0QBTvwg5hATCAmEBPYbQJVdZxl2Z6DjfC0RIKg5tOAANLX/joPwA6Q/voLAsAErjSB7ADsAJjA1DVADsARwBFADkAOwGUQl0FcBrU1AAWk7gBFyAFaa0wUzEygg8e+USIYCAaCgWAgM4FgYMfJBwU4sAPcBuIBGAnDAxAF4wHwAETBbQ3wXgAmkIGQ1DUABUABJIFQAEkgFAAFQAEMhPz7jaD6c6rT6fSJql5X1QupG8FV3w1U1S8Oav9jZt8Hg8H+cDicaoxxQ0Q+dXxLN/VeeK/vm4jc0aIonpnZjvdueKxfVZ/XO8B7EbnrsQHULB9qAbwUkYc0w2UHXtUCeCAir12WT9Fb86ngGONjM6sp4Ao9Sb8DZnasqvshhIPTsfAY4yVVzWaz2eWUW9Dr9W6t+3x8yrXXtfV6vZ9mVoQQTur/eS+gseJcB6cu//+8GYQAEACfjEldA7wZxDwAU8HMAzAPwDxAx1mHCUzdAEAB51aYHIAcwMFj3ygRCoACoAAoAAqAAqCAeQcwgZhATOCiA+QADrQABUABUAAUAAVAAVAAFNDWACYQE8hEUOoagAKgACgACoACoAAoAAqAArgMWtIAGJg6AjATyEwgGAgGgoFgIBgIBoKBYCAYCAaCgQ7Ib6lEKAAKgAKgACgACoACoAAoAAqAAqCAsw5wG+hADWAgGAgGgoFgIBgIBoKBYCAYCAY6MP5cBq1ZZH4iptEccgAH2wE5ADkAOQA5ADkAOQA5ADkAOQA5ADmAA+NPDkAOcNaBGONbEbm/oidbIYRDTw+FuyAoz/Oxqu52nP/151RvhBB+I4CEO1CW5aCqqiMR2WyVuV1/Szfh0jtLc7cD1F2IMW6o6lMzuyYiv1T1Y5Zlb7wtfl3vX65PGxG+cwU/AAAAAElFTkSuQmCC" alt="">-->
<!--                  <p>单次上传</p>-->
<!--          				<p>最多10张图片</p>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 进行拖拽和删除操作的div &ndash;&gt;-->
<!--          	<div class="operations">-->
<!--          		<div class="drag">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">-->
<!--          			<div class="dragChild">-->
<!--          				<div class="dragChilds">-->
<!--          					长按拖动题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          		<div class="del">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">-->
<!--          			<div class="delChild">-->
<!--          				<div class="delChilds">-->
<!--          					删除题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 是否为必填项 &ndash;&gt;-->
<!--          	<div class="mustFillIn">-->
<!--          		必填<input type="checkbox" class="checke">-->
<!--          	</div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 说明 &ndash;&gt;-->
<!--          <div class="topic_wrap" type="explain">-->
<!--          	&lt;!&ndash; 内容div &ndash;&gt;-->
<!--          	<div class="topic_content_wrap">-->
<!--          		<div class="topic_sort"></div>-->
<!--          		<div class="topic_content">-->
<!--          			<div class="topic_content_title" contenteditable="true">-->
<!--          				请阅读本项说明，然后回答问题-->
<!--          			</div>-->
<!--          			<div style="height: 20px;"></div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 进行拖拽和删除操作的div &ndash;&gt;-->
<!--          	<div class="operations">-->
<!--          		<div class="drag">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">-->
<!--          			<div class="dragChild">-->
<!--          				<div class="dragChilds">-->
<!--          					长按拖动题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          		<div class="del">-->
<!--          			&lt;!&ndash; 未激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">-->
<!--          			&lt;!&ndash; 激活 &ndash;&gt;-->
<!--          			<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">-->
<!--          			<div class="delChild">-->
<!--          				<div class="delChilds">-->
<!--          					删除题目-->
<!--          					<div class="dragTriangle"></div>-->
<!--          				</div>-->
<!--          			</div>-->
<!--          		</div>-->
<!--          	</div>-->
<!--          	&lt;!&ndash; 是否为必填项 &ndash;&gt;-->
<!--          	<div class="mustFillIn">-->
<!--          		必填<input type="checkbox" class="checke">-->
<!--          	</div>-->
<!--          </div>-->

<!--        </div>-->
<!--      </div>-->

    </div>

<!--    <div class="BtnWraps">-->
<!--      <el-button type="primary" @click="capture">保存</el-button>-->
<!--      <el-button>取消</el-button>-->
<!--    </div>-->
    <!-- 添加新类目模板 -->
    <addCategoryTemP ref='addCategoryTemP'></addCategoryTemP>
    <!-- 添加单题 -->
    <SingleTopic ref='SingleTopic'></SingleTopic>
  </div>
</template>

<script>
  import addCategoryTemP from './addCategoryTemP'
  import SingleTopic from './SingleTopic'
  import url from '@/mock/modules/url'

  export default {
    name: 'questionBank_right',
    data() {
      return {
        wrapFlag:true,
        typeLists:[{typeName:'',id:0}],
        radio:0,
        form: {
          name: '',
          type: '',
          keyWrod: ''
        },
        data: {
          ind: '',
          ele: '',
          left: '',
          top: '',
          width: '',
          flag: false,
          clickDomX: '',
          clickDomY: '',
          dom: ''
        },
        tikuId:'',
        // 用于存放所有子元素的index和offsetTop
        eleArrData: [],
        moverFlag: true,
        ifDistanceEle: '',
        insertionIndex: 0,
        setTimeouts: '',
        commomTopicBigInd: 0,
        sidebarFolds: this.$store.state.common.sidebarFold,
        focusData:'',
        oderEle:'',
        tkTypeListsDatas:[],
        alldata:''
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      // 给所有的topic_wrap绑定点击事件
      allTopic_wrap() {
        let topic_wrapList = document.getElementsByClassName('topic_wrap')
        for (let i = 0; i < topic_wrapList.length; i++) {
          topic_wrapList[i].onclick = function(e) {
            for (let j = 0; j < topic_wrapList.length; j++) {
              topic_wrapList[j].id = ''
            }
            this.id = 'ActiveTopic_wrap'
          }
        }
      },
      // 给移动题库的大外套绑定监听事件
      topicBig() {
        const _that = this
        let bigWrap = document.getElementsByClassName('topicBig_wrap')
        for (let i = 0; i < bigWrap.length; i++) {
          bigWrap[i].onmousedown = function(e) {
            _that.commomTopicBigInd = i
            // console.log(commomTopicBigInd)
          }
        }
      },
      // 获取所有的drag绑定事件
      getDrags() {
        const _that = this
        let drag = document.getElementsByClassName('drag')
        let dels = document.getElementsByClassName('del')
        for (let i = 0; i < drag.length; i++) {
          drag[i].onmousedown = function(e) {
            _that.dragMouseDown(e, this)
          }
          drag[i].onmousemove = function(e) {
            _that.dragMouseMove(e, this)
          }
          drag[i].onmouseup = function(e) {
            _that.dragMouseUp(e, this)
          }
          dels[i].onclick = function(e) {
            _that.del(e, this)
          }
        }
      },
      // 排序用
      subject() {
        let topic_wrapList = document.getElementsByClassName('topicBig_wrap')
        for (let j = 0; j < topic_wrapList.length; j++) {
          for (let i = 0; i < topic_wrapList[j].children.length; i++) {
            topic_wrapList[j].children[i].setAttribute('ind', i + 1)
            topic_wrapList[j].children[i].children[0].children[0].innerText = i + 1
          }
        }
        this.getDrags()
        this.handleSele()
      },
      // 通过className获取指定的dom
      getDomAndInd(dom) {
        let bigWrap = document.getElementsByClassName('topicBig_wrap')[this.commomTopicBigInd]
        let ind = Number(dom.parentNode.parentNode.getAttribute("ind"))
        let topic_wrap = bigWrap.children[ind - 1]
        // let topic_wrap = document.getElementsByClassName('topic_wrap')[]
        this.data.ind = ind
        this.data.ele = topic_wrap
        // console.log(this.commomTopicBigInd)
      },
      // 鼠标按下事件
      dragMouseDown(event, dom) {
        let topic_wrapList = document.getElementsByClassName('topic_wrap')
        for (let j = 0; j < topic_wrapList.length; j++) {
          topic_wrapList[j].id = ''
        }
        dom.parentNode.parentNode.id = 'ActiveTopic_wrap'
        const _that = this
        _that.setTimeouts = setTimeout(() => {
          _that.data.clickDomX = event.offsetX
          _that.data.clickDomY = event.offsetY
          dom.style.cursor = "move"
          _that.getDomAndInd(dom)
          _that.data.width = _that.data.ele.offsetWidth
          _that.data.type = _that.data.ele.getAttribute('type')
          _that.data.flag = true
        }, 10)
      },
      // 鼠标抬起事件
      dragMouseUp(event, dom) {
        clearTimeout(this.setTimeouts)
        dom.style.cursor = "auto"
      },
      // 鼠标移动事件
      dragMouseMove(e, dom) {
        this.data.left = dom.parentNode.offsetLeft
        this.data.top = dom.parentNode.offsetTop
      },
      // 删除元素
      del(event, dom) {
        this.getDomAndInd(dom)
        console.log(this.data.ele.getAttribute('ids'))
        this.$http({
          url: this.$http.adornUrl(url.epiRegisterTopicdelete.url),
          method: url.epiRegisterTopicdelete.method,
          params: this.$http.adornParams({
            id:this.data.ele.getAttribute('ids')
          })
        }).then((res)=>{
          if (res.data.msg == 'success') {
            this.data.ele.remove()
            this.clearData()
            this.subject() //排序
          }
        }).catch((err)=>{

        })

      },
      // 清空存放元素的对象
      clearData() {
        this.data = {
          ind: '',
          ele: '',
          flag: false,
          left: '',
          top: '',
          width: '',
          clickDomX: '',
          clickDomY: ''
        }
        this.eleArrData = []
        this.moverFlag = true
      },
      // 让元素css样式恢复
      restore() {
        this.data.ele.className = 'topic_wrap'
        this.data.ele.style.top = 0
        this.data.ele.style.left = 0
        this.data.ele.style.width = '100%'
      },
      // 鼠标移动时获取所有的子元素
      allChildList(dom) {
        // 获取到大外套下的所有子元素的ind和offsetTop
        // console.log(dom,dom.parentNode)
        let bigWrapChildList = dom.parentNode.children
        if (this.moverFlag) {
          for (let i = 0; i < bigWrapChildList.length; i++) {
            if (bigWrapChildList[i].className == 'topic_wrap') {
              let obj = {
                offsetTop: bigWrapChildList[i].offsetTop,
                offsetHeight: bigWrapChildList[i].offsetHeight,
                eleInd: bigWrapChildList[i].getAttribute('ind')
              }
              this.eleArrData.push(obj)
            }
          }
        }
        // console.log(eleArrData)
        this.moverFlag = false
      },
      // 删除所有div的编辑属性
      disable() {
        let disableDivList = document.getElementsByClassName('topic_content_title');
        for (let i = 0; i < disableDivList.length; i++) {
          disableDivList[i].removeAttribute('contenteditable')
        }
      },
      // 判断元素移动的距离
      ifDistance(array, domOffsetTop) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].offsetTop > domOffsetTop && i == 0 || array[i].offsetTop < domOffsetTop && domOffsetTop <= array[
              i].offsetTop + (array[i].offsetHeight / 2)) {
            return 0
          } else if (i + 1 >= array.length) {
            return array.length
          } else if (domOffsetTop > array[i].offsetTop + (array[i].offsetHeight / 2) && domOffsetTop <= array[i + 1].offsetTop +
            (array[i + 1].offsetHeight / 2)) {
            return i + 1
          }

        }
      },
      //编辑的可能比较多要获取滚动条的Top值
      getScrollTop(ele) {
        return ele.scrollTop
      },
      // 必填选择
      checkeSele() {
        let checke = document.getElementsByClassName('checke')
        for (let i = 0; i < checke.length; i++) {
          if (checke[i].parentNode.parentNode.getAttribute('mustFillIn') == null) {
            checke[i].parentNode.parentNode.setAttribute('mustFillIn', false)
          }
          checke[i].onclick = function(e) {
            window.event ? window.event.cancelBubble = true : e.stopPropagation();
            let type = this.parentNode.parentNode.getAttribute('mustFillIn')
            if (type == 'false') {
              this.parentNode.parentNode.setAttribute('mustFillIn', true)
            } else {
              this.parentNode.parentNode.setAttribute('mustFillIn', false)
            }
          }
        }
      },
      // 添加选项
      handleSele() {
        const _that = this
        let handle = document.getElementsByClassName('handle')
        for (let i = 0; i < handle.length; i++) {
          handle[i].onclick = function() {
            let parent = this.parentNode
            let BigType = parent.parentNode.parentNode.getAttribute('type')
            _that.$http({
              url: _that.$http.adornUrl(url.epiSelectsave.url),
              method: url.epiSelectsave.method,
              data: _that.$http.adornData({
                content:'新选项',
                questionId:parent.parentNode.parentNode.getAttribute('ids'),
                ifInput:0,
              })
            }).then((res)=>{
              if (res.data.code == 0) {
                let div = document.createElement('div')
                div.setAttribute('additional', false)
                div.setAttribute('ids', res.data.data.id)
                div.innerHTML =
                  `<div contenteditable="true" class="selsectA_dls" >新选项</div>
      								<div class="delSingle">
        							<div class="delSingleImg">
        								<img class="deleOne" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFAUlEQVRoQ9VaW2gcZRT+zmyyb6Lik5qCVrxGRbGgFbFeqhUUvKbgY8W2D0l2ziQQH7WPBpI5s0keUkUfBduaChaM11bEtGBR1HjFCzTVJ2nFtyQ7R/7ln2V2nN3ZbCab7MI87M65fTP/f/5zvrOELv9Q3vEPDw/3FQqFbara5zhOn7EfhuESES1VKpVzU1NTS3n6XDeAUql0veM4uwA8DuCpFoM7DuBEGIanyuXyLy3qpIq1DcDzvH1hGB4gonvWE4CqnnYc57Dv+2+2Y2fNAJj5OQCDAB5o4PAigD9ilxG7JnZd1kDvJIAZETm6FiAtAxgZGTHrOlDVp+MOiOiCqn4EoHqJyG/NAmDm7QB2m4uIdqvq5Ql7c0TkTk5OnmsFSEsAXNd9hIjMK746ZvRPAK8BmBWRv1pxlpRh5isBHASwH8BVsfvnVXVfEAQfZtnNBOC67hARTSUMHVpP4E2AvBy/p6rDQRBMNwPRFIDrugNE9HbC6N4gCI5kPZl27rfjryEAz/NuU9Vv4oGEYbijXC6fbSe4VnVKpdJdjuN8mdgXt/u+/22ajVQAg4ODV/T29p4C0B8piUjmcms1yFbkmFljcosrKyu7ZmZm/k7qpgbled5RVX02El5dXd0+PT39eyuO85IZGhq6tqenp5bRiOiY7/smhdd9/gfA5vn4Gn9YRD7JK7C12GHmhwB8HNMZSJ4TaQA+jR1Sh0TklbU4zVuWmY3/KDudFJEH6/ZH/IspD1T1DfubyfM72s3xeQGxZ4XZ1NVzgoheiJcddW+AmU8DuNs63/SnHz2ExFs4IyK1+qsGYHR09JZKpbJolf4BcPNmP/0YAHNi/wDgUvNboVDon5iY+L76RiIhz/M8VZ2030+IyBN5LYM87DDze7ZkN8toxPd9vw4AM78PYI919pKIjOfhOC8bzDwG4FVrb15EHksCqB0cqnpTEAQ/5eU8Dzuu695IRD9GtqKDtbqEbBsYla8XRaSuxM0jgDxsMPMFANV+olKpbDPtaRUAM+8E8IV18rWI3JmHw7xtMPNXAO6wdu8VkYUqgEQVeFxE6pqWeCBjY2OXLC8vj+YdHAAtFouT4+Pj/zayzcxzUd+tqtWquAogkYFERLwmRr6LF3k5A1kUkVub+DaZh6ub12airQYAzapeZk4HsEWWEIrF4kRbS6jrN3HXp1GbSuMd0HVZ9EjOmzfTnKVjfk09yCyAWooyVIeIHM602kEBZj5gmBDrspbqa8UcM79oeR4jc0RE9nYwvkxXzGzYkQEruF9EXq+m00jTkrQ/2xxr2Lb+rVROE9FixOKFYXhDRArXNTSu6y7EyNot2dAYMjgIAlP6VD91ALq+pbSbuXubegvAcC81WiUqmjJ32QYIpFCN2bSKLe7eidPonaAUk/iTFCMRzfm+/0xSLpWZM7OAMAwX4nT6JlOL5x3H2Zk2M2jId9qZwAdxxJ2gGJOUovGvqo82mhVk0etps4ENoxpTqEQTfNMZQSbjnMbZA+jUgCNzFpEJwG5qMyt4K9GJbeSIaZGInm80E4gv65YAGAUzMygWi7Nx2t0aMize5wA+U9V3s+gYS488CeB+APdFbFvtZCU6try8fDBtFpCWqVsGECl37Zg1id6WHWbCGJHB7R5lZ4hotmOD7mSUhhQOw3CPqhpaMqIms8DME9G84zjzEUmbpdDo/pqXUJajrvuzRxagjb7/HwopgE9AmjToAAAAAElFTkSuQmCC" alt="">
        								<img class="deleTow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFUklEQVRoQ91aXWzbVBT+jp04LRICtCfWxuk2SpwWEIhJUIQYP4MhDYm/bRKPQ2x9AAQDCR4ZjyCxgYCHbggekRhjQ2IShQIbQrRIIBCwxqGMNU5bntA2IdHGSXzQde3MMU7spm7XEClSknvuOee7vvfcc74TQoe/KG7/p3q6e6uJSppY6iWmXqGfiWeYrJlENVnqn52fidPmsgGc6U31l2VriwTaDsZDkZwjHLfAJ1I16dSmmfJUpDlNhNoGoKeTuwm0lwm3LssBxgSDD2mlynvt6FkyAF1VdoD5SRDd2cTgeQDTIEyDedqWIeoDow+w31cGzmM+CaK3NcP8cClAIgP4fX13upasvcGMh30GzgEYY/CYBGksa5T/aOVAQU1ttGBtJdBWAOJ9lVeeCMfkivzMNXPzpShAIgGYVFP3SmDxiHs8SucYONxNiZG+4j9/RjHml5nOXHb1PFeHCdgDYL1nfNYC7R4wyp+H6Q0FkM+kniLmN72KGHh5OY63APJSgx2ip3PF8lutQLQEoKvKTgAf+BTs0gzzSNjKtDPejr2mAPK9yvUk4efGlefNOaPyQzvORZ2TV5M3E+j7BrsWbsjNmL8E6QgEkO/BOklWTjEw6E7SDDN0u0V1MoqcrirsyhFw2qqZW3Kz+Ms/N9ApXVVEKHu0LkzSRq24cDaK4bhk9EzXBrDljWhHNcPcEQrAjvPAxT1O0j1aceHLuBxbih4903U32PrCM2en/574zxPQ08mv3EtKRJucYe5fitG4ZfOqsp+AxejEfFIrVe7y2mgAINIDEL3rCMx1UWJzuzE+LiDirljgqjjUi/cE8+PetKMBQD6jTBDjFltuDay+uwjep8CE73JFs55/1QFMqcpADTjtTLrQRYncpV59F4DzFPIArhC/ycBgv2FOis91AIV0ah8TH3BW/0TOMB+IaxvEoSevKp8QsN12mum5bKl8sAGAriqfAtjmGHtRM8xX4zAclw5dVV4A8Iqjb1QzzPv9AOoXB2TStLPlQlzG49Cjb0hlUWPd1eVerPYWEmVgTa656et5zTAbUtw4HIhDh64qInW36wm5JqdFeWoDyGcSQ8TSt46RnzTDvCkOg3Hr0FXlRwA32ueUrNtyxeq4DaAhCyQc14qmv2ip+6JncTnPK8/H7ZwkIny3eUAr4O9muvWMcsxTd9tZsQ3AG4EAfl0zKvuaKSmoyq/eJC9OICJpyxrmdU0BqMmDAD3rjURrCoBwrFXWqzcDsBa2kL2q3eZrbW2hjj/EHR9GnUjkqYBoUxg9EufhjaJL0DEMPhN4kdkAPCGKwcM5o3IoiuLVksmryb0EGrHteUJ9PZmbzCSfkJgOOw4d0Qxz12o5F8WOriqCHREsCSziPQPFyjuLWJyXIGkrEv/mfD3XRYnBNZZOi1TfTnGSFl3rksINBU0hrYy7ZO1aLWiIMZEtmUPuwv+/Skr7MHdyUe+E00ZaBVgxKjHs8AZQjeG0ip3cZZSPvDQ6Y+UpRT8YP8UoaPds0XzELxfIzIleQDVRG/fS6ZeSWgQwm6jKQ0E9g6Z8p9MT+KwB8SpQjAGUIizQfc16BS0J26DeAFaQagygEsEhPYJQxjmIs1+tBgciBJBQAGILiV6BJOF9XyW2Yi0mm0638FiznoB3W0cCYIPowTqSFZFMXaTdFzVdYOAbAr6GTB+H0TEOPfIgA3cQcLvLtnmcOso1czioFxAUdiMDcCd3bJvVj14w2SzRsEsGh11KzcYFWUsWj6xao9vviCCFLaZtTCxoSZeaDMMzSkyjEvGoS9KGTWg2vuQtFGao4/7sEQZopcf/BemIoE/FC7kxAAAAAElFTkSuQmCC" alt="">
        							</div>
        							<div class="Additional">
        								<img class="AdditionalImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADE0lEQVRoQ+1avYsTQRR/LwtBBEHEs9DGWi0sPK3EO7xCQQUL+wPxGknyNvkDvMMukJ2XBKLggTb2cieIhRhLBdFCLSwFr1ARUUEIYUcmJJjb3bnMZD/uPHbK7Pv6zW/mvZk3QbAcRLQMAKcB4KKlahLiX6WUa47jPPI877EyiDZWiegzABy20UlRdoWZl40BuK7rSSndFAOyNo2Is0YAiOgkALyx9pC+wkNTAAQAIhBPN/34Ij3Mjf363RSA2ri3AuYGazBLEET0HADGAZht4mHmyQHEZWv3M1Cr1Y75vj8npTwUmK1zmtl7EXdWx/S7xWLxdb1e/6WzuSUDRLQGAJcTDGgaUxuIeFsIcTdKWQuAiN4BwPFpPKahUygUFjzPexa0HQlAk2HSiMvYJiJ+7Pf7s+12++e4kg5AKLcae0pRUEp5odlsPjUBICMqbJKb0xTmxDqjYyAEgJnnTb0mIWdaKHMAScy2Jj0anbVyBnQM1Gq1g/1+/yoizvd6vaVOp/Pbhq1t3wNBapnZ6Jg+ArmtAIhInc9VLRkfVneFHECwkNnUgZwBAMiXkOkSKpfL5wuFwtmIFBk6x0SlUV0TIBMGiOjlsKVok+JDsoi4VwjxJ3DKTLcSE9EiANyPFfk/5VVmvpE1gMQ6c1LKpWazeS9TAMpZpVK5AwCLiLgnBhNdx3GuNRqNb5kDUA5LpdKM4zhRd+dQJQaAUOuRmSPbkZlsYt2s54VMX8gUW8GrrepPbe6NElGsK2WKDCgAm4KNWAVP8D8HsJIEgP0A8AkA9o1myPf9hVarFWpMbbGPogrZJAY2mPlIbAAqKCJSjx/qEUSNV8x8xibVarKQFgAiCiFEVflIBMAQhFqvR5n5gU3wQ10dA8FN/EOlZ2Z+O/KRGADboKcpZFE+cgBxZn6ka1qJdy0DXwBgZgzdTng+BUS8KYToTGIYK5XKKiJenySY9Xd1aGw0Gh8m+cVqtXrJ9/31SYIZf19n5ismPgcdtB32SvOemU+YBD8oZCNB13VPSSlVNVV/ozlgaiBBucHp0/b1/y+YkUvQA24oSQAAAABJRU5ErkJggg==" alt="">
        								<img class="AdditionalActive" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADEElEQVRoQ+2aPWsUURSG33ciQQRBxFhokyI7C8bCwsRKskELBRUs7ANiGhFmZ3+ACXbCzAaEKBjQxl4SQSwkSakgWmgws6lEU6iIqKgg7JEZsrCZvZOdu/MRDZMyc76ee+65Z+6ZJTT/TFumIBgFcVZTNbm44BOIeQEeNlw+8g1Sx6pZkw8QHNLRyVB22nM5FRvArIkLQTXDgLRNUzASC6BkyTEaeKntIWMFAR7EAijbYglQb49HBEsZx6c0T6LS9uBLLICgcIHrIYvBHswTolSVxRBAvCIuAFJK087PwFBNjhhNVEAc3FSwxJhqESlYTmlx0Wxiqa8fL1Zv8nuUzS0zUK7JvAjOpxVQT3aIdQI3Vh3eUelHApi2vAYw3JPTbJROey6fhk0rASJOmGzCim/Va/7ByNotfmtXUQKo/hnfT3aSBnHmrcMnXQFMWyTcYcn0ilMDsWujjNpCHQCNOsc1HCcWjdsoC4DESx1hoMhAuIh1a8CsyQEILgIY3/Ubkyuz/KGTrW3PQLi4PJexXtNbkNsKMGRJxTCwmOSuUAAkqYEiAwCKLRR3C5m2nAJwUnFEdrzHqI7RqCFALhkwbXkGYFTnfFfJ/hTseV/nr/ZnmQOUbJkgcC9p8Bv6c57LK/kCpDuZm/Rc3s0VwHdWrsltEUwA2N1rJvxpHg1c8hx+zh3Adzh0TQbQ13l3VnVif8oQBl2boXIcmXkNbLXiRSOLaGRCLIXnTiIY65iNqu7EOq/TWWVgA6B9Et25EQSP+V8DANOJAQYt2ddv4B2AvW1LpBxMRdWSqoi7ZoBY9xweTgzgB1WypU7A2gjwuefyhM5Rqw1A1D2Htu8jFYDgiLWkQgODDZf3dYL3ZbcA2DQ8JvDVP54bM3zV8pEagG7QvTQylY8CIMnKt3TjduIdmoGqfAQx0KL7Rz6fAoKrXp2z3TLs18AcgMvdBPN+3iSG1xyudPPLki3nCCx0E8zzOYmFVYcX4vgMJmj/2FeaN57Lo3GCDxpZS7BcleNNwiKCn9Hsj2sgLbngskMs6379/wswWKA5yAtM5wAAAABJRU5ErkJggg==" alt="">
        								<div class="AdditionalTitle">
      											<div>
      												追加空格
      											</div>
      										</div>
      									</div>
      								</div>`
                if (BigType == 'radio') {
                  div.className = 'topic_content_title radio'
                  parent.insertBefore(div, this)
                } else if (BigType == 'checkbox') {
                  div.className = 'topic_content_title checkbox'
                  parent.insertBefore(div, this)
                }
                _that.delSingleSele()
                _that.AdditionalSpan()
                _that.csh()
              }
            }).catch((err)=>{

            })
          }
        }
      },
      // 追加空格
      AdditionalSpan() {
        const _that = this
        let AdditionalList = document.getElementsByClassName('Additional')
        for (let i = 0; i < AdditionalList.length; i++) {
          AdditionalList[i].onclick = function() {
            let flag = this.parentNode.parentNode.getAttribute('additional')
            let classNames = this.parentNode.parentNode.children[0].className
            if (flag == 'true') {
              let newClassName = classNames.replace('AdditionalDiv', '')
              this.parentNode.parentNode.children[0].className = newClassName
              this.parentNode.parentNode.setAttribute('additional', false)
            } else if (flag == 'false') {
              this.parentNode.parentNode.children[0].className = classNames + ' AdditionalDiv'
              this.parentNode.parentNode.setAttribute('additional', true)
            }
            let isinp = this.parentNode.parentNode.getAttribute('additional')=='true'?1:0
            _that.$http({
              url: _that.$http.adornUrl(url.epiSelectupdates.url),
              method: url.epiSelectupdates.method,
              data: _that.$http.adornData({
                content:this.parentNode.previousElementSibling.innerText,
                questionId:this.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('ids'),
                ifInput:isinp,
                id:this.parentNode.parentNode.getAttribute('ids')
              })
            }).then((res)=>{
              console.log(res)
            }).catch((err)=>{

            })
          }
        }
      },
      // 删除选项
      delSingleSele() {
        const _that = this
        let delSingle = document.getElementsByClassName('delSingleImg')
        for (let i = 0; i < delSingle.length; i++) {
          delSingle[i].onclick = function() {
            _that.$http({
              url: _that.$http.adornUrl(url.epiSelectdelete.url),
              method: url.epiSelectdelete.method,
              params: _that.$http.adornParams({
                id:this.parentNode.parentNode.getAttribute('ids')
              })
            }).then((res)=>{
              this.parentNode.parentNode.remove()
              _that.handleSele()
            }).catch((err)=>{

            })

          }
        }
      },
      cli(index) {
        let topicBig_wrap = document.getElementsByClassName('topicBig_wrap')
        for (let i = 0; i < topicBig_wrap.length; i++) {
          for (let j = 0; j < topicBig_wrap.length; j++) {
            topicBig_wrap[j].style.borderColor = 'transparent'
          }
          topicBig_wrap[index].style.borderColor = 'none'
        }
      },
      clkxs() {
        let topicBig_wrap = document.getElementsByClassName('topicBig_wrap')
        for (let i = 0; i < topicBig_wrap.length; i++) {
          topicBig_wrap[i].onclick = function() {
            for (let j = 0; j < topicBig_wrap.length; j++) {
              topicBig_wrap[j].style.borderColor = 'transparent'
            }
            this.style.borderColor = 'none'
          }
        }
      },
      csh() {
        const _that = this
        // 必填选择
        _that.checkeSele()
        // 添加选项
        _that.handleSele()
        // 追加空格
        _that.AdditionalSpan()
        // 删除选项
        _that.delSingleSele()
        // 获取所有的题目进行排序
        _that.subject()

        _that.getDrags()
        _that.topicBig()
        _that.allTopic_wrap()
        _that.delTk()
        _that.clkxs()
        _that.DivContentChange()
        _that.subjectUpdata()
      },
      addTk() {
        let Html = this.$refs.addCategoryTemP.addCategory()
        let editContent = document.getElementsByClassName('editContent')[0]
        console.log(editContent)
        let div = document.createElement('div')
        div.className = 'category_wrap'
        div.innerHTML = Html
        editContent.appendChild(div)
        this.csh()
        this.wrapFlag = true
      },
      delTk() {
        const _that = this
        let del_category = document.getElementsByClassName('del_category')
        for (let i = 0; i < del_category.length; i++) {
          del_category[i].onclick = function() {
            this.parentNode.parentNode.remove()
            _that.csh()
          }
        }
      },
      addTkDT(item,id) {
        let topicBig_wrap = document.getElementsByClassName('topicBig_wrap')
        let html = this.$refs.SingleTopic.ifSingleTopic(item,this.tkTypeListsDatas,item.topicId)
        let div = document.createElement('div')
        div.setAttribute('type', item.type)
        div.className = 'topic_wrap'
        div.innerHTML = html
        topicBig_wrap[this.commomTopicBigInd].appendChild(div)
        this.wrapFlag = true
        this.csh()
        this.$http({
          url: this.$http.adornUrl(url.tkTypeListsave.url),
          method: url.tkTypeListsave.method,
          data: this.$http.adornData({
            title:item.title,
            remark:'',
            isAnswer:1,
            tikuId:id,
            topicId:item.topicId,
            orderNum:div.getAttribute('ind')
          })
        }).then((res)=>{
          if (res.data.data.id) {
            div.setAttribute('ids',res.data.data.id)
          }
        }).catch((err)=>{

        })
      },
      // 渲染题目
      init(data) {
        const _that = this
        if (data.length != 0) {
          this.radio = data[0].tikuType
          this.form = {
            name: data[0].registerName,
            keyWrod: data[0].remark
          }
          this.$http({
            url: this.$http.adornUrl(url.tkTypeList.url),
            method: url.tkTypeList.method,
            params: this.$http.adornParams({})
          }).then((res)=>{
            this.typeLists = res.data.data
            // console.log(this.typeLists)
          }).catch((err)=>{

          })

          let titleHtlm = ''
          let strx = ''
          data.forEach(eles => {
            titleHtlm +=
              `<div class="category_wrap">
                          <div class="category_title_wrap">
                            <div class="category_title" contenteditable="true">${eles.registerName}</div>
                            <!-- <div class="del_category">删除类目</div> -->
                          </div>
                          <div class="topicBig_wrap">`
            if (eles.epiQuestionEntityList.length != 0) {
              eles.epiQuestionEntityList.forEach(ele => {
                let ind = ''
                if (ele.topicId == 1 || ele.topicId == 5) {
                  ind = 'radio'
                }else if (ele.topicId == 2 || ele.topicId == 7) {
                  ind = 'checkbox'
                }else if (ele.topicId == 4) {
                  ind = 'oneRow'
                }else if (ele.topicId == 6) {
                  ind = 'multiRow'
                }else if (ele.topicId == 9) {//地址
                  ind = 'site'
                }else if (ele.topicId == 8) {
                  ind = 'dateline'
                }else if (ele.topicId == 10) {
                  ind = 'img'
                }else if (ele.topicId == 11) {//说明
                  ind = 'explain'
                }

                strx +=
                  `<div class="topic_wrap" ids='${ele.id}' type="${ind}" mustfillin="${ele.isAnswer==1?'true':'false'}" >`
                ele.type = ind
                // console.log(ele)
                let xs = _that.$refs.SingleTopic.ifSingleTopic(ele,_that.tkTypeListsDatas,ele.topicId)
                // console.log(xs)
                strx += xs
                strx += `</div>`
              })
            }
            titleHtlm += strx
            titleHtlm += `</div></div>`
          })
          let editContent = document.getElementsByClassName('editContent')[0]
          editContent.innerHTML = titleHtlm
          _that.csh()
        }
      },
      // 抓取数据
      capture() {
        const _that = this
        let data = []
        let num = document.getElementsByClassName('category_wrap')
        for (let i = 0; i < num.length; i++) {
          let dataObj = {}
          let BigTitle = num[i].children[0].children[0].innerText
          let topicList = []
          let childrens = num[i].children[1].children
          for (let j = 0; j < childrens.length; j++) {
            let obj = _that.getMustFillin(childrens[j])
            let title = ''
            let selectList = []
            let selectListChild = childrens[j].children[0].children[1].children
            if (selectListChild.length != 0) {
              selectList = []
              for (let l = 0; l < selectListChild.length; l++) {
                if (l == 0) {
                  title = selectListChild[l].innerText
                } else {
                  let iftitle = selectListChild[l].className
                  if (iftitle.indexOf('topic_content_title') != -1) {
                    let objs = {
                      title: selectListChild[l].children[0].innerText,
                      // blankFlag: selectListChild[l].getAttribute('additional'),
                      ifInput: selectListChild[l].getAttribute('additional')=='true'?1:0,
                    }
                    selectList.push(objs)
                  }
                }
              }
            }
            obj.content = title
            obj.epiSelectEntity = selectList
            topicList.push(obj)
          }
          dataObj.registerName = _that.form.name
          dataObj.remark = _that.form.keyWrod
          dataObj.tikyType = _that.radio
          dataObj.epiQuestionEntityList = topicList
          data.push(dataObj)
        }
        data.forEach(ele=>{
          if (ele.epiQuestionEntityList != 0) {
            ele.epiQuestionEntityList.forEach(eles=>{
             if (eles.topicId == 1){
               eles.epiSelectEntity.forEach(elex=>{
                 if(elex.ifInput == 1){
                   eles.topicId = 5
                 }
               })
             }else if (eles.topicId == 2){
               eles.epiSelectEntity.forEach(elex=>{
                 if(elex.ifInput == 1){
                   eles.topicId = 7
                 }
               })
             }
            })
          }
        })
        return data
        // console.log(data)
      },
      // 获取是否必填
      getMustFillin(ele) {
        let ind = ''
        let types = ele.getAttribute('type')
        if (types == 'radio') {
          ind = 1
        }else if (types == 'checkbox') {
          ind = 2
        }else if (types == 'oneRow') {
          ind = 4
        }else if (types == 'multiRow') {
          ind = 6
        }else if (types == 'site') {//地址
          ind = 9
        }else if (types == 'dateline') {
          ind = 8
        }else if (types == 'img') {
          ind = 10
        }else if (types == 'explain') {//说明
          ind = 11
        }
        let obj = {
          isAnswer: ele.getAttribute('mustfillin')=='true'?1:0,
          topicId: ind
        }
        return obj
      },
      delOne () {
        this.form.name = ''
        this.form.type = ''
        this.form.keyWrod = ''
        let category_wrap = document.getElementsByClassName('category_wrap')[0]
        category_wrap.remove()
      },
      //题目修改
      subjectUpdata () {
        const _that = this
        let saveTipic_dl = document.getElementsByClassName('saveTipic_dl')
        for (let i=0;i<saveTipic_dl.length;i++) {
          saveTipic_dl[i].onclick = function (e) {
            _that.$http({
              url: _that.$http.adornUrl(url.tkTypeListupdate.url),
              method: url.tkTypeListupdate.method,
              data: _that.$http.adornData({
                title:this.parentNode.previousElementSibling.children[1].children[0].innerText,
                remark:'',
                isAnswer:this.parentNode.parentNode.getAttribute('mustfillin')=="true"?1:0,
                tikuId:_that.alldata.id,
                id:this.parentNode.parentNode.getAttribute('ids'),
                topicId:this.parentNode.previousElementSibling.children[2].value,
                orderNum:this.parentNode.parentNode.getAttribute('ind')
              })
            }).then((res)=>{
              if (res.data && res.data.code == 0) {
                this.$message.success('保存成功')
              }
            }).catch((err)=>{

            })
          }
        }
      },
      // 选项内容更改时
      DivContentChange () {
        const _that = this
        let selsectA_dls = document.getElementsByClassName('selsectA_dls')
        for (let i=0;i<selsectA_dls.length;i++) {
            //选项的修改
          selsectA_dls[i].addEventListener('focus',function(e){
              _that.focusData = this.innerText
          })
          selsectA_dls[i].addEventListener('blur',function(e){
                if (_that.focusData != this.innerText) {
                  let isinp = this.parentNode.getAttribute('additional')=='true'?1:0
                  _that.$http({
                    url: _that.$http.adornUrl(url.epiSelectupdates.url),
                    method: url.epiSelectupdates.method,
                    data: _that.$http.adornData({
                      content:this.innerText,
                      questionId:this.parentNode.parentNode.parentNode.parentNode.getAttribute('ids'),
                      ifInput:isinp,
                      id:this.parentNode.getAttribute('ids')
                    })
                  }).then((res)=>{
                    console.log(res)
                  }).catch((err)=>{

                  })
                }
              })
        }
      },
      open(data) {
        this.$confirm('你将删除此道题目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已成功删除'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      getalldata (data) {
        this.alldata = data
      },
      Topicinitxs (data) {
        this.tkTypeListsDatas = data
      }
    },
    mounted() {
      // 全局的鼠标移动事件
      const _that = this
      window.onmousemove = function(e) {
        // 判断是否选中元素进行移动
        if (_that.data.flag) {
          let html = document.getElementsByTagName('html')[0]
          let TopVal = _that.getScrollTop(html)
          _that.data.ele.className = 'topic_wrap topic_wrap_Abs'
          _that.data.ele.style.width = _that.data.width + 'px'
          _that.data.ele.style.top = (e.clientY - _that.data.top - _that.data.clickDomY + TopVal - 108) + 'px'
          let leftxs = 0
          if (_that.sidebarFolds) {
            leftxs = 84
          } else {
            leftxs = 250
          }
          _that.data.ele.style.left = (e.clientX - _that.data.left - _that.data.clickDomX - leftxs) + 'px'
          _that.allChildList(_that.data.ele)
          let domOffsetTop = _that.data.ele.offsetTop + (_that.data.ele.offsetHeight / 2)
          let indexs = _that.ifDistance(_that.eleArrData, domOffsetTop)
          if (_that.insertionIndex != indexs) {
            let ifDistanceEles = document.getElementById('cr')
            if (ifDistanceEles) {
              ifDistanceEles.remove()
            }
            _that.cli(_that.commomTopicBigInd)
            let BigWrap = document.getElementsByClassName('topicBig_wrap')[_that.commomTopicBigInd]
            if (indexs < _that.eleArrData.length) {
              let allList = BigWrap.children
              if (indexs == 0) {
                let newItem = document.createElement("div")
                newItem.className = 'ifDistanceEles'
                newItem.id = 'cr'
                BigWrap.insertBefore(newItem, allList[0]);
                _that.insertionIndex = indexs
              } else {
                let newItem = document.createElement("div")
                newItem.className = 'ifDistanceEles'
                newItem.id = 'cr'
                BigWrap.insertBefore(newItem, allList[Number(_that.eleArrData[indexs].eleInd) - 1]);
                _that.insertionIndex = indexs
              }
            } else if (indexs => _that.eleArrData.length) {
              let newItem = document.createElement("div")
              newItem.className = 'ifDistanceEles'
              newItem.id = 'cr'
              BigWrap.appendChild(newItem)
              _that.insertionIndex = _that.eleArrData.length
            }
          }

        }
      }
      // 全局的鼠标抬起事件
      window.onmouseup = function(e) {
        if (_that.data.flag) {
          let ifDistanceEles = document.getElementById('cr')
          if (ifDistanceEles) {
            _that.oderEle = ifDistanceEles
            ifDistanceEles.innerHTML = _that.data.ele.innerHTML
            ifDistanceEles.setAttribute('type', _that.data.type)
            ifDistanceEles.className = 'topic_wrap'
            // console.log(_that.data.ele.className)
            ifDistanceEles.id = ''
            ifDistanceEles.setAttribute('ids',_that.data.ele.getAttribute('ids'))
            ifDistanceEles.style.transition = 'all .5s'
            setTimeout(() => {
              ifDistanceEles.style.transition = 'all 0s'
            }, 510)
            setTimeout(() => {
              _that.$http({
                url: _that.$http.adornUrl(url.tkTypeListupdate.url),
                method: url.tkTypeListupdate.method,
                data: _that.$http.adornData({
                  title:ifDistanceEles.children[0].children[1].children[0].innerText,
                  remark:'',
                  isAnswer:ifDistanceEles.getAttribute('mustfillin')=="true"?1:0,
                  tikuId:_that.alldata.id,
                  id:ifDistanceEles.getAttribute('ids'),
                  topicId:ifDistanceEles.children[0].children[2].value,
                  orderNum:ifDistanceEles.getAttribute('ind')
                })
              }).then((res)=>{
                // console.log(res)
              }).catch((err)=>{

              })
            }, 110)
            _that.data.ele.remove()
          }
          _that.restore()
          _that.clearData()
          _that.subject()
          _that.allTopic_wrap()
          _that.subjectUpdata()
          clearTimeout(_that.setTimeouts)
        }
      }
      _that.csh()
    },
    computed: {
      getshowIndex() {
        return this.$store.state.common.sidebarFold
      }
    },
    watch: {
      getshowIndex: function(newval, oldval) {
        this.sidebarFolds = newval
      }
    },
    components: {
      addCategoryTemP,
      SingleTopic
    }
  }
</script>

<style>
  .questionBank_right_wrap {
    padding: 20px;
    width: 70%;
  }

  .formTitle {}

  .formTitle /deep/ .el-input--medium .el-input__inner {
    width: 320px;
  }

  .formTitle /deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #2672ff;
  }

  .formTitle /deep/ .el-radio__input.is-checked .el-radio__inner {
    border-color: #2672ff;
    background: #2672ff;
  }

  .formTitle /deep/ .el-input__inner:focus {
    border-color: #2672ff;
  }
  .formTitle /deep/ .el-radio-group {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    font-size: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .formTitle /deep/ .el-radio+.el-radio {
     margin-left: 0px;
  }
  .editContent {
    /* background: #f4f4f4; */
    min-height: 500px;
  }




  * {
    margin: 0;
    padding: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .topicBig_wrap {
    width: 100%;
    margin: auto;
    /* background: #f4f4f4; */
    padding: 23px;
  }

  .topic_wrap {
    border-radius: 3px;
    box-shadow: 1px 1px 3px #999;
    background: #F9FBFF;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    margin: 20px 0;
  }

  .topic_wrap_Abs {
    position: absolute !important;
    z-index: 9999;
    margin: 0;
  }

  .topic_wrap:hover .operations {
    display: flex;
  }

  .topic_wrap:hover .mustFillIn {
    display: flex;
  }

  .topic_content_wrap {
    display: flex;
  }

  .topic_sort {
    border-radius: 3px 0 0 3px;
    min-width: 3%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #9CC6FE;
    color: #Fff;
  }

  .topic_content {
    width: 60%;
    padding: 20px 25px;
  }

  .topic_content>.topic_content_title {
    border: 1px dashed transparent;
  }

  .topic_content>.topic_content_title:hover {
    border: 1px dashed #666;
  }

  .topic_content>.topic_content_title:focus {
    background: #f1f1f1;
  }

  .topic_content_title {
    outline: none;
    position: relative;
  }

  .topic_content_title:hover .delSingle {
    visibility: visible;
  }

  .topic_content_title>div {
    outline: none;
  }

  /* 删除选项的样式 */
  .delSingle {
    position: absolute;
    right: -60px;
    top: 0;
    cursor: pointer;
    transition: all .2s;
    visibility: hidden;
    display: flex;
  }

  .delSingleImg {
    margin-right: 10px;
  }

  .delSingle img {
    width: 20px;
    height: 20px;
    display: block;
  }

  .delSingleImg:hover .deleOne {
    display: none;
  }

  .delSingleImg:hover .deleTow {
    display: block;
  }

  .delSingle .deleTow {
    display: none;
  }

  /* 追加空格的样式 */
  .Additional {
    position: relative;
  }

  .Additional img {
    width: 20px;
    height: 20px;
    display: block;
  }

  .Additional:hover .AdditionalImg {
    display: none;
  }

  .Additional:hover .AdditionalActive {
    display: block;
  }

  .Additional:hover .AdditionalTitle {
    display: block;
  }

  .Additional .AdditionalActive {
    display: none;
  }

  .AdditionalTitle {
    position: absolute;
    width: 66px;
    font-weight: 300;
    font-size: 12px;
    top: -35px;
    left: -20px;
    padding: 5px 9px;
    border-radius: 3px;
    background: #000000;
    border: none;
    display: none;
    color: #fff;
  }

  .AdditionalTitle>div {
    position: relative;
  }

  .AdditionalTitle>div:before {
    content: '';
    position: absolute;
    bottom: -7px;
    background: #000000;
    left: 0;
    right: 0;
    margin: auto;
    width: 10px;
    height: 10px;
    border: 1px solid #000000;
    border-top: 0px;
    border-left: 0px;
    transform: rotate(45deg);
  }

  .AdditionalDiv:after {
    content: '';
    display: inline-block;
    width: 70px;
    height: 18px;
    border: 1px solid #d8d8d8;
    border-radius: 2px;
    background-color: #fff;
    margin-left: 14px;
    vertical-align: top;
    margin-top: 2px;
  }

  /* 单选框 */
  .radio {
    font-weight: 300;
    margin-top: 5px;
    padding-left: 25px;
  }

  .radio:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 5px;
    margin: auto;
    width:14px;
    height:14px;
    border-radius: 50%;
    border: 1px solid #999999;
    background: #fff;
  }

  /* 复选框 */
  .checkbox {
    font-weight: 300;
    margin-top: 5px;
    padding-left: 25px;
  }

  .checkbox:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 5px;
    margin: auto;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #999999;
    background: #fff;
  }

  .operations {
    display: flex;
    position: absolute;
    right: 15px;
    top: 10px;
    display: none;
  }

  .operations>div {
    margin-right: 10px;
  }

  .operations>div:last-child {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .big {
    overflow: hidden;
  }

  .ifDistanceEles {
    height: 10px;
    background: #2672FF;
  }

  .drag {
    position: relative;
  }

  .drag:hover .dragChild {
    visibility: visible;
  }

  .drag:hover .notActiveImg {
    display: none;
  }

  .drag:hover .dragActiveImg {
    display: block;
  }

  .drag:active .dragChild {
    visibility: hidden;
  }

  .drag>img {
    width: 34px;
    height: 33px;
  }

  .notActiveImg {
    display: block;
  }

  .dragActiveImg {
    display: none;
  }

  .dragChild {
    position: absolute;
    top: -35px;
    left: -33px;
    width: 100px;
    background: #fff;
    transition: all .5s;
    visibility: hidden;
  }

  .dragChilds {
    position: relative;
    text-align: center;
    font-size: 12px;
    border: 1px solid #000;
    border-radius: 3px;
    padding: 5px;
    background: #000;
    color: #fff;
  }

  .delChilds {
    position: relative;
    text-align: center;
    font-size: 12px;
    padding: 5px;
    border-radius: 3px;
  }

  .dragTriangle {
    width: 10px;
    height: 10px;
    border: 1px solid #000;
    transform: rotate(45deg);
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    background: #000;
    border-top: 0px;
    border-left: 0px;
  }

  .del {
    position: relative;
  }

  .del:hover .delChild {
    visibility: visible;
  }

  .delChild {
    border-radius: 3px;
    width: 65px;
    position: absolute;
    top: -35px;
    left: -25px;
    transition: all .5s;
    background: #000;
    color: #fff;
    visibility: hidden;
  }

  .del>img {
    width: 14px;
    height: 15px;
    cursor: pointer;
  }

  .deldragActiveImg {
    display: none;
  }

  .del:hover .deldragActiveImg {
    display: block;
  }

  .del:hover .delnotActiveImg {
    display: none;
  }

  #ActiveTopic_wrap {
    border: 1px solid #2672ff;
  }

  #ActiveTopic_wrap .handle {
    display: flex;
  }

  .handle {
    font-weight: 300;
    display: flex;
    align-items: center;
    color: #0091FF;
    cursor: pointer;
    display: none;
    margin-top: 10px;
    width: 85px;
  }

  .handle>img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  /* 滑块开关外套 */
  .mustFillIn {
    position: absolute;
    bottom: 20px;
    right: 23px;
    display: flex;
    align-items: center;
    font-weight: 300;
    display: none;
  }

  .mustFillIn>input {
    margin-left: 5px;
  }

  /* 滑块开关 */
  .checke {
    position: relative;
    -webkit-appearance: none;
    width: 40px;
    height: 20px;
    line-height: 44px;
    background: #eee;
    border-radius: 30px;
    outline: none;
    cursor: pointer;
  }

  .checke:before {
    position: absolute;
    left: 0;
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #eee;
    box-shadow: 0px 0px 5px #ddd;
    transition: all 0.2s linear;
  }

  .checke:checked {
    background: #2672FF;
  }

  .checke:checked:before {
    left: 20px;
    transition: all 0.2s linear;
  }

  .dzs {
    width: 100px;
    height: 30px;
    background:rgba(255,255,255,1);
    border-radius:3px;
    border:1px solid rgba(221,221,221,0.82);
    margin-right: 10px;
    text-align: left;
    padding-left: 10px;
    box-sizing: border-box;
    font-weight: 100;
    line-height: 30px;
    font-size: 12px;
    position: relative;
  }
  .dzs:before{
    content: '>';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 12px;
    margin: auto;
    font-family: '黑体';
    transform: rotate(90deg);
  }
  .dzx {
    width: 100%;
    height: 30px;
    background:rgba(255,255,255,1);
    border-radius:3px;
    border:1px solid rgba(221,221,221,1);
    margin-top: 20px;
    font-weight: 100;
    line-height: 30px;
    font-size: 12px;
    padding-left: 10px;
  }

  .q_option_img {
    width: 100px;
    height: 100px;
    border:1px dashed rgba(0,0,0,0.15);
    text-align: center;
    vertical-align: middle;
    color: #aaa;
    font-size: 14px;
    cursor: pointer;
    margin-top: 20px;
    background: #fff;
  }

  .q_option_img>img {
    width:29px;
    height:29px;
    margin-top: 15px;
  }

  .q_option_img>p {
    font-size: 12px;
    margin: 0;
  }

  .q_option_img>p:nth-child(2) {
    margin-top: 10px;
  }

  .category_title_wrap {
    background: #fff;
    display: flex;
    justify-content: space-between;
    padding: 10px 12px;
  }
  .category_title:before{
    content: '';
    position: absolute;
    width: 2px;
    height: 65%;
    background: rgba(63,146,254,1);
    left: -8px;
    top: 0px;
    bottom: 0;
    margin: auto;
  }
  .category_title {
    outline: none;
    font-size: 14px;
    font-weight: 600;
    position: relative;
  }

  .del_category {
    width:94px;
    height:30px;
    background:rgba(63,146,254,1);
    border-radius:3px;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    color: #fff;
    font-size: 12px;
    display: none;
  }

  .del_category>img{
   width: 12px;
   height: 15px;
   margin-right: 5px;
   margin-top: -4px;
  }
  .topicBig_wrap {
    border: 1px solid transparent;
    box-sizing: border-box;
  }
  .selecteds_dl{
    outline: none;
    height: 23px;
    width: 110px;
    border-radius: 3px;
    padding: 0px 10px;
    box-sizing: border-box;
    margin-top: 20px;
    background: #fff;
  }
  .saveTipic_dl{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .saveTipic_dl>img{
    width: 14px;
    height: 15px;
  }
  .saveTipic_dl:hover .dragChild{
    visibility: visible;
  }
  .saveTipic_dl>.dragChild{
    left: -44px;
  }
  .saveTipic_dl:hover .dragActiveImgs{
    display: block;
  }
  .saveTipic_dl:hover .notActiveImgs{
    display: none;
  }
  .notActiveImgs{
    display: block;
  }
  .dragActiveImgs{
    display: none;
  }
</style>
