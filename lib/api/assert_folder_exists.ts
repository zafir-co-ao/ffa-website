import { fidToUuid } from "~/lib/deps";

export default async function assertFolderExists(fid: string, title: string): Promise<string> {
	const client = useAntboxClient().nodeClient;

	const folderOrErr = await client.get(fidToUuid(fid));

	if (folderOrErr.isRight()) {
		return folderOrErr.value.uuid;
	}

	if (folderOrErr.value === "NotFoundError") {
		await client.createFolder({ title, fid });
	}

	return fidToUuid(fid);
}
