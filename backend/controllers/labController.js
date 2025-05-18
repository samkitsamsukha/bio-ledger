import Lab from "../models/labModel.js";

// 1. Seed lab
export const seedLab = async (req, res) => {
	try {
		const existing = await Lab.findOne();
		if (existing)
			return res.status(400).json({ message: "Lab already seeded." });

		const lab = new Lab(req.body);
		await lab.save();
		res.status(201).json({ message: "Lab seeded successfully", lab });
	} catch (error) {
		res.status(500).json({ message: "Error seeding lab", error });
	}
};

// 2. Post Project
export const postProject = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		lab.projects.push(req.body);
		await lab.save();
		res.status(200).json(lab.projects);
	} catch (error) {
		res.status(500).json({ message: "Error adding project", error });
	}
};

// 3. Get All Projects
export const getAllProjects = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		res.status(200).json(lab.projects);
	} catch (error) {
		res.status(500).json({ message: "Error fetching projects", error });
	}
};

export const getLab = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		res.status(200).json(lab);
	} catch (error) {
		res.status(500).json({ message: "Error fetching lab", error });
	}
};

// 4. Post Equipment
export const postEquipment = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		lab.equipments.push(req.body);
		await lab.save();
		res.status(200).json(lab.equipments);
	} catch (error) {
		res.status(500).json({ message: "Error adding equipment", error });
	}
};

// 5. Get All Equipment
export const getAllEquipment = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		res.status(200).json(lab.equipments);
	} catch (error) {
		res.status(500).json({ message: "Error fetching equipment", error });
	}
};

// 6. Post Assistants
export const postAssistant = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		lab.assistants.push(req.body);
		await lab.save();
		res.status(200).json(lab.assistants);
	} catch (error) {
		res.status(500).json({ message: "Error adding assistant", error });
	}
};

// 7. Get All Assistants
export const getAllAssistants = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		res.status(200).json(lab.assistants);
	} catch (error) {
		res.status(500).json({ message: "Error fetching assistants", error });
	}
};

// 8. Add Alert
export const addAlert = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		lab.alerts.push(req.body);
		await lab.save();
		res.status(200).json(lab.alerts);
	} catch (error) {
		res.status(500).json({ message: "Error adding alert", error });
	}
};

// 9. Get All Alerts
export const getAllAlerts = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		res.status(200).json(lab.alerts);
	} catch (error) {
		res.status(500).json({ message: "Error fetching alerts", error });
	}
};

// 10. Update Alerts (Replace all alerts)
export const updateAlerts = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		lab.alerts = req.body.alerts;
		await lab.save();
		res.status(200).json({ message: "Alerts updated", alerts: lab.alerts });
	} catch (error) {
		res.status(500).json({ message: "Error updating alerts", error });
	}
};

// 11. Get Contacts
export const getContacts = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		res.status(200).json(lab.contacts);
	} catch (error) {
		res.status(500).json({ message: "Error fetching contacts", error });
	}
};

// 12. Post Contacts (overwrite contacts object)
export const postContacts = async (req, res) => {
	try {
		const lab = await Lab.findOne();
		lab.contacts = req.body;
		await lab.save();
		res
			.status(200)
			.json({ message: "Contacts updated", contacts: lab.contacts });
	} catch (error) {
		res.status(500).json({ message: "Error posting contacts", error });
	}
};
