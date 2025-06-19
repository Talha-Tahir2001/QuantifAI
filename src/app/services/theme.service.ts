import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  REQUEST,
  signal,
  WritableSignal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformID = inject(PLATFORM_ID);
  private request = inject(REQUEST, { optional: true });
  readonly theme: WritableSignal<'fastape' | 'goblinhero'> =
    signal('fastape');
  constructor() {
    if (isPlatformBrowser(this.platformID)) {
      const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('theme='))
        ?.split('=')[1] as 'fastape' | 'goblinhero' | undefined;
      this.theme.set(cookie ?? 'fastape');
      document.documentElement.setAttribute('data-theme', this.theme());
    } else if (this.request) {
      const cookieHeader = this.request.headers.get('cookie') ?? '';
      const match = cookieHeader.match(/theme=(fastape|goblinhero)/);
      // this.theme.set((match?.[1] as 'fastape' | 'goblinhero') ?? 'fastape');
      this.theme.set(
        (match?.[1] ?? 'fastape') as 'fastape' | 'goblinhero'
      );
    }
  }

  toggleTheme(): void {
    const next = this.theme() === 'fastape' ? 'goblinhero' : 'fastape';
    this.theme.set(next);
    if (isPlatformBrowser(this.platformID)) {
      document.documentElement.setAttribute('data-theme', next);
      document.cookie = `theme=${next}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
    }
  }
  get serverTheme() {
    return this.theme(); // used during SSR rendering
  }
}
