import { postCache } from "~/server/utils/postCache";

export default defineEventHandler(async () => {
	return await postCache.getAllPosts();
});
