import React, {useEffect, useState} from 'react';
import Popup from "reactjs-popup";
import {db} from "./Firebase";
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";

/**
 * Renders a functional item list from a database
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
    const [newItemValues, setItemValues] = useState(defaultNewValues);

    // an "items" state is set as an array, and the setItems() method can be used to update that
    // array
    const [items, setItems] = useState([]);

    // manages "categories" array state
    const [allCategories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("category");

    // Input values stored when changing item's info.
    const changedName = React.createRef();
    const changedQuantity = React.createRef();
    const changedPrice = React.createRef();
    const changedCategory = React.createRef();
    const createdDate = React.createRef();

    /**
     * Executes the getItems() function before other things after each render.
     */
    useEffect(() => {
        getItems()
        getCategories()
    }, []);

    /**
     * Handles multiple inputs while adding a new item to the database.
     * @param e
     */
    const handleNewItemInput = (e) => {
        const {name, value} = e.target;
        setItemValues({
            ...newItemValues,
            [name]: value,
        });
    }

    const handleNewCategory = (e) => {
        setNewCategory(e.target.value);
    }

    /**
     * Queries items from the 'items' collection in the Firebase database.
     */
    function getItems() {
        const itemsCollectionRef = collection(db, 'items');
        getDocs(itemsCollectionRef).then(response => {
            const item = response.docs.map(doc => ({
                data: doc.data(),
                id: doc.id,
            }))
            setItems(item);
        }).catch(error => console.log(error.message));
    }

    /**
     * Queries categories from the 'categories' collection in the Firebase database.
     */
    function getCategories() {
        const itemsCollectionRef = collection(db, 'allcategories');
        getDocs(itemsCollectionRef).then(response => {
            const category = response.docs.map(doc => ({
                data: doc.data(),
                id: doc.id,
            }))
            setCategories(category);
        }).catch(error => console.log(error.message));
    }

    /**
     * Adds a new Item to the database with the given input from a submitted new item form.
     * @returns {Promise<void>}
     */
    async function addNewItem(event) {
        event.preventDefault();
        const ref = doc(db, 'items', newItemValues.name).withConverter(itemConverter);
        const newItem = new Item(
            newItemValues.name,
            newItemValues.quantity,
            newItemValues.price,
            newItemValues.category,
            new Date().toString(),
            new Date().toString())
        await setDoc(ref, newItem).catch(error => {
            console.log(error.message);
        });
        window.location.reload(false);
    }

    /**
     * Removes an Item from the database and the user's list.
     * @param event
     * @returns {Promise<void>}
     */
    async function removeItem(event) {
        event.preventDefault();
        const ref = doc(db, 'items', event.target.value);
        if(window.confirm("Are you sure you want to delete this item?")) {
            await deleteDoc(ref).catch(error => {
                console.log(error.message);
            });
            window.location.reload(false);
        }
    }

    /**
     * Changes the properties of an item that already exists in the database when a form is
     * submitted
     * @param event
     * @returns {Promise<void>}
     */
    async function changeItemInfo(event) {
        event.preventDefault();
        const ref = doc(db, 'items', changedName.current.value).withConverter(itemConverter);
        const updatedItem = new Item(
            changedName.current.value,
            changedQuantity.current.value,
            changedPrice.current.value,
            changedCategory.current.value,
            createdDate.current.innerText,
            new Date().toString())
        await setDoc(ref, updatedItem).catch(error => {
            console.log(error.message);
        });
        window.location.reload(false);
    }

    /**
     * Adds a new Category to the database with the given input from a submitted new category from.
     * @param event
     * @returns {Promise<void>}
     */
    async function addCategory(event) {
        event.preventDefault();
        const categoryDocRef = doc(db, 'allcategories', 'Categories');
        await updateDoc(categoryDocRef, {
            categories: arrayUnion(...[newCategory])
        }).then(response => {
            console.log("updated");
        }).catch(error => console.log(error.message));
        getCategories();
    }

    /**
     * Removes a Category from the available categories and from the database
     * @param event
     * @returns {Promise<void>}
     */
    async function removeCategory(event) {
        event.preventDefault();
        const categoryDocRef = doc(db, 'allcategories', 'Categories')
        const removeIndex = allCategories[0].data.categories.indexOf(event.target.value);
        allCategories[0].data.categories.splice(removeIndex,1);
        await setDoc(categoryDocRef, {
            categories: arrayUnion(...allCategories[0].data.categories)
        }).then(response => {
            console.log("updated");
        }).catch(error => console.log(error.message));
        getCategories();
    }

    return (
        <div className="itemManager">
            <h2 className="itemsTitle"> Items </h2>
            <button className="defaultButtons" onClick={() => getItems()}>Refresh Items</button>
            <Popup
                trigger= {<button className="defaultButtons"> Manage Categories </button>}
                modal
                nested
                onOpen={() => getCategories()}
            >
                <div className="popupBox">
                    <div className="categoriesBox">
                    <h3>Available Categories</h3>
                        <ul className="categoriesList" >
                            {allCategories.map(category => (category.data.categories.map(categoryName => (
                                <li key={categoryName}>{categoryName}
                                    <button onClick={removeCategory}
                                            value={categoryName}
                                            className="sideButtons">
                                        Remove
                                    </button>
                                </li>
                            )
                        )))}
                        </ul>
                    </div>
                </div>
                <form onSubmit={addCategory}>
                    <label className="newCategoryInfo">
                        New Category Name: <input
                        type="text"
                        value={newCategory}
                        onChange={handleNewCategory}
                    />
                    </label>
                    <input className="submitButtons" value="Add Category" type="submit"/>
                </form>
            </Popup>
            <Popup
                trigger= {<button className="defaultButtons"> Add Item </button>}
                modal
                nested>
                <div className="popupBox">
                    <h3> New Item Info </h3>
                    <form onSubmit={addNewItem}>
                        <label>
                            Item Name:<input type="text"
                                   value={newItemValues.name}
                                   onChange={handleNewItemInput}
                                   name="name"
                            />
                        </label>
                        <label>
                            Item Quantity:
                            <input type="number"
                                   value={newItemValues.quantity}
                                   onChange={handleNewItemInput}
                                   name="quantity"
                            />
                        </label>
                        <label>
                            Item Price:
                            <input type="number"
                                   value={newItemValues.price}
                                   onChange={handleNewItemInput}
                                   name="price"
                            />
                        </label>
                        <label>
                            Item Category:
                            <select value={newItemValues.category}
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
                        <input className="submitButtons" type="submit"/>
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
                            <button onClick={removeItem} value={item.data.name} className="sideButtons"> Remove </button>
                            <Popup
                            trigger= {<button className="sideButtons"> Edit </button>}
                            modal
                            nested>
                            <div className="editItemBox">
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
                                    Date Created: <p ref={createdDate}> {item.data.created_at}</p>
                                    Last Modified:<p> {item.data.modified_at} </p>
                                    <input className="submitButtons" value={"Change"} type="submit"/>
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
