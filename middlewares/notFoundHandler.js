export default async (req, res) => {
    res.status(404).json({
        success: false,
        message: `${req.protocol + '://' + req.get('host') + req.originalUrl} is not found! Sorry for that!`,
    });
}