const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
    const requests = await prisma.swapRequest.findMany({ include: { item: true, requester: true } });
    res.json(requests);
};
exports.getOne = async (req, res) => {
    const request = await prisma.swapRequest.findUnique({ where: { id: req.params.id } });
    res.json(request);
};
exports.create = async (req, res) => {
    const request = await prisma.swapRequest.create({ data: req.body });
    res.json(request);
};
exports.update = async (req, res) => {
    const request = await prisma.swapRequest.update({ where: { id: req.params.id }, data: req.body });
    res.json(request);
};
exports.remove = async (req, res) => {
    await prisma.swapRequest.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
};
