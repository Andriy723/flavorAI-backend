import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

            if (!decoded.userId && decoded.sub) {
                decoded.userId = decoded.sub;
            }

            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}