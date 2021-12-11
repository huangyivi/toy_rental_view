/*
 * @Description: 
 * @Author: yivi
 * @Date: 2021-12-07 14:46:24
 * @LastEditors: yivi
 * @LastEditTime: 2021-12-11 14:29:31
 */
import axios from "axios"

let DOMAIN = "http://localhost:7001/api/";


let Request = axios.create({
    baseURL: DOMAIN,
    headers: {
        "content-type" : "application/x-www-form-urlencoded",
    }
})

export const ToyApi = {
    getAll() {
        return Request.get('/toy/all')
    },
    edit(data) {
        return Request.post('/toy/edit',data);
    },
    del(data) {
        return Request.post('/toy/del',data);
    },
    add(data) {
        return Request.post('/toy/add',data);
    },
    search(data) {
        return Request.post('/toy/search',data);
    },
    getAllFree() {
        return Request.get('/toy/free');
    }
}
export const BossApi = {
    getAll() {
        return Request.get('/assistant/all')
    },
    del(data) {
        return Request.post('/assistant/del',data);
    },
    add(data) {
        return Request.post('/assistant/add',data);
    },
    search(data) {
        return Request.post('/assistant/search',data);
    }
}


export const MemberApi = {
    getAll() {
        return Request.get('/member/all')
    },
    edit(data) {
        return Request.post('/member/edit',data);
    },
    del(data) {
        return Request.post('/member/del',data);
    },
    add(data) {
        return Request.post('/member/add',data);
    },
    search(data) {
        return Request.post('/member/search',data);
    }
}

export const RentalApi = {
    getAll() {
        return Request.get('/rental/all')
    },
    edit(data) {
        return Request.post('/rental/edit',data);
    },
    del(data) {
        return Request.post('/rental/del',data);
    },
    add(data) {
        return Request.post('/rental/add',data);
    },
    return(data) {
        return Request.post('/rental/return',data)
    }
}


export const UserAPi = {
    login(data) {
        return Request.post('/user/login',data)
    },
    changePwd(data) {
        return Request.post('/user/changePwd',data)
    }
}