import app from "./app"
import { connectToDatabase } from "./db/connection.js";

//connections and listeneres
const PORT = process.env.PORT || 5000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `[server]: running on port: ${PORT} | http://localhost:${PORT}/`
      );
    });
  })
  .catch((err) => console.log(err));