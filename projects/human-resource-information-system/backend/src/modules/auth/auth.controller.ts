import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import {
  LoginDto,
  MfaVerifyDto,
  RefreshTokenDto,
} from './dto/auth.dto.js';

/** Extended Express request with auth user populated by JwtGuard. */
type AuthedRequest = Request & {
  user?: { id: string; email?: string; roles?: string[] };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('mfa/verify')
  verifyMfa(@Body() body: MfaVerifyDto) {
    return this.authService.verifyMfa(body.userId, body.token);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Req() req: AuthedRequest) {
    const user = req.user as { id: string };
    return this.authService.logout(user.id);
  }

  @Get('me')
  me(@Req() req: AuthedRequest) {
    return (req.user as { id: string; email: string });
  }

  @Put('password')
  changePassword(@Req() req: AuthedRequest, @Body() body: { newPassword: string }) {
    const user = req.user as { id: string };
    return this.authService.changePassword(user.id, body.newPassword);
  }
}
