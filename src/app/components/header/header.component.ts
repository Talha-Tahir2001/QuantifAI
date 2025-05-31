import { CommonModule } from '@angular/common';
import { Component, HostListener, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, HouseIcon, InfoIcon, GithubIcon, ScanIcon } from 'lucide-angular';
@Component({
  selector: 'app-header',
  imports: [ RouterModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {

  readonly HouseIcon = HouseIcon;
  readonly InfoIcon = InfoIcon;
  readonly GithubIcon = GithubIcon;
  readonly ScanIcon = ScanIcon;

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
