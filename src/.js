import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Demo/Home/Home'));
//Order
const Order= React.lazy(()=> import('./Demo/Order/order'));
const routes = [
    { path: '/dashboard/default', exact: true, name: 'Default', component: DashboardDefault },
    {path:'/order', exact:true,name:'Default' ,component:Order},

];

export default routes;
