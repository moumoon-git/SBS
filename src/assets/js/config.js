/*
 * @Author: your name
 * @Date: 2020-11-06 16:42:26
 * @LastEditTime: 2020-11-25 17:39:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SZEos2.7.1.ucse:\xuchuangxing\openLab\src\assets\js\config.js
 */
export const ACCEPT_CONFIG = {
    image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
    document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt'],
    getAll(){
        return [...this.image, ...this.video, ...this.document]
    }, 
};