import React, {useEffect, useState} from 'react';
import Popup from "reactjs-popup";
import {db} from "./Firebase";
import { collection, getDocs } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

/**
 * Returns a list of items from the database
 * @returns {JSX.Element}
 * @constructor
 */
export default function Items() {
    // Initial values for a new item being added
    const defaultNewValues = {
        name: "Item",
        quantity: 0,
        price: 0,
        category: "shoes",
    }
    // states defined for newly added item values
    const [newValues, setValues] = useState(defaultNewValues);
    // an "items" state is set as an array, and the setItems() method can be used to update that
    // array
    const [items, setItems] = useState([]);
    // manages "categories" array state
    const [allCategories, setCategories] = useState([]);

    // Input values stored when changing item's info.
    const changedName = React.createRef();
    const changedQuantity = React.createRef();
    const changedPrice = React.createRef();
    const changedCategory = React.createRef();

    /**
     * Executes the getItems() and getCategories() function before other things after each render.
     */
    useEffect(() => {
        getItems()
        getCategories();
    }, []);

    /**
     * Handles multiple inputs while adding a new item.
     * @param e
     */
    const handleNewItemInput = (e) => {
        const {name, value} = e.target;
        setValues({
            ...newValues,
            [name]: value,
        });
    }

    /**
     * Queries from the 'items' collection in the Firebase database.
     */
    function getItems() {
        const itemsCollectionRef = collection(db, 'items');
        getDocs(itemsCollectionRef).then(response => {
            const item = response.docs.map(doc => ({
                data: doc.data(),
                id: doc.id,
            }))
            setItems(item);
        }).catch(error => console.log(error.message))
    }

    /**
     * Queries from the 'categories' collection in the Firebase database.
     */
    function getCategories() {
        const itemsCollectionRef = collection(db, 'allcategories');
        getDocs(itemsCollectionRef).then(response => {
            const category = response.docs.map(doc => ({
                data: doc.data(),
                id: doc.id,
            }))
            setCategories(category);
        }).catch(error => console.log(error.message))
    }

    /**
     * Adds a new Item to the database with the given input on the new item form
     * @returns {Promise<void>}
     */
    async function addNewItem(event) {
        event.preventDefault();
        const ref = doc(db, 'items', newValues.name).withConverter(itemConverter);
        const newItem = new Item(
            newValues.name,
            newValues.quantity,
            newValues.price,
            newValues.category,
            new Date().toString(),
            new Date().toString())
        await setDoc(ref, newItem).catch(error => {
            console.log(error.message);
        });
        window.location.reload(false);
    }

    async function changeItemInfo(event) {
        event.preventDefault();
        const ref = doc(db, 'items', changedName.current.value).withConverter(itemConverter);
        const updatedItem = new Item(
            changedName.current.value,
            changedQuantity.current.value,
            changedPrice.current.value,
            changedCategory.current.value,
            new Date().toString(),
            new Date().toString())
        await setDoc(ref, updatedItem).catch(error => {
            console.log(error.message);
        });
        window.location.reload(false);
    }

    return (
        <div>
            <h2 className="itemsTitle"> Items </h2>
            <button className="refreshItems" onClick={() => getItems()}>Refresh Items</button>
            <Popup
                trigger= {<button className="addItem"> Add Item </button>}
                modal
                nested>
                <div className="newItemBox">
                    <h3> New Item Info </h3>
                    <form onSubmit={addNewItem}>
                        <label>
                            Item Name:
                            <input type="text"
                                   value={newValues.name}
                                   onChange={handleNewItemInput}
                                   name="name"
                            />
                        </label>
                        <label>
                            Item Quantity:
                            <input type="number"
                                   value={newValues.quantity}
                                   onChange={handleNewItemInput}
                                   name="quantity"
                            />
                        </label>
                        <label>
                            Item Price:
                            <input type="number"
                                   value={newValues.price}
                                   onChange={handleNewItemInput}
                                   name="price"
                            />
                        </label>
                        <label>
                            Item Category:
                            <select value={newValues.category}
                                    onChange={handleNewItemInput}
                                    name="category"
                            >
                                {allCategories.map(category => (
                                    category.data.categories.map(categoryName => (
                                        <option key={categoryName}>{categoryName}</option>
                                    ))
                                ))}
                            </select>
                        </label>
                        <input type="submit"/>
                    </form>
                </div>
            </Popup>
            <table className="listItems">
                <thead>
                    <tr>
                        <th> Name </th>
                        <th> Quantity </th>
                        <th> Price </th>
                        <th> Category </th>
                    </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{item.data.name}</td>
                        <td>{item.data.quantity}</td>
                        <td>${item.data.price}</td>
                        <td>{item.data.category}</td>
                        <td>
                            <Popup
                            trigger= {<button className="editItem"> Edit </button>}
                            modal
                            nested>
                            <div className="newItemBox">
                                <h3> Item Info </h3>
                                <form onSubmit={changeItemInfo}>
                                    <label>
                                        Item Name:
                                        <input type="text"
                                               defaultValue={item.data.name}
                                               ref={changedName}
                                        />
                                    </label>
                                    <label>
                                        Item Quantity:
                                        <input type="number"
                                               defaultValue={item.data.quantity}
                                               ref={changedQuantity}
                                        />
                                    </label>
                                    <label>
                                        Item Price:
                                        <input type="number"
                                               defaultValue={item.data.price}
                                               ref={changedPrice}
                                        />
                                    </label>
                                    <label>
                                        Item Category:
                                        <select
                                            defaultValue={item.data.category}
                                            ref={changedCategory}
                                        >
                                            {allCategories.map(category => (
                                                category.data.categories.map(categoryName => (
                                                    <option key={categoryName}>{categoryName}</option>
                                                ))
                                            ))}
                                        </select>
                                    </label>
                                    Date Created: {item.data.created_at}
                                    <br/><br/>
                                    Last Modified: {item.data.modified_at}
                                    <input className="changeItemButton" value={"Change"} type="submit"/>
                                </form>
                            </div>
                        </Popup>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
};

/**
 * Used to organize new Item data before converting into Firestore data format
 */
class Item {
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
const itemConverter = {
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

// async function addCategory() {
//     const categoryDocRef = doc(db, 'allcategories', 'categories');
//     await updateDoc(categoryDocRef, {
//         categories: arrayUnion(newCategory.current.value)
//     }).then(response => {
//         console.log("updated");
//     }).catch(error => console.log(error.message));
// }
