import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  createHash,
  randomUUID,
} from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity.js';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly jwtAccessTtl: string;
  private readonly jwtRefreshTtl: string;
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.jwtAccessTtl = this.configService.get<string>('JWT_ACCESS_TTL') ?? '15m';
    this.jwtRefreshTtl = this.configService.get<string>('JWT_REFRESH_TTL') ?? '7d';
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') ?? 'dev-secret-change-me';
  }

  async issueTokens(user: User, mfaRequired: boolean) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, mfaRequired },
      {
        secret: this.jwtSecret,
        expiresIn: this.jwtAccessTtl as import('ms').StringValue,
      },
    );
    const refreshToken = randomUUID();
    const hash = this.hashRefreshToken(refreshToken);
    await this.userRepository.update(user.id, {
      refreshTokenHash: hash,
    });
    return { accessToken, refreshToken, mfaRequired };
  }

  async rotate(refreshToken: string): Promise<string> {
    const hash = this.hashRefreshToken(refreshToken);
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.refresh_token_hash = :hash', { hash })
      .getOne();
    if (!user) throw new UnauthorizedException('Invalid refresh token');
    const newRefreshToken = randomUUID();
    await this.userRepository.update(user.id, {
      refreshTokenHash: this.hashRefreshToken(newRefreshToken),
    });
    return newRefreshToken;
  }

  async revoke(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      refreshTokenHash: null,
    });
  }

  private hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
