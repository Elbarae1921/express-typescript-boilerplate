import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import Icontroller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import fileupload from "express-fileupload";

class App {
    public app: Express;

    constructor(controllers: Icontroller[]) {
        // initialize express
        this.app = express();

        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeIndexFile();
        this.initializeErrorHandling();
    }

    // start express
    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App running on port ${process.env.PORT}`);
        })
    }

    // initialize the parsing middleware
    private initializeMiddleware() {
        this.app.use('/api/upload', fileupload({
            abortOnLimit: true,
            limits: { fileSize: 2000000 /*2mb*/ },
            createParentPath: true,
            responseOnLimit: "La limite de taille de fichier a été atteinte",
            preserveExtension: 4
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(helmet());
        this.app.use(morgan("dev"));
        this.app.use(compression());
        this.app.use(express.static('public'));
    }

    // set controllers and their routes
    private initializeControllers(controllers: Icontroller[]) {
        for(const controller of controllers) {
            this.app.use('/api', controller.router);
        }
    }

    // redirect every other route to react
    private initializeIndexFile() {
        this.app.use('*', (_, res) => {
            res.sendFile(`${process.cwd()}/public/index.html`);
        })
    }

    // initialize the error middleware lastly to not override the others
    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;
