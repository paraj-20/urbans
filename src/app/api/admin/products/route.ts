import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { fetchProductsByCategory, fetchTrending, getCustomProductData } from '@/lib/db';

const dataPath = path.join(process.cwd(), 'data', 'products.json');

// Helper to write to JSON
async function writeCustomData(data: any) {
    await fs.promises.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
    try {
        // Fetch all possible products to list them in the admin dashboard
        const menProducts = await fetchProductsByCategory('MEN');
        const womenProducts = await fetchProductsByCategory('WOMEN');
        const menTrending = await fetchTrending('MEN');
        const womenTrending = await fetchTrending('WOMEN');
        
        // Deduplicate using a Map
        const allProducts = [...menProducts, ...womenProducts, ...menTrending, ...womenTrending];
        const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());

        return NextResponse.json(uniqueProducts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, action, product } = body;
        
        const customData = await getCustomProductData();
        
        if (action === 'update') {
            // Update existing product
            customData[id] = { ...customData[id], ...product };
        } else if (action === 'add') {
            // Add new custom product
            const newId = `custom-${Date.now()}`;
            customData[newId] = { ...product, id: newId };
        }
        
        await writeCustomData(customData);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id, imageUrl } = await req.json();
        const customData = await getCustomProductData();
        
        // Remove from JSON if it's there
        if (customData[id]) {
            delete customData[id];
            await writeCustomData(customData);
        }

        // Try to delete local image if it exists and is a local file
        if (imageUrl && imageUrl.startsWith('/products/')) {
            const localImagePath = path.join(process.cwd(), 'public', ...imageUrl.split('/').filter(Boolean));
            if (fs.existsSync(localImagePath)) {
                await fs.promises.unlink(localImagePath);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
