"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './admin.module.css';
import { useCurrency } from '@/context/CurrencyContext';

const categoryOptions = [
    { value: 'MEN', label: 'MEN' },
    { value: 'WOMEN', label: 'WOMEN' }
];

const subcategoryOptions = [
    { value: 'shirts', label: 'Shirts' },
    { value: 't-shirts', label: 'T-Shirts' },
    { value: 'jackets', label: 'Jackets' },
    { value: 'pants', label: 'Pants' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'aesthetics', label: 'Aesthetics' },
    { value: 'trending', label: 'Trending' },
    { value: 'caps', label: 'Caps' },
    { value: 'backpacks', label: 'Backpacks' }
];

type CustomSelectProps = {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
};

function CustomSelect({ value, onChange, options }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className={styles.customSelectWrapper} ref={selectRef}>
            <div className={styles.customSelectTrigger} onClick={() => setIsOpen(!isOpen)}>
                <span>{selectedLabel}</span>
                <span className={styles.customSelectArrow} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
            </div>
            {isOpen && (
                <div className={styles.customSelectDropdown}>
                    {options.map(opt => (
                        <div 
                            key={opt.value} 
                            className={`${styles.customSelectOption} ${value === opt.value ? styles.selectedOption : ''}`}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

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
    const { formatPrice } = useCurrency();
    
    // Form state
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newCategory, setNewCategory] = useState('MEN');
    const [newSubcategory, setNewSubcategory] = useState('shirts');

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterSubcategory, setFilterSubcategory] = useState('ALL');

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setNewImageUrl(data.url);
            } else {
                alert("Failed to upload image");
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading image");
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (showLoading = true) => {
        if (showLoading) setLoading(true);
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
            fetchProducts(false);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const res = await fetch('/api/admin/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, imageUrl })
        });
        if (res.ok) fetchProducts(false);
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
            fetchProducts(false);
        }
    };

    const filteredProducts = products.filter(p => {
        if (filterCategory !== 'ALL' && p.category !== filterCategory) return false;
        if (filterSubcategory !== 'ALL' && p.subcategory !== filterSubcategory) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>CMS Dashboard</h1>

            <form className={styles.addForm} onSubmit={handleAdd}>
                <input required placeholder="Product Name" value={newName} onChange={e => setNewName(e.target.value)} />
                <input required type="number" placeholder="Base Price (USD)" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                <div className={styles.imageUploadGroup}>
                    <input 
                        required 
                        placeholder="Image URL" 
                        value={newImageUrl} 
                        onChange={e => setNewImageUrl(e.target.value)} 
                        style={{ flex: 1 }}
                    />
                    <label className={styles.uploadLabel}>
                        {uploadingImage ? 'Uploading...' : '📁 Upload'}
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', opacity: 0, width: 0, height: 0, zIndex: -1 }} disabled={uploadingImage} />
                    </label>
                </div>
                <CustomSelect 
                    value={newCategory} 
                    onChange={setNewCategory} 
                    options={categoryOptions} 
                />
                <CustomSelect 
                    value={newSubcategory} 
                    onChange={setNewSubcategory} 
                    options={subcategoryOptions} 
                />
                <button type="submit" className={styles.submitBtn}>Add Product</button>
            </form>

            <div className={styles.productSection}>
                <div className={styles.sectionHeader}>
                    <h2>Manage Products</h2>
                    <span className={styles.productCount}>{filteredProducts.length} Products</span>
                </div>

                <div className={styles.filters}>
                    <input 
                        type="text" 
                        placeholder="Search products by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <div className={styles.filterGroup}>
                        <div style={{ width: '200px' }}>
                            <CustomSelect 
                                value={filterCategory} 
                                onChange={setFilterCategory} 
                                options={[{ value: 'ALL', label: 'All Categories' }, ...categoryOptions]} 
                            />
                        </div>
                        <div style={{ width: '200px' }}>
                            <CustomSelect 
                                value={filterSubcategory} 
                                onChange={setFilterSubcategory} 
                                options={[{ value: 'ALL', label: 'All Subcategories' }, ...subcategoryOptions]} 
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.tableHeader}>
                    <span>Image</span>
                    <span>Product Name</span>
                    <span>Price</span>
                    <span>Category</span>
                    <span>Subcategory</span>
                    <span>Actions</span>
                </div>

                <div className={styles.productList}>
                    {loading ? <p className={styles.loadingText}>Loading products...</p> : filteredProducts.map(p => (
                        <div key={p.id} className={styles.productRow}>
                            <img src={p.imageUrl} alt={p.name} className={styles.productImage} />
                            
                            {editingId === p.id ? (
                                <>
                                    <input className={styles.editInput} value={editName} onChange={e => setEditName(e.target.value)} />
                                    <input type="number" className={styles.editInput} value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                                    <span className={styles.badge}>{p.category}</span>
                                    <span className={styles.badge}>{p.subcategory}</span>
                                    <div className={styles.actions}>
                                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id)}>Save</button>
                                        <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <strong style={{cursor: 'pointer'}} onClick={() => startEdit(p)} title="Click to edit" className={styles.productName}>{p.name}</strong>
                                    <span style={{cursor: 'pointer'}} onClick={() => startEdit(p)} title="Click to edit" className={styles.priceText}>{formatPrice(p.price)}</span>
                                    <span className={styles.badge}>{p.category}</span>
                                    <span className={styles.badge} style={{textTransform: 'capitalize'}}>{p.subcategory}</span>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(p.id, p.imageUrl)}>Delete</button>
                                </>
                            )}
                        </div>
                    ))}
                    {!loading && filteredProducts.length === 0 && <p className={styles.noProducts}>No products found matching your filters.</p>}
                </div>
            </div>
        </div>
    );
}
