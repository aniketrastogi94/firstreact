export default {
    items: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Home',
                    type: 'item',
                    url: '/dashboard/default',
                    icon: "home_outline",
                }
            ]
        },
        {
            id: 'ui-element',
            title: 'UI ELEMENT',
            type: 'group',
            icon: 'icon-ui',
            children: [
                {
                    id: 'basic',
                    title: 'Order',
                    type: 'item',
                    url:'/dashboard/order',
                    icon: 'shopping_cart',

                }
            ]
        },

    ]
}
