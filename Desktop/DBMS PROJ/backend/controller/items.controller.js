import oracledb from 'oracledb';
import { dbConfig } from '../DB/connectdb.js';

const getAllItems = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Connected!");

        const result = await connection.execute(
            `SELECT * FROM ITEMS`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log("Result:", result.rows);

        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: 'No items found.' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: "Internal server error." });
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

export { getAllItems };
