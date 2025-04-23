import oracledb from "oracledb";
 export const dbConfig = {
user:"dbmsproj",
password:"harshit",
connectString: "localhost:1521/XE"

}
async function fetchData() {
    let connection;
    try {
        // Establish connection
        connection = await oracledb.getConnection(dbConfig);
        console.log("Connected to Oracle Database");      
    } catch (err) {
        console.error("Error connecting to Oracle DB:", err);
    } }

export default fetchData;