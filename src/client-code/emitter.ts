type Fn = () => void
export const emitter = (() => {
  let listeners: Fn[] = []
  return {
    on(fn: Fn) {
      listeners.push(fn)
    },
    off(fn: Fn) {
      listeners = listeners.filter((t) => fn === t)
    },
    emit() {
      listeners.forEach((fn: Fn) => {
        fn()
      })
    },
  }
})()
