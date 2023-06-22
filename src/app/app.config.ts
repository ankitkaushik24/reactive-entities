import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {coreInterceptor} from "./interceptors/core.interceptor";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(NoopAnimationsModule), provideHttpClient(withInterceptors([coreInterceptor]))]
};
