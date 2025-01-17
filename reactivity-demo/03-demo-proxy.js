let item = {
    price: 5,
    quantity: 2
}

// let proxiedProduct = new Proxy(product, {
//     get(target, key, receiver) {
//         console.log('get was called with key = ' + key)
//         return Reflect.get(target, key, receiver)
//     },
//     set(target, key, value, receiver) {
//         console.log('set was called with key = ' + key + ' and value = ' + value)
//         return Reflect.set(target, key, value, receiver)
//     }
// })
// proxiedProduct.quantity = 5
// console.log(proxiedProduct.quantity)

function reactive(target){
    const handler = {
        get(target, key, receiver) {
            console.log('get was called with key = ' + key)
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            console.log('set was called with key = ' + key + ' and value = ' + value)
            return Reflect.set(target, key, value, receiver)
        }
    }
    return new Proxy(target, handler)
}

let product = reactive(item)
product.quantity = 7
console.log(product.quantity)