/*
 * @Description: 
 * @Author: yivi
 * @Date: 2021-12-07 16:28:18
 * @LastEditors: yivi
 * @LastEditTime: 2021-12-07 19:12:23
 */

export const getDate = function() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month > 9 ? month : '0' + month;
    day = day > 9 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

