import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from 'app/theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routing } from './dashboard.routing';

import { DashboardComponent } from './dashboard.component';
import { ConfiguratorComponent } from './configurator/configurator.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    NgbModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    ConfiguratorComponent
  ],
  providers: [
  ]
})
export class DashboardModule { }
