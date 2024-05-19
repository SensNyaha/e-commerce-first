export default async (err, req, res, next) => {
    const stack = err?.stack;
    const message = err?.message;

    res.status(500).json({
        success: false,
        message: `Unhandled Error: ${message}: ${stack}`,
    })
}