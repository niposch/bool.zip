import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MintermInputComponent } from './minterm-input/minterm-input.component';

@NgModule({
  declarations: [
    AppComponent,
    MintermInputComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
