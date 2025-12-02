import jwt from 'jsonwebtoken'

export default function generateToken(userId: any) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
}
