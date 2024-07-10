export interface Product {
    sku: string;
    name: string;
    price: number;
}

export const products: Product[] = [
    { sku: 'ipd', name: 'Super iPad', price: 549.99 },
    { sku: 'mbp', name: 'MacBook Pro', price: 1399.99 },
    { sku: 'atv', name: 'Apple TV', price: 109.50 },
    { sku: 'vga', name: 'VGA adapter', price: 30.00 }
];


// this can be mmodified as per use case

export interface PricingRule {
    sku: string;
    type: 'discount' | 'bulk';
    discountPrice?: number;
    bulkQuantity?: number;
    bulkPrice?: number;
}

// our sales person can define rules as he's indecisive

export const pricingRules: PricingRule[] = [
    { sku: 'atv', type: 'discount' },
    { sku: 'ipd', type: 'bulk', bulkQuantity: 4, bulkPrice: 499.99 }
];
