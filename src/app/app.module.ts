import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AgmCoreModule } from '@agm/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapControllerComponent } from './components/dashboard/map-controller/map-controller.component';
import { RouteControllerComponent } from './components/dashboard/route-controller/route-controller.component';

import { MapService } from './services/map.service';
import { TreesService } from './services/trees.service';
import { RoutesService } from './services/routes.service';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavbarComponent,
    DashboardComponent,
    MapControllerComponent,
    RouteControllerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCCvOH0fbWoRqlwuwGGl-sNZJuO9tKcq2M'
    }),
    MatSliderModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTabsModule,
    MatStepperModule,
    MatIconModule,
    MatInputModule
  ],
  providers: [ MapService, TreesService, RoutesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
