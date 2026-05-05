export function useAuth() {
  return {
    session: null,
    signIn: async () => ({ ok: true }),
    signOut: async () => ({ ok: true }),
  };
}
