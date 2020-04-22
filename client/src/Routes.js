import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from './App';
const Routes = (props) => {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={App} />
                    {/* <Route path="/room/:roomID" component={Room} /> */}
                </Switch>
            </BrowserRouter>
        </div>
    );
}


export default Routes;
