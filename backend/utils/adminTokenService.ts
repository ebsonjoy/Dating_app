import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface AdminTokenPayload {
  adminId: string;
  adminTokenType: 'access' | 'refresh';
}

class AdminTokenService {
  static generateAdminAccessToken(adminId: string): string {
    return jwt.sign(
      { adminId, adminTokenType: 'access' }, 
      process.env.ACCESS_TOKEN_SECRET_ADMIN as string, 
      { expiresIn: '15m' }
    );
  }

  static generateAdminRefreshToken(adminId: string): string {
    return jwt.sign(
      { adminId, adminTokenType: 'refresh' },
      process.env.REFRESH_TOKEN_SECRET_ADMIN as string, 
      { expiresIn: '7d' }
    );
  }

  static setAdminTokenCookies(res: Response, adminAccessToken: string, adminRefreshToken: string): void {
    res.cookie('adminAccessToken', adminAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('adminRefreshToken', adminRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  static verifyAdminAccessToken(token: string): AdminTokenPayload | null {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN as string) as AdminTokenPayload;
      return decoded.adminTokenType === 'access' ? decoded : null;
    } catch (error) {
        console.log(error);
      return null;
    }
  }

  static verifyAdminRefreshToken(token: string): AdminTokenPayload | null {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_ADMIN as string) as AdminTokenPayload;
      return decoded.adminTokenType === 'refresh' ? decoded : null;
    } catch (error) {
        console.log(error);
      return null;
    }
  }
}

export default AdminTokenService;