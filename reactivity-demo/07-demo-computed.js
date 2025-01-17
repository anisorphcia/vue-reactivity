const targetMap = new WeakMap()
let activeEffect = null

function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, (dep = new Set()))
        }
        dep.add(activeEffect)
    }
}

function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    let dep = depsMap.get(key)
    if (dep) {
        dep.forEach(effect => { effect() })
    }
}
function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            let result = Reflect.get(target, key, receiver)
            track(target, key)
            return result
        },
        set(target, key, value, receiver) {
            let oldValue = target[key]
            let result = Reflect.set(target, key, value, receiver)
            if (oldValue != result) {
                trigger(target, key)
            }
            return result
        }
    }
    return new Proxy(target, handler)
}

function watchEffect(eff) {
    activeEffect = eff
    activeEffect()
    activeEffect = null
}

function ref(raw) {
    const r = {
        get value() {
            track(r, 'value')
            return raw
        },
        set value(newVal) {
            raw = newVal
            trigger(r, 'value')
        }
    }
    return r
}

function computed(getter) {
    let result = ref()
    effect(() => (result.value = getter()))
    return result
}

// let product = reactive({ price: 5, quantity: 2 })
// product.name = 'anything'
// let salePrice = computed(() => {
//     return product.price * 1.1
// })
// let total = computed(() => {
//     return product.price * product.quantity
// })
// console.log('before total', total.value)
// console.log('before salePrice', salePrice.value)
// console.log('before product', product)
// product.quantity = 9
// product.price = 10
// product.name = 'nothing'
// console.log('after total', total.value)
// console.log('after salePrice', salePrice.value)
// console.log('product', product)