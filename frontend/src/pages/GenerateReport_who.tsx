'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

// Interface definitions for the data structure
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
    name:string;
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

// Main component for generating the report
export default function GenerateWHOReport() {
    const [lab, setLab] = useState<LabData | null>(null);

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

    const generateWHOFormatReport = () => {
        if (!lab) {
            alert("Lab data is not loaded yet.");
            return;
        }

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // --- WHO-style Document Constants ---
        const FONT_FAMILY = 'Helvetica'; // Common font for WHO reports
        const MARGIN_TOP = 60;
        const MARGIN_BOTTOM = 60;
        const MARGIN_X = 55;
        const CONTENT_WIDTH = pageWidth - (MARGIN_X * 2);

        let currentY = MARGIN_TOP;
        let pageNumber = 1;

        // --- PDF Generation Helpers ---
        const addPageHeaderAndFooter = () => {
            doc.setFont(FONT_FAMILY, "Normal");
            doc.setFontSize(8);
            
            // Footer with Page Number
            const footerText = `Page ${pageNumber}`;
            doc.text(footerText, pageWidth / 2, pageHeight - (MARGIN_BOTTOM / 2), { align: 'center' });
        };
        
        const checkAndAddPage = (spaceNeeded: number) => {
            if (currentY + spaceNeeded > pageHeight - MARGIN_BOTTOM) {
                addPageHeaderAndFooter();
                doc.addPage();
                pageNumber++;
                currentY = MARGIN_TOP;
            }
        };
        
        const addH1 = (text: string) => {
            checkAndAddPage(40);
            doc.setFont(FONT_FAMILY, 'Bold');
            doc.setFontSize(14);
            doc.text(text, MARGIN_X, currentY);
            currentY += 25;
            doc.setLineWidth(1);
            doc.line(MARGIN_X, currentY - 5, MARGIN_X + CONTENT_WIDTH, currentY - 5);
            currentY += 15;
        };

        const addH2 = (text: string) => {
            checkAndAddPage(30);
            doc.setFont(FONT_FAMILY, 'Bold');
            doc.setFontSize(11);
            doc.text(text, MARGIN_X, currentY);
            currentY += 20;
        };
        
        const addBodyText = (text: string) => {
            checkAndAddPage(20);
            doc.setFont(FONT_FAMILY, 'Normal');
            doc.setFontSize(10);
            const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
            doc.text(lines, MARGIN_X, currentY, { align: 'justify', lineHeightFactor: 1.4 });
            currentY += lines.length * 10 * 1.4;
            currentY += 10;
        };


        // --- PAGE 1: Title Page ---
        doc.setFont(FONT_FAMILY, 'Bold');
        doc.setFontSize(10);
        doc.text("WHO-STYLE COMPLIANCE REPORT", pageWidth / 2, 80, { align: 'center' });
        
        doc.setFontSize(24);
        const titleLines = doc.splitTextToSize(`Bio-safety Compliance Report: ${lab.name}`, CONTENT_WIDTH * 0.8);
        doc.text(titleLines, pageWidth / 2, 180, { align: 'center' });

        doc.setFont(FONT_FAMILY, 'Normal');
        doc.setFontSize(12);
        doc.text(`Location: ${lab.location}`, pageWidth / 2, 250, { align: 'center' });

        doc.text(`Date of Report: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 120, { align: 'center' });

        doc.setFont(FONT_FAMILY, 'Bold');
        doc.text("World Health Organization", pageWidth / 2, pageHeight - 80, { align: 'center' });
        doc.setFont(FONT_FAMILY, 'Normal');
        doc.text("Placeholder for official WHO branding", pageWidth / 2, pageHeight - 65, { align: 'center' });


        // --- START CONTENT PAGES ---
        doc.addPage();
        pageNumber++;
        currentY = MARGIN_TOP;

        // --- Section 1: Abstract ---
        addH1("1. Abstract");
        const abstractBody = 'This report presents a compliance overview of a BSL certified biosafety laboratory engaged in ongoing high-containment research projects. It details laboratory infrastructure, equipment inventory, and adherence to regulatory biosafety standards. The document also outlines active research efforts, staff qualifications, and safety protocols, ensuring operational alignment with institutional and international guidelines for secure and responsible biological research.';
        addBodyText(abstractBody);
        
        // --- Section 2: Laboratory Equipment (Table) ---
        if (lab.equipments && lab.equipments.length > 0) {
            currentY += 10;
            addH1("2. Laboratory Equipment");
            const head = [['ID', 'Name / Model', 'Manufacturer', 'Year', 'Specifications']];
            const body = lab.equipments.map((eq, index) => [
                index + 1,
                `${eq.name}\n(Model: ${eq.model})`,
                eq.manufacturer,
                eq.year,
                eq.specifications.map(s => `• ${s.specification}`).join('\n')
            ]);

            autoTable(doc, {
                head,
                body,
                startY: currentY,
                didDrawPage: (data: { pageNumber: number }) => {
                    addPageHeaderAndFooter();
                    if (data.pageNumber > pageNumber) pageNumber = data.pageNumber;
                    currentY = MARGIN_TOP; // Reset Y on new page
                },
                margin: { left: MARGIN_X, right: MARGIN_X },
                styles: { font: FONT_FAMILY, fontSize: 9, cellPadding: 4, valign: 'middle' },
                headStyles: { fillColor: '#222222', textColor: '#FFFFFF', fontStyle: 'bold' },
                theme: 'grid'
            });
            currentY = (doc as any).lastAutoTable.finalY;
        }
        
        // --- Section 3: Staff Members (Table) ---
        if (lab.assistants && lab.assistants.length > 0) {
            currentY += 20;
            addH1("3. Qualified Staff Members");
             const head = [['ID', 'Name', 'Designation / Role', 'Department', 'Specialization']];
             const body = lab.assistants.map((staff, index) => [
                index + 1,
                staff.name,
                `${staff.designation}\n(Role: ${staff.role})`,
                staff.department,
                staff.specialization,
            ]);

             autoTable(doc, {
                head,
                body,
                startY: currentY,
                didDrawPage: (data: { pageNumber: number }) => {
                    addPageHeaderAndFooter();
                    if (data.pageNumber > pageNumber) pageNumber = data.pageNumber;
                    currentY = MARGIN_TOP;
                },
                margin: { left: MARGIN_X, right: MARGIN_X },
                styles: { font: FONT_FAMILY, fontSize: 9, cellPadding: 4, valign: 'middle' },
                headStyles: { fillColor: '#222222', textColor: '#FFFFFF', fontStyle: 'bold' },
                theme: 'grid'
            });
            currentY = (doc as any).lastAutoTable.finalY;
        }

        // --- Section 4: Ongoing Projects ---
        if (lab.projects && lab.projects.length > 0) {
            currentY += 20;
            addH1("4. Ongoing Research Projects");

            lab.projects.forEach((project, index) => {
                checkAndAddPage(150); // Estimate space for a project
                addH2(`4.${index + 1} ${project.title}`);
                
                addBodyText(`Aim: ${project.aim}`);
                addBodyText(`Methodology: ${project.methodology}`);

                doc.setFont(FONT_FAMILY, 'Bold');
                doc.setFontSize(10);
                doc.text("Objectives:", MARGIN_X, currentY);
                currentY += 15;

                doc.setFont(FONT_FAMILY, 'Normal');
                project.objectives.forEach(obj => {
                    const objLines = doc.splitTextToSize(`• ${obj}`, CONTENT_WIDTH - 15);
                    checkAndAddPage(objLines.length * 15);
                    doc.text(objLines, MARGIN_X + 15, currentY);
                    currentY += objLines.length * 10 * 1.4;
                });
                currentY += 20;
            });
        }
        
        // Add final page's footer
        addPageHeaderAndFooter();

        // --- Save the document ---
        doc.save(`${lab.name.replace(/\s+/g, '_')}_WHO_Report.pdf`);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto font-sans bg-gray-50 text-center rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-3 text-gray-700">WHO-Style Report Generator</h2>
            <p className="text-gray-600 mb-6">
                Click the button below to generate a formal, single-column biosafety report
                with tabular data, styled according to WHO guidelines.
            </p>
            <button
                onClick={generateWHOFormatReport}
                disabled={!lab}
                className="bg-teal-600 text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Download WHO Format Report
            </button>
            {!lab && <p className="text-red-500 mt-4">Waiting for lab data to load...</p>}
        </div>
    );
}