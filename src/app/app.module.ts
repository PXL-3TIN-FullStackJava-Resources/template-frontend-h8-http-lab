import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ConfessionItemComponent } from './components/confession-item/confession-item.component';
import { AddConfessionComponent } from './components/add-confession/add-confession.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InMemConfessionService } from './services/inmemorydb.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';


@NgModule({
  declarations: [
    AppComponent,
    ConfessionItemComponent,
    AddConfessionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemConfessionService),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
