import oracledb from "oracledb";
import { dbConfig } from "../DB/connectdb.js";

const getEquipmentByExerciseId = async (req, res) => {
  const { exerciseid } = req.params;

  if (!exerciseid) {
    return res.status(400).json({ error: "Exercise ID is required" });
  }

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const query = `
     SELECT EQUIPMENTID, EQUIPMENTNAME, DESCRIPTION
FROM EQUIPMENT
WHERE EQUIPMENTID IN (
    SELECT EQUIPMENTID
    FROM EXERCISE_EQUIPMENT
    WHERE EXERCISEID = :exerciseid
);
    `;

    const result = await connection.execute(
      query,
      { exerciseid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Error fetching equipment for exercise:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};
async function getEquipment(req, res){
   try{
    console.log("getEquipment called");
const connection = await oracledb.getConnection(dbConfig);
const result = await connection.execute(`select * from equipment`, [], {outFormat: oracledb.OUT_FORMAT_OBJECT});
res.json(result.rows);
   }catch(err){
    console.error(err);
    res.json(err);
   } 
}
const getEquipmentById = async (req, res) => {
    const { equipmentid } = req.params;
    console.log(equipmentid);
    if (!equipmentid) {
        return res.status(400).json({ error: "Equipment ID is required" });
    }

  try{
    let connection=await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
        `SELECT * FROM equipment WHERE equipmentid = :equipmentid`,
        { equipmentid },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Equipment not found" });
    }
    console.log(result.rows[0]);
    res.status(200).json(result.rows[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }


}
export { getEquipmentByExerciseId,getEquipment,getEquipmentById };
