import { connectUsingMongoose } from "./src/config/config.js";
import app from "./index.js";
app.listen(3200, async() => {
    await connectUsingMongoose();
  console.log("server is listening on 3200");
});
