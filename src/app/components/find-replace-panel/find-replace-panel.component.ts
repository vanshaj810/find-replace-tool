import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextEditorService } from '../../services/text-editor.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-find-replace-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="panel-container" [@fadeIn]>
      <div class="input-group">
        <input
          type="text"
          [(ngModel)]="findText"
          (ngModelChange)="onInputChange()"
          placeholder="Find text..."
          class="form-control"
        />
      </div>
      <div class="input-group">
        <input
          type="text"
          [(ngModel)]="replaceText"
          placeholder="Replace with..."
          class="form-control"
        />
      </div>
      <div class="options">
        <label class="option">
          <input
            type="checkbox"
            [(ngModel)]="caseSensitive"
            (change)="onOptionsChange()"
          /> Case Sensitive
        </label>
        <label class="option">
          <input
            type="checkbox"
            [(ngModel)]="useRegex"
            (change)="onOptionsChange()"
          /> Use Regex
        </label>
      </div>
      <div class="actions">
        <button
          (click)="onFind()"
          class="btn-find"
          [disabled]="!isValidInput()"
        >
          <i class="material-icons">search</i>
          Find
        </button>
        <button
          (click)="onReplace()"
          class="btn-replace"
          [disabled]="!isValidInput()"
        >
          <i class="material-icons">find_replace</i>
          Replace All
        </button>
        <span *ngIf="matchCount !== null" class="match-count">
          {{ matchCount }} {{ matchCount === 1 ? 'match' : 'matches' }} found
        </span>
      </div>
      <div *ngIf="errorMessage" class="error-message">
        <i class="material-icons">error_outline</i>
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .panel-container {
      padding: 1.5rem;
      background: var(--bg-secondary);
      border-radius: 8px;
      box-shadow: 0 2px 4px var(--shadow-color);
      transition: all 0.3s ease;
    }

    .input-group {
      margin-bottom: 1rem;
      
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-primary);
        color: var(--text-primary);
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.25);
        }

        &::placeholder {
          color: var(--text-secondary);
        }
      }
    }

    .options {
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1.5rem;
      
      .option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
        color: var(--text-primary);
        transition: color 0.3s ease;
        
        &:hover {
          color: var(--accent-color);
        }
        
        input {
          cursor: pointer;
          width: 16px;
          height: 16px;
          accent-color: var(--accent-color);
        }
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-find,
    .btn-replace {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      
      i {
        font-size: 18px;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--text-secondary) !important;
      }
    }

    .btn-find {
      background: #28a745;
      color: white;
      
      &:hover:not(:disabled) {
        background: #218838;
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    .btn-replace {
      background: #007bff;
      color: white;
      
      &:hover:not(:disabled) {
        background: #0056b3;
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    .match-count {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .error-message {
      margin-top: 1rem;
      color: var(--danger-color);
      font-size: 0.9rem;
    }
  `]
})
export class FindReplacePanelComponent {
  @ViewChild('findInput') findInput!: ElementRef<HTMLInputElement>;
  @ViewChild('replaceInput') replaceInput!: ElementRef<HTMLInputElement>;
  findText = '';
  replaceText = '';
  matchCount: number | null = null;
  caseSensitive = false;
  useRegex = false;
  errorMessage = '';

  constructor(private textEditorService: TextEditorService) {}

  onInputChange(): void {
    this.errorMessage = '';
    this.matchCount = null;
    if (this.findText) {
      this.onFind();
    }
  }

  onOptionsChange(): void {
    if (this.findText) {
      this.onFind();
    }
  }

  isValidInput(): boolean {
    if (!this.findText) return false;
    if (this.useRegex) {
      try {
        new RegExp(this.findText);
        return true;
      } catch {
        this.errorMessage = 'Invalid regular expression pattern';
        return false;
      }
    }
    return true;
  }

  onFind(): void {
    if (this.isValidInput()) {
      try {
        const count = this.textEditorService.findMatches(
          this.findText,
          this.caseSensitive,
          this.useRegex
        );
        this.matchCount = count;
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = 'Error performing search';
        this.matchCount = null;
      }
    }
  }

  onReplace(): void {
    if (this.isValidInput()) {
      try {
        const result = this.textEditorService.findAndReplace(
          this.findText,
          this.replaceText,
          this.caseSensitive,
          this.useRegex
        );
        this.matchCount = result.count;
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = 'Error performing replace';
        this.matchCount = null;
      }
    }
  }
  focusFindInput(): void {
    this.findInput.nativeElement.focus();
  }

  focusReplaceInput(): void {
    this.replaceInput.nativeElement.focus();
  }

  clearSearch(): void {
    this.findText = '';
    this.replaceText = '';
    this.matchCount = null;
    this.errorMessage = '';
  }
}