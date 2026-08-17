import {
  Component,
  ChangeDetectionStrategy,
  signal,
  ViewEncapsulation,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../../services/commonService';
import {
  ModuleAccess,
  ModuleResponse,
  RoleAccessPayload,
  RoleAccessResponse,
} from '../../../core/model/model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, TableModule, ReactiveFormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Roles implements OnInit {
  ngOnInit(): void {
    this.getRoles();
    this.setModuleAccess();
  }
  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);

  isSlidePanelOpen = signal(false);
  roles = signal<RoleAccessResponse>([]);
  modules = signal<ModuleResponse[]>([]);
  panelMode = signal<'add' | 'edit'>('add');
  roleForm = this.fb.group({
    roleName: this.fb.nonNullable.control(''),
    moduleAccess: this.fb.array<FormGroup>([]),
  });
  get moduleAccess(): FormArray {
    return this.roleForm.controls.moduleAccess;
  }
  private createModuleAccess(module: ModuleResponse): FormGroup {
    return this.fb.group({
      moduleId: this.fb.control(module.moduleId),
      canCreate: this.fb.control(false),
      canEdit: this.fb.control(false),
      canDelete: this.fb.control(false),
      canList: this.fb.control(false),
      canView: this.fb.control(false),
    });
  }
  setModuleAccess() {
    this.commonService.getModules().subscribe({
      next: (res: ModuleResponse[]) => {
        this.modules.set(res);
        this.moduleAccess.clear();
        // console.log(this.modules());

        res.forEach((module) => {
          this.moduleAccess.push(this.createModuleAccess(module));
        });
        console.log('after setting moudleaccess', this.moduleAccess);
      },
    });
  }
  getRoles() {
    this.commonService.getRoles().subscribe({
      next: (res: RoleAccessResponse) => {
        // console.log(res);
        this.roles.set(res);
        // this.setModuleAccess();
        console.log('roles', this.roles());
      },
    });
  }

  openAddRole() {
    this.panelMode.set('add');
    this.roleForm.controls.roleName.reset();
    this.moduleAccess.controls.forEach((control) => {
      control.patchValue({
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canList: false,
        canView: false,
      });
    });
    this.isSlidePanelOpen.set(true);
  }
  createRole() {
    let body = this.roleForm.getRawValue() as RoleAccessPayload;
    this.commonService.createRole(body).subscribe({
      next: (res: RoleAccessResponse) => {
        this.closePanel();
        this.getRoles();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updateRole() {
    console.log(this.roleForm.getRawValue());
    let body = this.roleForm.getRawValue() as RoleAccessPayload;
    this.commonService.updateRole(body, this.updateRoleId()).subscribe({
      next: (res) => {
        console.log('role updated');
        this.closePanel();
        this.getRoles();
      },
    });
  }
  saveForm() {
    this.panelMode() == 'add' ? this.createRole() : this.updateRole();
  }

  updateRoleId = signal<number>(0);
  roleEdit(roleId: number) {
    this.panelMode.set('edit');
    this.updateRoleId.set(roleId);
    this.commonService.getRoleById(roleId).subscribe({
      next: (res) => {
        this.roleForm.reset();
        this.moduleAccess.clear();
        this.roleForm.controls.roleName.setValue(res.roleName);
        res.moduleAccess.forEach((module: ModuleAccess) => {
          this.moduleAccess.push(
            this.fb.group({
              moduleId: this.fb.control(module.moduleId),
              canCreate: this.fb.control(module.canCreate),
              canEdit: this.fb.control(module.canEdit),
              canDelete: this.fb.control(module.canDelete),
              canList: this.fb.control(module.canList),
              canView: this.fb.control(module.canView),
            }),
          );
        });
        this.isSlidePanelOpen.set(true);
      },
    });
  }

  closePanel() {
    this.isSlidePanelOpen.set(false);
    this.roleForm.controls.roleName.reset();

    this.moduleAccess.controls.forEach((control) => {
      control.patchValue({
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canList: false,
        canView: false,
      });
    });
  }
}
