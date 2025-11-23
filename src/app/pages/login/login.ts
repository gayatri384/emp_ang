import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = '';
  password: string = '';
  role: string = '';
  //  Add loading flag
  isSubmitting: boolean = false;

  showDropdown = false;
  constructor(private authService: AuthService, private router: Router) { }
  toggleUserDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  onSubmit() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password');
      return;
    }
    this.isSubmitting = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.token) {
          if (res.role === 'Admin') {
            alert('Login successful ');
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 300);

          }
          else if (res.role === 'Employee') {
            this.router.navigate(['/app-employee-layout/dashboard']);
            alert('Login successful');
          }

          else this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Login failed', err);
        alert(err?.error || 'Invalid credentials or server error');
      }
    });
  }
}