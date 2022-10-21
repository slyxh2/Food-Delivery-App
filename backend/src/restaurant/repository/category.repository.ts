import { getDataSource } from "src/common/utils/getDataSource";
import { User } from "src/users/entities/users.entity";
import { Verification } from "src/users/entities/verification.entity";
import { Category } from "../entities/category.entity";
import { Restaurant } from "../entities/restaruant.entity";
import { DataSource } from "typeorm";
require('dotenv').config();

const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Category, User, Verification, Restaurant]
});
// const dataSource = getDataSource([Category, User, Verification, Restaurant]);
dataSource.initialize();
export const CategoryRepository = dataSource.getRepository(Category).extend({
    async getOrCreate(name: string): Promise<Category> {
        let categoryName = name.trim().toLowerCase();
        let categorySlug = categoryName.replace(/ /g, '-');
        let category = await this.findOne({
            where: { slug: categorySlug }
        });
        if (!category) {
            category = await this.save(this.create({ slug: categorySlug, name: categoryName }));
        }
        return category
    }
})






