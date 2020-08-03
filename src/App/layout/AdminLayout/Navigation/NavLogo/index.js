import React from 'react';
import DEMO  from './../../../../../store/constant';
import Aux from "../../../../../hoc/_Aux";
import UserProfile from "../../../../../assets/images/admin-picture.jpg"
const navLogo = (props) => {
    let toggleClass = ['mobile-menu'];
    if (props.collapseMenu) {
        toggleClass = [...toggleClass, 'on'];
    }
    return (
        <Aux>
            <div className="navbar-brand header-logo">
                 <a href={DEMO.BLANK_LINK} className="b-brand">
                    <div
                        className="b-bg" 
                        style={
                            {
                                backgroundImage: `url("https://res.cloudinary.com/dlwatmwd3/image/upload/v1552407627/Vyorius/logo.png" )`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat'
                            }
                        } 
                    >
                        
                    </div>
                    <span className="b-title">Vyorius</span>
                 </a>
                 <a href={DEMO.BLANK_LINK} className={toggleClass.join(' ')} id="mobile-collapse" onClick={props.onToggleNavigation}><span /></a>
            </div>
            <div className="userprofile">
                <img className="userprofile-images" src={UserProfile} alt="userprofile" />
                <h6>Mike Stelo</h6>
            </div>
         </Aux>
    );
};

export default navLogo;
