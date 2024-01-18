export interface Toaster {
	exception: (error: Error) => void;
	success: (message: string) => void;
}
