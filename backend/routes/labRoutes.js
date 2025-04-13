import express from "express";
import {
	getAllProjects,
	getAllAssistants,
	getAllEquipments,
	addAssistant,
	addProject,
	addEquipment,
} from "../controllers/labController.js";
import Lab from "../models/labModel.js";

const router = express.Router();

// Seed route
router.post("/init", async (req, res) => {
	try {
		const existing = await Lab.findOne();
		if (existing)
			return res.status(400).json({ message: "Lab already initialized" });

		const newLab = new Lab({
			projects: [],
			assistants: [],
			equipments: [],
		});

		await newLab.save();
		res.status(201).json({ message: "Lab initialized" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Main Lab routes
router.get("/projects", getAllProjects);
router.get("/assistants", getAllAssistants);
router.get("/equipments", getAllEquipments);

router.post("/assistants", addAssistant);
router.post("/projects", addProject);
router.post("/equipments", addEquipment);

export default router;
