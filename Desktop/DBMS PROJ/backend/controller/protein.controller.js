import oracledb from 'oracledb';
import { dbConfig } from '../DB/connectdb.js';

// Get protein data by email
const getProteinData = async (req, res) => {
  const { email } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT TARGET, CONSUMED FROM PROTEIN WHERE EMAIL = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const row = result.rows[0];
    res.json({
      required: parseFloat(row.TARGET),
      consumed: parseFloat(row.CONSUMED),
    });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
}


// Update consumed protein by email
const updateProteinData = async (req, res) => {
  const { email } = req.params;
  const { required, consumed, weight } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const remaining = (parseFloat(required) - parseFloat(consumed)).toFixed(1);

    await connection.execute(
      `
      DECLARE
        v_count NUMBER;
      BEGIN
        SELECT COUNT(*) INTO v_count FROM PROTEIN WHERE EMAIL = :email;

        IF v_count > 0 THEN
          UPDATE PROTEIN
          SET TARGET = :required,
              CONSUMED = :consumed,
              REMAINING = :remaining,
              WEIGHT = :weight
          WHERE EMAIL = :email;
        ELSE
          INSERT INTO PROTEIN (TARGET, CONSUMED, REMAINING, WEIGHT, EMAIL)
          VALUES (:required, :consumed, :remaining, :weight, :email);
        END IF;
      END;
      `,
      {
        email,
        required,
        consumed,
        remaining,
        weight,
      },
      { autoCommit: true }
    );

    await connection.close();
    res.json({ message: 'Protein data saved' });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


export { getProteinData, updateProteinData };
