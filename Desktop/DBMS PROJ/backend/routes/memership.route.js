import express from 'express';
import { dbConfig } from '../DB/connectdb.js';
import oracleDB from 'oracledb';

const router = express.Router();

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await oracleDB.getConnection(dbConfig);
        const result = await conn.execute(`SELECT * FROM MEMBERSHIP`, [], { outFormat: oracleDB.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB error' });
    } finally {
        if (conn) try { await conn.close(); } catch (_) {}
    }
});




router.post('/', async (req, res) => {
  const { email, membership } = req.body;

  if (!email || !membership) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let conn;

  try {
    conn = await oracleDB.getConnection(dbConfig);

    // Step 1: Get MEMBERSHIPID from MEMBERSHIP table using the name
    const membershipResult = await conn.execute(
      `SELECT * FROM MEMBERSHIP WHERE NAME = :name`,
      { name: membership }
    );

    if (membershipResult.rows.length === 0) {
      return res.status(404).json({ message: 'Membership plan not found' });
    }

   

    // Step 2: Update MEMBER with that MEMBERSHIPID using MEMAIL
    const updateResult = await conn.execute(
      `UPDATE MEMBER SET MEMBERSHIPID = :membership WHERE MEMAIL = :email`,
      {
        membership,
        email,
      },
      { autoCommit: true }
    );

    if (updateResult.rowsAffected === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ message: 'Membership successfully updated for the member!' });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Failed to update membership' });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error closing connection', err);
      }
    }
  }
});



  
export default router;