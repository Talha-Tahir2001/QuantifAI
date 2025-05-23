import { CommonModule } from '@angular/common';
import { Component, HostListener, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  scrolled = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  readonly isDarkMode = input<boolean>(false);
  readonly onThemeToggle = input<() => void>(() => {});
}
