import React from "react";
import { isLogged } from "../appollo";


export const NotFound = () => {
    return <>
        <h1>404</h1>
        <button onClick={() => isLogged(true)}>CLICK ME !!!!</button>
    </>
}