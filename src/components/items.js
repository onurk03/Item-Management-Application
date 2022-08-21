import React, {useEffect, useState} from 'react';
import ItemList from "./itemList";
import ManageCategories from "./ManageCategories";
import AddItem from "./addItem";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../Firebase";

/**
 * Renders a functional item list from a database
 * @returns {JSX.Element}
 * @constructor
 */
export default function Items() {
    // manages "categories" array state
    const [allCategories, setCategories] = useState([]);

    useEffect(() => {
        getCategories()
    }, []);

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

    return (
        <div className="itemManager">
            <h2 className="itemsTitle"> Items </h2>
            <ManageCategories/>
            <AddItem allCategories = {allCategories}/>
            <ItemList allCategories = {allCategories}/>
        </div>
    )
};
