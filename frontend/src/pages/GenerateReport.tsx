'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';

interface Project {
    title: string;
    subtitle: string;
    aim: string;
    methodology: string;
    results: string[];
    bsl?: string;
    objectives?: string[];
    equipment?: string[];
}

interface Assistant {
    name: string;
    designation: string;
    role?: string;
    department?: string;
    email?: string;
    specialization?: string;
    experience?: string;
}

interface LabData {
    name: string;
    location: string;
    projects: Project[];
    assistants: Assistant[];
    equipments: string[];
    contacts: { name: string; email: string; phone?: string }[];
}

export default function GenerateReport() {
    const [lab, setLab] = useState<LabData | null>(null);
    const [format, setFormat] = useState<'IEEE' | 'WHO'>('IEEE');

    useEffect(() => {
        const fetchLabData = async () => {
            const res = await axios.get('http://localhost:5000/api/lab/lab');
            setLab(res.data);
            console.log(res.data);
        };
        fetchLabData();
    }, []);

    console.log(lab);

    const generatePDF = () => {
        if (!lab) return;

        const startTime = performance.now(); // Record the start time

        const doc = new jsPDF();
        doc.setFont('Times', 'Normal');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let y = margin + 10;
        const lineHeightBase = 6;


        const formatText = (
            doc: jsPDF,
            text: string,
            x: number,
            y: number,
            maxWidth: number,
            lineHeightMultiplier: number = 1
        ): number => {
            const lineHeight: number = lineHeightBase * lineHeightMultiplier;
            const lines: string[] = doc.splitTextToSize(text, maxWidth);
            lines.forEach((line: string, i: number) => {
                doc.text(line, x, y + i * lineHeight);
            });
            return y + lines.length * lineHeight;
        };

        if (format === 'IEEE') {
            doc.setFontSize(18);
            doc.setTextColor(41, 128, 185);
            doc.text(`${lab.name} – IEEE Report`, pageWidth / 2, y, { align: 'center' });
            y += 12;
            doc.setTextColor(0);
            doc.setFontSize(12);
            doc.text(`Location: ${lab.location}`, margin, y);
            y += 15;
            doc.line(margin, y - 5, pageWidth - margin, y - 5);
            y += 5;

            lab.projects.forEach((project, idx) => {
                const col1X = margin;
                const col2X = pageWidth / 2 + 5;
                const colWidth = (pageWidth / 2) - margin - 5;

                doc.setFontSize(16);
                doc.setTextColor(52, 73, 94);
                y = formatText(doc, `Project ${idx + 1}: ${project.title}`, col1X, y, pageWidth - 2 * margin, 1.2);
                y += 5;

                doc.setFontSize(12);
                doc.setTextColor(0);
                let yStart = y;

                y = formatText(doc, `Subtitle: ${project.subtitle}`, col1X, y, colWidth);
                y = formatText(doc, `Aim: ${project.aim}`, col2X, yStart, colWidth);

                y += 5;
                yStart = y;
                y = formatText(doc, `Methodology: ${project.methodology}`, col1X, y, colWidth);
                y = formatText(doc, `Results: ${project.results.join(', ')}`, col2X, yStart, colWidth);

                y += 10;
                doc.line(margin, y, pageWidth - margin, y);
                y += 5;

                if (y > pageHeight - margin - 30) {
                    doc.addPage();
                    y = margin + 10;
                }
            });

            doc.addPage();
            y = margin + 10;
            doc.setFontSize(18);
            doc.setTextColor(41, 128, 185);
            doc.text('Lab Assistants', pageWidth / 2, y, { align: 'center' });
            y += 15;
            doc.setTextColor(0);

            lab.assistants.forEach((a) => {
                doc.setFontSize(14);
                doc.setTextColor(52, 73, 94);
                y = formatText(doc, `${a.designation} ${a.name}`, margin, y, pageWidth - 2 * margin);
                y += 3;
                doc.setFontSize(12);
                doc.setTextColor(0);
                y = formatText(doc, `Role: ${a.role}, Department: ${a.department}`, margin, y, pageWidth - 2 * margin);
                y = formatText(doc, `Email: ${a.email}`, margin, y, pageWidth - 2 * margin);
                y = formatText(doc, `Specialization: ${a.specialization}, Experience: ${a.experience}`, margin, y, pageWidth - 2 * margin);
                y += 8;
                doc.line(margin, y, pageWidth - margin, y);
                y += 5;

                if (y > pageHeight - margin - 20) {
                    doc.addPage();
                    y = margin + 10;
                }
            });
        } else {
            doc.setFontSize(20);
            doc.setTextColor(142, 68, 173);
            doc.text(`${lab.name} – WHO Report`, margin, y);
            y += 12;
            doc.setTextColor(0);
            doc.setFontSize(12);
            doc.text(`Location: ${lab.location}`, margin, y);
            y += 15;
            doc.line(margin, y - 5, pageWidth - margin, y - 5);
            y += 10;

            lab.projects.forEach((project, idx) => {
                doc.setFontSize(16);
                doc.setTextColor(52, 73, 94);
                y = formatText(doc, `Project ${idx + 1}: ${project.title}`, margin, y, pageWidth - 2 * margin, 1.2);
                y += 5;
                doc.setFontSize(12);
                doc.setTextColor(0);
                y = formatText(doc, `Subtitle: ${project.subtitle}`, margin, y, pageWidth - 2 * margin);
                y = formatText(doc, `BSL Level: ${project.bsl}`, margin, y, pageWidth - 2 * margin);
                y = formatText(doc, `Aim: ${project.aim}`, margin, y, pageWidth - 2 * margin);
                y = formatText(doc, `Objectives: ${(project.objectives ? project.objectives.join(', ') : 'N/A')}`, margin, y, pageWidth - 2 * margin);
                y = formatText(doc, `Methodology: ${project.methodology}`, margin, y, pageWidth - 2 * margin);
                y = formatText(
                    doc,
                    `Equipment Used: ${project.equipment ? project.equipment.join(', ') : 'N/A'}`,
                    margin,
                    y,
                    pageWidth - 2 * margin
                );
                y = formatText(doc, `Results: ${project.results.join(', ')}`, margin, y, pageWidth - 2 * margin);
                y += 10;
                doc.line(margin, y, pageWidth - margin, y);
                y += 8;

                if (y > pageHeight - margin - 30) {
                    doc.addPage();
                    y = margin + 10;
                }
            });

            doc.addPage();
            y = margin + 10;
            doc.setFontSize(18);
            doc.setTextColor(142, 68, 173);
            doc.text('Lab Assistants', margin, y);
            y += 10;

            lab.assistants.forEach((a) => {
                doc.setFontSize(14);
                doc.setTextColor(52, 73, 94);
                y = formatText(doc, `${a.designation} ${a.name}`, margin, y, pageWidth - 2 * margin);
                y += 3;
                doc.setFontSize(12);
                doc.setTextColor(0);
                y = formatText(doc, `Email: ${a.email}`, margin, y, pageWidth - 2 * margin);
                y = formatText(doc, `Specialization: ${a.specialization}, Experience: ${a.experience}`, margin, y, pageWidth - 2 * margin);
                y += 8;
                doc.line(margin, y, pageWidth - margin, y);
                y += 5;

                if (y > pageHeight - margin - 20) {
                    doc.addPage();
                    y = margin + 10;
                }
            });
        }

        doc.save(`${lab.name.replace(/\s+/g, '_')}_${format}_Report.pdf`);
        const endTime = performance.now(); // Record the end time
        const generationTime = (endTime - startTime) / 1000; // Calculate time in seconds
        console.log(`Start Time: ${startTime} seconds`);
        console.log(`End Time: ${endTime} seconds`);
        console.log(`Report generation time: ${generationTime} seconds`);
    };


    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Generate Report</h2>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <div
                    className={`border rounded-xl p-4 shadow-md cursor-pointer w-full sm:w-1/2 ${format === 'IEEE' ? 'ring-2 ring-blue-500' : ''
                        }`}
                    onClick={() => setFormat('IEEE')}
                >
                    <img src="/ieee-template.png" alt="IEEE Template" className="rounded-lg mb-2" />
                    <h3 className="text-xl font-semibold text-center">IEEE Format</h3>
                </div>

                <div
                    className={`border rounded-xl p-4 shadow-md cursor-pointer w-full sm:w-1/2 ${format === 'WHO' ? 'ring-2 ring-blue-500' : ''
                        }`}
                    onClick={() => setFormat('WHO')}
                >
                    <img src="/who-template.png" alt="WHO Template" className="rounded-lg mb-2" />
                    <h3 className="text-xl font-semibold text-center">WHO Format</h3>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={generatePDF}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                >
                    Download {format} Report
                </button>
            </div>
        </div>
    );
}
