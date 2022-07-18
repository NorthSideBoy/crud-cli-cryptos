
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/form', component: () => import('pages/Form.vue') },
    ],
  },

  {
    path:'/',
    component: () => import('src/layouts/RegisterLayout.vue'),
    children: [
      {path: '/register', component: () =>import('pages/Register.vue')}
    ],
  },

  {
    path:'/',
    component: () => import('src/layouts/LoginLayout.vue'),
    children: [
      {path: '/login', component: () =>import('pages/Login.vue')}
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
