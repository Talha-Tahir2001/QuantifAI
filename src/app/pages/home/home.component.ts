import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgxTypedWriterModule } from 'ngx-typed-writer';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeaturesComponent } from '../../components/features/features.component';
import { LucideAngularModule, ArrowRightIcon } from 'lucide-angular';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';

@Component({
  selector: 'app-home',
  imports: [
    FooterComponent,
    NgxTypedWriterModule,
    RouterLink,
    FeaturesComponent,
    LucideAngularModule,
    HowItWorksComponent,
  ],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {
  isBrowser = signal(false);

  readonly ArrowRightIcon = ArrowRightIcon;
  platformID = inject(PLATFORM_ID);
  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformID));
  }
}
