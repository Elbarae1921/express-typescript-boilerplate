import "reflect-metadata";
import faker from "faker";

import Admin from "../entities/admin.entity";

export default async () => {

    const admin = new Admin();

    admin.email = faker.internet.email();
    admin.password = 'password';

    await admin.save();

    return admin;
}
