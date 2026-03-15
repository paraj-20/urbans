import fs from 'fs';
import path from 'path';

export type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: 'MEN' | 'WOMEN';
    subcategory: string;
    isNew?: boolean;
};

// Reliable string hash function to generate consistent prices based on the file name
function stringToHash(string: string) {
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Generate base price according to logic for each category
function getBasePrice(subcategory: string, hash: number): number {
    const sub = subcategory.toLowerCase();
    switch (sub) {
        case 'shirts': return 50 + (hash % 40);
        case 't-shirts': return 30 + (hash % 30);
        case 'jackets': return 100 + (hash % 80);
        case 'pants': return 60 + (hash % 50);
        case 'jeans': return 70 + (hash % 50);
        case 'aesthetics': return 40 + (hash % 40);
        case 'caps': return 25 + (hash % 20);
        case 'backpacks': return 80 + (hash % 60);
        default: return 50 + (hash % 50);
    }
}

function capitalizeWords(str: string) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function scanDirectoryForProducts(category: 'MEN' | 'WOMEN', section: 'clothing' | 'accessories', subcategory: string): Promise<Product[]> {
    const products: Product[] = [];
    const dirPath = path.join(process.cwd(), 'public', 'products', category.toLowerCase(), section, subcategory.toLowerCase());

    try {
        if (fs.existsSync(dirPath)) {
            const files = await fs.promises.readdir(dirPath);
            let counter = 1;
            for (const file of files) {
                if (file.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
                    const hash = stringToHash(file);
                    products.push({
                        id: `${category}-${section}-${subcategory}-${file}`,
                        name: `${capitalizeWords(category.toLowerCase())} ${capitalizeWords(subcategory.toLowerCase())} ${counter}`,
                        price: getBasePrice(subcategory, hash),
                        imageUrl: `/products/${category.toLowerCase()}/${section}/${subcategory.toLowerCase()}/${file}`,
                        category,
                        subcategory,
                        isNew: hash % 3 === 0
                    });
                    counter++;
                }
            }
        }
    } catch (e) {
        console.error(`Error scanning directory ${dirPath}`, e);
    }
    return products;
}

export async function scanTrending(category: 'MEN' | 'WOMEN'): Promise<Product[]> {
    const products: Product[] = [];
    const dirPath = path.join(process.cwd(), 'public', 'products', category.toLowerCase(), 'trending');

    try {
        if (fs.existsSync(dirPath)) {
            const files = await fs.promises.readdir(dirPath);
            let counter = 1;
            for (const file of files) {
                if (file.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
                    const hash = stringToHash(file);
                    products.push({
                        id: `${category}-trending-${file}`,
                        name: `Trending ${capitalizeWords(category.toLowerCase())} ${counter}`,
                        price: 60 + (hash % 60), 
                        imageUrl: `/products/${category.toLowerCase()}/trending/${file}`,
                        category,
                        subcategory: 'trending',
                        isNew: true
                    });
                    counter++;
                }
            }
        }
    } catch (e) {
        console.error(`Error scanning trending directory ${dirPath}`, e);
    }
    return products;
}

export async function fetchProductsByCategory(category: 'MEN' | 'WOMEN', limit?: number): Promise<Product[]> {
    const sections = [
        { section: 'clothing' as const, subs: ['shirts', 't-shirts', 'jackets', 'pants', 'jeans', 'aesthetics'] },
        { section: 'accessories' as const, subs: ['caps', 'backpacks'] }
    ];

    let allProducts: Product[] = [];
    for (const sec of sections) {
        for (const sub of sec.subs) {
            allProducts = allProducts.concat(await scanDirectoryForProducts(category, sec.section, sub));
        }
    }

    return limit ? allProducts.slice(0, limit) : allProducts;
}

export async function fetchProductsBySection(category: 'MEN' | 'WOMEN', subcategories: string[], limit?: number): Promise<Product[]> {
    let allProducts: Product[] = [];

    for (const sub of subcategories) {
        const section = ['caps', 'backpacks'].includes(sub.toLowerCase()) ? 'accessories' : 'clothing';
        allProducts = allProducts.concat(await scanDirectoryForProducts(category, section as any, sub));
    }

    return limit ? allProducts.slice(0, limit) : allProducts;
}

export async function fetchTrending(category: 'MEN' | 'WOMEN'): Promise<Product[]> {
    return await scanTrending(category);
}
