import UserFactory from './user.seed';
import AdminFactory from './admin.seed';
import { createConnection } from 'typeorm';

const main = async () => {
    // connect to postgres
    await createConnection();

    console.debug(await UserFactory());
    console.debug(await AdminFactory());

    return;
}

main();
