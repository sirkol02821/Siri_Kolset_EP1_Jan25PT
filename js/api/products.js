export async function getProducts() {
    try {
        const response = await fetch("https://v2.api.noroff.dev/online-shop");
        if(!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const result = await response.json();

        return result.data;

    } catch (error) {
        console.error(error);
        return [];
    }
}
