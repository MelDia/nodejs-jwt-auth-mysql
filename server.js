const express = require("express");
const cors = require("cors");
const http = require("http");

const db = require("./app/models");
const Role = db.role;

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: "http://localhost:8081"
};

db.seq.sync();
// db.seq.sync({ force: true }).then(() => {
//     console.log("Drop and Resync DB");
//     initial();
// });

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

server.listen(PORT, () => {
    console.log(`Server is running on port >> ${PORT}.`)
})

function initial() {
    try {
        Role.create({
            id: 1,
            name: "user"
        });

        Role.create({
            id: 2,
            name: "moderator"
        });

        Role.create({
            id: 3,
            name: "admin"
        });
        console.log("Roles added to the database successfully!");
    } catch (error) {
        console.error("Error creating roles: ", error)
    }

}