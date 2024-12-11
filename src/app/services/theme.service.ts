import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  toggleTheme(): void {
    this.isDarkMode.next(!this.isDarkMode.value);
    document.body.classList.toggle('dark-theme');
  }

  setInitialTheme(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode.next(prefersDark);
    if (prefersDark) {
      document.body.classList.add('dark-theme');
    }
  }
}
