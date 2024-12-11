import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextEditorService } from '../../services/text-editor.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-container" [@fadeIn]>
      <textarea
        class="editor"
        [(ngModel)]="content"
        (ngModelChange)="onTextChange($event)"
        placeholder="Enter or paste your text here..."
      ></textarea>
      <div class="editor-stats">
        <span>Characters: {{ content.length }}</span>
        <span>Words: {{ getWordCount() }}</span>
        <span>Lines: {{ getLineCount() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .editor-container {
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 8px;
      box-shadow: 0 2px 4px var(--shadow-color);
      transition: all 0.3s ease;
    }

    .editor {
      width: 100%;
      min-height: 400px;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      line-height: 1.6;
      resize: vertical;
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
      }

      &::placeholder {
        color: var(--text-secondary);
      }
    }

    .editor-stats {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class TextEditorComponent {
  content = '';

  constructor(private textEditorService: TextEditorService) {
    this.textEditorService.textContent$.subscribe(
      text => this.content = text
    );
  }

  onTextChange(text: string): void {
    this.textEditorService.updateText(text);
  }

  getWordCount(): number {
    return this.content.trim() ? this.content.trim().split(/\s+/).length : 0;
  }

  getLineCount(): number {
    return this.content.split('\n').length;
  }
}
