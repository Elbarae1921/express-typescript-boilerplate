import { Entity, BaseEntity, Index, Column, Unique, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from "typeorm";
import { IsDate, IsEmail } from "class-validator";
import { hash } from "bcrypt";

@Entity()
@Unique(['id'])
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    @IsDate()
    dateBirth: Date;

    @Column()
    @Index({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    password: string;

    @Column()
    tel: string;

    @Column()
    address: string;

    @Column()
    photo: string;

    @Column({
        name: "created_at",
        type: "timestamp"
    })
    @CreateDateColumn()
    createdAt: Date;

    @Column({
        name: "updated_at",
        type: "timestamp"
    })
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     *
     * @param {string} firstName
     * @param {string} lastName
     * @param {Date} dateBirth
     * @param {string} email
     * @param {string} tel
     * @param {string} address
     * @param {string} photo
     */
    constructor(
        firstName: string,
        lastName: string,
        dateBirth: Date,
        email: string,
        tel: string,
        address: string,
        photo: string
    ) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateBirth = dateBirth;
        this.email = email;
        this.tel = tel;
        this.address = address;
        this.photo = photo;
    }

    @BeforeInsert()
    async setPassword() {
        this.password = await hash(
            this.password,
            Number(process.env.BCRYPT_ROUNDS)
        );
    }

    @BeforeInsert()
    beforeCreate() {
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updatedAt = new Date();
    }
}
