import admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const registerAdmin = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send({ message: "Incomplete data" });

  const existingAdmin = await admin.findOne({ email: req.body.email });
  if (existingAdmin)
    return res.status(400).send({ message: "The admin is already registered" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const adminRegister = new admin({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    dbStatus: true,
  });

  const result = await adminRegister.save();
  return !result
    ? res.status(400).send({ message: "Failed to register admin" })
    : res.status(200).send({ result });
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Incomplete data" });

  const adminLogin = await admin.findOne({ email: req.body.email });
  if (!adminLogin)
    return res.status(400).send({ message: "Wrong email or password" });

  const hash = await bcrypt.compare(req.body.password, adminLogin.password);
  if (!hash)
    return res.status(400).send({ message: "Wrong email or password" });

//   return !adminLogin
//     ? res.status(400).send({ message: "Admin no found" })
//     : res.status(200).json({
//                 token: jwt.sign({
//                     _id: adminLogin._id,
//                     name: adminLogin.name,
//                     iat: moment().unix(),
//                 },
//                 process.env.SKE_JWT
//                 ),
//             });

    try {
      return res.status(200).json({
          token: jwt.sign({
              _id: adminLogin._id,
              name: adminLogin.name,
              iat: moment().unix(),
          },
          process.env.SKE_JWT
          ),
      });
    } catch (e) {
        return res.status(400).send({ message: "Login error"});
    }
};

export default { registerAdmin, login };
