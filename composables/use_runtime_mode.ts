export default function () {
	return useState("runtimeMode", () => process.env.NODE_ENV);
}
