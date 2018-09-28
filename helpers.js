/** Creates a route callback with the specified data */
export const getRouteMiddleware = (routePath, routes) => {
  if (routes[routePath].constructor !== Object) {
    routes[routePath] = { component: routes[routePath] };
  }

  const { data = {}, loader } = routes[routePath];
  let hasPreloaded = false;

  const loadPreloads = () => {
    const { preload } = routes[routePath];
    setTimeout(() =>
      preload.forEach(preloadRoute => {
        const loader = routes[preloadRoute].loader;
        if (typeof loader === 'function') {
          loader().then(({ default: component }) => {
            routes[preloadRoute].component = component;
          });
        }
      }),
    );
    hasPreloaded = true;
  };

  return (ctx, next) => {
    const {
      components,
      params,
      state: { path, ...state },
    } = ctx;

    const { component, preload } = routes[routePath];

    /** Remove pathregexp path match */
    delete params[0];
    const routeData = Object.assign({}, data, state, { params });

    /** If no component present and */
    if (!component) {
      /** If there's a loader function, load it */
      if (typeof loader === 'function') {
        loader().then(({ default: component }) => {
          components.push({ component, data: routeData });
          if (preload && !hasPreloaded) {
            loadPreloads();
          }
          next();
        });
      } else {
        throw new Error(
          `[svelte-router] No component for route "${routePath}"`,
        );
      }
      return;
    }

    components.push({ component, data: routeData });
    if (preload && !hasPreloaded) {
      loadPreloads();
    }
    next();
  };
};

export const getSveltedHierarchy = Router => ctx => {
  const { components } = ctx;
  const props = {
    page: null,
    context: ctx,
    path: ctx.path,
  };

  /** Data needs to always be an object or else nesting won't work */
  components.reduce((prev, { component, data = {} }) => {
    data.page = null;
    prev.page = {
      child: component,
      props: data,
    };

    return prev.page.props;
  }, props);

  Router.store.fire('router:beforeNavigation', ctx);

  Router.set(props);

  Router.store.fire('router:navigation', ctx);
};
