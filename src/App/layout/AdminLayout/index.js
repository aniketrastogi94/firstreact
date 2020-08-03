import React, { Component, Suspense, useEffect, useState } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';
// import axios from 'axios';
import Navigation from './Navigation';
import {Withoutnavbar , Withnavbar} from './NavBar';
import Loader from "../Loader";
import routes from "../../../routes";
import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";
import './app.scss';
import './app.css';
// const proxyurl = "https://cors-anywhere.herokuapp.com/";
function NavBar() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handler = (event: any) => {
        setWidth(event.target.innerWidth);
      };

      window.addEventListener('resize', handler);

      return () => {
        window.removeEventListener('resize', handler);
      };
    }, []);

    if(width > 991){
        return <Withoutnavbar />
    }else return <Withnavbar />
  }
class AdminLayout extends Component {

    fullScreenExitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            this.props.onFullScreenExit();
        }
    };

    componentWillMount() {
        if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
            this.props.onComponentWillMount();
        }
    }

    mobileOutClickHandler() {
        if (this.props.windowWidth < 992 && this.props.collapseMenu) {
            this.props.onComponentWillMount();
        }
    }

//     componentDidMount() {
//     axios.post(proxyurl+` http://127.0.0.1:8000/find-path/`,{
// "source":[25.136582259755453,75.8163070678711],
// "destination":[ 25.186301620540558,75.87741851806639],
// "intermediate_stops":[[25.154545,75.84234],[25.15523,75.8616256]],
// "buffer_radius_km":1,
// "tags":{"flyzone":true,"water":true,"forest":true,"school_hospitals":true,"population":true},
// "custom_restriction_markers":[[25.15523,75.8616256,100]],
// "optimum_path":true
// }
// )
//       .then(res => {
//         const persons = res.data;
//         // console.log('abc');
//         console.log(res.config.data);
//         this.setState({ persons });
//       })
//       .catch(err => {
//         console.log(err);
//         console.log("kjfdajfadj");
//       })
//   }

    render() {


        /* full screen exit call */
        document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);

        const menu = routes.map((route, index) => {
            return (route.component) ? (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} />
                    )} />
            ) : (null);
        });

        return (
            <Aux>
                <Fullscreen enabled={this.props.isFullScreen}>
                    <Navigation />
                    <NavBar />
                    <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
                        <div className="pcoded-wrapper">
                            <div className="pcoded-content">
                                <div className="pcoded-inner-content">
                                    <div className="main-body">
                                        <div className="page-wrapper">
                                            <Suspense fallback={<Loader/>}>
                                                <Switch>
                                                    {menu}
                                                    <Redirect from="/" to={this.props.defaultPath} />
                                                </Switch>
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fullscreen>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        defaultPath: state.defaultPath,
        isFullScreen: state.isFullScreen,
        collapseMenu: state.collapseMenu,
        configBlock: state.configBlock,
        layout: state.layout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreenExit: () => dispatch({type: actionTypes.FULL_SCREEN_EXIT}),
        onComponentWillMount: () => dispatch({type: actionTypes.COLLAPSE_MENU})
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (windowSize(AdminLayout));
