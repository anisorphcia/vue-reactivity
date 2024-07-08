class Dep {
    constructor() {
      this.subscribers = new Set();
    }

    depend() {
      if (activeEffect) {
        this.subscribers.add(activeEffect);
      }
    }

    notify() {
      this.subscribers.forEach((sub) => sub());
    }
  }

  let activeEffect = null;

  function watchEffect(effect) {
    activeEffect = effect;
    effect();
    activeEffect = null;
  }

  function reactive(target) {
    const depMap = new WeakMap();

    const getDep = (target, key) => {
      let deps = depMap.get(target);
      if (!deps) {
        deps = new Map();
        depMap.set(target, deps);
      }
      let dep = deps.get(key);
      if (!dep) {
        dep = new Dep();
        deps.set(key, dep);
      }
      return dep;
    };

    const handler = {
        get(target, property, receiver){
            const dep = getDep(target, property)
            dep.depend()
            return Reflect.get(target, property, receiver)
        },
        set(target, property, value, receiver){
            const dep = getDep(target, property)
            dep.notify()
            return Reflect.set(target, property, value, receiver)
        }
    }
    return new Proxy(target, handler)
  }