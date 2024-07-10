import { PricingRule ,Product, products, pricingRules} from "./interfaces/Interface";

class Checkout {
    private cart: string[];
    private pricingRules: PricingRule[];

    constructor(pricingRules: PricingRule[]) {
        this.cart = [];
        this.pricingRules = pricingRules;
    }

    scan(sku: string) {
        this.cart.push(sku);
    }

    total(): number {
        const counts = this.countItems();

        // console.log('counnts', counts)

        let total = 0;

        for (const sku in counts) {
            if (counts.hasOwnProperty(sku)) {
                const count = counts[sku];
                const rule = this.findPricingRule(sku);

                if (rule) {
                    switch (rule.type) {
                        case 'discount':
                            total += this.applyDiscountRule(sku, count);
                            break;
                        case 'bulk':
                            total += this.applyBulkRule(sku, count, rule);
                            break;
                        default:
                            total += count * this.findProductPrice(sku);
                            break;
                    }
                } else {
                    total += count * this.findProductPrice(sku);
                }
            }
        }

        return total;
    }


    // this creates a map of sku as kley with number of products as value
    private countItems(): { [key: string]: number } {
        return this.cart.reduce((counts, sku) => {
            counts[sku] = (counts[sku] || 0) + 1;
            return counts;
        }, {});
    }


    private findPricingRule(sku: string): PricingRule | undefined {
        return this.pricingRules.find(rule => rule.sku === sku);
    }


    private findProductPrice(sku: string): number {
        const product = products.find(p => p.sku === sku);
        return product ? product.price : 0;
    }


    private applyDiscountRule(sku: string, count: number): number {
        //for now i've hardcoded this for atv 
        if (sku === 'atv') {
            const price = this.findProductPrice(sku);
            return Math.ceil(count / 3) * 2 * price;
        }
        return 0; // Default to no discount if no specific rule matches
    }

    private applyBulkRule(sku: string, count: number, rule: PricingRule): number {
        if (rule.bulkQuantity && count >= rule.bulkQuantity) {
            return count * rule.bulkPrice!;
        }
        return count * this.findProductPrice(sku);
    }
}

// testing the logic


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