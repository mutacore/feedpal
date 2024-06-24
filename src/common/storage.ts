export async function setLocal(key: string, value: any) {
  await chrome.storage.local.set({ [key]: value });
}

export async function getLocal(key: string): Promise<any> {
  const res = await chrome.storage.local.get(key);
  return res[key];
}

export async function removeLocal(key: string) {
  await chrome.storage.local.remove(key);
}

export async function batchSetLocal(items: Record<string, any>) {
  await chrome.storage.local.set(items);
}

export async function batchGetLocal(keys: string[]): Promise<any[]> {
  const res = await chrome.storage.local.get(keys);
  return keys.map(key => res[key]);
}
