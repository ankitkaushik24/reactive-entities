import {NgModule} from "@angular/core";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {coreInterceptor} from "./interceptors/core.interceptor";
import {AppComponent} from "./app.component";

@NgModule({
  imports: [NoopAnimationsModule],
  providers: [provideHttpClient(withInterceptors([coreInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule {}
