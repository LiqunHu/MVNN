const CryptoJS = require('crypto-js');
let hash = CryptoJS.MD5("Message");
console.log(hash.toString());
