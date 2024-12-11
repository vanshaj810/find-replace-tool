import { TextOperation } from "./text-operation";

export interface HistoryItem {
  id: string;
  originalText: string;
  modifiedText: string;
  operation: TextOperation;
}
