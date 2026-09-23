const KEY="product_admin_token";
export function getToken(){return typeof window==="undefined"?null:localStorage.getItem(KEY)}
export function setToken(t){localStorage.setItem(KEY,t)}
export function clearToken(){localStorage.removeItem(KEY)}
