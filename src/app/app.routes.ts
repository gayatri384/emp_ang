import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { authGuard } from './pages/services/auth.guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// login
import { Login } from './pages/login/login';

// admin layout
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout';
import { EmployeeComponent } from './pages/employee/employee.component';
import { DepartmentComponent } from './pages/department/department.component';
import { LeaveComponent } from './pages/leave/leave.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { AssignAssetsComponent } from './pages/assign-assets/assign-assets.conponent';
import { UserDashboardComponent } from './pages/users/dashboard.component/dashboard.component';
import { Attendance } from './pages/attendance/attendance';
import { AdminTasksComponent } from './pages/a-task/a-task';

// employee layout
import { EmployeeLayoutComponent } from './pages/users/employee-layout/employee-layout';
import { EmpLeave } from './pages/users/emp-leave/emp-leave';
import { EmpAssets } from './pages/users/emp-assets/emp-assets';
import { EmpAttendance } from './pages/users/emp-attendance/emp-attendance';
import { EmployeeTasksComponent } from './pages/users/e-task/e-task';

export const routes: Routes = [
  // Redirect root to login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Login page route
  {
    path: 'login',
    component: Login
  },

  // Protected layout (Topbar + Sidebar)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'assets', component: AssetsComponent },
      { path: 'AAssets', component: AssignAssetsComponent },
      { path: 'attendance', component: Attendance },
      { path: 'atask', component: AdminTasksComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  // Employee Layout
  {
    path: 'app-employee-layout',
    component: EmployeeLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'empleave', component: EmpLeave },
      { path: 'empassets', component: EmpAssets },
      { path: 'empattendance', component: EmpAttendance },
      { path: 'etask', component: EmployeeTasksComponent }
    ]
  },


  // Wildcard → redirect to login if no match
  {
    path: '**',
    redirectTo: 'login'
  }
];

// Wrap routes in a module to provide HashLocationStrategy
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }
