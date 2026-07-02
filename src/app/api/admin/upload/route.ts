import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Generate a unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        
        // Ensure products directory exists
        const publicProductsDir = path.join(process.cwd(), 'public', 'products');
        if (!fs.existsSync(publicProductsDir)) {
            fs.mkdirSync(publicProductsDir, { recursive: true });
        }

        const filePath = path.join(publicProductsDir, filename);
        
        await fs.promises.writeFile(filePath, buffer);
        
        const fileUrl = `/products/${filename}`;
        
        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
