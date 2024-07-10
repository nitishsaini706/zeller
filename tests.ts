// test.ts

import { PricingRule } from './interfaces/Interface';
import Checkout from './Checkout';


// our sales person can define rules as he's indecisive
// we can define/change logic as requjired

const pricingRules: PricingRule[] = [
    { sku: 'atv', type: 'discount' },
    { sku: 'ipd', type: 'bulk', bulkQuantity: 4, bulkPrice: 499.99 }
];

const co = new Checkout(pricingRules);

co.scan('atv');
co.scan('atv');
co.scan('atv');
co.scan('vga');

console.log(`Total expected: $${co.total().toFixed(2)}`);

const co2 = new Checkout(pricingRules);

co2.scan('atv');
co2.scan('ipd');
co2.scan('ipd');
co2.scan('atv');
co2.scan('ipd');
co2.scan('ipd');
co2.scan('ipd');

console.log(`Total expected: $${co2.total().toFixed(2)}`);
