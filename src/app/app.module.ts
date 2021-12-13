import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TermInputComponent } from './minterm-input/term-input.component';
import { VariableInputComponent } from './variable-input/variable-input.component';

@NgModule({
  declarations: [
    AppComponent,
    TermInputComponent,
    VariableInputComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
