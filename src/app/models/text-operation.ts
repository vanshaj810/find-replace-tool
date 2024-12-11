export interface TextOperation {
    findText: string;
    replaceText: string;
    timestamp: Date;
    matchCount?: number;
    caseSensitive: boolean;
    useRegex: boolean;
  }