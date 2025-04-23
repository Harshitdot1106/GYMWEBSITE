import oracledb from "oracledb";
import { dbConfig } from "../DB/connectdb.js";

const getAllExercises = async (req, res) => {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `SELECT EXERCISEID, EXERCISENAME, MUSCLE, THUMNAIL FROM exercise`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      if (connection) await connection.close();
    }
  };
  const MuscleExerciseById = async (req, res) => {
    const { name } = req.params;
    console.log(name);
  
    if (!name) {
      return res.status(400).json({ error: "Muscle name is required" });
    }
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(dbConfig);
  
      const result = await connection.execute(
        `SELECT EXERCISEID, EXERCISENAME, MUSCLE, THUMNAIL 
         FROM EXERCISE 
         WHERE MUSCLE = :name`,
        [name],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error("Error closing DB connection:", err);
        }
      }
    }
  };
  
  export { getAllExercises, MuscleExerciseById };
