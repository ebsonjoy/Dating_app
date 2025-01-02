// src/declarations.d.ts

import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head: string[][];
      body: (string | number)[][];
      startY?: number;
      theme?: string;
    }) => void;
  }
}


