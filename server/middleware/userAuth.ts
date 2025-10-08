import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JwtPayload } from "../interfaces/jwt"

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: 'Não autorizado! Logue novamente' });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (tokenDecode.id) {
      (res.locals as any).userId = tokenDecode.id;
    } else {
      return res.json({ success: false, message: 'Não autorizado! Logue novamente' });
    }
    next();
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth