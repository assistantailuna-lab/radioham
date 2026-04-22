import { promises as fs } from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const konuDir = path.join(distDir, "konu");
const outputFile = path.join(distDir, "_redirects");

async function walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
		} else {
			files.push(fullPath);
		}
	}
	return files;
}

function normalizePath(urlPath) {
	if (!urlPath.startsWith("/")) return `/${urlPath}`;
	return urlPath;
}

async function main() {
	try {
		await fs.access(konuDir);
	} catch {
		console.warn("[redirects] konu directory not found, skipping _redirects generation.");
		return;
	}

	const files = await walk(konuDir);
	const redirectLines = new Set();

	for (const filePath of files) {
		if (!filePath.endsWith("index.html")) continue;
		const html = await fs.readFile(filePath, "utf8");
		const match = html.match(/Redirecting from <code>([^<]+)<\/code> to <code>([^<]+)<\/code>/i);
		if (!match) continue;

		const from = normalizePath(match[1].trim());
		const to = normalizePath(match[2].trim());
		const fromNoSlash = from.endsWith("/") ? from.slice(0, -1) : from;
		const fromWithSlash = from.endsWith("/") ? from : `${from}/`;

		redirectLines.add(`${fromNoSlash} ${to} 301`);
		redirectLines.add(`${fromWithSlash} ${to} 301`);
	}

	const sortedLines = Array.from(redirectLines).sort((a, b) => a.localeCompare(b));
	await fs.writeFile(outputFile, `${sortedLines.join("\n")}\n`, "utf8");
	console.log(`[redirects] wrote ${sortedLines.length} rule(s) to dist/_redirects`);
}

main().catch((error) => {
	console.error("[redirects] failed:", error);
	process.exit(1);
});
