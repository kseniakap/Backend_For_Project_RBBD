import jwt from 'jsonwebtoken'

//проверка пользователя
export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = jwt.verify(token,  "secret123")
            req.userId = decoded.id
            next()
        } catch (error) {
            return res.status(403).json({
                message: 'Нет доступа',
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        })
    }
}
