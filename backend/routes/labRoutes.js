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
	getLab,
} from "../controllers/labController.js";
import Lab from "../models/labModel.js";
import {sendAlertMail} from "../controllers/sendAlertMail.js";

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
router.post("/send-alert", async (req, res) => {
	const { recipients, labName, alertMessage } = req.body;
	try {
		await sendAlertMail({
			recipients,
			labName,
			alertMessage,
			timestamp: Date.now(),
		});
		res.status(200).json({ message: "Alert email sent successfully" });
	} catch (error) {
		console.error("Email send failed:", error);
		res.status(500).json({ message: "Failed to send alert email" });
	}
});

export default router;
