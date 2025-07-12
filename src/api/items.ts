import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method === "POST") {
		try {
			const {
				userId,
				title,
				description,
				category,
				type,
				size,
				condition,
				points,
				location,
				tags,
				images,
				status,
			} = req.body;

			const item = await prisma.item.create({
				data: {
					userId,
					title,
					description,
					category,
					type,
					size,
					condition,
					points,
					location,
					tags,
					status,
					images: {
						create: images.map((img: any) => ({
							url: img.url,
							isPrimary: img.isPrimary || false,
						})),
					},
				},
				include: { images: true },
			});

			res.status(201).json({ success: true, item });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	} else if (req.method === "GET") {
		try {
			const items = await prisma.item.findMany({
				include: { images: true, user: true },
			});
			res.status(200).json({ success: true, items });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	} else {
		res.status(405).json({ success: false, error: "Method not allowed" });
	}
}
