import { OAuth2Client } from 'google-auth-library';
import { IUser } from '../../types/user.types';
import User from '../../models/User';
import crypto from 'crypto';
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
        console.log(error);
        
      throw new Error('Invalid Google token');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findOrCreateUser(payload: any): Promise<IUser> {
    try {
      if (!payload?.email) {
        throw new Error('No email found in Google payload');
      }

      let user = await User.findOne({ email: payload.email });
      if (!user) {
        user = await User.create({
          name: payload.name,
          email: payload.email,
          password: crypto.randomBytes(16).toString('hex'),
          status: true,
          isGoogleLogin:true,
          googleId: payload.sub,
          dateOfBirth:'NA',
          mobileNumber:'NA'
        });
        return user;
    }

    user = await User.findOneAndUpdate(
        { email: payload.email },
        { isGoogleLogin: false },
        { new: true }
      );

      if (!user) {
        throw new Error('Failed to update existing user');
      }
    return user;
      
    } catch (error) {
      console.error('Error in findOrCreateUser:', error);
      throw new Error('Error creating user from Google data');
    }
  }
}
