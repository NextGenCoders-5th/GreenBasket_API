import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.toString(), salt);
    return hashedPassword;
  }
  async comparePassword(data: string | Buffer, hash: any): Promise<boolean> {
    return await bcrypt.compare(data.toString(), hash);
  }
}
