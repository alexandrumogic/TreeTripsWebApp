import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public constructor (private domSanitizer: DomSanitizer, public matIconRegistry: MatIconRegistry) {
    matIconRegistry.addSvgIcon('artar', domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/trees-categories/svg/artar.svg'));
    matIconRegistry.addSvgIcon('fag', domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/trees-categories/svg/fag.svg'));
    matIconRegistry.addSvgIcon('frasin', domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/trees-categories/svg/frasin.svg'));
    matIconRegistry.addSvgIcon('pin', domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/trees-categories/svg/pin.svg'));
    matIconRegistry.addSvgIcon('camp1', domSanitizer.bypassSecurityTrustResourceUrl('./assets/img/camping/svg/camp1.svg'));
  }
}
