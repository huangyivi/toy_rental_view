/*
 * @Description: 
 * @Author: yivi
 * @Date: 2021-12-06 21:03:12
 * @LastEditors: yivi
 * @LastEditTime: 2021-12-07 19:34:04
 */
import Toy from "../view/Toy"
import Member from "../view/Member"
import Rental from "../view/Rental"
export default [
    {
        key: "toy",
        name: "玩具管理",
        path:'/',
        component: <Toy />,
        exact: true
    },
    {
        key: "member",
        name: "会员管理",
        path:'/member',
        component: <Member />,
        exact: true
    },
    {
        key: "rental",
        name: "出租管理",
        path:'/rental',
        component: <Rental />,
        exact: true
    },
    
]