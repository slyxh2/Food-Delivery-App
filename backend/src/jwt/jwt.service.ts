import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './interface/jwt-module-options.interface';
import { CONFIG_OPTION } from './jwt.const';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTION) private readonly option: JwtModuleOptions
    ) { }
    sign(input: object): string {
        return jwt.sign(input, this.option.privateKey);
    }
    verify(token: string) {
        return jwt.verify(token, this.option.privateKey);
    }
}
