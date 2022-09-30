function transformationTime(date) {
  let replaceDate = date.replace(/-/g, '/');
  let time = new Date(replaceDate);
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  console.log(y + '-' + transformationDate(m) + '-' + transformationDate(d))
}
function transformationDate(data) { //转换时间格式
  return data < 10 ? '0' + data : data;
}
export default transformationTime
