import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SpinnerModule } from './shared/spinner/spinner.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, RouterModule, SpinnerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
