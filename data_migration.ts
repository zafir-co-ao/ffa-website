// import { FlatFileNodeRepository } from "./src/adapters/flat_file/flat_file_node_repository.ts";
// import { PouchdbNodeRepository } from "./src/adapters/pouchdb/pouchdb_node_repository.ts";
// import { FolderNode } from "./src/domain/nodes/folder_node.ts";
// import { Node } from "./src/domain/nodes/node.ts";

// const src = new FlatFileNodeRepository("/home/kindalus/var/website-ffa/repo");
// const dst = new PouchdbNodeRepository(
// 	"/home/kindalus/var/website-ffa/repository",
// );

// const srcNodes = await src.filter([], Number.MAX_SAFE_INTEGER, 1);
// console.log("Nodes to migrate:", srcNodes.nodes.length);

// const errors: string[] = [];

// for (const node of srcNodes.nodes) {
// 	const err = await dst.add(toNewNode(node));

// 	if (err.isLeft()) {
// 		errors.push(err.value.message);
// 	}
// }

// console.log("Errors:");
// console.log(errors);

// function toNewNode(node: any): Node {
// 	const { versions, starred, trashed, ...rest } = node;
// 	const newNode = {
// 		properties: {},
// 		...rest,
// 		parent: node.parent === "ROOT" ? Node.ROOT_FOLDER_UUID : node.parent,
// 		mimetype: mimetype(node.mimetype),
// 		owner: "ffa@antbox.io",
// 		fulltext: escapeFulltext(
// 			node.title,
// 			node.properties?.["legal-alert:title"]?.pt,
// 			node.properties?.["legal-alert:title"]?.en,
// 			node.properties?.["event:title"]?.pt,
// 			node.properties?.["event:title"]?.en,
// 			node.properties?.["media-article:title"]?.pt,
// 			node.properties?.["media-article:title"]?.en,
// 			node.properties?.["media-article:lawyerName"],
// 		),
// 	};

// 	return permissions(newNode);
// }

// function mimetype(m: string): string {
// 	switch (m) {
// 		case "application/folder":
// 			return Node.FOLDER_MIMETYPE;

// 		case "application/smartfolder":
// 			return Node.SMART_FOLDER_MIMETYPE;
// 	}

// 	return m;
// }

// function permissions(n: Node | FolderNode): Node {
// 	if (n.mimetype !== Node.FOLDER_MIMETYPE) {
// 		return n;
// 	}

// 	return {
// 		...n,
// 		group: "ffa",
// 		permissions: {
// 			group: ["Read", "Write", "Export"],
// 			authenticated: ["Read", "Write", "Export"],
// 			anonymous: ["Read", "Write", "Export"],
// 		},
// 	} as FolderNode;
// }

// function escapeFulltext(...opts: string[]): string {
// 	const fulltext = opts.filter((o) => o && o.length > 0)
// 		.map((str) => str.split(" "))
// 		.flat()
// 		.reduce(toSet, [] as string[]).join(" ");

// 	return fulltext.toLocaleLowerCase()
// 		.replace(/[áàâäãå]/g, "a")
// 		.replace(/[ç]/g, "c")
// 		.replace(/[éèêë]/g, "e")
// 		.replace(/[íìîï]/g, "i")
// 		.replace(/ñ/g, "n")
// 		.replace(/[óòôöõ]/g, "o")
// 		.replace(/[úùûü]/g, "u")
// 		.replace(/[ýÿ]/g, "y")
// 		.replace(/[\W\._]/g, " ")
// 		.replace(/(^|\s)\w{1,2}\s/g, " ")
// 		.replace(/\s+/g, " ")
// 		.trim();
// }

// function toSet<T>(acc: T[], cur: T): T[] {
// 	if (!acc.includes(cur)) {
// 		acc.push(cur);
// 	}

// 	return acc;
// }
