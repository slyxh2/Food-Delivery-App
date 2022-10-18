import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role.decorator";
import { CreateAccountInput, CreateAccountOutput } from "./dto/create-account.dto";
import { EditProfileInput, EditProfileOutput } from "./dto/edit-profile.dto";
import { LoginOutput, LoginInput } from "./dto/login.dto";
import { UserProfileInput, UserProfileOutput } from "./dto/user-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "./dto/verify-email.dto";
import { User } from "./entities/users.entity";
import { UserService } from "./users.service";



@Resolver(of => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService
    ) { }


    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') accountInf: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            let result = await this.userService.createAccount(accountInf);
            return result;
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
    @Role(['Any'])
    me(
        @AuthUser() authUser: User,
        @Context() context
    ) {
        return authUser;
    }


    @Query(returns => UserProfileOutput)
    @Role(['Any'])
    async getUserProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        try {
            const { user } = await this.userService.findUserById(userProfileInput.userId);
            if (user) {
                return {
                    ok: true,
                    user,
                }
            } else {
                return {
                    ok: false,
                    error: 'User not found'
                }
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }

    }


    @Mutation(returns => EditProfileOutput)
    @Role(['Any'])
    async editProfile(
        @AuthUser() user: User,
        @Args('input') profileInf: EditProfileInput
    ): Promise<EditProfileOutput> {
        try {
            await this.userService.updateProfile(user.id, profileInf);
            return {
                ok: true
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    @Mutation(returns => VerifyEmailOutput)
    async verifyEmail(@Args('input') verify: VerifyEmailInput): Promise<VerifyEmailOutput> {
        const { code } = verify;
        try {
            let result = await this.userService.verifyEmail(code);
            return result;
        } catch (error) {
            return { ok: false, error };
        }
    }

}