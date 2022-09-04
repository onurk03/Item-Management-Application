import React, {useState} from "react";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../services/Firebase";
import {Item, itemConverter} from "./Item";
import Popup from "reactjs-popup";

/**
 * Renders the pop-up form for adding a new item.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ItemAdd(props) {
    // Initial values for a new item being added
    const defaultNewValues = {
        name: "Item",
        quantity: 0,
        price: 0,
        category: "shoes",
    }
    // states defined for newly added item values
    const [newItemValues, setItemValues] = useState(defaultNewValues);

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

    return (
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
                            {props.allCategories.map(category => (
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
    )
}
