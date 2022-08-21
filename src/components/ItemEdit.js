import Popup from "reactjs-popup";
import React from "react";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../Firebase";
import {Item, itemConverter} from "./Item";

export default function ItemEdit(props) {
    // Input values stored when changing item's info.
    const changedName = React.createRef();
    const changedQuantity = React.createRef();
    const changedPrice = React.createRef();
    const changedCategory = React.createRef();
    const createdDate = React.createRef();

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

    return(
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
                           defaultValue={props.item.data.name}
                           ref={changedName}
                    />
                </label>
                <label>
                    Item Quantity:
                    <input type="number"
                           defaultValue={props.item.data.quantity}
                           ref={changedQuantity}
                    />
                </label>
                <label>
                    Item Price:
                    <input type="number"
                           defaultValue={props.item.data.price}
                           ref={changedPrice}
                    />
                </label>
                <label>
                    Item Category:
                    <select
                        defaultValue={props.item.data.category}
                        ref={changedCategory}
                    >
                        {props.allCategories.map(category => (
                            category.data.categories.map(categoryName => (
                                <option key={categoryName}>{categoryName}</option>
                            ))
                        ))}
                    </select>
                </label>
                Date Created: <p ref={createdDate}> {props.item.data.created_at}</p>
                Last Modified:<p> {props.item.data.modified_at} </p>
                <input className="submitButtons" value={"Change"} type="submit"/>
            </form>
        </div>
    </Popup>
    );
}
