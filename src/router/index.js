import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/store'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/rank',
        name: 'Rank',
        meta: { requiresAuth: true },
        component: () =>
            import ( /* webpackChunkName: "rank" */ '../views/Rank.vue'),
    },
    {
        path: '/old-man-rank',
        name: 'OldManRank',
        meta: { requiresAuth: true },
        component: () =>
            import ( /* webpackChunkName: "rank" */ '../views/OldManRank.vue')
    },
    {
        path: '/record',
        name: 'Record',
        component: () =>
            import ( /* webpackChunkName: "rank" */ '../views/Record.vue')
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        meta: { requiresAuth: true },
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue'),
    },
]

const router = new VueRouter({
    routes,
})

//Navigation Guards
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {

        // this route requires auth, check if logged in
        // if not, redirect to login page.
        let userId = store.state.userId || localStorage.getItem('id');
        console.log(userId);
        if (store.state.student.logined || userId != undefined) {
            next()
        } else {
            next({
                path: '/',
            })
            alert('请先签到')
        }
    } else {
        next() // 确保一定要调用 next()
    }

})

export default router