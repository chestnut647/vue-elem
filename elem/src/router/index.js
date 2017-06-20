import Vue from 'vue'
import Router from 'vue-router'
import Goods from '../components/goods/Goods'
import Seller from '../components/seller/Seller'
import Ratings from '../components/ratings/Ratings'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/goods',
            name: 'Goods',
            component: Goods
        },
        {
            path: '/seller',
            name: 'Seller',
            component: Seller
        },
        {
            path: '/ratings',
            name: 'Ratings',
            component: Ratings
        }
    ]
})