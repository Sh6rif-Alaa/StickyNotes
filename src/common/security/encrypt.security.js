import crypto from 'node:crypto';

const algorithm = 'aes-256-cbc'
const key = "qwghjyumi12638ikhb7'yr@%^5yhi&@r";
const iv = crypto.randomBytes(16);

export function encrypt({ text } = {}) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')

    encrypted += cipher.final('hex')

    return iv.toString('hex') + ":" + encrypted
}

export function decrypt({ cipherText } = {}) {
    let ivBuffer = Buffer.from(cipherText.split(':')[0], 'hex')

    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivBuffer)

    let decrypted = decipher.update(cipherText.split(':')[1], 'hex', 'utf8')

    decrypted += decipher.final('utf8')

    return decrypted
}