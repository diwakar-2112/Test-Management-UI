import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import {PageInfo, UserList as user, UserPayload} from '../../../core/model/model';
import {UserListResponse} from '../../../core/model/model';
import {CommonService} from '../../../../services/commonService';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SelectModule,
    PaginationComponent
  ],
  templateUrl: './users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users implements OnInit {
  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);
  ngOnInit() {
    this.getUserList();
    this.filterForm.valueChanges.subscribe(()=>{
      this.currentPage.set(0);
      this.getUserList();
    })

  }
  userList = signal<user[]>([]);
    
  getUserList(){
    const filters = this.filterForm.value;
    const params :any = {
      page: this.currentPage(),
      size: this.pageSize(),
      search: filters.search,
    }
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.status) params.status = filters.status

    this.commonService.getUserList(params).subscribe({
      next:(res:UserListResponse)=>{
        console.log('fetched users list',res.content);
        this.userList.set(res.content);
        this.pageInfo.set(res.pageInfo);
      },
      error:(err)=>{
        console.log('error fetching users list',err);
      }
    })
  }

  //pagination
  pageInfo = signal<PageInfo | null>(null);
  currentPage = signal(0);
  pageSize = signal(5);
  totalPages = computed(() => this.pageInfo()?.totalPages ?? 0);
  totalElements = computed(() => this.pageInfo()?.totalElements ?? 0);





  // Filters
  filterForm = this.fb.group({
    search: [''],
    role: [null as string | null],
    status: [null as string | null]
  });

  rolesOptions = [
    { label: 'All Roles', value: null },
    { label: 'Admin', value: 'Admin' },
    { label: 'QA Lead', value: 'QA Lead' },
    { label: 'Tester', value: 'Tester' }
  ];

  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  //
  panelMode = signal<'add' | 'edit'>('add');
  userForm = this.fb.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: [''],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    status: ['ACTIVE'], // true = ACTIVE, false = INACTIVE
    roleId: [2, Validators.required] // Defaulting to 2 as per your JSON
  }, { validators: this.passwordMatchValidator });

   passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.getUserList();
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'QA Lead': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Tester': return 'bg-surface-highlight text-text-secondary border border-border/50';
      default: return 'bg-surface text-text-secondary border border-border';
    }
  }

  // add/edit user
  isSlidePanelOpen = signal(false);
  closePanel(){
    this.isSlidePanelOpen.set(false);
  }
  onStatusChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.userForm.get('status')?.setValue(isChecked ? 'ACTIVE' : 'INACTIVE');
  }
  openAddUser(){
    this.panelMode.set('add');
    this.isSlidePanelOpen.set(true);
  }
  saveUser(){
      if(this.userForm.invalid){
        this.userForm.markAllAsTouched();
        return;
      }
      console.log('User form data:', this.userForm.value);
      const payload = this.userForm.value as UserPayload; 
      this.commonService.createUser(payload).subscribe({
        next:(res:UserListResponse)=>{
          console.log('user created successfully',res);
          this.getUserList();
          this.closePanel();
        }
      })
     
  }
}