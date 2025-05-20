import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'QuantifAI';

  private platformID = inject(PLATFORM_ID);

  isDarkMode = signal(false);
  constructor() {
    if (isPlatformBrowser(this.platformID)) {
      this.isDarkMode.set(this.getInitialTheme());
    }
  }
  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'coffee' : false;
  }

  toggleTheme(): void {
    this.isDarkMode.update((value) => {
      const newValue = !value;
      if (isPlatformBrowser(this.platformID)) {
        localStorage.setItem('theme', newValue ? 'coffee' : 'caramellatte');
      }      
      return newValue;
    });
  }
}
