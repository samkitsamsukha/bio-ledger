import express from "express";
import {
	seedLab,
	postProject,
	getAllProjects,
	postEquipment,
	getAllEquipment,
	postAssistant,
	getAllAssistants,
	addAlert,
	getAllAlerts,
	updateAlerts,
	getContacts,
	postContacts,
	getLab
} from "../controllers/labController.js";
import Lab from "../models/labModel.js";

const router = express.Router();

router.post("/seed", seedLab);
router.post("/project", postProject);
router.get("/projects", getAllProjects);
router.post("/equipment", postEquipment);
router.get("/equipments", getAllEquipment);
router.post("/assistant", postAssistant);
router.get("/assistants", getAllAssistants);
router.post("/alert", addAlert);
router.get("/alerts", getAllAlerts);
router.put("/alerts", updateAlerts);
router.get("/contacts", getContacts);
router.post("/contacts", postContacts);
router.get("/lab", getLab);

export default router;
