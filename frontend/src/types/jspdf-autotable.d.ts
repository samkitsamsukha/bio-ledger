declare module 'jspdf-autotable' {
    interface AutoTableOptions {
        head?: string[][];
        body?: any[][];
        startY?: number;
        didDrawPage?: (data: { pageNumber: number }) => void;
        margin?: { left?: number; right?: number };
        styles?: {
            font?: string;
            fontSize?: number;
            cellPadding?: number;
            valign?: string;
        };
        headStyles?: {
            fillColor?: string;
            textColor?: string;
            fontStyle?: string;
        };
        theme?: string;
    }

    function autoTable(doc: any, options: AutoTableOptions): void;
    export default autoTable;
} 