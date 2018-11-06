# svelte-page

> Nested routing with [`page.js`](https://github.com/visionmedia/page.js) for svelte

## How to use

1. Build a object with all your routes:

```js
export default {
  '/': home,
  '/other': other,
  '/things': {
    component: things,
    data: { foo: 'A custom property' },
  },
  '/things/:thing*': thing,
  '/things/:thing/subthing/': subthing,
}
```

2. Pass it to the `<Router />`

```html
<Router routes={routes} />

<script>
  import routes from './routes.js'

  export default {
    data() {
      return {
        routes
      }
    }
  }
</script>
```

Every page may receive the following properties:

- Any property passed to the page programatically with the `Router.go(path, { ...props })` or in the `routes.js` definition
- `params` - An object representing all the parameters from the URL
- `page`
  - `child` - The nested route component that should be rendered;
  - `props` - The props that should be passed to the nested component

3. For nested routes, use the `<NestedRoute>`

```html
Here is my sub-page:
<br>
<NestedRoute {page} />

<script>
  export default {
    components: {
      NestedRoute: 'svelte-page/NestedRoute.html'
    }
  }
</script>
```

`<NestedRoute />` can fire events to allow communication between parent and child pages.

Available events:

- `action`
- `response`
- `event`

**Example:**

```html
<NestedRoute on:action="handle(event)" />
```

## Props

```html
<Router
  routes={routes}
  strict={true}
  hashbang={true}
>
```

- `routes` - The routes object `(default: undefined)`
- `strict` - If false, match trailling slash `(default: true)`
- `hashbang` - Add `#!` before urls `(default: true)`

**Dynamic**:

- `context` - The `page.js` context object
- `path` - The current router path

## Slots

Both `<Router>` and `<NestedRoute>` have the optional `default` slot which is only rendered when the current route isn't associated with any component.

```html
<Router ...>
  404 - Route not found
</Router>

<NestedRoute>
  Nested route not found
</NestedRoute>
```

## Events

### Component events

When a route isn't found, both the `<Router>` and `<NestedRoute>` fire a `notFound` event.

```html
<Router on:notFound="console.log('Route not found!!!')" />
<NestedRoute on:notFound="console.log('NestedRoute not found!!!')" />
```

---

The `<Router />` adds itself to the `root` component as a `router` property, so it's also possible to get the context by observing its lifecycle:

```html
<!-- Some other component down the hierarchy -->
<script>
  export default {
    oncreate() {
      this.root.router.on('update', ({ current }) => {
        console.log('Current path:', current.context.path)
      })
    }
  }
</script>
```

### Static events

The `Router` constructor has a `change` event which can be listened in the same way as you would do with a svelte component:

```js
import Router from 'svelte-page'

const onRouteChange = context => {
  console.log('Current path:', context.path)
}

export default {
  oncreate() {
    Router.on('change', onRouteChange)
  },
  ondestroy() {
    Router.off('change', onRouteChange)
  },
}
```

Do note these are **static** calls and we're not dealing directly with the `<Router/>` component.

## Static Methods

```html
<!-- Some other component down the hierarchy -->
<script>
  import Router from 'svelte-page'

  export default {
    oncreate() {
      /** Show the specified route with an optional data object */
      Router.go('/about', optionalData)
      Router.push('/about', optionalData)

      /** Go back to the previous route */
      Router.back()
    }
  }
</script>
```

## Example

**App.html**

```html
<Router {routes} />

<script>
  import Home from './routes/Home.html';
  import About from './routes/About.html';
  import AboutPersonTemplate from './routes/AboutPersonTemplate.html';
  import AboutPerson from './routes/AboutPerson.html';

  export default {
    components: {
      Router: 'svelte-page/Router.html',
    },
    data() {
      return {
        routes: {
          "/": Home,
          /** About page will have a {name} prop */
          "/about": {
            component: About,
            data: { name: 'Text name' }
          },
          /**
           * Page will have {page.child} because of nested routes
           **/
          "/about/*": AboutPersonTemplate,
          /** Page will have a {params.whoami} prop */
          "/about/:whoami": AboutPerson
        }
      }
    }
  }
</script>
```

**AboutPersonTemplate.html**

```html
<NestedRoute {page} />

<script>
  export default {
    components: {
      NestedRoute: 'svelte-page/NestedRoute.html',
    },
  }
</script>
```

For more examples, please check the [`example/src/routes.js`](https://github.com/kaisermann/svelte-router/blob/master/example/src/routes.js) file.

## Credits and inspirations

- [tivac/svelte-routing](https://github.com/tivac/svelte-routing/) :grin:
