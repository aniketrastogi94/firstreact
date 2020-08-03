import React from 'react';
import Switch from '@material-ui/core/Switch';
import Aux from "../../hoc/_Aux";
import {
  makeStyles
} from '@material-ui/core/styles';
import {
  Row,
  Col
} from 'react-bootstrap';
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  FeatureGroup
} from 'react-leaflet'
import {
  EditControl
} from "./index"
import L from "leaflet";
import {
  withStyles
} from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MarkerClusterGroup from "react-leaflet-markercluster";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import Hub from "../../assets/images/hub.png";
import { useAlert } from 'react-alert';
const PurpleSwitch = withStyles({
  switchBase: {
    color: "#E95617",

    '&$checked': {
      color: "#E95617",
    },
    '&$checked + $track': {
      backgroundColor: "#E95617",
    },

  },
  checked: {},
  track: {},
})(Switch);
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    textAlign: "left",
    borderBottom: "1px solid lightgray",
    fontSize: "12px",
    '& label.Mui-focused': {
      color: '#E95617',
    },

  },
  map: {
    height: "82vh",
    width: "100%",
    zIndex: 1,
    bottom: "0",
  }
}));
const HubIcon = new L.Icon({
  iconUrl: Hub,
  iconRetinaUrl: Hub,
  popupAnchor: [0, -35],
  iconSize: [50, 50],
});

var data, stops;
export default function App() {
  const alert = useAlert()
  const classes = useStyles();
  const [points,setpoints] = React.useState({});
  const position = [31.780632, 76.994168];
  const [state, setState] = React.useState({
    routes: false,
    sourceLatitude: 0.00,
    sourceLong: 0.00,
    destLat: 0.00,
    desLon: 0.00,
    bufferRadius: 0.00,
    noOfIntermediateStop: 0,
    custom_restriction_markers1: 0.00,
    custom_restriction_markers2: 0.00,
    custom_restriction_markers3: 0.00,
    flyzone: false,
    water: false,
    forest: false,
    school_hospitals: false,
    population: false,
    optimum_path: false,
    openform:false
  });
  const [type, setType] = React.useState('startPoint');

  const handlemarkertypeChange = (event) => {
    setType(event.target.value);
  };

  const [intermediate_stops, setintermediate_stops] = React.useState([])
  const handleClickOpen = () => {
    setState({
      ...state,
      opendialog: true
    })
  };
  const handleClose = () => {
    setState({
      ...state,
      opendialog: false
    })
  };
  const handletagchange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });
  };
  const handletextfieldchange = (event) => {
    const name = event.target.name;
    if (name === "sourceLatitude") {
      setState({
        ...state,
        sourceLatitude: event.target.value
      })
    }
    if (name === "sourceLong") {
      setState({
        ...state,
        sourceLong: event.target.value
      })
    }
    if (name === "destLat") {
      setState({
        ...state,
        destLat: event.target.value
      })
    }
    if (name === "desLon") {
      setState({
        ...state,
        desLon: event.target.value
      })
    }
    if (name === "custom_restriction_markers1") {
      setState({
        ...state,
        custom_restriction_markers1: event.target.value
      })
    }
    if (name === "custom_restriction_markers2") {
      setState({
        ...state,
        custom_restriction_markers2: event.target.value
      })
    }
    if (name === "custom_restriction_markers3") {
      setState({
        ...state,
        custom_restriction_markers3: event.target.value
      })
    }
    if (name === "bufferRadius") {
      setState({
        ...state,
        bufferRadius: event.target.value
      })
    }
  }
  const handlepostrequest = () => {
    console.log(state);
    axios.post('http://127.0.0.1:8000/find-path/', {
        "source": [parseFloat(state.sourceLatitude), parseFloat(state.sourceLong)],
        "destination": [parseFloat(state.destLat), parseFloat(state.desLon)],
        "intermediate_stops": intermediate_stops,
        "buffer_radius_km": parseInt(state.bufferRadius),
        "tags": {
          "flyzone": state.flyzone,
          "water": state.water,
          "forest": state.forest,
          "school_hospitals": state.school_hospitals,
          "population": state.population
        },
        "custom_restriction_markers": [
          [parseFloat(state.custom_restriction_markers1), parseFloat(state.custom_restriction_markers2), parseFloat(state.custom_restriction_markers3)]
        ],
        "optimum_path": state.optimum_path
      })
      .then(res => {
        data = res.data.final_path;
        stops = res.data.intermediate_stops;
        console.log(res);

      })
      .catch(err => {
        console.log(err);
        console.log("error happen");
        alert.show("incorrect post request format");
      })
  }
  const handlenoOfInt = (event) => {
    setState({
      ...state,
      noOfIntermediateStop: event.target.value
    });
    const values = [...intermediate_stops];
    for (var i = 0; i < event.target.value; i++) {
      values.push([]);
    }
    setintermediate_stops(values);
  }
  const handlestopchange = (index, event) => {
    const values = [...intermediate_stops];
    if (event.target.name === 'stoplat') {
      values[index][0] = parseFloat(event.target.value);
    } else if (event.target.name === 'stopLon') {
      values[index][1] = parseFloat(event.target.value);
    }
    setintermediate_stops(values);
  }
  const temp = [data];
  const handleChange = (event) => {
    if (data) {
      setState({
        ...state,
        [event.target.name]: event.target.checked
      });
    }else {
      alert.show('Please enter the coordinates and other enteries first')
    }
  };
  var RoutesMarker2 = "";
  var StartingPoint = "";
  var IntermediateStops = "";
  if (state.routes === true) {
    RoutesMarker2 = temp.map((points, i) => ( <
      Polyline key = {
        i
      }
      positions = {
        points
      }
      color = "#E95617"
      weight = {
        5
      }
      lineCap = "square" / >
    ));
    StartingPoint = < >
      <
      Marker key = "1"
    position = {
      {
        lat: temp[0][0][0],
        lng: temp[0][0][1]
      }
    }
    icon = {
        HubIcon
      } >
      <
      Popup key = "1" >
      <
      div >
      <
      strong >
      Starting Point <
      /strong><br / >
      <
      /div> <
      /Popup> <
      /Marker> <
      Marker key = "1"
    position = {
      {
        lat: temp[0][temp[0].length - 1][0],
        lng: temp[0][temp[0].length - 1][1]
      }
    }
    icon = {
        HubIcon
      } >
      <
      Popup key = "1" >
      <
      div >
      <
      strong >
      Destination Point <
      /strong><br / >
      <
      /div> <
      /Popup> <
      /Marker> <
      />
    IntermediateStops = stops.map((stop, i) => ( <
      Marker key = {
        i
      }
      position = {
        {
          lat: stop[0],
          lng: stop[1]
        }
      }
      icon = {
        HubIcon
      } >
      <
      Popup key = {
        i
      } >
      <
      div >
      <
      strong >
      Intermediate Stop: {
        i + 1
      } <
      /strong><br / >
      <
      /div> <
      /Popup> <
      /Marker>
    ));
  }
  const handleClosemarkerform = () => {

    if(type === "startPoint"){
      setState({...state,sourceLatitude:points.lat,sourceLong:points.lng,openform:false});

    }else if(type === "destinationPoint"){
        setState({...state,destLat:points.lat,desLon:points.lng,openform:false});
    }else if(type === "intermediate_stops"){
      const value = intermediate_stops;
      value.push([points.lat,points.lng]);
      setintermediate_stops(value);
setState({...state,openform:false})
    }
     console.log(intermediate_stops);
    console.log(state);
  }
  const _onEdited = (e) => {

    let numEdited = 0;
    e.layers.eachLayer((layer) => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);

    // _onChange();
  }
  const _onCreated = (e) => {
    let type = e.layerType;
    // let layer = e.layer;

    if (type === 'marker') {
       setState({...state,openform:true})
      // Do marker specific actions
      setpoints(e.layer._latlng);
      console.log("_onCreated: marker created", e);
    } else {
      console.log("_onCreated: something else created:", type, e);
    }
    // Do whatever else you need to. (save to db; etc)

    // _onChange();
  }

  const _onDeleted = (e) => {

    let numDeleted = 0;
    e.layers.eachLayer((layer) => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);

    // _onChange();
  }
  return ( <
      div >
      <
      div className = {
        classes.root
      } >

      <
      div >
      <
      FormGroup style = {
        {
          display: "block"
        }
      } >
      <
      span style = {
        {
          justifyItems: "center",
          alignItems: 'center',
          marginRight: "10px",
          marginLeft: "10px"
        }
      } >
      <
      FormControlLabel style = {
        {
          marginTop: '5px'
        }
      }
      control = {
        < PurpleSwitch size = "small"
        checked = {
          state.routes
        }
        onChange = {
          handleChange
        }
        name = "routes" / >
      }
      label = "Routes" /
      >
      <
      FormControlLabel style = {
        {
          marginTop: '5px'
        }
      }
      control = {
        < PurpleSwitch size = "small"
        checked = {
          state.flyzone
        }
        onChange = {
          handletagchange
        }
        name = "flyzone" / >
      }
      label = "Flyzone" /
      >
      <
      FormControlLabel style = {
        {
          marginTop: '5px'
        }
      }
      control = {
        < PurpleSwitch size = "small"
        checked = {
          state.water
        }
        onChange = {
          handletagchange
        }
        name = "water" / >
      }
      label = "Water" /
      >
      <
      FormControlLabel style = {
        {
          marginTop: '5px'
        }
      }
      control = {
        < PurpleSwitch size = "small"
        checked = {
          state.forest
        }
        onChange = {
          handletagchange
        }
        name = "forest" / >
      }
      label = "Forest" /
      >
      <
      FormControlLabel style = {
        {
          marginTop: '5px'
        }
      }
      control = {
        < PurpleSwitch size = "small"
        checked = {
          state.school_hospitals
        }
        onChange = {
          handletagchange
        }
        name = "school_hospitals" / >
      }
      label = "School/Hospital" /
      >
      <
      FormControlLabel style = {
        {
          marginTop: '5px'
        }
      }
      control = {
        < PurpleSwitch size = "small"
        checked = {
          state.population
        }
        onChange = {
          handletagchange
        }
        name = "population" / >
      }
      label = "Population" /
      >
      <
      FormControlLabel style = {
        {
          marginTop: '5px'
        }
      }
      control = {
        < PurpleSwitch size = "small"
        checked = {
          state.optimum_path
        }
        onChange = {
          handletagchange
        }
        name = "optimum_path" / >
      }
      label = "Optimum Path" /
      >
      <
      /span> <
      Button style = {
        {
          color: "#E95617"
        }
      }
      onClick = {
        handleClickOpen
      } >
      Find routes <
      /Button> <
      Dialog open = {
        state.opendialog
      }
      onClose = {
        handleClose
      }
      aria-labelledby = "form-dialog-title" >
      <
      DialogContent >

      <
      TextField name = "sourceLatitude"
      label = " source latitude"
      type = "double"
      required={true}
      style = {
        {
          marginRight: '15px'
        }
      }
      onChange = {
        handletextfieldchange
      }
      value = {
        state.sourceLatitude
      }
      /> <
      TextField name = "sourceLong"
      required={true}
      onChange = {
        handletextfieldchange
      }
      label = "source longitude"
      type = "double"
      required={true}
      style = {
        {
          marginRight: '15px'
        }
      }
      value = {
        state.sourceLong
      }
      /> <
      br / >
      <
      TextField name = "destLat"
      required={true}
      onChange = {
        handletextfieldchange
      }
      label = " destination latitude"
      type = "double"
      style = {
        {
          marginRight: '15px'
        }
      }
      value = {
        state.destLat
      }
      /> <
      TextField name = 'desLon'
      required={true}
      onChange = {
        handletextfieldchange
      }
      label = " destination longitude"
      type = "double"
      style = {
        {
          marginRight: '15px'
        }
      }
      value = {
        state.desLon
      }
      /> <
      br / >
      <
      TextField name = "noOfIntermediateStop"
      required={true}
      onChange = {
        handlenoOfInt
      }
      label = "no. of intermediate "
      style = {
        {
          marginRight: '15px'
        }
      }
      value = {
        (state.noOfIntermediateStop === 0)?intermediate_stops.length:state.noOfIntermediateStop
      }
      /> <
      br / > {
        intermediate_stops.map((stop, index) => ( < React.Fragment key = {
              index
            } >
            <
            TextField name = "stoplat"
            required={true}
            onChange = {
              event => handlestopchange(index, event)
            }
            label = " stop latitude"
            style = {
              {
                marginRight: '15px'
              }
            }
            value = {
              stop[0]
            }
            /> <
            TextField name = "stopLon"
            required={true}
            onChange = {
              event => handlestopchange(index, event)
            }
            label = "stop longitude"
            style = {
              {
                marginRight: '15px'
              }
            }
            value = {
              stop[1]
            }
            /> <
            br / >
            <
            /React.Fragment>))
          }


          <
          TextField name = "custom_restriction_markers1"
          required={true}
          onChange = {
            handletextfieldchange
          }
          label = "restriction marker 1"
          type = "double"
          style = {
            {
              marginRight: '15px'
            }
          }
          value = {
            state.custom_restriction_markers1
          }
          /> <
          TextField name = "custom_restriction_markers2"
          required={true}
          onChange = {
            handletextfieldchange
          }
          label = "restriction marker 2"
          type = "double"
          style = {
            {
              marginRight: '15px'
            }
          }
          value = {
            state.custom_restriction_markers2
          }
          /> <
          TextField name = "custom_restriction_markers3"
          required={true}
          onChange = {
            handletextfieldchange
          }
          label = "restriction marker 3 "
          type = "double"
          style = {
            {
              marginRight: '15px'
            }
          }
          value = {
            state.custom_restriction_markers3
          }
          /> <
          TextField name = "bufferRadius"
          required={true}
          onChange = {
            handletextfieldchange
          }
          label = "buffer radius in km"
          type = "double"
          style = {
            {
              marginRight: '15px'
            }
          }
          value = {
            state.bufferRadius
          }
          /> <
          br / >

          <
          /DialogContent> <
          DialogActions >
          <
          Button onClick = {
            handlepostrequest
          }
          style = {
            {
              color: "#E95617"
            }
          } >
          Find Routes <
          /Button> <
          /DialogActions> <
          /Dialog> <
          /FormGroup>

          <
          /div> <
          /div> <
          Aux style = {
            {
              height: " 70vh"
            }
          } >
          <
          Row >
          <
          Col xl = {
            12
          } >
          <
          Map className = {
            classes.map
          }
          center = {
            position
          }
          zoom = {
            12
          }
          >
          <
          TileLayer url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' /
          >
          <
          FeatureGroup >
          <
          EditControl position = 'topleft'
          onEdited = {
            _onEdited
          }
          onCreated = {
            _onCreated
          }
          onDeleted = {
            _onDeleted
          }
          draw = {
            {
              rectangle: false,
              circle: false,
              polygon: false,
              circlemarker: false,
              polyline: false
            }
          }
          />

          <
          /FeatureGroup>

          {
            RoutesMarker2
          }


          <
          MarkerClusterGroup > {
            StartingPoint
          } {
            IntermediateStops
          } <
          /MarkerClusterGroup>


          {
            state.openform ? <Dialog open={state.openform} onClose={handleClosemarkerform} aria-labelledby="form-dialog-title" >
            <DialogContent>
            <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label" >Type</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={type}
            onChange={event => handlemarkertypeChange(event)}
            label="Marker Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="startPoint">Starting Point</MenuItem>
            <MenuItem value="destinationPoint">Destination Point</MenuItem>
            <MenuItem value="intermediate_stops">Intermediate Stops</MenuItem>
          </Select>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosemarkerform} color="primary">
            Enter
          </Button>
        </DialogActions>
      </Dialog>:null
          }
          <
          /Map>

          <
          /Col> <
          /Row> <
          /Aux> <
          /div>
        );
      }
