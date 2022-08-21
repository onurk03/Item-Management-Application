/**
 * Used to organize new Item data before converting into Firestore data format
 */
export class Item {
    constructor(name, quantity, price, category, createdAt, modifiedAt) {
        this.name = name
        this.quantity = quantity
        this.price = price
        this.category = category
        this.createdAt = createdAt
        this.modifiedAt = modifiedAt
    }
}

// Firestore data converter
export const itemConverter = {
    toFirestore: (item) => {
        return {
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
            created_at: item.createdAt,
            modified_at: item.modifiedAt,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Item(data.name, data.quantity, data.price, data.category, data.created_at
            , data.modified_at);
    }
}
