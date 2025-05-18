const generatePDF = () => {
	if (!lab) return;

	const startTime = performance.now(); // Record the start time

	const doc = new jsPDF();
	doc.setFont("Times", "Normal");
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

	if (format === "IEEE") {
		doc.setFontSize(18);
		doc.setTextColor(41, 128, 185);
		doc.text(`${lab.name} – IEEE Report`, pageWidth / 2, y, {
			align: "center",
		});
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
			const colWidth = pageWidth / 2 - margin - 5;

			doc.setFontSize(16);
			doc.setTextColor(52, 73, 94);
			y = formatText(
				doc,
				`Project ${idx + 1}: ${project.title}`,
				col1X,
				y,
				pageWidth - 2 * margin,
				1.2
			);
			y += 5;

			doc.setFontSize(12);
			doc.setTextColor(0);
			let yStart = y;

			y = formatText(doc, `Subtitle: ${project.subtitle}`, col1X, y, colWidth);
			y = formatText(doc, `Aim: ${project.aim}`, col2X, yStart, colWidth);

			y += 5;
			yStart = y;
			y = formatText(
				doc,
				`Methodology: ${project.methodology}`,
				col1X,
				y,
				colWidth
			);
			y = formatText(
				doc,
				`Results: ${project.results.join(", ")}`,
				col2X,
				yStart,
				colWidth
			);

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
		doc.text("Lab Assistants", pageWidth / 2, y, { align: "center" });
		y += 15;
		doc.setTextColor(0);

		lab.assistants.forEach((a) => {
			doc.setFontSize(14);
			doc.setTextColor(52, 73, 94);
			y = formatText(
				doc,
				`${a.designation} ${a.name}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y += 3;
			doc.setFontSize(12);
			doc.setTextColor(0);
			y = formatText(
				doc,
				`Role: ${a.role}, Department: ${a.department}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`Email: ${a.email}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`Specialization: ${a.specialization}, Experience: ${a.experience}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
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
			y = formatText(
				doc,
				`Project ${idx + 1}: ${project.title}`,
				margin,
				y,
				pageWidth - 2 * margin,
				1.2
			);
			y += 5;
			doc.setFontSize(12);
			doc.setTextColor(0);
			y = formatText(
				doc,
				`Subtitle: ${project.subtitle}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`BSL Level: ${project.bsl}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`Aim: ${project.aim}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`Objectives: ${
					project.objectives ? project.objectives.join(", ") : "N/A"
				}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`Methodology: ${project.methodology}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`Equipment Used: ${
					project.equipment ? project.equipment.join(", ") : "N/A"
				}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`Results: ${project.results.join(", ")}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
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
		doc.text("Lab Assistants", margin, y);
		y += 10;

		lab.assistants.forEach((a) => {
			doc.setFontSize(14);
			doc.setTextColor(52, 73, 94);
			y = formatText(
				doc,
				`${a.designation} ${a.name}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y += 3;
			doc.setFontSize(12);
			doc.setTextColor(0);
			y = formatText(
				doc,
				`Email: ${a.email}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y = formatText(
				doc,
				`Specialization: ${a.specialization}, Experience: ${a.experience}`,
				margin,
				y,
				pageWidth - 2 * margin
			);
			y += 8;
			doc.line(margin, y, pageWidth - margin, y);
			y += 5;

			if (y > pageHeight - margin - 20) {
				doc.addPage();
				y = margin + 10;
			}
		});
	}

	doc.save(`${lab.name.replace(/\s+/g, "_")}_${format}_Report.pdf`);
	const endTime = performance.now(); // Record the end time
	const generationTime = (endTime - startTime) / 1000; // Calculate time in seconds
	console.log(`Start Time: ${startTime} seconds`);
	console.log(`End Time: ${endTime} seconds`);
	console.log(`Report generation time: ${generationTime} seconds`);
};
