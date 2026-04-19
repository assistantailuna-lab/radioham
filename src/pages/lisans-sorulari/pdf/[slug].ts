import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const prerender = true;

const PDF_FILE_BY_SLUG: Record<string, string> = {
	isletme: "isletme-soru-bankasi.pdf",
	teknik: "teknik-soru-bankasi.pdf",
	duzenlemeler: "duzenlemeler-soru-bankasi.pdf"
};

export function getStaticPaths() {
	return Object.keys(PDF_FILE_BY_SLUG).map((slug) => ({
		params: { slug }
	}));
}

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug ?? "";
	const fileName = PDF_FILE_BY_SLUG[slug];

	if (!fileName) {
		return new Response("Not found", { status: 404 });
	}

	try {
		const filePath = path.join(process.cwd(), "public", "lisans-sorulari", fileName);
		const pdfData = await readFile(filePath);

		return new Response(pdfData, {
			headers: {
				"Content-Type": "application/octet-stream",
				"Cache-Control": "public, max-age=31536000, immutable",
				"X-Content-Type-Options": "nosniff"
			}
		});
	} catch {
		return new Response("Not found", { status: 404 });
	}
};
