import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, GithubIcon, LinkedinIcon } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [DatePipe, LucideAngularModule],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {
  readonly GithubIcon = GithubIcon;
  readonly LinkedinIcon = LinkedinIcon;
  
  public Year : Date = new Date();
}
