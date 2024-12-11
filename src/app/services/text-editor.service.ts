import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TextOperation } from '../models/text-operation';

@Injectable({
  providedIn: 'root'
})
export class TextEditorService {
  private textContent = new BehaviorSubject<string>('');
  private lastOperation = new BehaviorSubject<TextOperation | null>(null);

  textContent$ = this.textContent.asObservable();
  lastOperation$ = this.lastOperation.asObservable();

  updateText(text: string): void {
    this.textContent.next(text);
  }

  findMatches(findText: string, caseSensitive: boolean, useRegex: boolean): number {
    const currentText = this.textContent.getValue();
    let regex: RegExp;

    try {
      if (useRegex) {
        // For regex searches, use the pattern as-is with case sensitivity flag
        regex = new RegExp(findText, caseSensitive ? 'g' : 'gi');
      } else {
        // For normal text searches, escape special characters
        const escapedText = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // If not case sensitive, create case-insensitive pattern
        if (!caseSensitive) {
          regex = new RegExp(escapedText, 'gi');
        } else {
          regex = new RegExp(escapedText, 'g');
        }
      }

      // Get all matches
      const matches = currentText.match(regex);
      if (matches) {
        // For case-sensitive search, filter matches to exact case
        if (caseSensitive && !useRegex) {
          const exactMatches = matches.filter(match => match === findText);
          return exactMatches.length;
        }
        return matches.length;
      }
      return 0;
    } catch (e) {
      console.error('Invalid pattern:', e);
      return 0;
    }
  }

  findAndReplace(
    findText: string,
    replaceText: string,
    caseSensitive: boolean,
    useRegex: boolean
  ): { text: string; count: number } {
    const currentText = this.textContent.getValue();
    let regex: RegExp;
    let count = 0;

    try {
      if (useRegex) {
        // For regex replacements, use the pattern as-is
        regex = new RegExp(findText, caseSensitive ? 'g' : 'gi');
        const modifiedText = currentText.replace(regex, replaceText);
        count = (currentText.match(regex) || []).length;
        this.textContent.next(modifiedText);
      } else {
        // For normal text replacements
        const escapedText = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!caseSensitive) {
          // Case-insensitive replacement
          regex = new RegExp(escapedText, 'gi');
          const modifiedText = currentText.replace(regex, replaceText);
          count = (currentText.match(regex) || []).length;
          this.textContent.next(modifiedText);
        } else {
          // Case-sensitive replacement using split and join
          const parts = currentText.split(findText);
          count = parts.length - 1;
          const modifiedText = parts.join(replaceText);
          this.textContent.next(modifiedText);
        }
      }

      this.lastOperation.next({
        findText,
        replaceText,
        timestamp: new Date(),
        matchCount: count,
        caseSensitive,
        useRegex
      });

      return { text: this.textContent.getValue(), count };
    } catch (e) {
      console.error('Invalid pattern:', e);
      return { text: currentText, count: 0 };
    }
  }
}
