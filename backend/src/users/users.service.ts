import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput, CreateAccountOutput } from "./dto/create-account.dto";
import { User } from "./entities/users.entity";
import { LoginOutput, LoginInput } from "./dto/login.dto";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput, EditProfileOutput } from "./dto/edit-profile.dto";
import { Verification } from "./entities/verification.entity";
import { MailService } from "src/mail/mail.service";
import { UserProfileOutput } from "./dto/user-profile.dto";
import { VerifyEmailOutput } from "./dto/verify-email.dto";



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly Verification: Repository<Verification>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) { }

    async createAccount(accountInf: CreateAccountInput): Promise<CreateAccountOutput> {
        const { email, password, role } = accountInf
        // check new user
        try {
            const exists = await this.users.findOne({
                where: { email }
            });
            if (exists) {
                return { ok: false, error: 'There is a user with that email already' }
            }
            const user = await this.users.save(this.users.create({ email, password, role }));
            const ver = await this.Verification.save(this.Verification.create({ user }));
            // this.mailService.sendVerificationEmail({ email, code: ver.code })
            return { ok: true };
        } catch (e) {
            return { ok: false, error: "Couldn't create account" }
        }
    }

    async login(loginInf: LoginInput): Promise<LoginOutput> {
        const { email, password } = loginInf;
        try {
            const user = await this.users.findOne({
                where: { email },
                select: ['id', 'password']
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


    async findUserById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOne({
                where: {
                    id
                }
            })
            return {
                ok: true,
                user,
            };
        } catch (error) {
            return { ok: false, error: 'User Not Found' };
        }


    }

    async updateProfile(userId: number, newProfile: EditProfileInput): Promise<EditProfileOutput> {
        try {
            const { email } = newProfile;
            let user = await this.users.findOne({ where: { id: userId } });
            if (email) {
                user.verified = false;
                await this.Verification.delete({ user: { id: user.id } });
                const ver = await this.Verification.save(this.Verification.create({ user }));
                this.mailService.sendVerificationEmail({ email, code: ver.code });
            }
            Object.assign(user, newProfile);
            return {
                ok: true,
                user: await this.users.save(user)
            }
        } catch (error) {
            return { ok: false, error: 'Could not update profile' };
        }

    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {
            const ver = await this.Verification.findOne({
                where: { code },
                relations: ['user']
            });
            if (ver) {
                ver.user.verified = true;
                await this.users.save(ver.user);
                await this.Verification.delete(ver.id);
                return { ok: true };
            }
            return { ok: false, error: 'Verification not found.' };
        } catch (error) {
            console.log(error);
            return { ok: false, error: 'Could not verify email' };
        }
    }
}