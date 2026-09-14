export async function sendRequest<T>(endpoint: string, id?: string):Promise<T> {
    const res = await fetch(endpoint, { method: 'POST', headers: {"x-id": id} });
    if (!res.ok)
        throw new Error('Failed to fetch: ' + endpoint);
    const data = await res.json();
    return data
}