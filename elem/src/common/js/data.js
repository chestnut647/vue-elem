export function formatDate(date, fmt) {
    var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日子
        'h+': date.getHours(), //小时
        'm+': date.getMinutes() // 分钟
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let key in o) {
        if (new RegExp(`(${key})`).test(fmt)) {
            let str = o[key] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 2) ? padLeftZero(str) : str);
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}