import oracledb from "oracledb";
import bcrypt from "bcrypt";
import { dbConfig } from "../DB/connectdb.js";
import { v4 as uuidv4 } from "uuid";

// 🔹 Create Trainer Function
const createTrainer = async (req, res) => {
  const { tname, temail, password, specialization } = req.body;
  console.log(req.body);

  if (!tname || !temail || !password || !specialization) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  let connection;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const joindate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const trainerID = uuidv4(); // Generate UUID for TRAINERID

    connection = await oracledb.getConnection(dbConfig);

    const query = `INSERT INTO TRAINER (TRAINERID, TNAME, TEMAIL, "PASSWORD", SPECIALIZATION, JOINDATE)
                   VALUES (:trainerID, :tname, :temail, :password, :specialization, TO_DATE(:joindate, 'YYYY-MM-DD'))`;

    await connection.execute(
      query,
      { trainerID, tname, temail, password: hashedPassword, specialization, joindate },
      { autoCommit: true }
    );

    res.status(201).json({ message: "Trainer created successfully!" });
    console.log("Trainer created successfully!");
  } catch (error) {
    console.error("Error creating trainer:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
};

// 🔹 Get Trainer Function
const getTrainer = async (req, res) => {
  const { temail, password } = req.body;

  if (!temail || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT TRAINERID, TNAME, TEMAIL, "PASSWORD", SPECIALIZATION, JOINDATE 
       FROM TRAINER WHERE TEMAIL = :temail`,
      { temail },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const trainer = result.rows[0];
    const isMatch = await bcrypt.compare(password, trainer.PASSWORD);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.json({ message: "Login successful!", trainer });
    console.log(trainer);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
};

// Export functions
export { createTrainer, getTrainer };
