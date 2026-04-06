import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GlobalLoaderService } from '../../services/global-loader.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  template: `
    @if (loader.isVisible()) {
      <div class="loader-overlay" aria-live="polite" aria-busy="true" role="status">
        <div class="loader-content">
          <div class="spinner-wrap" aria-hidden="true">
            <svg class="ring-ticks" viewBox="0 0 200 200">
              @for (tick of ticks; track tick.index) {
                <line
                  [attr.x1]="tick.x1"
                  [attr.y1]="tick.y1"
                  [attr.x2]="tick.x2"
                  [attr.y2]="tick.y2"
                  [attr.stroke-width]="tick.strokeWidth"
                />
              }
            </svg>

            <svg class="ring-outer" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" />
            </svg>

            <svg class="ring-mid" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="72" />
            </svg>

            <svg class="ring-inner" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="54" />
            </svg>

            <div class="dot"></div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './global-loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoaderComponent {
  protected readonly loader = inject(GlobalLoaderService);
  protected readonly ticks = Array.from({ length: 32 }, (_, index) => {
    const cx = 100;
    const cy = 100;
    const r = 90;
    const angle = (index / 32) * Math.PI * 2 - Math.PI / 2;
    const isMajor = index % 8 === 0;
    const lineLength = isMajor ? 10 : 5;

    return {
      index,
      x1: cx + Math.cos(angle) * r,
      y1: cy + Math.sin(angle) * r,
      x2: cx + Math.cos(angle) * (r - lineLength),
      y2: cy + Math.sin(angle) * (r - lineLength),
      strokeWidth: isMajor ? 2 : 1.2,
    };
  });
}
