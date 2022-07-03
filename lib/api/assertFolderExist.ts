import { nodeServiceClient, fidToUuid } from "~~/lib/deps";

export default async function assertFolderExist(
	fid: string,
	title: string
): Promise<string> {
	const folder = await nodeServiceClient.get(fidToUuid(fid));

	if (folder) {
		return folder.uuid;
	}

	const uuid = await nodeServiceClient.createFolder(title);
	await nodeServiceClient.update(uuid, {
		fid,
	});

	return uuid;
}
