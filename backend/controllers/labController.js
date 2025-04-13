import Lab from "../models/labModel.js";

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const lab = await Lab.findOne();
    res.status(200).json(lab?.projects || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all assistants
export const getAllAssistants = async (req, res) => {
  try {
    const lab = await Lab.findOne();
    res.status(200).json(lab?.assistants || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all equipments
export const getAllEquipments = async (req, res) => {
  try {
    const lab = await Lab.findOne();
    res.status(200).json(lab?.equipments || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new assistant
export const addAssistant = async (req, res) => {
  try {
    const lab = await Lab.findOne();
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    lab.assistants.push(req.body);
    await lab.save();
    res.status(201).json({ message: "Assistant added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new project
export const addProject = async (req, res) => {
  try {
    const lab = await Lab.findOne();
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    lab.projects.push(req.body);
    await lab.save();
    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new equipment
export const addEquipment = async (req, res) => {
  try {
    const lab = await Lab.findOne();
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    lab.equipments.push(req.body);
    await lab.save();
    res.status(201).json({ message: "Equipment added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
