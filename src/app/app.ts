import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { ThemeService } from '@primeuix/themes';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../services/theme.service';
import { GlobalLoaderComponent } from './core/components/global-loader/global-loader.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, GlobalLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('test-management');
  private themeService = inject(ThemeService);
}
