
let obj = {  //enCode 加密   deCode  解密
    encode : (str) => {
        let arr = [];
        for (var i = 0; i < str.length; i++) {
            arr[i] = str.charCodeAt(i) + i;
        }
        let string = '';
        for (let j in arr) {
            string += String.fromCharCode(arr[j]);
        }
        let encodeStr = encodeURIComponent(string);
        return encodeStr;
    },
    decode : (str) => {  //这里处理过异常，解析失败自动返回字符串err 
        try {
            let deCodeStr = decodeURIComponent(str),
                arr = [];
            for (let i = 0; i < deCodeStr.length; i++) {
                arr[i] = deCodeStr.charCodeAt(i) - i;
            }
            let string = '';
            for (let i in arr) {
                string += String.fromCharCode(arr[i])
            }
            return string;
        } catch (e) {
            return 'err'
        }
    }
}



module.exports = obj;