import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import { verify } from 'otplib';
import { User } from '../../entities/user.entity.js';
import { TokenService } from './token.service.js';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(email: string, fullName: string, password: string) {
    const passwordHash = await this.hashPassword(password);
    const user = this.userRepository.create({ email, fullName, passwordHash });
    return this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.passwordHash || !(await this.comparePassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const mfaRequired = user.mfaSecretRef !== null;
    const tokens = await this.tokenService.issueTokens(user, mfaRequired);
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });
    this.logger.debug(`login: user=${user.id} mfaRequired=${mfaRequired}`);
    return tokens;
  }

  async verifyMfa(userId: string, token: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.mfaSecretRef) return false;
    const result = await verify({ token, secret: user.mfaSecretRef });
    return result.valid;
  }

  async refresh(refreshToken: string): Promise<string> {
    return this.tokenService.rotate(refreshToken);
  }

  async logout(userId: string): Promise<void> {
    await this.tokenService.revoke(userId);
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await this.hashPassword(newPassword);
    await this.userRepository.update(userId, { passwordHash });
  }

  private hashPassword(password: string): Promise<string> {
    return bcryptHash(password, BCRYPT_ROUNDS);
  }

  private comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptCompare(password, hash);
  }
}
