// Utilidades gerais podem ser adicionadas aqui
export function isAdmin(user) {
  return user && user.role === 'admin';
}
