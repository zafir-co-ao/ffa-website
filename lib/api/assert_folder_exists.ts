import { fidToUuid, nodeServiceClient } from "~/lib/deps";

const client = nodeServiceClient(process.env.NUXT_ANTBOX_URL!);

export default async function assertFolderExists(fid: string, title: string): Promise<string> {
	const folderOrErr = await client.get(fidToUuid(fid));

	if (folderOrErr.isRight()) {
		return folderOrErr.value.uuid;
	}

	if (folderOrErr.value === "NotFoundError") {
		await client.createFolder({ title, fid });
	}

	return fidToUuid(fid);
}
