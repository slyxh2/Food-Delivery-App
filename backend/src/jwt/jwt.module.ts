import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModuleOptions } from './interface/jwt-module-options.interface';
import { JwtService } from './jwt.service';
import { CONFIG_OPTION } from './jwt.const';
import { UserService } from 'src/users/users.service';
@Global()
@Module({})
export class JwtModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            providers: [{
                provide: CONFIG_OPTION,
                useValue: options
            },
                JwtService
            ],
            exports: [JwtService],

        }
    }
}
