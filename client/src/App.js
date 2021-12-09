import React, { Fragment, useReducer, useEffect } from "react";
import Routes from "./components";
import { LayoutContext, layoutState, layoutReducer } from "./components/shop";

import alanBtn from "@alan-ai/alan-sdk-web";

function App() {
    useEffect(() => {
        alanBtn({
            key: "7ff6cbaa1fa81f35a6f1516d0bfbf7122e956eca572e1d8b807a3e2338fdd0dc/testing",
            onCommand: (commandData) => {
                if (commandData.command === "go:back") {
                    // Call the client code that will react to the received command
                }
            },
        });
    }, []);
    const [data, dispatch] = useReducer(layoutReducer, layoutState); 
    return (<Fragment >
        <LayoutContext.Provider value = {{ data, dispatch } } >
        <Routes />
    </LayoutContext.Provider> </Fragment>);
}

export default App;