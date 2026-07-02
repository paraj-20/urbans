"use client";

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    subcategory: string;
};

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newCategory, setNewCategory] = useState('MEN');
    const [newSubcategory, setNewSubcategory] = useState('shirts');

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/products');
        if (res.ok) {
            const data = await res.json();
            setProducts(data);
        }
        setLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'add',
                product: {
                    name: newName,
                    price: Number(newPrice),
                    imageUrl: newImageUrl,
                    category: newCategory,
                    subcategory: newSubcategory,
                    isCustom: true
                }
            })
        });
        if (res.ok) {
            setNewName(''); setNewPrice(''); setNewImageUrl('');
            fetchProducts();
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const res = await fetch('/api/admin/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, imageUrl })
        });
        if (res.ok) fetchProducts();
    };

    const startEdit = (p: Product) => {
        setEditingId(p.id);
        setEditName(p.name);
        setEditPrice(p.price.toString());
    };

    const saveEdit = async (id: string) => {
        const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                action: 'update',
                product: { name: editName, price: Number(editPrice) }
            })
        });
        if (res.ok) {
            setEditingId(null);
            fetchProducts();
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>CMS Dashboard</h1>

            <form className={styles.addForm} onSubmit={handleAdd}>
                <input required placeholder="Product Name" value={newName} onChange={e => setNewName(e.target.value)} />
                <input required type="number" placeholder="Price ($)" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                <input required placeholder="Image URL (e.g. https://...)" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                </select>
                <select value={newSubcategory} onChange={e => setNewSubcategory(e.target.value)}>
                    <option value="shirts">Shirts</option>
                    <option value="t-shirts">T-Shirts</option>
                    <option value="jackets">Jackets</option>
                    <option value="pants">Pants</option>
                    <option value="jeans">Jeans</option>
                    <option value="aesthetics">Aesthetics</option>
                    <option value="trending">Trending</option>
                    <option value="caps">Caps</option>
                    <option value="backpacks">Backpacks</option>
                </select>
                <button type="submit" className={styles.submitBtn}>Add Product</button>
            </form>

            <div className={styles.productList}>
                {loading ? <p>Loading products...</p> : products.map(p => (
                    <div key={p.id} className={styles.productRow}>
                        <img src={p.imageUrl} alt={p.name} className={styles.productImage} />
                        
                        {editingId === p.id ? (
                            <>
                                <input className={styles.editInput} value={editName} onChange={e => setEditName(e.target.value)} />
                                <input type="number" className={styles.editInput} value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                                <span>{p.category}</span>
                                <span>{p.subcategory}</span>
                                <button className={styles.saveBtn} onClick={() => saveEdit(p.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                <strong style={{cursor: 'pointer'}} onClick={() => startEdit(p)} title="Click to edit">{p.name}</strong>
                                <span style={{cursor: 'pointer'}} onClick={() => startEdit(p)} title="Click to edit">${p.price}</span>
                                <span>{p.category}</span>
                                <span style={{textTransform: 'capitalize'}}>{p.subcategory}</span>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(p.id, p.imageUrl)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
                {!loading && products.length === 0 && <p>No products found.</p>}
            </div>
        </div>
    );
}
