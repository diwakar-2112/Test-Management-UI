import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="info-modal">
      <div class="info-modal__icon" aria-hidden="true">!</div>

      <div class="info-modal__content">
        <h2 class="info-modal__title">{{ title }}</h2>
        <p class="info-modal__message">{{ message }}</p>
      </div>

      <div class="info-modal__actions">
        <button
          pButton
          type="button"
          label="Got it"
          class="info-modal__button"
          (click)="close()"
        ></button>
      </div>
    </div>
  `,
  styles: [
    `
      .info-modal {
        display: grid;
        grid-template-columns: 3rem 1fr;
        gap: 1rem;
        min-width: 0;
        padding-top: 0.125rem;
      }

      .info-modal__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        border: 1px solid rgba(var(--primary) / 0.3);
        border-radius: 999px;
        background:
          radial-gradient(circle at 30% 25%, rgba(255 255 255 / 0.28), transparent 32%),
          rgba(var(--primary) / 0.16);
        color: rgb(var(--primary));
        font-size: 1.35rem;
        font-weight: 800;
        line-height: 1;
        box-shadow: 0 14px 32px rgba(var(--primary) / 0.16);
      }

      .info-modal__content {
        min-width: 0;
      }

      .info-modal__title {
        margin: 0 0 0.45rem;
        color: rgb(var(--text-main));
        font-size: 1.05rem;
        font-weight: 800;
        letter-spacing: 0;
      }

      .info-modal__message {
        margin: 0;
        color: rgb(var(--text-secondary));
        font-size: 0.95rem;
        line-height: 1.6;
        word-break: break-word;
      }

      .info-modal__actions {
        grid-column: 1 / -1;
        display: flex;
        justify-content: flex-end;
        padding-top: 0.5rem;
      }

      .info-modal__button {
        min-width: 6.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoModalComponent {
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  title = this.config.data?.message.error ?? 'Access restricted';
  message = this.config.data?.message.message ?? 'Something went wrong';

  close() {
    this.ref.close();
  }
}
