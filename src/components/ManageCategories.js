import {arrayUnion, collection, doc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../services/Firebase";
import Popup from "reactjs-popup";
import React, {useState} from "react";

/**
 * Renders the pop-up form for managing all categories available in the database.
 * @returns {JSX.Element}
 * @constructor
 */
export default function ManageCategories() {
    const [newCategory, setNewCategory] = useState("category");
    // manages "categories" array state
    const [allCategories, setCategories] = useState([]);

    /**
     * Handles input changes for creating a new category
     * @param e
     */
    const handleNewCategory = (e) => {
        setNewCategory(e.target.value);
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
    return(
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
    )
}
