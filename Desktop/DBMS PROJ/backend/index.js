import express from 'express';
import cors from 'cors';
import  fetchData  from './DB/connectdb.js'; 
import oracledb from 'oracledb';
import {dbConfig} from './DB/connectdb.js';
import memberRoute from './routes/member.route.js';
import trainerRoute from './routes/trainer.route.js';
import classRoute from './routes/class.route.js';
import exerciseRouter from './routes/exercise.js';
import equipmentRouter from './routes/equipment.js';
import mealRoute from './routes/items.route.js';
import infoRoutes from './routes/infoRoutes.js';
import proteinRoute from './routes/protein.route.js';
import { getTutorial } from './controller/tutorial.controller.js';
import attendanceRoutes from './routes/attendance.route.js';
import membershipRoute from './routes/memership.route.js';
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 300;
app.get('/', async (req, res) => {
   let connection;
   try{
connection = await oracledb.getConnection(dbConfig);
const result = await connection.execute(`select * from exercise`, [], {outFormat: oracledb.OUT_FORMAT_OBJECT});
res.json(result.rows);
   }catch(err){
        console.error("Error connecting to Oracle DB:", err);
   } 
})
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api/equipment', equipmentRouter);
app.use('/api/membership',membershipRoute);
app.use('/api/exercise',exerciseRouter)
app.use('/api/member', memberRoute);
app.use('/api/trainer', trainerRoute);
app.use('/api/class', classRoute);
app.use('/api/meal', mealRoute);
app.use('/api/info', infoRoutes);
app.use('/api/protein', proteinRoute);
app.post("/api/tutorial",getTutorial);
app.use('/api/attendance', attendanceRoutes);
app.get("/api/usage/:equipmentId", async (req, res) => {
   const equipmentId = req.params.equipmentId;
 console.log("Equipment ID:", equipmentId);
   let conn;
   try {
     conn = await oracledb.getConnection(dbConfig);
 
     const result = await conn.execute(
       `SELECT * FROM exercise 
        WHERE EXERCISEID IN (
          SELECT EXERCISEID FROM usage WHERE EQUIPMENTID = :equipmentId
        )`,
       { equipmentId },
       { outFormat: oracledb.OUT_FORMAT_OBJECT }
     );
 
     res.json(result.rows);
   } catch (err) {
     console.error(err);
     res.status(500).send("Server error");
   } finally {
     if (conn) {
       try {
         await conn.close();
       } catch (err) {
         console.error("Error closing connection", err);
       }
     }
   }
 });
 

app.listen(PORT, async () => {
   await fetchData();
    console.log(`Server has started on port ${PORT}`);
});
