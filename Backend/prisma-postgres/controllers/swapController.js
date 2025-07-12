const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
    const swaps = await prisma.swap.findMany({ include: { item: true, owner: true, swapper: true } });
    res.json(swaps);
};
exports.getOne = async (req, res) => {
    const swap = await prisma.swap.findUnique({ where: { id: req.params.id } });
    res.json(swap);
};
exports.create = async (req, res) => {
    const swap = await prisma.swap.create({ data: req.body });
    res.json(swap);
};
exports.remove = async (req, res) => {
    await prisma.swap.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
};
