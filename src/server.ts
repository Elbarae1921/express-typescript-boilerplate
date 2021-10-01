import "reflect-metadata";
import {createConnection} from "typeorm";

import App from "./App";
import AdminController from "./controllers/admin.controller";
import HomeController from "./controllers/home.controller";
import "dotenv/config";


const main = async () => {

    // connect to postgres
    await createConnection();

    // create new instance of App
    const app = new App([
        new AdminController(),
        new HomeController()
    ]);

    // start express
    app.listen();
}


main();
