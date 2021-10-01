import { hash } from "bcrypt";
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";

@Entity()
export default class Admin extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

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