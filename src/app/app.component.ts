import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { FindReplacePanelComponent } from './components/find-replace-panel/find-replace-panel.component';
import { ThemeService } from './services/theme.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TextEditorComponent, FindReplacePanelComponent],
  template: `
    <div class="container" [@fadeIn]>
      <header>
        <h1>Advanced Find & Replace Tool</h1>
        <div class="toolbar">
          <button class="theme-toggle" (click)="toggleTheme()">
            <i class="material-icons">{{ (isDarkMode$ | async) ? 'light_mode' : 'dark_mode' }}</i>
          </button>
        </div>
      </header>
      
      <main>
        <div class="tool-layout" [@fadeIn]>
          <app-find-replace-panel class="panel"></app-find-replace-panel>
          <app-text-editor class="editor"></app-text-editor>
        </div>
      </main>

  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      transition: background-color 0.3s ease;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h1 {
        color: var(--text-primary);
        font-size: 2.5rem;
        font-weight: 300;
        margin: 0;
      }
    }

    .toolbar {
      display: flex;
      gap: 1rem;
    }

    .theme-toggle,
    .help-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.3s ease;

      &:hover {
        background: var(--hover-bg);
      }

      i {
        font-size: 24px;
      }
    }

    .tool-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      align-items: start;
    }

    .help-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .help-content {
      background: var(--bg-primary);
      padding: 2rem;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      h2 {
        color: var(--text-primary);
        margin-top: 0;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        margin: 0.5rem 0;
        color: var(--text-secondary);
      }

      kbd {
        background: var(--kbd-bg);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-size: 0.9em;
      }

      code {
        background: var(--code-bg);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: monospace;
      }
    }

    @media (max-width: 768px) {
      .tool-layout {
        grid-template-columns: 1fr;
      }
    }

    .help-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      
      h2 {
        margin: 0;
      }
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--hover-bg);
        color: var(--text-primary);
      }
    }

    .shortcuts-section {
      h3 {
        color: var(--text-primary);
        margin: 1.5rem 0 0.5rem;
        font-size: 1.1rem;
        
        &:first-child {
          margin-top: 0;
        }
      }

      ul {
        margin: 0;
      }

      .examples {
        li {
          margin: 0.75rem 0;
          
          code {
            display: block;
            margin-bottom: 0.25rem;
            background: var(--code-bg);
            padding: 0.4rem 0.6rem;
          }
        }
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'find-replace-tool';
  isDarkMode$: Observable<boolean>;
  showHelp = false;

  constructor(private readonly themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit() {
    this.themeService.setInitialTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
  }
}
