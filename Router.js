/**
 * We use a external file 'Router.js' to better align with the future v3
 * and it's functional components.
 */
import Page from 'page'

const Router = {}
let events = {}
let ctx = null

Router.push = Router.go = Page.show
Router.back = Page.back

Router.getContext = () => ctx
Router.getPath = () => ctx.path

Router.on = (event, handler) => {
  if (!events[event]) {
    events[event] = []
  }

  if (events[event].indexOf(handler) === -1) {
    events[event].push(handler)
  }
}

Router.off = (event, handler) => {
  const handlers = events[event]

  if (handlers && handlers.length && handler) {
    const handlerIndex = handlers.indexOf(handler)
    if (handlerIndex > -1) {
      handlers.splice(handlerIndex, 1)
    }

    if (!handlers.length) {
      delete events[event]
    }
  }
}

Router.fire = (event, data) => {
  const handlers = events[event]
  if (handlers && handlers.length) {
    handlers.forEach(handler => handler(data))
  }
}

Router.destroy = () => {
  events = {}
}

Router.on('change', newCtx => {
  ctx = newCtx
})

export default Router
