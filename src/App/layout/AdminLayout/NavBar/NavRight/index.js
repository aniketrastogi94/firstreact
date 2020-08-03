import React, { Component } from 'react';

import Aux from "../../../../../hoc/_Aux";
import NavSearch from "./NavSearch/index";

class NavRight extends Component {
    state = {
        listOpen: false
    };

    render() {

        return (
            <Aux>
                <ul className="navbar-nav ml-auto">
                    <li>
                        <NavSearch />
                    </li>
                    <li>
                        <i className="feather icon-user"/>
                    </li>
                    <li>
                        <i className="icon feather icon-bell"/>
                    </li>
                    <li>
                        <i className="icon feather icon-settings"/>
                    </li>
                </ul>
               
            </Aux>
        );
    }
}

export default NavRight;
