import app from "./app";
import { config } from "./config";

app.listen(config.PORT, () => {
  console.log(`HabitTracker backend running on port ${config.PORT}`);
});
