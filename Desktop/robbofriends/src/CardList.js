import React from "react";
import  Card from './Card';

const CardList =({robots}) => (
    <div>
        {robots.map(({id,name,email,address}) =>(
            <Card
            key={id}
            id={id}
            name={name}
            email={email}
            address={address}
            />

        ))}
    </div>
);

export default CardList;