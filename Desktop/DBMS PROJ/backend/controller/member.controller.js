import oracledb from "oracledb";
import bcrypt from "bcrypt";
import { dbConfig } from "../DB/connectdb.js";
import { v4 as uuidv4 } from "uuid";
// 🔹 Create Member Function
const createMember = async (req, res) => {
  const { memail, password, mname } = req.body;
  console.log(req.body);

  if (!memail || !password || !mname) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  let connection;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const Joindate = new Date().toISOString().split("T")[0]; // Ensures YYYY-MM-DD format

    connection = await oracledb.getConnection(dbConfig);

    const query = `INSERT INTO MEMBER (MEMBERID, MNAME, MEMAIL, "PASSWORD", JOINDATE)
                   VALUES (member_seq.NEXTVAL, :mname, :memail, :password, TO_DATE(:Joindate, 'YYYY-MM-DD'))`;

    await connection.execute(
      query,
      { memail, password: hashedPassword, mname, Joindate },
      { autoCommit: true }
    );

    res.status(201).json({ message: "Member created successfully!" });
    console.log("Member created successfully!");
  } catch (error) {
    console.error("Error creating member:", error);
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
const getMember = async (req, res) => {
  const { memail, password } = req.body;

  if (!memail || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT memail, password, mname, joindate 
       FROM member WHERE memail = :memail`,
      { memail },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.json({ message: "Login successful!", user });
console.log(user);
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
export { createMember, getMember };
