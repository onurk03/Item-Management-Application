import React, {useEffect, useState} from "react";
import ItemEdit from "./ItemEdit";
import {collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db} from "../services/Firebase";

/**
 * Renders a list of all items stored in the database.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ItemList(props) {
    // an "items" state is set as an array, and the setItems() method can be used to update that
    // array
    const [items, setItems] = useState([]);

    /**
     * Executes the getItems() function before other things after each render.
     */
    useEffect(() => {
        getItems()
    }, []);

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

    return(
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
        {items.map(currItem => (
            <tr key={currItem.id}>
                <td>{currItem.data.name}</td>
                <td>{currItem.data.quantity}</td>
                <td>${currItem.data.price}</td>
                <td>{currItem.data.category}</td>
                <td>
                    <button onClick={removeItem} value={currItem.data.name} className="sideButtons"> Remove </button>
                    <ItemEdit item = {currItem}
                              allCategories = {props.allCategories}
                    />
                </td>
            </tr>
        ))}
        </tbody>
    </table>
    );

}
