import React, {useEffect, useState} from 'react';
import {db} from "./Firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Items() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getItems()
    }, []);

    useEffect(() => {
        console.log(items);
    }, [items]);

    

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

    return (
        <div>
            <h2 className="itemsTitle"> Items </h2>
            <button onClick={() => getItems()}>Refresh Items</button>
            <ul>
                {items.map(item => (
                    <li key={item.id}>{item.data.name}</li>
                ))}
            </ul>
        </div>
    )
};
