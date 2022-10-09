import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dto/create-account.dto";
import { User } from "./entities/users.entity";
import { LoginOutput, LoginInput } from "./dto/login.dto";
import { JwtService } from "src/jwt/jwt.service";



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async createAccount(accountInf: CreateAccountInput): Promise<string | undefined> {
        const { email, password, role } = accountInf
        // check new user
        try {
            const exists = await this.users.findOne({
                where: { email }
            });
            if (exists) {
                return 'There is a user with that email already';
            }
            await this.users.save(this.users.create({ email, password, role }));
        } catch (e) {
            return "Couldn't create account";
        }
    }

    async login(loginInf: LoginInput): Promise<LoginOutput> {
        const { email, password } = loginInf;
        try {
            const user = await this.users.findOne({
                where: { email }
            })
            if (!user) {
                return {
                    ok: false,
                    error: 'User not found'
                }
            }
            const isPasswordCorrect = await user.checkPassword(password);
            if (!isPasswordCorrect) {
                return {
                    ok: false,
                    error: 'wrong password'
                }
            }
            // const token = jwt.sign({ id: user.id }, this.config.get('PRIVATE_KEY'));
            const token = this.jwtService.sign({ id: user.id });
            return {
                ok: true,
                token
            }
        } catch (err) {
            return {
                ok: false,
                error: err
            }
        }
    }

    async findUserById(id: number): Promise<User> {
        return this.users.findOne({
            where: {
                id
            }
        })
    }
}