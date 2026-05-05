export function usePost() {
  const createPost = async () => ({ ok: true });
  const deletePost = async () => ({ ok: true });

  return { createPost, deletePost };
}
