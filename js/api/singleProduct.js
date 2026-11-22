

export async function getSingleProduct(id) {
    const response = await fetch(`https://v2.api.noroff.dev/online-shop/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch product.");
    }
    
    const result = await response.json();
    
    return result.data
}