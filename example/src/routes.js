import home from './pages/home.html'

export default {
  '/': {
    component: home,
    preload: ['/other', '/things'],
  },
  '/other': {
    loader: () => import('./pages/other.html'),
  },
  '/things': {
    loader: () => import('./pages/things.html'),
    data: { foo: 'This is a foo value' },
  },
  '/things/:thing*': {
    loader: () => import('./pages/thing.html'),
    preload: ['/things/:thing/subthing/'],
  },
  '/things/:thing/subthing/': {
    loader: () => import('./pages/subthing.html'),
  },
}
