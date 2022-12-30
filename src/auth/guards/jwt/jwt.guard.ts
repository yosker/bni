import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const jwt = this.reflector.get<object>('token-jwt', context.getHandler());

    const request = context.switchToHttp().getRequest();

    return true;
  }
}
