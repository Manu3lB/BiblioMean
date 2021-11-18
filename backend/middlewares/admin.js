import admin from "../models/admin.js";

const adm = async (req, res, next) => {
    const adminBiblio = await admin.findById(req.admin._id);
    return adminBiblio
    ? next()
    : res.status(400).send({ message: "Unauthorized user" });
}

export default adm;