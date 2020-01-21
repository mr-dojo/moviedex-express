const app = require("./app");

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Started listening on port http://localhost:${PORT}`));
