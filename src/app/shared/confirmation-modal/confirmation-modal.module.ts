import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '@app/core/core.module';
import { ConfirmationModalComponent } from './component/confirmation-modal.component';
import { ConfirmationService } from './service/confirmation.service';

@NgModule({
  declarations: [ConfirmationModalComponent],
  exports: [ConfirmationModalComponent],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [ConfirmationService],
})
export class ConfirmationModalModule {}
