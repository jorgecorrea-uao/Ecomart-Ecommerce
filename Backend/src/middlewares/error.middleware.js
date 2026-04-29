const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    const statusCode = err.statusCode || 500
    const message = err.message || 'Error interno del servidor'

    console.error('💥 Error global:', err)

    res.status(statusCode).json({
        success: false,
        message
    })
}

module.exports = errorMiddleware
