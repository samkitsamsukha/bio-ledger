'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import GenerateWHOReport from './GenerateReport_who';

// Interface definitions
interface Project {
    title: string;
    subtitle: string;
    aim: string;
    methodology: string;
    results: string[];
    bsl: string;
    objectives: string[];
    equipment: string[];
    startDate: Date;
    endDate: Date;
}

interface Equipment {
    name: string;
    model: string;
    manufacturer: string;
    year: number;
    specifications: Array<{ specification: string }>;
}

interface Assistant {
    name: string;
    designation: string;
    role: string;
    department: string;
    email: string;
    specialization: string;
    experience: string;
}

interface LabData {
    name: string;
    location: string;
    projects: Project[];
    assistants: Assistant[];
    equipments: Equipment[];
    contacts: { name: string; email: string; phone?: string }[];
}


// IEEE Styling Constants
const FONT_FAMILY = 'Times';
const TITLE_FONT_SIZE = 22;
const SUBTITLE_FONT_SIZE = 12;
const SECTION_HEADER_FONT_SIZE = 10;
const BODY_FONT_SIZE = 10;
const ABSTRACT_FONT_SIZE = 9;
const PAGE_NUMBER_FONT_SIZE = 9;
const LINE_SPACING_MULTIPLIER = 1.25; 

const MARGIN_TOP = 19.05; 
const MARGIN_BOTTOM = 25.4; 
const MARGIN_LEFT = 15.875; 
const MARGIN_RIGHT = 15.875; 
const COLUMN_GAP_MM = 6.35; 

// Types for styled text
type FontStyle = 'Normal' | 'Bold' | 'Italic' | 'BoldItalic';
type TextDecoration = 'underline';
interface StyledSegment {
    text: string;
    fontStyle?: FontStyle;
    textDecoration?: TextDecoration;
}
type FormattedLine = StyledSegment[];

// Helper to add page number
const addPageNumberToDoc = (
    docInstance: jsPDF,
    pageNum: number,
    pageW: number,
    pageH: number,
    marginB: number,
    fontS: number
) => {
    docInstance.setFont(FONT_FAMILY, 'Normal');
    docInstance.setFontSize(fontS);
    docInstance.text(String(pageNum), pageW / 2, pageH - marginB / 2, { align: 'center' });
};


export default function GenerateReport() {
    const [lab, setLab] = useState<LabData | null>(null);
    const [format, setFormat] = useState<'IEEE' | 'WHO'>('IEEE');

    useEffect(() => {
        const fetchLabData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/lab/lab');
                setLab(res.data);
            } catch (error) {
                console.error("Failed to fetch lab data:", error);
            }
        };
        fetchLabData();
    }, []);

    const generateIEEEFormatReport = () => {
        if (!lab) {
            alert("Lab data is not loaded yet.");
            return;
        }

        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const contentWidth = pageWidth - MARGIN_LEFT - MARGIN_RIGHT;
        const columnWidth = (contentWidth - COLUMN_GAP_MM) / 2;

        let currentPageFlow = 1;
        let currentYFlow = MARGIN_TOP;
        let currentColumnFlow: 'left' | 'right' = 'left';
        let currentXFlow = MARGIN_LEFT;
        let initialContentYOnPage1 = MARGIN_TOP; 

        const getLineHeightMM = (fontSize: number, multiplier: number = LINE_SPACING_MULTIPLIER): number => {
            return (fontSize * 0.352778) * multiplier; 
        };

        const switchToNextPage = () => {
            addPageNumberToDoc(doc, currentPageFlow, pageWidth, pageHeight, MARGIN_BOTTOM, PAGE_NUMBER_FONT_SIZE);
            doc.addPage();
            currentPageFlow++;
            currentYFlow = MARGIN_TOP;
            currentColumnFlow = 'left';
            currentXFlow = MARGIN_LEFT;
        };

        const switchToRightColumn = () => {
            currentColumnFlow = 'right';
            currentXFlow = MARGIN_LEFT + columnWidth + COLUMN_GAP_MM;
            currentYFlow = (currentPageFlow === 1) ? initialContentYOnPage1 : MARGIN_TOP;
        };
        
        const addFlowingText = ( 
            text: string,
            fontSize: number,
            fontStyle: FontStyle = 'Normal',
            isNonBreakingBlock: boolean = false,
            align: 'left' | 'center' | 'justify' = 'left' 
        ) => {
            doc.setFont(FONT_FAMILY, fontStyle);
            doc.setFontSize(fontSize);
            const lineHeight = getLineHeightMM(fontSize);
            const lines = doc.splitTextToSize(text, columnWidth);

            if (isNonBreakingBlock) {
                const blockHeight = lines.length * lineHeight;
                if (currentYFlow + blockHeight > pageHeight - MARGIN_BOTTOM) { 
                    if (currentColumnFlow === 'left') {
                        switchToRightColumn();
                        if (currentYFlow + blockHeight > pageHeight - MARGIN_BOTTOM) {
                            switchToNextPage(); 
                        }
                    } else { 
                        switchToNextPage();
                    }
                }
            }

            lines.forEach((line: string, index: number) => {
                if (currentYFlow + lineHeight > pageHeight - MARGIN_BOTTOM) {
                    if (currentColumnFlow === 'left') {
                        switchToRightColumn();
                        if (currentYFlow + lineHeight > pageHeight - MARGIN_BOTTOM) {
                            switchToNextPage();
                        }
                    } else { 
                        switchToNextPage();
                    }
                }

                const textOptions: { align?: 'left' | 'right' | 'center' | 'justify', maxWidth?: number } = { maxWidth: columnWidth };
                if (align === 'justify') {
                    if (index < lines.length - 1) { 
                        textOptions.align = 'justify';
                    } else { 
                        textOptions.align = 'left';
                    }
                } else {
                    textOptions.align = align; 
                }
                
                if (align === 'center' && currentColumnFlow === 'left') { // Special handling for full-width centered titles
                     doc.text(line, pageWidth / 2, currentYFlow, { align: 'center'});
                } else if (align === 'center') { // Centered within a column
                     doc.text(line, currentXFlow + columnWidth / 2, currentYFlow, textOptions);
                }
                else {
                     doc.text(line, currentXFlow, currentYFlow, textOptions);
                }
                currentYFlow += lineHeight;
            });
        };

        // --- PDF Generation Starts ---
        let tempCurrentY = MARGIN_TOP;
        doc.setFont(FONT_FAMILY, 'Bold');
        doc.setFontSize(TITLE_FONT_SIZE);
        const titleText = lab.name ? `${lab.name}: Bio-safety Compliance Report` : 'Bio-safety Compliance Report';
        const titleLines = doc.splitTextToSize(titleText, contentWidth); 
        doc.text(titleLines, pageWidth / 2, tempCurrentY, { align: 'center' });
        tempCurrentY += titleLines.length * getLineHeightMM(TITLE_FONT_SIZE);
        tempCurrentY += getLineHeightMM(TITLE_FONT_SIZE) * 0.5; 

        doc.setFont(FONT_FAMILY, 'Normal');
        doc.setFontSize(SUBTITLE_FONT_SIZE);
        const subtitleText = lab.location || "Lab Location Not Specified";
        const subtitleLines = doc.splitTextToSize(subtitleText, contentWidth);
        doc.text(subtitleLines, pageWidth / 2, tempCurrentY, { align: 'center' });
        tempCurrentY += subtitleLines.length * getLineHeightMM(SUBTITLE_FONT_SIZE);
        tempCurrentY += getLineHeightMM(SUBTITLE_FONT_SIZE) * 1.0; 
        
        initialContentYOnPage1 = tempCurrentY; 
        currentYFlow = initialContentYOnPage1;
        currentColumnFlow = 'left';
        currentXFlow = MARGIN_LEFT;
        
        const abstractPreamble = "Abstract—"; 
        const abstractBody = 'This report presents a compliance overview of a BSL certified biosafety laboratory engaged in ongoing high-containment research projects. It details laboratory infrastructure, equipment inventory, and adherence to regulatory biosafety standards. The document also outlines active research efforts, staff qualifications, and safety protocols, ensuring operational alignment with institutional and international guidelines for secure and responsible biological research.';
        
        addFlowingText(`${abstractPreamble}${abstractBody}`, ABSTRACT_FONT_SIZE, 'Italic', false, 'justify');
        currentYFlow += getLineHeightMM(BODY_FONT_SIZE, 1.0); 

        const renderFlowingSection = (
            title: string,
            items: any[],
            itemFormatter: (item: any, index: number) => FormattedLine[] 
        ) => {
            addFlowingText(title.toUpperCase(), SECTION_HEADER_FONT_SIZE, 'Bold', true, 'left');
            currentYFlow += getLineHeightMM(SECTION_HEADER_FONT_SIZE, 0.25); 

            items.forEach((item, itemIndex) => {
                const formattedItemLines: FormattedLine[] = itemFormatter(item, itemIndex);
                const itemLineHeight = getLineHeightMM(BODY_FONT_SIZE);

                formattedItemLines.forEach((lineSegments) => {
                    if (currentYFlow + itemLineHeight > pageHeight - MARGIN_BOTTOM) {
                        if (currentColumnFlow === 'left') {
                            switchToRightColumn();
                            if (currentYFlow + itemLineHeight > pageHeight - MARGIN_BOTTOM) {
                                switchToNextPage();
                            }
                        } else { 
                            switchToNextPage();
                        }
                    }

                    let lineX = currentXFlow; 

                    for (const segment of lineSegments) {
                        doc.setFont(FONT_FAMILY, segment.fontStyle || 'Normal');
                        doc.setFontSize(BODY_FONT_SIZE);

                        let remainingSegmentText = segment.text;
                        const segmentTextPartsProcessed: string[] = [];

                        // Handle the first line/part of the segment based on available width on the current PDF line
                        const firstPartAvailableWidth = columnWidth - (lineX - currentXFlow);
                        const firstLinePotentialParts = doc.splitTextToSize(remainingSegmentText, firstPartAvailableWidth);

                        if (firstLinePotentialParts.length > 0) {
                            segmentTextPartsProcessed.push(firstLinePotentialParts[0]);
                            // Accurately get the length of the processed part to remove from remainingSegmentText
                            const processedPartLength = firstLinePotentialParts[0].length;
                            remainingSegmentText = remainingSegmentText.substring(processedPartLength).trimStart();
                        }
                        
                        // Handle subsequent wrapped lines of the segment, these use full columnWidth
                        if (remainingSegmentText.length > 0) {
                            const wrappedLines = doc.splitTextToSize(remainingSegmentText, columnWidth); 
                            segmentTextPartsProcessed.push(...wrappedLines);
                        }

                        segmentTextPartsProcessed.forEach((textPart, partIndex) => {
                            if (partIndex > 0) { // Wrapped part of the segment, starts on a new PDF line
                                currentYFlow += itemLineHeight;
                                lineX = currentXFlow; 
                                if (currentYFlow + itemLineHeight > pageHeight - MARGIN_BOTTOM) {
                                    if (currentColumnFlow === 'left') {
                                        switchToRightColumn();
                                        if (currentYFlow + itemLineHeight > pageHeight - MARGIN_BOTTOM) switchToNextPage();
                                    } else {
                                        switchToNextPage();
                                    }
                                    lineX = currentXFlow; 
                                }
                            }
                            
                            let currentPartRenderMaxWidth: number;
                            if (partIndex === 0) { // First (or only) part of this segment being rendered on current PDF line
                                currentPartRenderMaxWidth = firstPartAvailableWidth;
                            } else { // Wrapped part of this segment, on a new PDF line
                                currentPartRenderMaxWidth = columnWidth;
                            }

                            const textRenderOptions: { align?: 'left' | 'right' | 'center' | 'justify', maxWidth?: number } = {};
                            textRenderOptions.maxWidth = currentPartRenderMaxWidth;

                            const isLastProcessedPartOfSegment = (partIndex === segmentTextPartsProcessed.length - 1);

                            if (isLastProcessedPartOfSegment) {
                                textRenderOptions.align = 'left'; 
                            } else { 
                                textRenderOptions.align = 'justify';
                            }

                            if (segmentTextPartsProcessed.length === 1) { 
                                if (doc.getTextWidth(textPart) < currentPartRenderMaxWidth * 0.90 || currentPartRenderMaxWidth < doc.getTextWidth("Test ")) { // Heuristic for short line
                                    textRenderOptions.align = 'left';
                                } else {
                                    textRenderOptions.align = 'justify'; 
                                }
                            }
                            
                            doc.text(textPart, lineX, currentYFlow, textRenderOptions);

                            let effectiveTextWidth = doc.getTextWidth(textPart);
                            if (textRenderOptions.align === 'justify' && textRenderOptions.maxWidth) {
                                let wasActuallyJustified = textRenderOptions.align === 'justify';
                                if (segmentTextPartsProcessed.length === 1 && (doc.getTextWidth(textPart) < currentPartRenderMaxWidth * 0.90 || currentPartRenderMaxWidth < doc.getTextWidth("Test "))) {
                                    wasActuallyJustified = false;
                                }
                                if(wasActuallyJustified){
                                    effectiveTextWidth = textRenderOptions.maxWidth;
                                }
                            }
                            
                            if (segment.textDecoration === 'underline') {
                                const underlineYOffset = (BODY_FONT_SIZE * 0.352778) * 0.15; 
                                doc.setLineWidth(0.2); 
                                doc.line(lineX, currentYFlow + underlineYOffset, lineX + effectiveTextWidth, currentYFlow + underlineYOffset);
                            }
                            lineX += effectiveTextWidth; 
                        });
                    }
                    currentYFlow += itemLineHeight; 
                });

                if (itemIndex < items.length - 1) {
                    currentYFlow += getLineHeightMM(BODY_FONT_SIZE, 0.3); 
                }
            });
            currentYFlow += getLineHeightMM(BODY_FONT_SIZE, 0.5); 
        };

        // --- Item Formatter Functions (Unchanged from previous correct version) ---
        const equipmentFormatter = (item: Equipment, index: number): FormattedLine[] => {
            const lines: FormattedLine[] = [];
            lines.push([{ text: `${index + 1}. ${item.name.toUpperCase()}`, fontStyle: 'Bold' }]);
            lines.push([
                { text: "Model: ", fontStyle: 'Bold' },
                { text: item.model, fontStyle: 'Normal' }
            ]);
            lines.push([
                { text: "Manufacturer: ", fontStyle: 'Bold' },
                { text: item.manufacturer, fontStyle: 'Normal' }
            ]);
            lines.push([
                { text: "Year: ", fontStyle: 'Bold' },
                { text: String(item.year), fontStyle: 'Normal' }
            ]);
            item.specifications.forEach(spec => {
                lines.push([{ text: `    • ${spec.specification}`, fontStyle: 'Normal' }]);
            });
            return lines;
        };

        const staffFormatter = (item: Assistant, index: number): FormattedLine[] => {
            const lines: FormattedLine[] = [];
            lines.push([
                {text: `${index + 1}. ${item.designation} `, fontStyle: 'Normal'},
                {text: item.name, fontStyle: 'Bold'}
            ]);
            lines.push([
                { text: "    Role: ", fontStyle: 'Bold' },
                { text: item.role, fontStyle: 'Normal' }
            ]);
            lines.push([
                { text: "    Department: ", fontStyle: 'Bold' },
                { text: item.department, fontStyle: 'Normal' }
            ]);
            lines.push([
                { text: "    Email: ", fontStyle: 'Bold' },
                { text: item.email, fontStyle: 'Normal' }
            ]);
            lines.push([
                { text: "    Specialization: ", fontStyle: 'Bold' },
                { text: item.specialization, fontStyle: 'Normal' }
            ]);
            lines.push([
                { text: "    Experience: ", fontStyle: 'Bold' },
                { text: item.experience, fontStyle: 'Normal' }
            ]);
            return lines;
        };
        
        const projectFormatter = (item: Project, index: number): FormattedLine[] => {
            const lines: FormattedLine[] = [];
            lines.push([{ text: `${index + 1}. ${item.title.toUpperCase()}`, fontStyle: 'Bold' }]);
            if (item.subtitle) {
                lines.push([{ text: `    ${item.subtitle}`, fontStyle: 'Normal', textDecoration: 'underline' }]);
            }
            lines.push([
                { text: "    BSL Level: ", fontStyle: 'Bold' },
                { text: item.bsl, fontStyle: 'Normal' }
            ]);
            lines.push([
                { text: "    Duration: ", fontStyle: 'Bold' },
                { text: `${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`, fontStyle: 'Normal' }
            ]);
            lines.push([{ text: `    Aim: ${item.aim}`, fontStyle: 'Italic' }]); 
            
            lines.push([{ text: "    Objectives:", fontStyle: 'Bold' }]); 
            item.objectives.forEach(obj => {
                lines.push([{ text: `        • ${obj}`, fontStyle: 'Normal' }]);
            });

            lines.push([{ text: "    Methodology:", fontStyle: 'Bold'}]); 
            lines.push([{text: `    ${item.methodology}`, fontStyle: 'Normal'}]);

            if (item.equipment && item.equipment.length > 0) {
                lines.push([ 
                    { text: "    Equipment Used: ", fontStyle: 'Normal' }, 
                    { text: item.equipment.join(', '), fontStyle: 'Normal' }
                ]);
            }
            if (item.results && item.results.length > 0) {
                 lines.push([ 
                    { text: "    Expected/Preliminary Results: ", fontStyle: 'Normal' }, 
                    { text: item.results.join(', '), fontStyle: 'Normal' }
                ]);
            }
            return lines;
        };

        // --- Render Sections ---
        if (lab.equipments && lab.equipments.length > 0) {
            renderFlowingSection("I. EQUIPMENTS", lab.equipments, equipmentFormatter);
        }
        if (lab.assistants && lab.assistants.length > 0) {
            renderFlowingSection("II. STAFF MEMBERS", lab.assistants, staffFormatter);
        }
        if (lab.projects && lab.projects.length > 0) {
            renderFlowingSection("III. ONGOING PROJECTS", lab.projects, projectFormatter);
        }
        
        addPageNumberToDoc(doc, currentPageFlow, pageWidth, pageHeight, MARGIN_BOTTOM, PAGE_NUMBER_FONT_SIZE);
        doc.save(`${lab.name ? lab.name.replace(/\s+/g, '_') : 'Lab'}_IEEE_Flow_Report_Final.pdf`);
    };
 
    const generatePDF = () => {
        if (!lab) {
            alert("Lab data is not available. Please wait or check the connection.");
            return;
        }
        if (format === 'IEEE') {
            generateIEEEFormatReport();
        } else {
            alert('WHO format is not implemented in this example.');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Generate Biosafety Lab Report</h2>
            <p className="text-center mb-6">This version attempts true two-column newspaper-style flow with updated formatting and justification.</p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <div
                    className={`border rounded-xl p-4 shadow-md cursor-pointer w-full sm:w-1/2 ${format === 'IEEE' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setFormat('IEEE')}
                >
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg mb-2">
                        <span className="text-gray-500">IEEE Format Preview</span>
                    </div>
                    <h3 className="text-xl font-semibold text-center">IEEE Format</h3>
                    <button
                    onClick={generatePDF}
                    disabled={!lab}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                    Download {format} Report
                </button>
                </div>

                <div><GenerateWHOReport /></div>
            </div>

            {/* <div className="mt-8 text-center">
                <button
                    onClick={generatePDF}
                    disabled={!lab}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                    Download {format} Report
                </button>
                {!lab && <p className="text-red-500 mt-2">Lab data is loading or failed to load.</p>}
            </div> */}
        </div>
    );
}
