import React from 'react';

const navIcon = (props) => {
    let navIcons = false;
    if (props.items.icon) {
        navIcons = <span className="material-icons pcoded-micon" style={{fontSize:"20px"}}>{props.items.icon} </span>;
    }
    return navIcons;
};

export default navIcon;