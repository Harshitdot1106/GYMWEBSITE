// controllers/infoController.ts

import oracledb from 'oracledb';
import { dbConfig } from '../DB/connectdb.js';
export const getInfoByEmail = async (req, res) => {
  const email = req.params.email;
console.log(email);
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT HEIGHT, WEIGHT, BMI, AGE, GENDER, BFI
FROM (
    SELECT HEIGHT, WEIGHT, BMI, AGE, GENDER, BFI
    FROM INFO
    WHERE EMAIL = :email
)`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "No info found for this email" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const postInfo = async (req, res) => {
  const { HEIGHT, WEIGHT, BMI, AGE, GENDER, BFI, EMAIL } = req.body;
console.log(req.body);
  try {
    const connection = await oracledb.getConnection(dbConfig);

    // check if entry already exists
    const check = await connection.execute(
      `SELECT * FROM INFO WHERE EMAIL = :email`,
      [EMAIL],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (check.rows.length > 0) {
      // Optional: update instead
      await connection.execute(
        `UPDATE INFO
SET HEIGHT = :HEIGHT,
    WEIGHT = :WEIGHT,
    BMI = :BMI,
    AGE = :AGE,
    GENDER = :GENDER,
    BFI = :BFI
WHERE EMAIL = (
    SELECT EMAIL FROM INFO WHERE EMAIL = :EMAIL
)
`,
        [HEIGHT, WEIGHT, BMI, AGE, GENDER, BFI, EMAIL],
        { autoCommit: true }
      );
      res.json({ message: "Info updated successfully" });
    } else {
      const memberId = Math.floor(Math.random() * 1000000); // You can auto-generate or handle it better

      await connection.execute(
        `INSERT INTO INFO (HEIGHT, WEIGHT, BMI, AGE, GENDER, BFI, EMAIL) 
         VALUES (:HEIGHT, :WEIGHT, :BMI, :AGE, :GENDER, :BFI, :EMAIL )`,
        [HEIGHT, WEIGHT, BMI, AGE, GENDER, BFI, EMAIL],
        { autoCommit: true }
      );

      res.json({ message: "Info submitted successfully" });
    }

    await connection.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save info" });
  }
};
