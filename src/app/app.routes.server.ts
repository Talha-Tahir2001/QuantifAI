import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  },
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'detect',
    renderMode: RenderMode.Client
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender
  }
];
