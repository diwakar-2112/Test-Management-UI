import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-template-renderer',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-container *ngTemplateOutlet="config.data.template; context: {$implicit: ref}"></ng-container>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateRendererComponent {
    config = inject(DynamicDialogConfig);
    ref = inject(DynamicDialogRef);
}
