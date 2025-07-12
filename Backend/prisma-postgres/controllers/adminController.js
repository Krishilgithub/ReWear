const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
    const admins = await prisma.admin.findMany();
    res.json(admins);
};
exports.getOne = async (req, res) => {
    const admin = await prisma.admin.findUnique({ where: { id: req.params.id } });
    res.json(admin);
};
exports.create = async (req, res) => {
    const admin = await prisma.admin.create({ data: req.body });
    res.json(admin);
};
exports.update = async (req, res) => {
    const admin = await prisma.admin.update({ where: { id: req.params.id }, data: req.body });
    res.json(admin);
};
exports.remove = async (req, res) => {
    await prisma.admin.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
};
