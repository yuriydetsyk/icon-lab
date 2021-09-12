import { Component, Input } from '@angular/core';

@Component({
  selector: 'bd-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() public showLogo = false;
  public currentYear = new Date().getFullYear();
}
