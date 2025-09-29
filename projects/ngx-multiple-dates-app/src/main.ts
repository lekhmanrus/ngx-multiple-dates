import { enableProdMode, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { MatNativeDateModule } from '@angular/material/core';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';

import { RootComponent } from './app/components/root/root.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(RootComponent, {
  providers: [
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MatNativeDateModule,
      MtxPopoverModule
    ),
    provideHttpClient(withFetch())
  ]
})
  .catch((error) => console.error(error));
