import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModuleOptions } from './interface/jwt-module-options.interface';
import { JwtService } from './jwt.service';
import { JWT_CONFIG_OPTION } from 'src/common/common.const';
@Global()
@Module({})
export class JwtModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            providers: [{
                provide: JWT_CONFIG_OPTION,
                useValue: options
            },
                JwtService
            ],
            exports: [JwtService],
        }
    }
}
