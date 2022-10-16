/*
 * @Author: slyxh2 750772121@qq.com
 * @Date: 2022-10-09 16:12:42
 * @LastEditors: slyxh2 750772121@qq.com
 * @LastEditTime: 2022-10-16 01:21:14
 * @FilePath: /backend/src/jwt/jwt.midleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/users/users.service";
import { JwtService } from "./jwt.service";


@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        if ('x-jwt' in req.headers) {
            const token = req.headers['x-jwt'];
            try {
                const decoded = this.jwtService.verify(token.toString());
                if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                    const { user } = await this.userService.findUserById(decoded['id']);
                    req['user'] = user;
                }
            } catch (e) { }
        }

        next();
    }
}