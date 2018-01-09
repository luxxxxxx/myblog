
const crypto = require('crypto');
      

let obj = {  // 使用cipher and decipher
    //str  加密解密的 字符串     cb 回调函数
    cipher : (str,cb) => {  //加密
        let encrypted = '';
        const cipher = crypto.createCipher('aes192', 'luxxxxxx');
        cipher.on('readable', () => {
            const data = cipher.read();
            if (data) 
                encrypted += data.toString('hex');
        });
        cipher.on('end', () => {
            cb(encrypted)
        });
        cipher.write(str);
        cipher.end();
    },
    decipher : (str,cb) => {
        let decrypted = '';
        const decipher = crypto.createDecipher('aes192', 'luxxxxxx');
        decipher.on('readable', () => {
            const data = decipher.read();
            if (data)
                decrypted += data.toString('utf8');
        });
        decipher.on('end', () => {
            cb(decrypted);
        });
        decipher.write(str, 'hex');
        decipher.end();
    }
}
module.exports = obj;