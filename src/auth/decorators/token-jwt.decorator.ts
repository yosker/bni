import { SetMetadata } from '@nestjs/common';

export const TokenJwt = (...args: string[]) => SetMetadata('token-jwt', args);
