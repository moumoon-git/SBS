<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: 'SingleTopic',
    data() {
      return {

      }
    },
    methods: {
      selects(data,topicIds){
        // console.log(topicIds)
        let str ='<select class="selecteds_dl" >'
        data.forEach((ele,index)=>{
          if (index+1 == topicIds) {
            str+=`<option selected value ="${ele.id}">${ele.topicName}</option>`
          }else{
            str+=`<option value ="${ele.id}">${ele.topicName}</option>`
          }
        })
        str+='</select>'
        return str
      },
      ifSingleTopic(item,datas,topicId) {
        const _that = this
        if (item.type == 'radio') {
          let str = `<div class="topic_content_wrap">
						<div class="topic_sort"></div>
						<div class="topic_content">
							<div class="topic_content_title" contenteditable="true">
								${item.title}
							</div>`
              let str2 = ''
              if (item.epiSelectEntityList.length!=0) {
                item.epiSelectEntityList.forEach(ele=>{
                  str2+=`<div class="topic_content_title radio " additional='${ele.ifInput== 1?'true':'false'}' ids="${ele.id}">
                        <div contenteditable="true" class='${ele.ifInput== 1?'AdditionalDiv selsectA_dls':'selsectA_dls'}'>${ele.content}</div>
                        <div class="delSingle">
                          <div class="delSingleImg">
                            <img class="deleOne" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAADXklEQVRYR82YTWhUVxiG3/eMY1qoCWJFoSVQpaLoQko1k2mSVtBUyLJJsLgIZhK10IIb3XTdjd0UKqQmM5ZAQ0tMly4MQmN+JhO1hYISUbEgLioqYlqoaZzzljN6J/fe2NwxqfXe3fn5vvPc7+/8EM/59U3pLWPxIYAGAFsE1EJYVVJD/EHgFoBpAOPW4Gx3HX97niVYyeTBQSVmatEGi08BpUtLV/YJYB4GJ6pv4XR7O4tRYpGKc5PabaWvCWyOUrbYuICrhvwsU89zi837V6Bvf9IrxVfxFYWDkiLBK4El6TT1Jv7CkQO7+OhZMs9c6NSo1moFzgjasUCItBTGAJyBwaQFrte8hgdu3sM/sdoAb8OiHkCLiEZIJqyD4EU+RktnE+8uHAv1PIUZFRR2kTPTj8UEPz9Yx2uVWKR3SpsSRX0h4KNw3BG8ysdoCkMFLOTcZKvgYEKW4U1Z7O9uYKESkPCcvnGlaDAAaIN/zFnKzKLJ774AULagb2B1KKCQHEkatHbU8f5SYDyZ/imtmbMYgvRBQI/hya4UD3t9ZSCXTQCGAwFMjhSTaD70LueWA+PJnrykZGIOw34oF+gAmr3sKwG5OvPwTV0OpjZvJhPYuVzLhH+kZKkiLvjd50pCzW1uc3WqBJQtaB+svvcJS5bppcZMlDWfxJTygUA3/LgrxR+eAOU1Dug9nx+HMmnTFqV4OeO5vD0toHVeBye60mxgbkwblNCNMi1prcGWSlN7qVCuJBiLaV+dkhLcyNykDkvq8RQLON+dNsFMWOqqEXK5vEYEvV/2DPmJA/pO0v55d/FYJs0vXxBDQG0ur6OCjvuABhzQz5LeKXcaNmZSHA+lageFrSAWbAMVgQtWxJViEv3+EpIrqEFWbhsqfSR/YXZSdyG9XnaZ4fruFO947eyEHQaxp6KFIyYRHO6sx96ntQd9Ba2j1e9lMfIes3k9AlTldVZXs6p9G/927Z683khCt/8LmLIVityeaeSvrj14WStnZjTry7TZGALFzWWxC+o4pn2gMBI8n0nzJRbGuG0dLuVitbmWgOJ2/IjdAc1ZKVZH2PK+FadDvoOK3TXIQcXqoui5LuoqLWnMgP/PVdqDitVjg//8E5vnGD9UrB6swqdFd23CCjS/qCe9fwBiJGybvpXr+wAAAABJRU5ErkJggg==" alt="">
                            <img class="deleTow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC5ElEQVRYR82YTUgVURTHf+c9SjcG9kFBEGQUSS0iKMrUWpQFLlMoXESbLNDRTW1aRIs2BeIbhbJNBEmBtnSRtLB8WSQFQZFUGESLoi/IjRbOifumec6bXs34NLizu3PPx/+e73uF+X49uh6Pg0AtQjXKOqDit5gphHcoL4EsKe7QLm/no0ISETdrmlqaEdpQaoBkfKAIYyi9ZBlgQGbj9MULdnU/Sg+wOU5YzP4EQjuO3P0X3d8BXdNypugGTuTOuRifoMBVKujkuEwXE1lckaurUIaAHUWYPGAUYQiPh8BrvvEtR1dJJbCRFLtRGoE6IFVExjhCI458iu79CcgHc7+Ii8zpbpPmLG3yKpHBenUTs1wADheJO+PC+iioQkDGTd9zYKKWmURowZFHiYBEiVzdhdIPVEW2xllGfdh9hYBcvYLSWsAkjJCiiTb5UhKYgKlXV+AxiLIvIr8PR04G/+YAmWyC4YIANmDKaKBVfi4ITMDcp0uYyemYA+UHekOQfT4gv848j8TNJGl2Ltgy0ZMYS83yOOK+CbJsNXXKB5TRI8DNEK9J9JqSYybOnH5MjUUC/SgdcssH5GoWZU9IziAd0hwnd0H7GR0AmvIyhAc4Uit0aRVp3oTQeqSpTpzapaLyS4LpeUGdUlJsEDJqIvxySO49OqQwE0pVGseX0RFgb4jslAF0A2gJme4MjlyKk7Uo+66eRrkYktUvuPoEZXv+p1JHp2Tza5Oq0xxD2UKqaBuIx+bhIbygnOsFJaRbzQgzGjLGU2Mh009WhgCtoVM+5tcZHQYOxGtNQCEM43AIxNQe6NbVCB9CnJ8NINN1y/I/v1LGefmRW3fpWtK8T6AqOYmwDUee5RjO6VKWMxNinrESkGUuszCoLUt76wqjda3D5JxVzdUAsm78sG5A891m0Qgb1G6rhnwDyrprkO86iy6Kc66z6CodgLLqsSE83VjzHBMGZdWDVXQW9Htfw/960vsFSo6PtNAUejcAAAAASUVORK5CYII=" alt="">
                          </div>
                          <div class="Additional">
                            <img class="AdditionalImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC0UlEQVRYR+2YP2hTURTGv++mreji1NEOioNLB1shibRYCkUFwe4dpH2pg6OooOAgiFA7urRJRDc3BUFQ1KE1aYQGoYMVxcU1IBRKS9rmffJe/jR9bV6a50u79G6Xe869v3fO/c699xFNWjKnXtp4SmBA0PFm9gHGN0EuiXiYiPId/SZ4sagzWxvKAzgZYKFWXWwZXvMFSmc1I2iy1ZkD25N5X6DUghYgRcsLsEDYrwMv1sBR4ACAc5XhTX+gjL0Ios81FvLWRdMfNlA6W5oRWMvCEZA3wntGyFFTaQN3RfTCVmfNiW5uT1T6axCWA6XMcB3CPIBpK86/9XPsAirXGc0diLTJnxBi9VC7gFJZvQc0EujLAznxiRXn/arrLqB0VmvbFZgFSH8CrePnVJ968osVc6Xutj0iZKs6SGh2Ih65GTZQyqd8HAE50W57hFJZDYMYMcTL8Si/N0txW4Eq15E8oA7nfCsWcfrWEFf9oNoKlM4oIWq2BtDJ89YFfjs0oGRGk6RmqgAy7E9E6dyZGra2RujQgZ7PqbvUhZ5arRJGIT2o9ckxm/jh9BmBXVzFL++eCi1CqayuA3oF4FgzJW2Ps2AMLtWrL0ygj4CG9w9TsSSnrBjvVf1CA0pmSrdJTrcGxC0Al604P4UO5B5+OQ3ZJZyt7RmDAUhjNUjysWy4B7IBZEfwNRHlUv1HhBahvSJz6CrzQv03ELDz5kn2AOp2VQquM5Vt7foRApDPluSHloGcPSVbnyuzFs0WT40PsrDvSt3YcEWGgy0DOfOV1WeuAHhmxfmmmQp3bGpvygw3KSxFujB1o5+/AwE1A/CO+6nMa3sE1OxJ7kRoA0D1cbhMyHnQhdoEM1qVNsicFWOs0QJMLWgRUvmHwgE0grMTcTZ82TCZ01Xaeluu/G1vKx1d7HPU1DBCrowdKOERpN669IVG51RgAfMyuOM957yL/ANR2ltEdONtlQAAAABJRU5ErkJggg==" alt="">
                            <img class="AdditionalActive" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACfUlEQVRYR+2YPWgUURCAvzkjoo1VSi2UFDYpNIUpFEUIKgjap1UL8VYUFRQsBBFiiuxpk3R2dhEEQVELT1DBQ7BQUdLYHgiCeGjMPZns3mVv/97tz3nNvW7ZmXnfzryZebOCbS2YSSrcwXAA2GoTz/F+FfgA3MCRx5JqoGZ2Aw0M23NslFWlDZxIB3LNInAmq+UC8g0b0Gtgv79BE1gusFmSqh6FPf7LVRvQO2CfL9zAkanSgUJRGAFFPBzrIc0mwxVgEtgcUNLYbvOffwGfcoasBdRZY56L8r3HRgTIqzMv/1Nqf2GN6R6oCFDNPMEwk/PL86jdxpFrXcUIkGs0FJ0KrKn9Lc8uFp1g6F/hiKa6t2KATMDYEo6cLR3INcnlYwTkhWXAHnLNEWAG4T5V+WgN8UCBtEwIDWAMaDLGLs7Jz1SoAQOdRljqAgh7qcr74QG5Rq8jei3prCkcUY8lr4F6aOhANTOOYWfg808B1wMhm8Xwef1ZaLOJr5EzVZqH7pqTtHkAbLFm0oZAE+FQT/aVBuSaZ4CmeNY1hyNXA+2hpDq0YC4hzGek+QscxZHn5QN5VfYwMBGA0sY4G3i+1W3IBu2Lb7kgOtZsrNJCFueaoWdZGKo4UPjmqRk87m/TElyT7fpRHCjtSD7NA6Rn6oVv9TfCDqqiF7t+K3W8nPCDNgezA6k5L/uOUeEe5+WhNQt7D3U4ZN5sL8xRlZV8QFaCkEBaloVER0Drf1NSRnL10J/AcKiDYD1rRPqQ14bcSe03ODKdpKNAwT7Th+3CIqmTjQIdBx4BlcJb2QxoauvflKqsJHvI61cKdTNmtrdt0e/7FkKdNpcjfS5k4R90IoA7WOF3BwAAAABJRU5ErkJggg==" alt="">
                            <div class="AdditionalTitle">
                              <div>
                                追加空格
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`
                })
              }


							let str3 = `<!-- 要进行的操作 -->
							<div class="handle">
								<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQ0lEQVRoQ+2aMW7CQBBF/8AVcgAXweIAOUDS5gCpU0FLnAOEHMAWLanoOUTgAHRUNhIHCC0dYhCWkJBlIq13bWzru96dnfnzZrRjraCkrxfoO4BXAfYKLJNIZmUcJWUY9T90CsHg2rYKhkkoP67Pcx6A/6kPUPxlHVVglUTyVPsAHkf63OngN8/R4xEvm4ksXAbhPAMMwDA9zEBWMCJEhAwVIEKWgrELESEiZKkAEbIUkF2oNgj1R+odAM8yo+n2/wYaJ/a7WMeh7M62UoT8QMcAvlwYr9DGdxzJWPIG8AqdsDpKgDfxA93CETpW3hTYrMC8BQHk/MMpIMZdtqQINb6IL9I1uo26zD+HekM1eReqzV3IMHM3l7MGDJVkDbAGDJHJLidCRIgIWSpAhCwFZBdqHUKNf2qQzthNfuxxQaqq5zYn5rRAmnVrK8sAAAAASUVORK5CYII=" alt="">添加选项
							</div>
						</div>
                ${_that.selects(datas,topicId)}
					</div>
					<!-- 进行拖拽和删除操作的div -->
					<div class="operations">
              <div class="saveTipic_dl" >
                <img  class="notActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVRYR2NkGGDAOMD2M8AdUFBQIAB0zHogdqCio67+//+/eeLEiStxmYnsAJDF+6loObJRiRMmTFiAzWxcDjiAphgWKujiuNyLLRSzgI6Yjq4BlwMcgYrBlgGjBjlk4OK4bEZTXwdU14Skthhobh+yXlo7wBFomQkQdyNZWgN0RCuMT7EDCgsL3YCGpfT394fhCjFgqGQC5abBLGViYlLv6+u7BeJT7ACg4feB5igA8Sygz9JxRRnQoWHAHAHLDfCopIYD/kN9dgDoAEdcDsAlTg0HgLIuKKE2AB3QOBAOEPj375/ypEmTzuLLNTQLAfTsSPcQoLcDcJU/uMQJFmgEE2F+fr4eIyPjRVJtBqkHZjt9YEV0CV/aIOgAqOZ6aEonxR2gbNkI00B2IiTFRnxqRx0wGgKjITAaAkMuBA5QqwREMwfUcAEBgk0yGtkPNxbTAbm5uXzMzMwbyah0SHXsgb9///pPnjz5E0jj4OmckuoNaqkHAIfKhjBE8O7/AAAAAElFTkSuQmCC" alt="">
                <img  class="dragActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR2NkGGDAOMD2M8AdYODwXuD/H9b1QAc5UNFRVxn+/2++eJR3JS4zEQ6w+ezwn4FxPxUthxvFyMiQeOEwzwJsZuNywAE0xbBQQRfH5V6MUPzPyJh16TD3dHQNWB3AyPDf8cIRXrBlBkghgyyOy2Zk9Qz/GesYGP83IaktvniEpw9ZL00dAHLwv/+MJsAo6IZZysjAWHPhCHcrgg9l4fIpoRDQt/rgxsDEmnLxCHcYrhDTs/2cyfifcRrC5yzqF49w3ALxKQ4Bfesv94GmKDAw/J918QhvOi4H61t/C2Ng/AfODchRSbkDbL78h/rsADB+HUkNSWo4AJR1QVm44dIR7ka6OwBUgP39w6Z8+Qj3WXy5BpfDKA4B9OxI9xCgqwNILaaJKdAIRoGR7Re9v/8ZLpJqOUg9MyOD/rnDPJfwpQ2CDgBp1rP5Wg/0DUb5js9RwFxxAJQrYGrIToTk+BybnlEHjIbAaAiMhsDQCgFgSXaAWiUgmjng4pxgk4xGlsONxeoAc/P/fD9Yv24ENa9o7IADHL+5/U+eZPwECY0BBgPuAABoqAk/tFswAAAAAABJRU5ErkJggg==" alt="">
                <div class="dragChild">
                  <div class="dragChilds">
                   保存
                   <div class="dragTriangle"></div>
                  </div>
                </div>
              </div>
						<div class="drag">
							<!-- 未激活 -->
							<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">
							<!-- 激活 -->
							<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">
							<div class="dragChild">
								<div class="dragChilds">
									长按拖动题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
						<div class="del">
							<!-- 未激活 -->
							<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">
							<!-- 激活 -->
							<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">
							<div class="delChild">
								<div class="delChilds">
									删除题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
					</div>
					<!-- 是否为必填项 -->
					<div class="mustFillIn">
							必填<input type="checkbox" class="checke" check${item.isAnswer==1?'ed':''}>
					</div>`
          return str+str2+str3
        } else if (item.type == 'checkbox') {
          let str = `<div class="topic_content_wrap">
						<div class="topic_sort"></div>
						<div class="topic_content">
							<div class="topic_content_title" contenteditable="true">
								${item.title}
							</div>`
              let str2 = ''
              if (item.epiSelectEntityList.length!=0) {
                item.epiSelectEntityList.forEach(ele=>{
                str2+=`<div class="topic_content_title checkbox " additional='${ele.ifInput== 1?'true':'false'}' ids="${ele.id}">
                      <div contenteditable="true" class='${ele.ifInput== 1?'AdditionalDiv selsectA_dls':'selsectA_dls'}'>${ele.content }</div>
                      <div class="delSingle">
                        <div class="delSingleImg">
                          <img class="deleOne" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAADXklEQVRYR82YTWhUVxiG3/eMY1qoCWJFoSVQpaLoQko1k2mSVtBUyLJJsLgIZhK10IIb3XTdjd0UKqQmM5ZAQ0tMly4MQmN+JhO1hYISUbEgLioqYlqoaZzzljN6J/fe2NwxqfXe3fn5vvPc7+/8EM/59U3pLWPxIYAGAFsE1EJYVVJD/EHgFoBpAOPW4Gx3HX97niVYyeTBQSVmatEGi08BpUtLV/YJYB4GJ6pv4XR7O4tRYpGKc5PabaWvCWyOUrbYuICrhvwsU89zi837V6Bvf9IrxVfxFYWDkiLBK4El6TT1Jv7CkQO7+OhZMs9c6NSo1moFzgjasUCItBTGAJyBwaQFrte8hgdu3sM/sdoAb8OiHkCLiEZIJqyD4EU+RktnE+8uHAv1PIUZFRR2kTPTj8UEPz9Yx2uVWKR3SpsSRX0h4KNw3BG8ysdoCkMFLOTcZKvgYEKW4U1Z7O9uYKESkPCcvnGlaDAAaIN/zFnKzKLJ774AULagb2B1KKCQHEkatHbU8f5SYDyZ/imtmbMYgvRBQI/hya4UD3t9ZSCXTQCGAwFMjhSTaD70LueWA+PJnrykZGIOw34oF+gAmr3sKwG5OvPwTV0OpjZvJhPYuVzLhH+kZKkiLvjd50pCzW1uc3WqBJQtaB+svvcJS5bppcZMlDWfxJTygUA3/LgrxR+eAOU1Dug9nx+HMmnTFqV4OeO5vD0toHVeBye60mxgbkwblNCNMi1prcGWSlN7qVCuJBiLaV+dkhLcyNykDkvq8RQLON+dNsFMWOqqEXK5vEYEvV/2DPmJA/pO0v55d/FYJs0vXxBDQG0ur6OCjvuABhzQz5LeKXcaNmZSHA+lageFrSAWbAMVgQtWxJViEv3+EpIrqEFWbhsqfSR/YXZSdyG9XnaZ4fruFO947eyEHQaxp6KFIyYRHO6sx96ntQd9Ba2j1e9lMfIes3k9AlTldVZXs6p9G/927Z683khCt/8LmLIVityeaeSvrj14WStnZjTry7TZGALFzWWxC+o4pn2gMBI8n0nzJRbGuG0dLuVitbmWgOJ2/IjdAc1ZKVZH2PK+FadDvoOK3TXIQcXqoui5LuoqLWnMgP/PVdqDitVjg//8E5vnGD9UrB6swqdFd23CCjS/qCe9fwBiJGybvpXr+wAAAABJRU5ErkJggg==" alt="">
                          <img class="deleTow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC5ElEQVRYR82YTUgVURTHf+c9SjcG9kFBEGQUSS0iKMrUWpQFLlMoXESbLNDRTW1aRIs2BeIbhbJNBEmBtnSRtLB8WSQFQZFUGESLoi/IjRbOifumec6bXs34NLizu3PPx/+e73uF+X49uh6Pg0AtQjXKOqDit5gphHcoL4EsKe7QLm/no0ISETdrmlqaEdpQaoBkfKAIYyi9ZBlgQGbj9MULdnU/Sg+wOU5YzP4EQjuO3P0X3d8BXdNypugGTuTOuRifoMBVKujkuEwXE1lckaurUIaAHUWYPGAUYQiPh8BrvvEtR1dJJbCRFLtRGoE6IFVExjhCI458iu79CcgHc7+Ii8zpbpPmLG3yKpHBenUTs1wADheJO+PC+iioQkDGTd9zYKKWmURowZFHiYBEiVzdhdIPVEW2xllGfdh9hYBcvYLSWsAkjJCiiTb5UhKYgKlXV+AxiLIvIr8PR04G/+YAmWyC4YIANmDKaKBVfi4ITMDcp0uYyemYA+UHekOQfT4gv848j8TNJGl2Ltgy0ZMYS83yOOK+CbJsNXXKB5TRI8DNEK9J9JqSYybOnH5MjUUC/SgdcssH5GoWZU9IziAd0hwnd0H7GR0AmvIyhAc4Uit0aRVp3oTQeqSpTpzapaLyS4LpeUGdUlJsEDJqIvxySO49OqQwE0pVGseX0RFgb4jslAF0A2gJme4MjlyKk7Uo+66eRrkYktUvuPoEZXv+p1JHp2Tza5Oq0xxD2UKqaBuIx+bhIbygnOsFJaRbzQgzGjLGU2Mh009WhgCtoVM+5tcZHQYOxGtNQCEM43AIxNQe6NbVCB9CnJ8NINN1y/I/v1LGefmRW3fpWtK8T6AqOYmwDUee5RjO6VKWMxNinrESkGUuszCoLUt76wqjda3D5JxVzdUAsm78sG5A891m0Qgb1G6rhnwDyrprkO86iy6Kc66z6CodgLLqsSE83VjzHBMGZdWDVXQW9Htfw/960vsFSo6PtNAUejcAAAAASUVORK5CYII=" alt="">
                        </div>
                        <div class="Additional">
                          <img class="AdditionalImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC0UlEQVRYR+2YP2hTURTGv++mreji1NEOioNLB1shibRYCkUFwe4dpH2pg6OooOAgiFA7urRJRDc3BUFQ1KE1aYQGoYMVxcU1IBRKS9rmffJe/jR9bV6a50u79G6Xe869v3fO/c699xFNWjKnXtp4SmBA0PFm9gHGN0EuiXiYiPId/SZ4sagzWxvKAzgZYKFWXWwZXvMFSmc1I2iy1ZkD25N5X6DUghYgRcsLsEDYrwMv1sBR4ACAc5XhTX+gjL0Ios81FvLWRdMfNlA6W5oRWMvCEZA3wntGyFFTaQN3RfTCVmfNiW5uT1T6axCWA6XMcB3CPIBpK86/9XPsAirXGc0diLTJnxBi9VC7gFJZvQc0EujLAznxiRXn/arrLqB0VmvbFZgFSH8CrePnVJ968osVc6Xutj0iZKs6SGh2Ih65GTZQyqd8HAE50W57hFJZDYMYMcTL8Si/N0txW4Eq15E8oA7nfCsWcfrWEFf9oNoKlM4oIWq2BtDJ89YFfjs0oGRGk6RmqgAy7E9E6dyZGra2RujQgZ7PqbvUhZ5arRJGIT2o9ckxm/jh9BmBXVzFL++eCi1CqayuA3oF4FgzJW2Ps2AMLtWrL0ygj4CG9w9TsSSnrBjvVf1CA0pmSrdJTrcGxC0Al604P4UO5B5+OQ3ZJZyt7RmDAUhjNUjysWy4B7IBZEfwNRHlUv1HhBahvSJz6CrzQv03ELDz5kn2AOp2VQquM5Vt7foRApDPluSHloGcPSVbnyuzFs0WT40PsrDvSt3YcEWGgy0DOfOV1WeuAHhmxfmmmQp3bGpvygw3KSxFujB1o5+/AwE1A/CO+6nMa3sE1OxJ7kRoA0D1cbhMyHnQhdoEM1qVNsicFWOs0QJMLWgRUvmHwgE0grMTcTZ82TCZ01Xaeluu/G1vKx1d7HPU1DBCrowdKOERpN669IVG51RgAfMyuOM957yL/ANR2ltEdONtlQAAAABJRU5ErkJggg==" alt="">
                          <img class="AdditionalActive" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACfUlEQVRYR+2YPWgUURCAvzkjoo1VSi2UFDYpNIUpFEUIKgjap1UL8VYUFRQsBBFiiuxpk3R2dhEEQVELT1DBQ7BQUdLYHgiCeGjMPZns3mVv/97tz3nNvW7ZmXnfzryZebOCbS2YSSrcwXAA2GoTz/F+FfgA3MCRx5JqoGZ2Aw0M23NslFWlDZxIB3LNInAmq+UC8g0b0Gtgv79BE1gusFmSqh6FPf7LVRvQO2CfL9zAkanSgUJRGAFFPBzrIc0mwxVgEtgcUNLYbvOffwGfcoasBdRZY56L8r3HRgTIqzMv/1Nqf2GN6R6oCFDNPMEwk/PL86jdxpFrXcUIkGs0FJ0KrKn9Lc8uFp1g6F/hiKa6t2KATMDYEo6cLR3INcnlYwTkhWXAHnLNEWAG4T5V+WgN8UCBtEwIDWAMaDLGLs7Jz1SoAQOdRljqAgh7qcr74QG5Rq8jei3prCkcUY8lr4F6aOhANTOOYWfg808B1wMhm8Xwef1ZaLOJr5EzVZqH7pqTtHkAbLFm0oZAE+FQT/aVBuSaZ4CmeNY1hyNXA+2hpDq0YC4hzGek+QscxZHn5QN5VfYwMBGA0sY4G3i+1W3IBu2Lb7kgOtZsrNJCFueaoWdZGKo4UPjmqRk87m/TElyT7fpRHCjtSD7NA6Rn6oVv9TfCDqqiF7t+K3W8nPCDNgezA6k5L/uOUeEe5+WhNQt7D3U4ZN5sL8xRlZV8QFaCkEBaloVER0Drf1NSRnL10J/AcKiDYD1rRPqQ14bcSe03ODKdpKNAwT7Th+3CIqmTjQIdBx4BlcJb2QxoauvflKqsJHvI61cKdTNmtrdt0e/7FkKdNpcjfS5k4R90IoA7WOF3BwAAAABJRU5ErkJggg==" alt="">
                          <div class="AdditionalTitle">
                            <div>
                              追加空格
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`
                    })
              }

							let str3 = `<div class="handle">
								<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQ0lEQVRoQ+2aMW7CQBBF/8AVcgAXweIAOUDS5gCpU0FLnAOEHMAWLanoOUTgAHRUNhIHCC0dYhCWkJBlIq13bWzru96dnfnzZrRjraCkrxfoO4BXAfYKLJNIZmUcJWUY9T90CsHg2rYKhkkoP67Pcx6A/6kPUPxlHVVglUTyVPsAHkf63OngN8/R4xEvm4ksXAbhPAMMwDA9zEBWMCJEhAwVIEKWgrELESEiZKkAEbIUkF2oNgj1R+odAM8yo+n2/wYaJ/a7WMeh7M62UoT8QMcAvlwYr9DGdxzJWPIG8AqdsDpKgDfxA93CETpW3hTYrMC8BQHk/MMpIMZdtqQINb6IL9I1uo26zD+HekM1eReqzV3IMHM3l7MGDJVkDbAGDJHJLidCRIgIWSpAhCwFZBdqHUKNf2qQzthNfuxxQaqq5zYn5rRAmnVrK8sAAAAASUVORK5CYII=" alt="">添加选项
							</div>
						</div>
            ${_that.selects(datas,topicId)}
					</div>
					<!-- 进行拖拽和删除操作的div -->
					<div class="operations">
            <div class="saveTipic_dl" >
              <img  class="notActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVRYR2NkGGDAOMD2M8AdUFBQIAB0zHogdqCio67+//+/eeLEiStxmYnsAJDF+6loObJRiRMmTFiAzWxcDjiAphgWKujiuNyLLRSzgI6Yjq4BlwMcgYrBlgGjBjlk4OK4bEZTXwdU14Skthhobh+yXlo7wBFomQkQdyNZWgN0RCuMT7EDCgsL3YCGpfT394fhCjFgqGQC5abBLGViYlLv6+u7BeJT7ACg4feB5igA8Sygz9JxRRnQoWHAHAHLDfCopIYD/kN9dgDoAEdcDsAlTg0HgLIuKKE2AB3QOBAOEPj375/ypEmTzuLLNTQLAfTsSPcQoLcDcJU/uMQJFmgEE2F+fr4eIyPjRVJtBqkHZjt9YEV0CV/aIOgAqOZ6aEonxR2gbNkI00B2IiTFRnxqRx0wGgKjITAaAkMuBA5QqwREMwfUcAEBgk0yGtkPNxbTAbm5uXzMzMwbyah0SHXsgb9///pPnjz5E0jj4OmckuoNaqkHAIfKhjBE8O7/AAAAAElFTkSuQmCC" alt="">
              <img  class="dragActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR2NkGGDAOMD2M8AdYODwXuD/H9b1QAc5UNFRVxn+/2++eJR3JS4zEQ6w+ezwn4FxPxUthxvFyMiQeOEwzwJsZuNywAE0xbBQQRfH5V6MUPzPyJh16TD3dHQNWB3AyPDf8cIRXrBlBkghgyyOy2Zk9Qz/GesYGP83IaktvniEpw9ZL00dAHLwv/+MJsAo6IZZysjAWHPhCHcrgg9l4fIpoRDQt/rgxsDEmnLxCHcYrhDTs/2cyfifcRrC5yzqF49w3ALxKQ4Bfesv94GmKDAw/J918QhvOi4H61t/C2Ng/AfODchRSbkDbL78h/rsADB+HUkNSWo4AJR1QVm44dIR7ka6OwBUgP39w6Z8+Qj3WXy5BpfDKA4B9OxI9xCgqwNILaaJKdAIRoGR7Re9v/8ZLpJqOUg9MyOD/rnDPJfwpQ2CDgBp1rP5Wg/0DUb5js9RwFxxAJQrYGrIToTk+BybnlEHjIbAaAiMhsDQCgFgSXaAWiUgmjng4pxgk4xGlsONxeoAc/P/fD9Yv24ENa9o7IADHL+5/U+eZPwECY0BBgPuAABoqAk/tFswAAAAAABJRU5ErkJggg==" alt="">
              <div class="dragChild">
                <div class="dragChilds">
                 保存
                 <div class="dragTriangle"></div>
                </div>
              </div>
            </div>
						<div class="drag">
							<!-- 未激活 -->
							<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">
							<!-- 激活 -->
							<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">
							<div class="dragChild">
								<div class="dragChilds">
									长按拖动题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
						<div class="del">
							<!-- 未激活 -->
							<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">
							<!-- 激活 -->
							<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">
							<div class="delChild">
								<div class="delChilds">
									删除题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
					</div>
					<!-- 是否为必填项 -->
					<div class="mustFillIn">
							必填<input type="checkbox" class="checke" check${item.isAnswer==1?'ed':''}>
					</div>`
          return str+str2+str3
        } else if (item.type == 'oneRow') {
          return `<div class="topic_content_wrap">
						<div class="topic_sort"></div>
						<div class="topic_content">
							<div class="topic_content_title" contenteditable="true">
								${item.title}
							</div>
							<div style="width: 100%;height: 30px;border-radius:3px;background:#fff;border: 1px solid #ccc;margin-top: 10px;"></div>
						</div>
            ${_that.selects(datas,topicId)}
					</div>
					<!-- 进行拖拽和删除操作的div -->
					<div class="operations">
          <div class="saveTipic_dl" >
            <img  class="notActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVRYR2NkGGDAOMD2M8AdUFBQIAB0zHogdqCio67+//+/eeLEiStxmYnsAJDF+6loObJRiRMmTFiAzWxcDjiAphgWKujiuNyLLRSzgI6Yjq4BlwMcgYrBlgGjBjlk4OK4bEZTXwdU14Skthhobh+yXlo7wBFomQkQdyNZWgN0RCuMT7EDCgsL3YCGpfT394fhCjFgqGQC5abBLGViYlLv6+u7BeJT7ACg4feB5igA8Sygz9JxRRnQoWHAHAHLDfCopIYD/kN9dgDoAEdcDsAlTg0HgLIuKKE2AB3QOBAOEPj375/ypEmTzuLLNTQLAfTsSPcQoLcDcJU/uMQJFmgEE2F+fr4eIyPjRVJtBqkHZjt9YEV0CV/aIOgAqOZ6aEonxR2gbNkI00B2IiTFRnxqRx0wGgKjITAaAkMuBA5QqwREMwfUcAEBgk0yGtkPNxbTAbm5uXzMzMwbyah0SHXsgb9///pPnjz5E0jj4OmckuoNaqkHAIfKhjBE8O7/AAAAAElFTkSuQmCC" alt="">
            <img  class="dragActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR2NkGGDAOMD2M8AdYODwXuD/H9b1QAc5UNFRVxn+/2++eJR3JS4zEQ6w+ezwn4FxPxUthxvFyMiQeOEwzwJsZuNywAE0xbBQQRfH5V6MUPzPyJh16TD3dHQNWB3AyPDf8cIRXrBlBkghgyyOy2Zk9Qz/GesYGP83IaktvniEpw9ZL00dAHLwv/+MJsAo6IZZysjAWHPhCHcrgg9l4fIpoRDQt/rgxsDEmnLxCHcYrhDTs/2cyfifcRrC5yzqF49w3ALxKQ4Bfesv94GmKDAw/J918QhvOi4H61t/C2Ng/AfODchRSbkDbL78h/rsADB+HUkNSWo4AJR1QVm44dIR7ka6OwBUgP39w6Z8+Qj3WXy5BpfDKA4B9OxI9xCgqwNILaaJKdAIRoGR7Re9v/8ZLpJqOUg9MyOD/rnDPJfwpQ2CDgBp1rP5Wg/0DUb5js9RwFxxAJQrYGrIToTk+BybnlEHjIbAaAiMhsDQCgFgSXaAWiUgmjng4pxgk4xGlsONxeoAc/P/fD9Yv24ENa9o7IADHL+5/U+eZPwECY0BBgPuAABoqAk/tFswAAAAAABJRU5ErkJggg==" alt="">
            <div class="dragChild">
              <div class="dragChilds">
               保存
               <div class="dragTriangle"></div>
              </div>
            </div>
          </div>
						<div class="drag">
							<!-- 未激活 -->
							<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">
							<!-- 激活 -->
							<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">
							<div class="dragChild">
								<div class="dragChilds">
									长按拖动题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
						<div class="del">
							<!-- 未激活 -->
							<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">
							<!-- 激活 -->
							<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">
							<div class="delChild">
								<div class="delChilds">
									删除题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
					</div>
					<!-- 是否为必填项 -->
					<div class="mustFillIn">
							必填<input type="checkbox" class="checke" check${item.isAnswer==1?'ed':''}>
					</div>`
        } else if (item.type == 'multiRow') {
          return `<div class="topic_content_wrap">
						<div class="topic_sort"></div>
						<div class="topic_content">
							<div class="topic_content_title" contenteditable="true">
								${item.title}
							</div>
							<div style="width: 100%;height: 82px;background:rgba(255,255,255,1);border-radius:3px;border: 1px solid #ccc;margin-top: 10px;"></div>
						</div>
            ${_that.selects(datas,topicId)}
					</div>
					<!-- 进行拖拽和删除操作的div -->
					<div class="operations">
          <div class="saveTipic_dl" >
            <img  class="notActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVRYR2NkGGDAOMD2M8AdUFBQIAB0zHogdqCio67+//+/eeLEiStxmYnsAJDF+6loObJRiRMmTFiAzWxcDjiAphgWKujiuNyLLRSzgI6Yjq4BlwMcgYrBlgGjBjlk4OK4bEZTXwdU14Skthhobh+yXlo7wBFomQkQdyNZWgN0RCuMT7EDCgsL3YCGpfT394fhCjFgqGQC5abBLGViYlLv6+u7BeJT7ACg4feB5igA8Sygz9JxRRnQoWHAHAHLDfCopIYD/kN9dgDoAEdcDsAlTg0HgLIuKKE2AB3QOBAOEPj375/ypEmTzuLLNTQLAfTsSPcQoLcDcJU/uMQJFmgEE2F+fr4eIyPjRVJtBqkHZjt9YEV0CV/aIOgAqOZ6aEonxR2gbNkI00B2IiTFRnxqRx0wGgKjITAaAkMuBA5QqwREMwfUcAEBgk0yGtkPNxbTAbm5uXzMzMwbyah0SHXsgb9///pPnjz5E0jj4OmckuoNaqkHAIfKhjBE8O7/AAAAAElFTkSuQmCC" alt="">
            <img  class="dragActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR2NkGGDAOMD2M8AdYODwXuD/H9b1QAc5UNFRVxn+/2++eJR3JS4zEQ6w+ezwn4FxPxUthxvFyMiQeOEwzwJsZuNywAE0xbBQQRfH5V6MUPzPyJh16TD3dHQNWB3AyPDf8cIRXrBlBkghgyyOy2Zk9Qz/GesYGP83IaktvniEpw9ZL00dAHLwv/+MJsAo6IZZysjAWHPhCHcrgg9l4fIpoRDQt/rgxsDEmnLxCHcYrhDTs/2cyfifcRrC5yzqF49w3ALxKQ4Bfesv94GmKDAw/J918QhvOi4H61t/C2Ng/AfODchRSbkDbL78h/rsADB+HUkNSWo4AJR1QVm44dIR7ka6OwBUgP39w6Z8+Qj3WXy5BpfDKA4B9OxI9xCgqwNILaaJKdAIRoGR7Re9v/8ZLpJqOUg9MyOD/rnDPJfwpQ2CDgBp1rP5Wg/0DUb5js9RwFxxAJQrYGrIToTk+BybnlEHjIbAaAiMhsDQCgFgSXaAWiUgmjng4pxgk4xGlsONxeoAc/P/fD9Yv24ENa9o7IADHL+5/U+eZPwECY0BBgPuAABoqAk/tFswAAAAAABJRU5ErkJggg==" alt="">
            <div class="dragChild">
              <div class="dragChilds">
               保存
               <div class="dragTriangle"></div>
              </div>
            </div>
          </div>
						<div class="drag">
							<!-- 未激活 -->
							<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">
							<!-- 激活 -->
							<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">
							<div class="dragChild">
								<div class="dragChilds">
									长按拖动题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
						<div class="del">
							<!-- 未激活 -->
							<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">
							<!-- 激活 -->
							<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">
							<div class="delChild">
								<div class="delChilds">
									删除题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
					</div>
					<!-- 是否为必填项 -->
					<div class="mustFillIn">
							必填<input type="checkbox" class="checke" check${item.isAnswer==1?'ed':''}>
					</div>`
        } else if (item.type == 'site') {
          return `<div class="topic_content_wrap">
						<div class="topic_sort"></div>
						<div class="topic_content">
							<div class="topic_content_title" contenteditable="true">
								${item.title}
							</div>
							<div style="width: 100%;height: 30px;display: flex;margin-top: 10px;">
								<div class="dzs" >请选择</div>
								<div class="dzs" >请选择</div>
								<div class="dzs" >请选择</div>
							</div>
							<div class="dzx">请输入详细地址</div>
						</div>
            ${_that.selects(datas,topicId)}
					</div>
					<!-- 进行拖拽和删除操作的div -->
					<div class="operations">
          <div class="saveTipic_dl" >
            <img  class="notActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVRYR2NkGGDAOMD2M8AdUFBQIAB0zHogdqCio67+//+/eeLEiStxmYnsAJDF+6loObJRiRMmTFiAzWxcDjiAphgWKujiuNyLLRSzgI6Yjq4BlwMcgYrBlgGjBjlk4OK4bEZTXwdU14Skthhobh+yXlo7wBFomQkQdyNZWgN0RCuMT7EDCgsL3YCGpfT394fhCjFgqGQC5abBLGViYlLv6+u7BeJT7ACg4feB5igA8Sygz9JxRRnQoWHAHAHLDfCopIYD/kN9dgDoAEdcDsAlTg0HgLIuKKE2AB3QOBAOEPj375/ypEmTzuLLNTQLAfTsSPcQoLcDcJU/uMQJFmgEE2F+fr4eIyPjRVJtBqkHZjt9YEV0CV/aIOgAqOZ6aEonxR2gbNkI00B2IiTFRnxqRx0wGgKjITAaAkMuBA5QqwREMwfUcAEBgk0yGtkPNxbTAbm5uXzMzMwbyah0SHXsgb9///pPnjz5E0jj4OmckuoNaqkHAIfKhjBE8O7/AAAAAElFTkSuQmCC" alt="">
            <img  class="dragActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR2NkGGDAOMD2M8AdYODwXuD/H9b1QAc5UNFRVxn+/2++eJR3JS4zEQ6w+ezwn4FxPxUthxvFyMiQeOEwzwJsZuNywAE0xbBQQRfH5V6MUPzPyJh16TD3dHQNWB3AyPDf8cIRXrBlBkghgyyOy2Zk9Qz/GesYGP83IaktvniEpw9ZL00dAHLwv/+MJsAo6IZZysjAWHPhCHcrgg9l4fIpoRDQt/rgxsDEmnLxCHcYrhDTs/2cyfifcRrC5yzqF49w3ALxKQ4Bfesv94GmKDAw/J918QhvOi4H61t/C2Ng/AfODchRSbkDbL78h/rsADB+HUkNSWo4AJR1QVm44dIR7ka6OwBUgP39w6Z8+Qj3WXy5BpfDKA4B9OxI9xCgqwNILaaJKdAIRoGR7Re9v/8ZLpJqOUg9MyOD/rnDPJfwpQ2CDgBp1rP5Wg/0DUb5js9RwFxxAJQrYGrIToTk+BybnlEHjIbAaAiMhsDQCgFgSXaAWiUgmjng4pxgk4xGlsONxeoAc/P/fD9Yv24ENa9o7IADHL+5/U+eZPwECY0BBgPuAABoqAk/tFswAAAAAABJRU5ErkJggg==" alt="">
            <div class="dragChild">
              <div class="dragChilds">
               保存
               <div class="dragTriangle"></div>
              </div>
            </div>
          </div>
						<div class="drag">
							<!-- 未激活 -->
							<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">
							<!-- 激活 -->
							<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">
							<div class="dragChild">
								<div class="dragChilds">
									长按拖动题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
						<div class="del">
							<!-- 未激活 -->
							<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">
							<!-- 激活 -->
							<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">
							<div class="delChild">
								<div class="delChilds">
									删除题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
					</div>
					<!-- 是否为必填项 -->
					<div class="mustFillIn">
							必填<input type="checkbox" class="checke" check${item.isAnswer==1?'ed':''}>
					</div>`
        } else if (item.type == 'dateline') {
          return `<div class="topic_content_wrap">
						<div class="topic_sort"></div>
						<div class="topic_content">
							<div class="topic_content_title" contenteditable="true">
								${item.title}
							</div>
							<div class="dzx">请选择日期<img src="" alt=""></div>
						</div>
            ${_that.selects(datas,topicId)}
					</div>
					<!-- 进行拖拽和删除操作的div -->
					<div class="operations">
          <div class="saveTipic_dl" >
            <img  class="notActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVRYR2NkGGDAOMD2M8AdUFBQIAB0zHogdqCio67+//+/eeLEiStxmYnsAJDF+6loObJRiRMmTFiAzWxcDjiAphgWKujiuNyLLRSzgI6Yjq4BlwMcgYrBlgGjBjlk4OK4bEZTXwdU14Skthhobh+yXlo7wBFomQkQdyNZWgN0RCuMT7EDCgsL3YCGpfT394fhCjFgqGQC5abBLGViYlLv6+u7BeJT7ACg4feB5igA8Sygz9JxRRnQoWHAHAHLDfCopIYD/kN9dgDoAEdcDsAlTg0HgLIuKKE2AB3QOBAOEPj375/ypEmTzuLLNTQLAfTsSPcQoLcDcJU/uMQJFmgEE2F+fr4eIyPjRVJtBqkHZjt9YEV0CV/aIOgAqOZ6aEonxR2gbNkI00B2IiTFRnxqRx0wGgKjITAaAkMuBA5QqwREMwfUcAEBgk0yGtkPNxbTAbm5uXzMzMwbyah0SHXsgb9///pPnjz5E0jj4OmckuoNaqkHAIfKhjBE8O7/AAAAAElFTkSuQmCC" alt="">
            <img  class="dragActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR2NkGGDAOMD2M8AdYODwXuD/H9b1QAc5UNFRVxn+/2++eJR3JS4zEQ6w+ezwn4FxPxUthxvFyMiQeOEwzwJsZuNywAE0xbBQQRfH5V6MUPzPyJh16TD3dHQNWB3AyPDf8cIRXrBlBkghgyyOy2Zk9Qz/GesYGP83IaktvniEpw9ZL00dAHLwv/+MJsAo6IZZysjAWHPhCHcrgg9l4fIpoRDQt/rgxsDEmnLxCHcYrhDTs/2cyfifcRrC5yzqF49w3ALxKQ4Bfesv94GmKDAw/J918QhvOi4H61t/C2Ng/AfODchRSbkDbL78h/rsADB+HUkNSWo4AJR1QVm44dIR7ka6OwBUgP39w6Z8+Qj3WXy5BpfDKA4B9OxI9xCgqwNILaaJKdAIRoGR7Re9v/8ZLpJqOUg9MyOD/rnDPJfwpQ2CDgBp1rP5Wg/0DUb5js9RwFxxAJQrYGrIToTk+BybnlEHjIbAaAiMhsDQCgFgSXaAWiUgmjng4pxgk4xGlsONxeoAc/P/fD9Yv24ENa9o7IADHL+5/U+eZPwECY0BBgPuAABoqAk/tFswAAAAAABJRU5ErkJggg==" alt="">
            <div class="dragChild">
              <div class="dragChilds">
               保存
               <div class="dragTriangle"></div>
              </div>
            </div>
          </div>
						<div class="drag">
							<!-- 未激活 -->
							<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">
							<!-- 激活 -->
							<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">
							<div class="dragChild">
								<div class="dragChilds">
									长按拖动题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
						<div class="del">
							<!-- 未激活 -->
							<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">
							<!-- 激活 -->
							<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">
							<div class="delChild">
								<div class="delChilds">
									删除题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
					</div>
					<!-- 是否为必填项 -->
					<div class="mustFillIn">
							必填<input type="checkbox" class="checke" check${item.isAnswer==1?'ed':''}>
					</div>`
        } else if (item.type == 'img') {
          return `<div class="topic_content_wrap">
						<div class="topic_sort"></div>
						<div class="topic_content">
							<div class="topic_content_title" contenteditable="true">
								${item.title}
							</div>
							<div class="q_option_img">
								<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAD1UlEQVR4Xu2dsWoUURSGz1nYZisJaucLaKHBB9DCRmHBZu62prHRdEGwyqaNlkHQxjQuzJ3CYlARBC0CluIzpBCMiNVOt0dmcZPZyeza3/OlS3nO/efe//vvmR0Vh3+TyeRiv9/fMbOrIvJDRL6GEA4dtkLUW9FlWQ6qqjoSkc1W7dshhANv/XAngDzPx6q6215oMztW1ZshhBNPIvAogHeqeq9rkVX1UZZlLxBAwh0oiuKzmd3uKtHM9kaj0Tjh8s+V5m4HQADLGkAAjX6wAzjY+9gB2AHwAA0NcARwBDjY9xslcgRwBHAEcASQAyw0gAfAA+ABFh0gB3CgBUwgJhATiAnEBGICO447PAAegOvg1DWACcQEYgIxgZhATCAmcN4BomCi4NRt33J9mEBMICYQE4gJxARiAjGBbQ0QBTvwg5hATCAmEBPYbQJVdZxl2Z6DjfC0RIKg5tOAANLX/joPwA6Q/voLAsAErjSB7ADsAJjA1DVADsARwBFADkAOwGUQl0FcBrU1AAWk7gBFyAFaa0wUzEygg8e+USIYCAaCgWAgM4FgYMfJBwU4sAPcBuIBGAnDAxAF4wHwAETBbQ3wXgAmkIGQ1DUABUABJIFQAEkgFAAFQAEMhPz7jaD6c6rT6fSJql5X1QupG8FV3w1U1S8Oav9jZt8Hg8H+cDicaoxxQ0Q+dXxLN/VeeK/vm4jc0aIonpnZjvdueKxfVZ/XO8B7EbnrsQHULB9qAbwUkYc0w2UHXtUCeCAir12WT9Fb86ngGONjM6sp4Ao9Sb8DZnasqvshhIPTsfAY4yVVzWaz2eWUW9Dr9W6t+3x8yrXXtfV6vZ9mVoQQTur/eS+gseJcB6cu//+8GYQAEACfjEldA7wZxDwAU8HMAzAPwDxAx1mHCUzdAEAB51aYHIAcwMFj3ygRCoACoAAoAAqAAqCAeQcwgZhATOCiA+QADrQABUABUAAUAAVAAVAAFNDWACYQE8hEUOoagAKgACgACoACoAAoAAqAArgMWtIAGJg6AjATyEwgGAgGgoFgIBgIBoKBYCAYCAaCgQ7Ib6lEKAAKgAKgACgACoACoAAoAAqAAqCAsw5wG+hADWAgGAgGgoFgIBgIBoKBYCAYCAY6MP5cBq1ZZH4iptEccgAH2wE5ADkAOQA5ADkAOQA5ADkAOQA5ADmAA+NPDkAOcNaBGONbEbm/oidbIYRDTw+FuyAoz/Oxqu52nP/151RvhBB+I4CEO1CW5aCqqiMR2WyVuV1/Szfh0jtLc7cD1F2IMW6o6lMzuyYiv1T1Y5Zlb7wtfl3vX65PGxG+cwU/AAAAAElFTkSuQmCC" alt="">
								<p>单次上传</p>
								<p>最多10张图片</p>
							</div>
						</div>
            ${_that.selects(datas,topicId)}
					</div>
					<!-- 进行拖拽和删除操作的div -->
					<div class="operations">
          <div class="saveTipic_dl" >
            <img  class="notActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVRYR2NkGGDAOMD2M8AdUFBQIAB0zHogdqCio67+//+/eeLEiStxmYnsAJDF+6loObJRiRMmTFiAzWxcDjiAphgWKujiuNyLLRSzgI6Yjq4BlwMcgYrBlgGjBjlk4OK4bEZTXwdU14Skthhobh+yXlo7wBFomQkQdyNZWgN0RCuMT7EDCgsL3YCGpfT394fhCjFgqGQC5abBLGViYlLv6+u7BeJT7ACg4feB5igA8Sygz9JxRRnQoWHAHAHLDfCopIYD/kN9dgDoAEdcDsAlTg0HgLIuKKE2AB3QOBAOEPj375/ypEmTzuLLNTQLAfTsSPcQoLcDcJU/uMQJFmgEE2F+fr4eIyPjRVJtBqkHZjt9YEV0CV/aIOgAqOZ6aEonxR2gbNkI00B2IiTFRnxqRx0wGgKjITAaAkMuBA5QqwREMwfUcAEBgk0yGtkPNxbTAbm5uXzMzMwbyah0SHXsgb9///pPnjz5E0jj4OmckuoNaqkHAIfKhjBE8O7/AAAAAElFTkSuQmCC" alt="">
            <img  class="dragActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR2NkGGDAOMD2M8AdYODwXuD/H9b1QAc5UNFRVxn+/2++eJR3JS4zEQ6w+ezwn4FxPxUthxvFyMiQeOEwzwJsZuNywAE0xbBQQRfH5V6MUPzPyJh16TD3dHQNWB3AyPDf8cIRXrBlBkghgyyOy2Zk9Qz/GesYGP83IaktvniEpw9ZL00dAHLwv/+MJsAo6IZZysjAWHPhCHcrgg9l4fIpoRDQt/rgxsDEmnLxCHcYrhDTs/2cyfifcRrC5yzqF49w3ALxKQ4Bfesv94GmKDAw/J918QhvOi4H61t/C2Ng/AfODchRSbkDbL78h/rsADB+HUkNSWo4AJR1QVm44dIR7ka6OwBUgP39w6Z8+Qj3WXy5BpfDKA4B9OxI9xCgqwNILaaJKdAIRoGR7Re9v/8ZLpJqOUg9MyOD/rnDPJfwpQ2CDgBp1rP5Wg/0DUb5js9RwFxxAJQrYGrIToTk+BybnlEHjIbAaAiMhsDQCgFgSXaAWiUgmjng4pxgk4xGlsONxeoAc/P/fD9Yv24ENa9o7IADHL+5/U+eZPwECY0BBgPuAABoqAk/tFswAAAAAABJRU5ErkJggg==" alt="">
            <div class="dragChild">
              <div class="dragChilds">
               保存
               <div class="dragTriangle"></div>
              </div>
            </div>
          </div>
						<div class="drag">
							<!-- 未激活 -->
							<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">
							<!-- 激活 -->
							<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">
							<div class="dragChild">
								<div class="dragChilds">
									长按拖动题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
						<div class="del">
							<!-- 未激活 -->
							<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">
							<!-- 激活 -->
							<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">
							<div class="delChild">
								<div class="delChilds">
									删除题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
					</div>
					<!-- 是否为必填项 -->
					<div class="mustFillIn">
							必填<input type="checkbox" class="checke" check${item.isAnswer==1?'ed':''}>
					</div>`
        } else if (item.type == 'explain') {
          return `<div class="topic_content_wrap">
						<div class="topic_sort"></div>
						<div class="topic_content">
							<div class="topic_content_title" contenteditable="true">
								${item.title}
							</div>
							<div style="height: 20px;"></div>
						</div>
            ${_that.selects(datas,topicId)}
					</div>
					<!-- 进行拖拽和删除操作的div -->
					<div class="operations">
          <div class="saveTipic_dl" >
            <img  class="notActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVRYR2NkGGDAOMD2M8AdUFBQIAB0zHogdqCio67+//+/eeLEiStxmYnsAJDF+6loObJRiRMmTFiAzWxcDjiAphgWKujiuNyLLRSzgI6Yjq4BlwMcgYrBlgGjBjlk4OK4bEZTXwdU14Skthhobh+yXlo7wBFomQkQdyNZWgN0RCuMT7EDCgsL3YCGpfT394fhCjFgqGQC5abBLGViYlLv6+u7BeJT7ACg4feB5igA8Sygz9JxRRnQoWHAHAHLDfCopIYD/kN9dgDoAEdcDsAlTg0HgLIuKKE2AB3QOBAOEPj375/ypEmTzuLLNTQLAfTsSPcQoLcDcJU/uMQJFmgEE2F+fr4eIyPjRVJtBqkHZjt9YEV0CV/aIOgAqOZ6aEonxR2gbNkI00B2IiTFRnxqRx0wGgKjITAaAkMuBA5QqwREMwfUcAEBgk0yGtkPNxbTAbm5uXzMzMwbyah0SHXsgb9///pPnjz5E0jj4OmckuoNaqkHAIfKhjBE8O7/AAAAAElFTkSuQmCC" alt="">
            <img  class="dragActiveImgs" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR2NkGGDAOMD2M8AdYODwXuD/H9b1QAc5UNFRVxn+/2++eJR3JS4zEQ6w+ezwn4FxPxUthxvFyMiQeOEwzwJsZuNywAE0xbBQQRfH5V6MUPzPyJh16TD3dHQNWB3AyPDf8cIRXrBlBkghgyyOy2Zk9Qz/GesYGP83IaktvniEpw9ZL00dAHLwv/+MJsAo6IZZysjAWHPhCHcrgg9l4fIpoRDQt/rgxsDEmnLxCHcYrhDTs/2cyfifcRrC5yzqF49w3ALxKQ4Bfesv94GmKDAw/J918QhvOi4H61t/C2Ng/AfODchRSbkDbL78h/rsADB+HUkNSWo4AJR1QVm44dIR7ka6OwBUgP39w6Z8+Qj3WXy5BpfDKA4B9OxI9xCgqwNILaaJKdAIRoGR7Re9v/8ZLpJqOUg9MyOD/rnDPJfwpQ2CDgBp1rP5Wg/0DUb5js9RwFxxAJQrYGrIToTk+BybnlEHjIbAaAiMhsDQCgFgSXaAWiUgmjng4pxgk4xGlsONxeoAc/P/fD9Yv24ENa9o7IADHL+5/U+eZPwECY0BBgPuAABoqAk/tFswAAAAAABJRU5ErkJggg==" alt="">
            <div class="dragChild">
              <div class="dragChilds">
               保存
               <div class="dragTriangle"></div>
              </div>
            </div>
          </div>
						<div class="drag">
							<!-- 未激活 -->
							<img draggable="false" class="notActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACHElEQVRoQ+2ZO1LDMBCGd3MeOi7AIaBiBlqoIVa6JKUcqKGlICegZ+hpOQUXoMoyZuIZY0uWVruaoJCUjh77aR//ykYo/IeF2w8HgF17MJsHrLULRDwloi8AeDHGLHLAZgHYGj/vGkxEyxwQ6gAu41uQHBCqAGPGtxCIuJhOp0utcFIDiDE+B4QKAMd4bQgxQIrxmjmhAfCOiMe9mL4EgKfus81mcz6ZTJ574z6qqjqS5IMYoK7rVwA46ZzqrTHmvq5r6hpWVRVaa68Q8aHzfPcAPsFyATSGr1arORGdAcAnEb1JtUHsAZ/7fQCScHHN/T8AbajEup7rgdTeKcoDjlIZTD4ugKMYRPVOQQBPnVcHsNYOynFM7zQK4BOpmH6G64HUvbwAvgWJ6NoY8xiqJlyAZj1r7Q0i3vXXHjswJ4DP+EZNZ7PZOmR8838KwHbeRV/Fm+c+iAGApLeJAZOMceWEC8DV20j21Zw7KB57CdBcxn/dZzWPULKWKw+KSWKfJhRRRscELUnIYhSSW0ZHdGe0pfjTrUSM4gcBtgrZT2z1XihbM9dWDe5NKjGE2K8iozyQUvq4ACl7/LQYqRND84oB4F7quTe70EGJPbAPr1XKfrElab9j6nz2EPLoRGhfiFHz4CKaVYjjCS3j1ctoDISm8eoAoXDSiPnBhT8mzrhjiv7I1++divzMyvWYZLxYiSWba8w9AGicomSNb9p0zkD9EBgsAAAAAElFTkSuQmCC" alt="">
							<!-- 激活 -->
							<img draggable="false" class="dragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRoQ+2ZPVLDMBCFdw+T0NBxAQ4BFTPQQhmHnqQnTgktBZwgPUNPS4E5AhegW0bgZDz6sVba9SSCpItjSe/zrvatFYTCP1i4ftgDbDuCg0VgXNEMAE4I4AsBVk2N5rv6ZxCAVvyNpXY+BIQ6QED8mkUdQhUgIn4NMWtqnGvlkhoAU7w6hApAonhVCDFApni1PSEGGFX0igBHVk5fAMBD9xoRnCHCo3XfW1PjoWQ/yAEm9IwIxxsRBNfNEhfjiqgrrKkRD6Z0SQR3nevbBwgZlg/ACB9XZPzhlAg+EeFF6g3iCITCHwKQpItv7P8B2KQKM/SpEcjtnVgR8JTK6OZLBRjZxQCA1XZEAQJ1Xh/AX46jEL0APSYV7WdSI5C7VhAgNCEiXL0v8D5WTVIBfkrshKaAcOuZO/jAvAAh8cZNP5b4FBPf1nvHyJjjzm0Xb8d5IRwAYW/D0Si5x9kTDkCgt5EsqjnWKR5/D2DHU8jZByVtYq8nlFJGg4aWa2RRh0z1gZ7U7V1r11uJqONHAVpTMqdq3YMq/V5oqGZuXcRT36QyUyj5KJIVgRwnSgXIWcOM2QNkvNT/nloz3+xikRFHwHmTKu1YpfiDLWHvFK3zg6dQwCdi65rfo27OmUS8Bzo+YZtd3/oq4tXLKDOd1MSrAzDSSZzzdljVUqg7cdF/8jm9U4l/s3Kqh9Y9g6SQljjOPHsAzlMa8p5v7U1+QBBfCXUAAAAASUVORK5CYII=" alt="">
							<div class="dragChild">
								<div class="dragChilds">
									长按拖动题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
						<div class="del">
							<!-- 未激活 -->
							<img draggable="false" class="delnotActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABc0lEQVRIS+2Wv0rEQBDGv9nccdgIKhYWgpW93APk/AO+hqBiZ9QH8Ay2ip6dKPgAPoIiSWq10losLC0UwRNyO3Ie0XhJNmYQREi63Z1vfsy3md0lGL7Z3fZkWKnOgzBEDGWKBcDMeCYKzzyndpMVS6YkdquzQcBgDqhvWb14Du2IgI1WZ6sYrBftrSoXRJym7VXY5IRdTQD+sN6UAEfH1PbpLZJAlzQ19sNFEI1LEhfX8B01DsIFME0UFxdXMPGD8acpnjJf8ffA37SYwfe+UzmJ152oUNoKWWZ6jvWttUrgl1P0dvwx4NpS3D7VUUe68kr981GM2NJI2L/HWfMl8HNbstqitDTPmcjCHzd+aen/txQZR1t3XoVgbdWW024M8dGWf5enR+QCZW/RdBgznvw1a894AdstniZoW1pRXKe1DoL16oUR2H2jzoxgTgNTYD0gAjPaWqnr4BHncEmbgbHV+uFlVQK8WqmHgOnlLckq1LwDB43zfeLyYOMAAAAASUVORK5CYII=" alt="">
							<!-- 激活 -->
							<img draggable="false" class="deldragActiveImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAABU0lEQVRIS+2WsS4EURSGv7O7gpJKgUKrJ9Gg1nsAjcqOSiFREIluk91O4gV4ByQShe29gNVoNpQbmT0yxojZu3PHHFsQc8tzz///c/4799wj+FZLN1AawAJQ8+ZCH3ikwh47cp6VKzmCDyhzOUKD208EMmMV7KP4P2oYc5cqhxJV7KyY7EKrzs49wjSvBauL07uMs0joYDclFJp6C6yYiIuDLiPBK2C9ONaAENrFz8eg8xXyCwRbeo2y9sNCEvgNgaz6K2yqjkgspgkk5aJr6f8VFJbfLVLuUpbXWCJEnHiSZLY0AQ5anhUvBT/PJesvLS3Nc+bDwu9f/NLSv29pVmuL4vGo1R76yphbm+XNijpsXSp572EHmLXwOxilw67M5wkeAQcjERSOqUuKy72HpzpGjxOULWDKKPwMnDHBPtuSmm39Q1RDJ02CL/T8k7eJ1QZ6A9fescVhlAxUAAAAAElFTkSuQmCC" alt="">
							<div class="delChild">
								<div class="delChilds">
									删除题目
									<div class="dragTriangle"></div>
								</div>
							</div>
						</div>
					</div>
					<!-- 是否为必填项 -->
					<div class="mustFillIn">
						必填<input type="checkbox" class="checke" check${item.isAnswer==1?'ed':''}>
					</div>`
        }
      }
    },
    mounted() {

    }
  }
</script>

<style>

</style>
