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
    matIconRegistry.addSvgIcon('artar', domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/trees-categories/artar.png'));
  }
}
