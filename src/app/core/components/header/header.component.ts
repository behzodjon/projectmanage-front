import { Component } from '@angular/core';
import { userSelector } from '@core/store/selectors/auth.selectors';
import { Store } from '@ngrx/store';
import * as AuthActions from '@core/store/actions/auth.actions';
import { LocalStorageKeys } from '@app/shared/enums/LocalStorageKeys';
import { AppLanguage } from '@app/shared/enums/AppLanguage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  user$ = this.store.select(userSelector);
  appLanguage: string =
    localStorage.getItem(LocalStorageKeys.LANG) || AppLanguage.En;

  constructor(
    private store: Store,
    private translateService: TranslateService
  ) {
    this.translateService.use(this.appLanguage);
  }
  onToggleLang(lang: string): void {
    this.appLanguage = lang;
    localStorage.setItem(LocalStorageKeys.LANG, lang);
    this.translateService.use(this.appLanguage);
  }
  onLogOut(): void {
    this.store.dispatch(AuthActions.LogOut());
  }
}
