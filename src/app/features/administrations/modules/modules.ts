import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../../../services/commonService';
import { ModalService } from '../../../core/services/modal.service';
import { ModuleRequest, ModuleResponse } from '../../../core/model/model';
@Component({
  selector: 'app-modules',
  imports: [CommonModule, ReactiveFormsModule, TableModule, ToastModule],
  providers: [MessageService],
  templateUrl: './modules.html',
  styleUrl: './modules.css',
  encapsulation: ViewEncapsulation.None,
})
export class Modules {
  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);
  private modalService = inject(ModalService);
  private messageService = inject(MessageService);

  moduleList = signal<ModuleResponse[]>([]);
  panelMode = signal<'add' | 'edit'>('add');
  selectedModuleId = signal<number | null>(null);

  moduleForm = this.fb.group({
    moduleName: ['', Validators.required],
    moduleUrl: ['', Validators.required],
    moduleKey: ['', Validators.required],
  });
  errorMessage = signal('');
  ngOnInit() {
    this.getModules();
  }

  getModules() {
    this.commonService.getModules().subscribe({
      next: (res) => {
        this.moduleList.set(res);
      },
      error: (err) => {
        this.errorMessage.set(err.error.message);
        this.showError();
      },
    });
  }
  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage(),
      sticky: false,
    });
  }
  closePanel() {
    this.isSlidePanelOpen.set(false);
  }
  isSlidePanelOpen = signal(false);

  onPageChange(page: number) {
    // this.currentPage.set(page);
    this.getModules();
  }

  openAddModule() {
    this.panelMode.set('add');
    this.selectedModuleId.set(null);
    this.moduleForm.reset();
    this.isSlidePanelOpen.set(true);
  }

  editModule(mod: ModuleResponse) {
    this.panelMode.set('edit');
    this.selectedModuleId.set(mod.moduleId);
    this.moduleForm.patchValue({
      moduleName: mod.moduleName,
      moduleUrl: mod.moduleUrl,
      moduleKey: mod.moduleKey,
    });
    this.isSlidePanelOpen.set(true);
  }
  saveModule() {
    this.commonService.createModule(this.moduleForm.getRawValue() as ModuleRequest).subscribe({
      next: (res) => {
        this.getModules();
        this.isSlidePanelOpen.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error.message);
        this.showError();
      },
    });
  }

  onDeleteConfirmed() {}
  cancelDelete() {}
  moduleToDelete() {}
}
