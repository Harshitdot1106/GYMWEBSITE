import express from 'express';
import { dbConfig } from '../DB/connectdb.js';
import oracleDB from 'oracledb';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, currentDate, status } = req.body;

  let conn = await oracleDB.getConnection(dbConfig);
  if (!email || !currentDate || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {    // check existing
    const check = await conn.execute(
      `SELECT * FROM ATTENDANCE WHERE EMAIL = :email AND CURRENTDATE = TRUNC(TO_DATE(:cd, 'YYYY-MM-DD'))`,
      { email, cd: currentDate },
      { outFormat: oracleDB.OUT_FORMAT_OBJECT }
    );

    if (check.rows.length) {
      // update
      await conn.execute(
        `UPDATE ATTENDANCE
           SET STATUS = :status
         WHERE EMAIL = :email
           AND CURRENTDATE = TRUNC(TO_DATE(:cd, 'YYYY-MM-DD'))`,
        { status, email, cd: currentDate },
        { autoCommit: true }
      );
      res.json({ message: 'Attendance updated' });
    } else {
      // insert
      await conn.execute(
        `INSERT INTO ATTENDANCE (EMAIL, CURRENTDATE, STATUS)
         VALUES (:email, TRUNC(TO_DATE(:cd, 'YYYY-MM-DD')), :status)`,
        { email, cd: currentDate, status },
        { autoCommit: true }
      );
      res.json({ message: 'Attendance recorded' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  } finally {
    if (conn) try { await conn.close(); } catch (_) {}
  }
});

router.get('/:email', async (req, res) => {
  const { email } = req.params;
  let conn
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }


  try {
     conn = await oracleDB.getConnection(dbConfig);
    const result = await conn.execute(
      `SELECT TO_CHAR(CURRENTDATE,'YYYY-MM-DD') AS DAY, STATUS
         FROM ATTENDANCE
        WHERE EMAIL = :email`,
      { email },
      { outFormat: oracleDB.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  } finally {
    if (conn) try { await conn.close(); } catch (_) {}
  }
});

export default router;