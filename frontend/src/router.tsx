import { createBrowserHistory, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const history = createBrowserHistory();

export const router = createRouter({
  history,
  routeTree,
  context: {
    // auth will be passed down from App component
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}