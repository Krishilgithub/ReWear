const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
    const users = await prisma.user.findMany({ include: { items: true } });
    res.json(users);
};

exports.getUserById = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { items: true }
    });
    res.json(user);
};

exports.createUser = async (req, res) => {
    try {
        const user = await prisma.user.create({ data: req.body });
        res.json(user);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.updateUser = async (req, res) => {
    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(user);
};

exports.deleteUser = async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
};
