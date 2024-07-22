import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err) {
            console.log(err);
            
            throw new UnauthorizedException();
        }

        if (!user) {
            console.log(err);
            throw new UnauthorizedException();
        }

        return user;
    }
}
