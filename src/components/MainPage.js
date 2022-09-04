import React, {useEffect, useState} from 'react';
import ItemList from "./itemList";
import ManageCategories from "./ManageCategories";
import ItemAdd from "./addItem";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../services/Firebase";

/**
 * Renders the main page that holds all components
 * @returns {JSX.Element}
 * @constructor
 */
export default function MainPage() {
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
            <ItemAdd allCategories = {allCategories}/>
            <ItemList allCategories = {allCategories}/>
        </div>
    )
};
