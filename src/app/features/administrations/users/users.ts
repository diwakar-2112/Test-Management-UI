import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { PageInfo, UserList as user, UserPayload } from '../../../core/model/model';
import { UserListResponse } from '../../../core/model/model';
import { CommonService } from '../../../../services/commonService';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SelectModule,
    PaginationComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users implements OnInit {
  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);
  private messageService = inject(MessageService);
  errorMessage = signal('');
  ngOnInit() {
    this.getUserList();
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage.set(0);
      this.getUserList();
    });
  }
  userList = signal<user[]>([]);

  getUserList() {
    const filters = this.filterForm.value;
    const params: any = {
      page: this.currentPage(),
      size: this.pageSize(),
      search: filters.search,
    };
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.status) params.status = filters.status;

    this.commonService.getUserList(params).subscribe({
      next: (res: UserListResponse) => {
        this.userList.set(res.content);
        this.pageInfo.set(res.pageInfo);
      },
      error: (err) => {
        console.log('error fetching users list', err);
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
  //pagination
  pageInfo = signal<PageInfo | null>(null);
  currentPage = signal(0);
  pageSize = signal(5);
  totalPages = computed(() => this.pageInfo()?.totalPages ?? 0);
  totalElements = computed(() => this.pageInfo()?.totalElements ?? 0);

  selectedUserId: number | null = null;

  // Filters
  filterForm = this.fb.group({
    search: [''],
    role: [null as string | null],
    status: [null as string | null],
  });

  rolesOptions = [
    { label: 'All Roles', value: null },
    { label: 'Admin', value: 'Admin' },
    { label: 'QA Lead', value: 'QA Lead' },
    { label: 'Tester', value: 'Tester' },
  ];

  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  //
  panelMode = signal<'add' | 'edit'>('add');
  userForm = this.fb.group(
    {
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      status: ['ACTIVE'],
      roleId: [2, Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.getUserList();
  }

  // getRoleBadgeClass(role: string): string {
  //   switch (role) {
  //     case 'Admin': return 'bg-red-500/10 text-red-400 border border-red-500/20';
  //     case 'QA Lead': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
  //     case 'Tester': return 'bg-surface-highlight text-text-secondary border border-border/50';
  //     default: return 'bg-surface text-text-secondary border border-border';
  //   }
  // }

  // add/edit user
  isSlidePanelOpen = signal(false);
  closePanel() {
    this.isSlidePanelOpen.set(false);
  }
  onStatusChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.userForm.get('status')?.setValue(isChecked ? 'ACTIVE' : 'INACTIVE');
  }
  openAddUser() {
    this.panelMode.set('add');
    this.userForm.get('password')?.setValidators(Validators.required);
    this.userForm.get('confirmPassword')?.setValidators(Validators.required);

    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    this.userForm.reset({ status: 'ACTIVE', roleId: 3 });
    this.isSlidePanelOpen.set(true);
  }
  saveUser() {
    // if(this.panelMode() === 'add'){
    //   this.createUser();
    // }
    this.panelMode() === 'add' ? this.createUser() : this.updateUser();
  }
  createUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const payload = this.userForm.value as UserPayload;
    this.commonService.createUser(payload).subscribe({
      next: (res: UserListResponse) => {
        this.getUserList();
        this.closePanel();
      },
      error: (err) => {
        console.log('error creating user', err);
        // this.errorMessage.set(err.error.message);
        // this.showError();
      },
    });
  }
  updateUser() {
    const body = {
      firstName: this.userForm?.value?.firstName,
      middleName: this.userForm.value.middleName,
      lastName: this.userForm.value.lastName,
      email: this.userForm.value.email,
      mobile: this.userForm.value.mobile,
      status: this.userForm.getRawValue().status,
      roleId: this.userForm.value.roleId,
    };

    this.commonService.updateUser(this.selectedUserId!, body).subscribe({
      next: () => {
        console.log('User updated');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User updated successfully`,
        });
        this.closePanel();
        this.getUserList();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  editUser(user: user) {
    console.log('editing user', user);
    this.userForm.patchValue({
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      roleId: user.roleId,
      status: user.status,
      password: '',
      confirmPassword: '',
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('confirmPassword')?.clearValidators();

    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    this.selectedUserId = user.id;
    this.panelMode.set('edit');
    this.isSlidePanelOpen.set(true);
  }

  confirmDelete(userId: any) {}
}
