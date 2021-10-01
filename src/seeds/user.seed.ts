import "reflect-metadata";
import faker from "faker";

import User from "../entities/user.entity";

export default async () => {
    
    const user = new User(
        faker.name.firstName(),
        faker.name.lastName(),
        faker.date.past(),
        faker.internet.email(),
        faker.phone.phoneNumber(),
        faker.address.streetAddress(),
        'default.png'
    );

    user.password = 'password'

    await user.save();

    return user;
}
