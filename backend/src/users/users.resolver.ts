import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Resolver } from "@nestjs/graphql";
import { CreateAccountInput, CreateAccountOutput } from "./dto/create-account.dto";
import { LoginOutput, LoginInput } from "./dto/login.dto";
import { User } from "./entities/users.entity";
import { UserService } from "./users.service";



@Resolver(of => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService
    ) { }

    @Query(returns => Boolean)
    hi() {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') accountInf: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            let error = await this.userService.createAccount(accountInf);
            if (error) {
                return {
                    ok: false,
                    error
                }
            }
            return {
                ok: true
            }
        } catch (e) {
            return {
                ok: false,
                error: e
            }
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInf: LoginInput): Promise<LoginOutput> {
        try {
            return this.userService.login(loginInf);
        } catch (e) {
            return {
                ok: false,
                error: e
            }
        }
    }

    @Query(returns => User)
    me(@Context() context) {
        console.log(context);
    }

}