import { PricingRule ,Product, products} from "./interfaces/Interface";


export default class Checkout {
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
        // console.log('this.pricingRules', this.pricingRules)

        // return this.pricingRules.find(rule => rule.sku === sku);

        for (const rule of this.pricingRules) {
            if (rule.sku === sku) {
                return rule;
            }
        }
        return undefined;
    }
    
    private findProductPrice(sku: string): number {

        // const product = products.find(p => p.sku === sku);

        for (const product of products) {
            if (product.sku === sku) {
                return product.price;
            }
        }
        return 0; 
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