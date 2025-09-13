const app = require("./app");
const port = 3000;

app.listen(port,()=>{
    console.log(`SERVER RUNNING ON PORT: http://localhost:${port}`);
});
