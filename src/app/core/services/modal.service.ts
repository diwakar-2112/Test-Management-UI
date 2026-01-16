import { Injectable, inject, Type, TemplateRef } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TemplateRendererComponent } from '../components/template-renderer/template-renderer.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private dialogService = inject(DialogService);
    private ref: DynamicDialogRef | undefined | null;

    /**
     * Opens a modal dialog with the specified component or template.
     * @param content The component or template to display inside the modal.
     * @param config Optional configuration for the dialog (width, header, etc.).
     * @returns The DynamicDialogRef instance.
     */
    open(content: Type<any> | TemplateRef<any>, config?: DynamicDialogConfig): DynamicDialogRef {
        if (content instanceof TemplateRef) {
            this.ref = this.dialogService.open(TemplateRendererComponent, {
                width: '50vw',
                modal: true,
                breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw'
                },
                styleClass: 'custom-modal',
                ...config,
                data: {
                    template: content,
                    ...config?.data
                }
            });
        } else {
            this.ref = this.dialogService.open(content, {
                width: '50vw',
                modal: true,
                breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw'
                },
                styleClass: 'custom-modal', // Allows global styling if needed
                ...config
            });
        }
        return this.ref!;
    }

    /**
     * Closes the currently open modal.
     * @param result Optional result to pass back to the caller.
     */
    close(result?: any) {
        if (this.ref) {
            this.ref.close(result);
            this.ref = undefined;
        }
    }
}
