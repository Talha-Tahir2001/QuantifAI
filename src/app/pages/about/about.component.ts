import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {LucideAngularModule, UserIcon} from 'lucide-angular';
@Component({
  selector: 'app-about',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './about.component.html',
  styles: ``
})
export class AboutComponent {
  readonly UserIcon = UserIcon;
}
