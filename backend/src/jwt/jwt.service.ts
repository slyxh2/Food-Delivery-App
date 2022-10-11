import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './interface/jwt-module-options.interface';
import * as jwt from 'jsonwebtoken';
import { JWT_CONFIG_OPTION } from 'src/common/common.const';
@Injectable()
export class JwtService {
    constructor(
        @Inject(JWT_CONFIG_OPTION) private readonly option: JwtModuleOptions
    ) { }
    sign(input: object): string {
        return jwt.sign(input, this.option.privateKey);
    }
    verify(token: string) {
        return jwt.verify(token, this.option.privateKey);
    }
}
