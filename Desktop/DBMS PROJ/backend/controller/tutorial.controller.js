import oracledb from "oracledb";
import { dbConfig } from "../DB/connectdb.js";

const getTutorial = async (req, res) => {
  const { exerciseId } = req.body;
  if (!exerciseId) return res.status(400).json({ message: "Missing exerciseId" });
console.log("Exercise ID:", exerciseId);
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
      DECLARE
        v_url TUTORIALS.URL%TYPE;
        v_desc TUTORIALS.DESCRIPTION%TYPE;
      BEGIN
        SELECT URL, DESCRIPTION INTO v_url, v_desc
        FROM TUTORIALS
        WHERE EXERCISEID = :id;

        :url := v_url;
        :desc := v_desc;
      END;
      `,
      {
        id: exerciseId,
        url: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
        desc: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
      }
    );

    res.status(200).json({ URL: result.outBinds.url, DESCRIPTION: result.outBinds.desc });
  } catch (err) {
    if (err.errorNum === 100) {
      // NO_DATA_FOUND
      res.status(404).json({ message: "No tutorial found" });
    } else {
      console.error("Error fetching tutorial:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } finally {
    if (connection) await connection.close();
  }
};

export { getTutorial };
