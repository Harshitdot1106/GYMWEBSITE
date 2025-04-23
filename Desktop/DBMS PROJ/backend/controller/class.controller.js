import oracledb from "oracledb";
import { dbConfig } from "../DB/connectdb.js";
import { v4 as uuidv4 } from "uuid";
// /import { uploadOnCloadinary } from "../utilis/cloudinary.js";
import express from "express";
import cloudinary from "../middleware/cloudinary.js";

// const uploadClassImage = async (req, res) => {
//   const { class_name, time, participants, description } = req.body;

//   if (!req.file|| !class_name || !time || !participants || !description) {
//     return res.status(400).json({ error: "All fields are required!" });
//   }

//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const class_id = uuidv4(); // Generate unique CLASSID

//     // Upload image to Cloudinary
//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { folder: "class_images" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(req.file.buffer);
//     });
//    const imageUrl = uploadResult.secure_url;
//     console.log(imageUrl);
   

//     const query = `INSERT INTO CLASS (CLASSID, CLASSNAME, TIME, PARTICIPANTS, THUMNAIL, DESCRIPTION) 
//                    VALUES (:class_id, :class_name, :time, :participants, :thumbnail, :description)`;

//     await connection.execute(
//       query,
//       {
//         class_id,
//         class_name,
//         time,
//         participants,
//         thumbnail: imageUrl, // Storing Image URL instead of BLOB
//         description,
//       },
//       { autoCommit: true }
//     );

//     res.status(201).json({ 
//       message: "Class image uploaded successfully!", 
//       imageUrl: uploadResult.secure_url 
//     });

//   } catch (error) {
//     console.error("Error uploading class image:", error);
//     res.status(500).json({ error: error.message });
//   } finally {
//     if (connection) await connection.close();
//   }
// };

// 🔹 Fetch Class Details & Image URL
// const getClassImage = async (req, res) => {
//   const { class_id } = req.params;

//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute(
//       `SELECT CLASSNAME, TIME, PARTICIPANTS, THUMNAIL, DESCRIPTION,TRAINER FROM CLASS WHERE CLASSID = :class_id`,
//       { class_id },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Class not found!" });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error fetching class image:", error);
//     res.status(500).json({ error: "Internal server error." });
//   } finally {
//     if (connection) await connection.close();
//   }
// };
const getAllClasses = async () => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
      DECLARE
        class_cursor SYS_REFCURSOR;
      BEGIN
        OPEN class_cursor FOR
          SELECT CLASSID, CLASSNAME, TIME, PARTICIPANTS, THUMNAIL, DESCRIPTION, TRAINER
          FROM CLASS;

        :result := class_cursor;
      END;
      `,
      {
        result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const resultSet = result.outBinds.result;
    const rows = await resultSet.getRows(); // Fetch all rows
    await resultSet.close();

    return rows;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
};
const getClass = async (req, res) => {
  try {
    const classData = await getAllClasses();
   
    res.json(classData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};
const joinClass = async (req, res) => {
  const { classId, email } = req.body;

  if (!classId || !email) {
    return res.status(400).json({ message: "Class ID and Email are required" });
  }

  console.log(classId, email);

  let connection;
  try {
    // Get a database connection
    connection = await oracledb.getConnection(dbConfig);

    // Check if the user exists
    const userResult = await connection.execute(
      `SELECT * FROM MEMBER WHERE MEMAIL = :email`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the class exists
    const classResult = await connection.execute(
      `SELECT * FROM CLASS WHERE CLASSID = :classId`,
      [classId]
    );

    if (classResult.rows.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if the user has already joined the class
    const alreadyJoined = await connection.execute(
      `SELECT * FROM CLASSREG WHERE CLASSID = :classId AND EMAIL = :email`,
      [classId, email]
    );

    if (alreadyJoined.rows.length > 0) {
      return res.status(200).json({ message: "You have already joined this class." });
    }

    // Insert into classreg table
    const insertQuery = `
      INSERT INTO CLASSREG (CLASSID, EMAIL)
      VALUES (:classId, :email)
    `;

    await connection.execute(insertQuery, [classId, email], { autoCommit: true });

    res.status(200).json({ message: "Joined class successfully!" });

  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

const joinedClass = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
      SELECT CLASSNAME, TIME, DESCRIPTION
FROM CLASS
WHERE CLASSID IN (
    SELECT CLASSID
    FROM CLASSREG
    WHERE EMAIL = :email
)

      `,
      [email]
    );

    const rows = result.rows.map((row, index) => {
      return {
        CLASSNAME: row[0],
        TIME: row[1],
        INSTRUCTOR: row[2],
      };
    });

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error retrieving joined classes:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}
    
export { getClass,joinClass,joinedClass };
