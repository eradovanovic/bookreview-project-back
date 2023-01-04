export interface JwtToken {
    subject: string
    expiresIn: string
    scopes: string[]
    role: string
}
