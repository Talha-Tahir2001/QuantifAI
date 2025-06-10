import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
// import { NgxTypedJsModule } from 'ngx-typed-js';
import { NgxTypedWriterModule } from 'ngx-typed-writer';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeaturesComponent } from '../../components/features/features.component';
import { LucideAngularModule, ArrowRightIcon } from 'lucide-angular';
import { HowItWorksComponent } from "../../components/how-it-works/how-it-works.component";

// type NgxTypedJsModuleType = typeof import('ngx-typed-js').NgxTypedJsModule;
@Component({
  selector: 'app-home',
  imports: [FooterComponent, NgxTypedWriterModule, RouterLink, FeaturesComponent, LucideAngularModule, HowItWorksComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {
  isBrowser = signal(false);
  // ngxTypedJsModule = signal<NgxTypedJsModuleType | null>(null);

  readonly ArrowRightIcon = ArrowRightIcon;
  platformID = inject(PLATFORM_ID);
  constructor() {

    this.isBrowser.set(isPlatformBrowser(this.platformID));
    // afterNextRender(() => {
    //     if (this.isBrowser()) {
    //       // Dynamically import NgxTypedJsModule only on the client-side
    //      import('ngx-typed-js').then(m => {
    //         // Update the signal with the dynamically loaded module
    //         this.ngxTypedJsModule.set(m.NgxTypedJsModule);
    //       }).catch(err => {
    //         console.error('Failed to load NgxTypedJsModule on client:', err);
    //       });
    //     }
    //   });
  }
}
