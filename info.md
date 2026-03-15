# Project Tech Stack & Architecture Info

## Technology Stack
- **Framework**: Next.js 15 (React 19)
- **Styling**: CSS Modules (Vanilla CSS)
- **Database**: Neon (Serverless Postgres)
- **Language**: TypeScript

## Image Storage Strategy
To store high-quality images efficiently while keeping the application fast and lightweight, we do not store large media files directly in the database (Neon) or the git repository.

### Recommended Solution: Cloud Object Storage + CDN
For a scalable "big brand" experience, we recommend using a dedicated cloud storage provider.

**Options:**
1.  **Cloudinary / Uploadcare**: 
    - **Pros**: Automatic image optimization (WebP/AVIF), resizing on the fly, easy CDN integration.
    - **Cons**: higher cost at very large scale.
    - **Best for**: E-commerce implementation where image quality and speed are paramount.

2.  **AWS S3 / Google Cloud Storage / R2**:
    - **Pros**: Cheapest storage, infinite scale.
    - **Cons**: Requires setting up a separate CDN (like CloudFront) for performance.

**Implementation Plan**:
- Use specific MCP servers (if available) or standard SDKs to upload images to the chosen provider.
- Store only the **image URL** string in the Neon Postgres database.
- The frontend (Next.js) loads images from the CDN URL, ensuring fast load times globally.

## Database (Neon)
- Use Neon for storing structured data: User profiles, Product details (title, price, description, *image_url*), Orders, and Inventory.





done for today