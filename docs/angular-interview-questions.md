# Angular Interview Questions For This Project

Use this file as a revision sheet before interviews. The answers are written around this project: a Test Management Portal built with Angular 20, standalone components, lazy routing, signals, RxJS, reactive forms, functional guards, functional HTTP interceptors, PrimeNG, Angular CDK, Tailwind, and Karma/Jasmine.

## 1. Project Architecture

### What is the high-level structure of this Angular project?

This project keeps the application code under `src/app` and shared root services under `src/services`.

- `src/app/features`: feature screens such as projects, test suites, test cases, test runs, login, users, roles, and modules.
- `src/app/core`: reusable app-level pieces like interceptors, guards, layout, shared components, models, and core services.
- `src/services`: shared services such as `CommonService`, `CommonDataService`, and `ThemeService`.
- `src/enviorments`: environment-specific configuration such as API base URL and Google client ID.

Interview answer:

> I would describe this as a feature-based Angular structure. Business screens live in `features`, reusable infrastructure lives in `core`, and API/domain services are separated so components do not directly build every HTTP call.

### Why is feature-based folder structure useful?

It keeps related component files together and makes the app easier to scale. For example, `test-suite-list.ts`, `test-suite-list.html`, and `test-suite-list.css` are colocated in one feature folder. If a developer is working on test suites, they can find the related TypeScript, template, and styles quickly.

### What is the role of the `core` folder?

The `core` folder contains app-wide infrastructure:

- `authGuard`: protects routes.
- `interceptors`: attach auth headers and manage the global loader.
- `services`: reusable app services like `ApiService`, `ModalService`, and `ExcelExportService`.
- `components`: shared UI components like pagination, loader, access denied page, and modal renderer.
- `layout`: the main layout used after login.
- `model`: shared TypeScript interfaces.

## 2. Standalone Components

### What are standalone components in Angular?

Standalone components are components that do not need to be declared inside an NgModule. They directly declare their dependencies using the `imports` array in the `@Component` decorator.

Project example:

```ts
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './users.html',
})
export class Users {}
```

### Why are standalone components useful?

They reduce NgModule boilerplate, make lazy loading easier, and make dependencies clearer. In this project, routes use `loadComponent` to lazy load standalone feature components.

### How is the app bootstrapped without `AppModule`?

The app uses `bootstrapApplication` in `src/main.ts`:

```ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

Global providers are configured in `src/app/app.config.ts` using `ApplicationConfig`.

## 3. Routing And Lazy Loading

### How is routing configured in this project?

Routes are defined in `src/app/app.routes.ts`. The app has public routes like `login` and protected routes under `MainLayoutComponent`.

Example:

```ts
{
  path: 'projects/:projectId/test-suites',
  loadComponent: () =>
    import('./features/test-suite-list/test-suite-list').then(m => m.TestSuiteList)
}
```

### What is lazy loading?

Lazy loading means loading code only when the user navigates to that route. Instead of putting every component into the initial bundle, Angular loads feature components on demand.

### Why is `loadComponent` used here?

Because the project uses standalone components. `loadComponent` lazy loads a single standalone component directly, without needing a feature module.

### What is `withComponentInputBinding()`?

`withComponentInputBinding()` allows route params, query params, and route data to bind directly to component inputs.

Project example:

```ts
projectId = input.required<string>();
suiteId = input.required<string>();
```

For a route like `projects/:projectId/test-suites/:suiteId/test-cases`, Angular can bind `projectId` and `suiteId` directly to these inputs.

### What is a wildcard route?

The wildcard route catches unknown URLs:

```ts
{
  path: '**',
  redirectTo: 'login'
}
```

It prevents users from seeing a blank page when they enter an invalid route.

## 4. Route Guards

### What is a route guard?

A route guard controls whether navigation is allowed. This project uses a functional `CanActivateFn` guard.

Project example:

```ts
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

### Why return `UrlTree` instead of calling `router.navigate()` inside a guard?

Returning a `UrlTree` is cleaner because it tells Angular Router what redirect should happen as part of the navigation decision. It avoids manually triggering a second navigation.

### What limitation does this guard have?

It only checks whether a token exists in `localStorage`. It does not verify whether the token is expired or valid. A stronger implementation could decode the JWT expiry or call an auth validation endpoint.

## 5. Dependency Injection

### What is dependency injection in Angular?

Dependency injection is Angular's system for providing classes or values to components and services without manually constructing them.

Project example:

```ts
private commonService = inject(CommonService);
private fb = inject(FormBuilder);
```

### What is the difference between constructor injection and `inject()`?

Constructor injection injects dependencies through constructor parameters. The `inject()` function is a newer style often used in standalone components, functional guards, functional interceptors, and services.

Both achieve dependency injection. This project mostly uses `inject()`.

### What does `providedIn: 'root'` mean?

It means Angular creates one singleton instance of the service for the whole app.

Project example:

```ts
@Injectable({
  providedIn: 'root',
})
export class CommonService {}
```

## 6. Signals And Change Detection

### What are Angular signals?

Signals are reactive state containers. A signal stores a value and notifies Angular when that value changes.

Project example:

```ts
testSuites = signal<TestSuite[]>([]);
loading = signal(false);
```

The value is read by calling the signal:

```html
@if (loading()) {
  ...
}
```

### What is `computed()`?

`computed()` creates a derived signal based on other signals.

Project example:

```ts
totalPages = computed(() => this.pageInfo()?.totalPages ?? 0);
```

Whenever `pageInfo` changes, `totalPages` recalculates automatically.

### What is `signal.update()`?

`update()` changes a signal based on its previous value.

Project example:

```ts
this.expandedIds.update((set) => {
  const next = new Set(set);
  next.add(id);
  return next;
});
```

Creating a new `Set` is important because it gives Angular a new reference to detect.

### What is `ChangeDetectionStrategy.OnPush`?

`OnPush` tells Angular to check a component mainly when inputs change, events happen, observables emit through async pipe, or signals update. It improves performance by reducing unnecessary checks.

This project uses `OnPush` in several components like `TestSuiteList`, `TestCaseList`, `Users`, and `PaginationComponent`.

### What is zoneless change detection?

This project enables:

```ts
provideZonelessChangeDetection()
```

Zoneless Angular reduces reliance on Zone.js for detecting async changes. Signals, explicit events, and Angular-aware APIs become more important because Angular is not depending on Zone.js to patch every async operation.

### Why is `NgZone.run()` used in Google login?

Google's SDK callback runs outside Angular's normal execution context. Wrapping the login logic in `ngZone.run()` ensures Angular notices state updates and navigation after the callback.

Project example:

```ts
this.ngZone.run(() => {
  this.authService.googleAuthLogin(googleIdtoken).subscribe(...);
});
```

## 7. Templates

### What are `@if` and `@for`?

They are Angular's modern control flow syntax.

Project example:

```html
@if (loading()) {
  <section>Loading...</section>
}

@for (suite of testSuites(); track suite.id) {
  <div>{{ suite.name }}</div>
}
```

### Why should `@for` use `track`?

`track` helps Angular identify list items efficiently. If the list changes, Angular can reuse DOM nodes instead of recreating everything.

Good project example:

```html
@for (suite of testSuites(); track suite.id) {
  ...
}
```

### What is event binding?

Event binding calls component methods when DOM events happen.

Project example:

```html
<button (click)="openCreateModal()">New Test Suite</button>
```

### What is property binding?

Property binding passes a TypeScript value into an HTML property or component input.

Project example:

```html
<app-pagination
  [currentPage]="currentPage()"
  [totalPages]="totalPages()"
  (pageChange)="onPageChange($event)"
></app-pagination>
```

### What is two-way binding?

Two-way binding combines property binding and event binding. This project mostly uses reactive forms instead of `[(ngModel)]`, which is usually cleaner for complex forms.

## 8. Reactive Forms

### What are reactive forms?

Reactive forms define form structure and validation in TypeScript using `FormBuilder`, `FormGroup`, and validators.

Project example:

```ts
userForm = this.fb.group(
  {
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  },
  { validators: this.passwordMatchValidator },
);
```

### Why use reactive forms over template-driven forms?

Reactive forms are better for complex forms because validation, state, and dynamic behavior are controlled in TypeScript. They are easier to test and easier to modify programmatically.

### What is a custom validator?

A custom validator is a function that returns either validation errors or `null`.

Project example:

```ts
passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
```

### What is `markAllAsTouched()`?

It marks all form controls as touched so validation messages become visible after submit.

Project example:

```ts
if (this.userForm.invalid) {
  this.userForm.markAllAsTouched();
  return;
}
```

### What is `patchValue()`?

`patchValue()` updates only matching form fields. It is useful in edit flows.

Project example:

```ts
this.userForm.patchValue({
  firstName: user.firstName,
  email: user.email,
  roleId: user.roleId,
});
```

## 9. Services And API Layer

### What is the purpose of `ApiService`?

`ApiService` wraps Angular `HttpClient` and centralizes the base API URL, query param creation, and common HTTP methods.

Project methods:

- `regularGetRequest<T>()`
- `post<T>()`
- `put<T>()`
- `delete<T>()`

### Why is a generic API service useful?

It avoids repeating the base URL and common HTTP setup in every component. It also makes it easier to add shared options later, such as headers, context, or error handling.

### What is the purpose of `CommonService`?

`CommonService` is the domain-facing service. Components call methods like:

- `getAllProjects()`
- `getTestSuites()`
- `createTestCase()`
- `getUserList()`
- `createRole()`
- `getAuthPermissions()`

It hides endpoint details from components.

### What is a possible improvement in `CommonService`?

Many methods currently return `Observable<any>`. A stronger approach is to use typed interfaces everywhere, such as `Observable<TestSuiteListResponse>` or `Observable<UserListResponse>`. That improves compile-time safety and interviewers like hearing that.

## 10. HTTP Client And RxJS

### What is an Observable?

An Observable represents a stream of async values. Angular `HttpClient` returns Observables for API calls.

Project example:

```ts
this.commonService.getUserList(params).subscribe({
  next: (res) => this.userList.set(res.content),
  error: (err) => this.showError(),
});
```

### Why do HTTP Observables need `subscribe()`?

HTTP Observables are lazy. The request is not sent until something subscribes.

### What is `tap()`?

`tap()` performs side effects without changing the emitted value.

Project example:

```ts
return this.api.post<LoginResponse>('auth/login', body).pipe(
  tap((response) => {
    localStorage.setItem('token', response.accessToken);
  }),
);
```

### What is `catchError()`?

`catchError()` handles errors in an Observable pipeline and returns a replacement Observable or rethrows the error.

Project example:

```ts
catchError((err) => {
  return throwError(() => err);
})
```

### What is `switchMap()`?

`switchMap()` maps one Observable into another and cancels the previous inner Observable if a new value arrives.

Project example:

```ts
this.commonService.getTestSuites(...).pipe(
  switchMap((res) =>
    this.excelExportService.exportToExcel(res, columns, fileName, sheetName)
  ),
);
```

Here it waits for API data, then switches to the Excel export Observable.

### What is `finalize()`?

`finalize()` runs cleanup logic when an Observable completes, errors, or is unsubscribed.

Project example:

```ts
return next(req).pipe(finalize(() => loaderHandle.close()));
```

This makes sure the global loader closes after every HTTP request.

## 11. HTTP Interceptors

### What is an HTTP interceptor?

An interceptor can inspect or modify HTTP requests and responses globally.

This project has:

- `authInterceptor`: adds the Bearer token and handles 401/403.
- `globalLoaderInterceptor`: shows and hides a loader around HTTP requests.

### How is the token attached to requests?

The auth interceptor reads the token from `localStorage` and clones the request:

```ts
authReq = req.clone({
  setHeaders: {
    Authorization: `Bearer ${token}`,
  },
});
```

HTTP requests are immutable, so cloning is required.

### How are interceptors registered?

In `app.config.ts`:

```ts
provideHttpClient(
  withFetch(),
  withInterceptors([authInterceptor, globalLoaderInterceptor])
)
```

### Why does interceptor order matter?

Interceptors run in the order they are provided for outgoing requests. Here, the auth header is added before the loader interceptor manages the request lifecycle.

### What is `HttpContextToken` used for?

It allows per-request metadata without modifying headers or params.

Project example:

```ts
export const SKIP_GLOBAL_LOADER = new HttpContextToken<boolean>(() => false);
```

This lets a request opt out of the global loader:

```ts
context: withSkipLoader()
```

## 12. Authentication And Authorization

### How does login work in this project?

The login component submits credentials to `CommonService.login()`. On success, the token and username are stored in `localStorage`, then the app navigates to the dashboard/projects route.

### What is the difference between authentication and authorization?

Authentication checks who the user is. Authorization checks what the user is allowed to do.

Project examples:

- Authentication: token existence checked by `authGuard`.
- Authorization: permission checks with `commonService.hasPermission('TESTSUITE_CREATE')`.

### How are permissions stored?

`CommonService` stores permissions in a signal:

```ts
private permissions = signal<string[]>([]);
```

It exposes helper methods:

- `hasPermission(permission)`
- `hasAnyPermission(permissions)`
- `hasAllPermissions(permissions)`

### What is a possible issue with permission storage?

Permissions are stored only in memory. If the page refreshes, the signal resets. A robust app should reload permissions after refresh, possibly from `auth/permissions`.

## 13. Component Communication

### How does parent-to-child communication work?

Parent components pass data through inputs.

Project example:

```ts
currentPage = input.required<number>();
totalPages = input.required<number>();
```

These inputs are used in `PaginationComponent`.

### How does child-to-parent communication work?

Child components emit events using `EventEmitter`.

Project example:

```ts
@Output() pageChange = new EventEmitter<number>();
```

The parent listens:

```html
(pageChange)="onPageChange($event)"
```

### What is `viewChild.required()`?

It gets a required reference to a template or child element. This project uses it to open modal templates.

Project example:

```ts
deleteConfirmModal = viewChild.required<TemplateRef<unknown>>('deleteConfirmModal');
```

## 14. UI Libraries

### Which UI libraries are used?

This project uses:

- PrimeNG for UI components like buttons, inputs, toast, select, and dialogs.
- Angular Material/CDK for utilities such as drag and drop.
- Tailwind CSS for utility-based styling.

### Where is PrimeNG configured?

PrimeNG is configured in `app.config.ts`:

```ts
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
    },
  },
  ripple: true,
})
```

### How is Angular CDK drag and drop used?

`TestCaseList` imports `DragDropModule` and uses `CdkDragDrop` with `moveItemInArray()` to reorder test cases locally.

```ts
onDrop(event: CdkDragDrop<TestCase[]>) {
  this.testCases.update((items) => {
    const copy = [...items];
    moveItemInArray(copy, event.previousIndex, event.currentIndex);
    return copy;
  });
}
```

## 15. Environment Configuration

### What are Angular environment files?

Environment files store configuration that changes between development and production, such as API URLs or third-party client IDs.

This project uses file replacement in `angular.json`:

```json
{
  "replace": "src/enviorments/environment.ts",
  "with": "src/enviorments/environment.prod.ts"
}
```

### What does `environment.baseUrl` do?

`ApiService` reads `environment.baseUrl` and prefixes all API paths with it:

```ts
private baseUrl = environment.baseUrl;
```

## 16. Build And Configuration

### What does `ng build --configuration production` do?

It creates an optimized production build. In this project, production build enables optimization, output hashing, AOT, disables source maps, and applies bundle budgets.

### What are Angular budgets?

Budgets set size limits for generated bundles. They help prevent the app from becoming too large.

Project example:

```json
{
  "type": "initial",
  "maximumWarning": "2mb",
  "maximumError": "3mb"
}
```

### What is AOT?

AOT means Ahead-of-Time compilation. Angular compiles templates during build time instead of in the browser, improving startup performance and catching template errors earlier.

## 17. Testing

### What testing setup does this project use?

The project uses Karma and Jasmine through Angular's test builder.

Script:

```json
"test": "ng test"
```

### What is a unit test in Angular?

A unit test checks a component, service, guard, or pipe in isolation. For example, a service test could verify that `ApiService.regularGetRequest()` builds query params correctly.

### What should you test in this project?

Good interview examples:

- `authGuard` redirects to login when no token exists.
- `authInterceptor` adds Authorization header when token exists.
- `globalLoaderInterceptor` closes loader in `finalize()`.
- `PaginationComponent` emits correct page numbers.
- `Users` form validator returns `passwordMismatch` when passwords differ.
- `CommonService.login()` stores token after successful login.

### How would you test a component with signals?

Set signal values, trigger change detection, and assert template output or component state.

Example idea:

```ts
component.loading.set(true);
fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain('Loading');
```

## 18. Performance

### What performance techniques are already used?

- Lazy loaded standalone components.
- `ChangeDetectionStrategy.OnPush`.
- Signals and computed state.
- `@for` with `track`.
- Production build optimization and output hashing.

### What improvements could be made?

- Use typed Observables instead of `any`.
- Avoid unnecessary subscriptions or unsubscribe from long-lived streams.
- Debounce filter form value changes before API calls.
- Move repeated pagination logic into the shared pagination component.
- Store permissions in a more refresh-safe way.
- Add route-level permission guards for admin pages.

### Why should filter input API calls be debounced?

If an API call is triggered on every keystroke, the app may send too many requests. RxJS `debounceTime()` and `distinctUntilChanged()` can reduce unnecessary calls.

Example:

```ts
this.filterForm.valueChanges
  .pipe(debounceTime(300), distinctUntilChanged())
  .subscribe(() => this.getUserList());
```

## 19. Security

### Is storing JWT tokens in `localStorage` safe?

It is common but has risk. If an attacker can run JavaScript through XSS, they can read `localStorage`. More secure apps often use HttpOnly cookies, strict Content Security Policy, and strong XSS prevention.

### What security checks should happen on the backend?

Frontend guards improve UX, but backend APIs must still enforce authentication and permissions. A user can bypass frontend checks by calling APIs directly.

### Why should error messages be handled carefully?

Showing raw backend errors can leak internal details. This project often displays `err.error?.message`, which is useful, but production apps should ensure those messages are safe for users.

## 20. Common Interview Questions With Strong Answers

### Explain this project in Angular terms.

This is an Angular 20 standalone application for managing projects, test suites, test cases, test runs, and administration. It uses lazy-loaded standalone feature components, functional guards and interceptors, signals for component state, reactive forms for login and admin forms, PrimeNG and Tailwind for UI, and a layered service structure where `CommonService` handles domain API calls through a generic `ApiService`.

### How would you explain the data flow on the Test Suite page?

The route provides `projectId` through component input binding. On init, the component calls `CommonService.getTestSuites(projectId, params)`. The service delegates to `ApiService`, which uses `HttpClient`. Interceptors attach auth headers and show the global loader. When the response arrives, the component updates signals like `testSuites`, `pageInfo`, and `loading`, and the template reacts automatically.

### How would you explain login flow?

The login form is a reactive form. On submit, the component calls `CommonService.login()`. The service posts credentials to `auth/login`, stores the token and username in `localStorage` on success, and then the component navigates to `/dashboard`, which redirects to `/projects`. The protected app routes are guarded by `authGuard`, which checks for the token.

### How would you explain authorization in this app?

The app has permission-based UI checks. `CommonService` keeps permissions in a signal and exposes helper methods like `hasPermission()`. In templates, buttons can be shown conditionally, for example only showing "New Test Suite" if the user has `TESTSUITE_CREATE`.

### How would you improve this project if given more time?

I would improve typing by replacing `any` with specific interfaces, add stronger auth handling for token expiry and refresh, reload permissions after page refresh, add debounced search/filtering, improve unit test coverage for guards/interceptors/forms, and move repeated pagination logic fully into the shared pagination component.

### What Angular 20 features can you mention from this project?

- Standalone components.
- `bootstrapApplication`.
- Functional guards.
- Functional interceptors.
- Signals.
- `computed()`.
- Signal inputs with `input.required()`.
- `viewChild.required()`.
- Modern template control flow with `@if` and `@for`.
- Zoneless change detection.

## 21. Quick Revision Checklist

- Explain standalone components and why this app does not need `AppModule`.
- Explain `app.config.ts` providers.
- Explain lazy loading with `loadComponent`.
- Explain route params with `input.required()` and `withComponentInputBinding()`.
- Explain `authGuard` and why it returns `UrlTree`.
- Explain functional interceptors and request cloning.
- Explain `HttpContextToken` and `SKIP_GLOBAL_LOADER`.
- Explain signals, computed signals, and `OnPush`.
- Explain reactive forms, validators, `patchValue`, and `markAllAsTouched`.
- Explain RxJS `subscribe`, `tap`, `catchError`, `switchMap`, and `finalize`.
- Explain why `localStorage` token storage has security tradeoffs.
- Explain how you would test guards, interceptors, services, and forms.

## 22. Questions To Ask The Interviewer

- Does your Angular team use standalone components or NgModules?
- How do you manage state: services, signals, NgRx, or another library?
- How do you handle authentication and token refresh?
- What is your testing strategy for components and services?
- Do you use Angular's latest control flow and signals in production?
- How do you structure large Angular applications by feature or domain?

