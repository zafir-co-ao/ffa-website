import { fidToUuid, nodeServiceClient } from "~/lib/deps";

const client = nodeServiceClient({ url: process.env.NUXT_PUBLIC_ANTBOX_URL! });

export default async function assertFolderExists(fid: string, title: string): Promise<string> {
	const folderOrErr = await client.get(fidToUuid(fid));

	if (folderOrErr.isRight()) {
		return folderOrErr.value.uuid;
	}

	if (folderOrErr.value !== "NotFoundError") {
		throw new Error(`Error getting folder ${fid}: ${folderOrErr.value}`);
	}

	const nodesOrErr = await client.createFolder({ title, fid });
	if (nodesOrErr.isLeft()) {
		throw new Error(`Error creating folder ${fid}: ${nodesOrErr.value}`);
	}

	return nodesOrErr.value.uuid;
}
