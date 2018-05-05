import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AgmCoreModule } from '@agm/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { DirectionsMapDirective } from './components/map/directions-map.directive';
import { AccountComponent } from './components/dashboard/account-controller/account/account.component';
import { UserService } from './services/user.service';
import { RoutesSavedComponent } from './components/dashboard/route-controller/routes-saved/routes-saved.component';
import { RoutesPublicComponent } from './components/dashboard/route-controller/routes-public/routes-public.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavbarComponent,
    DashboardComponent,
    MapControllerComponent,
    RouteControllerComponent,
    DirectionsMapDirective,
    AccountComponent,
    RoutesSavedComponent,
    RoutesPublicComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBLfs4ab6ODh4tuJkR7r38lhEaw_kKc_ZI'
    }),
    MatSliderModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTabsModule,
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  providers: [ MapService, TreesService, RoutesService, UserService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
