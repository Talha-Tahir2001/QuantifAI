import { Component, computed, HostListener, inject,  Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, HouseIcon, InfoIcon, GithubIcon, ScanIcon } from 'lucide-angular';
import { ThemeService } from '../../services/theme.service';
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
  themeService = inject(ThemeService);
  isDark: Signal<boolean> = computed(() => this.themeService.theme() === 'fastape');
}
