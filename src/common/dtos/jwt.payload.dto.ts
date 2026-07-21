export class JwtPayloadDto {
  uid: string; // user.id
  sid: string; // session.id
  nenv: string; // NODE_ENV
  cid: string; // company.id
  exp: number; // expiration time
  iat: number; // issue at
}
