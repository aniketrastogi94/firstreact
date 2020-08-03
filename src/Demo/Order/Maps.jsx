import React from 'react';
import Switch from '@material-ui/core/Switch';
import Aux from "../../hoc/_Aux";
import { makeStyles } from '@material-ui/core/styles';
import {Row, Col} from 'react-bootstrap';
import {Circle, Map, Marker, Popup, TileLayer ,GeoJSON, FeatureGroup} from 'react-leaflet'
import L from "leaflet";
import { EditControl } from "./index";
import * as turf from '@turf/turf';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Hospital from "../../assets/images/hospital.png";
import Educational from '../../assets/images/educational.png';
import Elevation from '../../assets/images/elevation.png';
import Electricity from '../../assets/images/electricity.png';
import { useAlert } from 'react-alert'
import axios from 'axios';
var osmtogeojson = require('osmtogeojson');

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
///////data recieve from api call
var data;
const useStyles = makeStyles((theme) => ({
    root: {
      display : "flex",
      textAlign: "left",
      borderBottom:"1px solid lightgray",
      fontSize :"12px",
      '& label.Mui-focused': {
        color: '#E95617',
      },

    },
    map: {
      height: "82vh",
      width : "100%",
      zIndex: 1,
      bottom : "0",
    }
  }));


export default function App() {
  // to show alert
  const alert = useAlert();
  const classes = useStyles();
  ///////to show ui of selected field marker
  var HospitalMarker="";
  var EducationalMarker=""
  var ElevationMarker="";
  var ElectricityMarker="";
  var Waterbodies ="";
  var Roads ="";
  var Forest = "";
  var CircleBlock = "";
  ///////to show line passes over water
  var LineOverWater=[];
  var LineOverForest =[];
  const [totalDistance,settotalDistance]=React.useState("");
  const [distanceoverforestwater,setdistanceoverforestwater]=React.useState("");
  const [line ,setline]=React.useState("");
  const position = [31.780632,  76.994168 ];
  //////// coordinate enter from the form
  const [coardinate,setcoordinate] = React.useState({
    lat:"",
    lng:"",
    radius:"",
    circle:false
  });
  const [lineOverWater,setLineOnWate]=React.useState(false);
  const [lineOverForest,setLineOnForest]=React.useState(false);
   const [markerformstate,setmarkerformstate] = React.useState(false);
  const [state, setState] = React.useState({
    hospitals:false,
    hospitaldata:"",
    waterbodies:false,
    waterdata:"",
    educationals:false,
    educationdata:"",
    roads:false,
    roaddata:"",
    electricity:false,
    electricitydata:"",
    forests:false,
    forestdata:"",
    elevations:false,
    elevationdata:"",

  });
const [lineoverwaterdata,setlineoverwaterdata] = React.useState([]);
const [lineoverforestdata,setlineoverforestdata] = React.useState([]);
// to fetch data from the api
  function fetchdata (name){
    const x = name;
    let baseUrl = "http://overpass-api.de/api/interpreter?data=";
  let overpassApiUrl = baseUrl + getquery(x);
  console.log(overpassApiUrl);

    axios.get(overpassApiUrl)
    .then(res => {
   data = res.data.elements;
      console.log(data);
      if(x === "hospitals"){
      setState({...state,hospitaldata:data,hospitals:true})
    }else if (x=== "educationals"){
      setState({...state,educationdata:data,educationals:true})
    }else if (x==="elevations"){
      setState({...state,elevationdata:data,elevations:true})
    }else if(x === "electricity"){
      setState({...state,electricitydata:data,electricity:true})
    }else if (x === "waterbodies"){
      // console.log(res.data);
      setState({...state,waterdata:osmtogeojson(res.data),waterbodies:true})
    }else if (x === "forests"){
      setState({...state,forestdata:osmtogeojson(res.data),forests:true})
    }else if(x === "roads"){
      setState({...state,roaddata:osmtogeojson(res.data),roads:true})
    }
    }).catch(err=>{
      console.log(err);
    })

  }
  const handlemarkerformClose=()=>{
    setmarkerformstate(false);
  }
  const handleChange = (event) => {
    if (coardinate.circle){
      setState({ ...state, [event.target.name]: event.target.checked });
      if(event.target.checked){
        fetchdata(event.target.name);
      }
    }else {
      alert.show("Please enter the coardinate first by clicking enter button ")
    }

  };
  const handleClickOpen = () => {
  setState({...state,
    opendialog:true
  })
  };
  const handleClose =() => {
    setState({...state,
      opendialog:false
    })
  };
  const handleDialogClick = () => {
    if(!coardinate.lat || !coardinate.lng || !coardinate.radius){
      alert.show("Please fill all the details");
    }else{
      setcoordinate({...coardinate, circle:true})
      setState({...state,
        opendialog:false
      })
    }
  }
  ////////to send query to api to fetch data
  function getquery(name) {
    if (name === "hospitals") {
      let query = `[out:json][timeout:100];(node[amenity=hospital](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng}););out body;`;
      return query;
    } else if (name === "roads") {
      let query = `[out:json][timeout:100];(way[highway](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng}););out body;>;out skel qt;`;
      return query;
    } else if (name === "waterbodies") {
      let query = `[out:json][timeout:100];(node[waterway](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});way[waterway](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});way[water](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});node['natural'='water'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});way[natural=water](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});relation['natural'='water'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng}););out body;>;out skel qt;`;
      return query;
    } else if (name === "forests") {
      let query = `[out:json][timeout:100];(way['natural'='wood'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});relation['natural'='wood'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});way['natural'='scrub'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});relation['natural'='scrub'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});way['leisure'='park'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng}););out body;>;out skel qt;`;
      return query;
    } else if (name === "electricity") {
      let query = `[out:json][timeout:100];(node[power](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng}););out body;>;out skel qt;`;
      return query;
    } else if (name === "educationals") {
      let query = `[out:json][timeout:100];(node['amenity'='school'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});node['amenity'='college'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng});node['amenity'='university'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng}););out body;>;out skel qt;`;
      return query;
    } else if (name === "elevations") {
      let query = `[out:json][timeout:100];(node['ele'](around:${coardinate.radius*1000},${coardinate.lat},${coardinate.lng}););out body;>;out skel qt;`;
      return query;
    } else {
      alert("Query not defined. check code.");
    }
  }
if(state.hospitaldata){
  HospitalMarker = state.hospitaldata.map((element,index) => <Marker key="1" position={{lat:element.lat,lng:element.lon}} icon={HospitalIcon}>
    <Popup key={index}>
        <div>
          <strong>
            {"Name : " + element.tags.name }<br />
            {"Location : " + element.lat+","+element.lon}<br />
            {"Amenity : "+element.tags.amenity}
          </strong>
        </div>
    </Popup>
  </Marker>)
}
if(state.educationdata){
EducationalMarker=  state.educationdata.map((element,index)=> <Marker key="1" position={{lat:element.lat,lng:element.lon}} icon={EducationalIcon}>
    <Popup key={index}>
        <div>
          <strong>
            {"Name : " + element.tags.name }<br />
            {"Location : " + element.lat+","+element.lon}<br />
            {"Amenity : "+element.tags.amenity}
          </strong>
        </div>
    </Popup>
  </Marker>);
}
if(state.elevationdata){
  ElevationMarker=state.elevationdata.map((element,index)=> <Marker key="1" position={{lat:element.lat,lng:element.lon}} icon={ElevationIcon}>
    <Popup key={index}>
        <div>
          <strong>
            {"Name : " + element.tags.name }<br />
            {"Location : " + element.lat+","+element.lon}<br />
            {"Amenity : "+element.tags.amenity}
          </strong>
        </div>
    </Popup>
  </Marker>)
}
if(state.electricitydata){
  ElectricityMarker=state.electricitydata.map((element,index)=> <Marker key="1" position={{lat:element.lat,lng:element.lon}} icon={ElectricityIcon}>
    <Popup key={index}>
        <div>
          <strong>
            {"Name : " + element.tags.name }<br />
            {"Location : " + element.lat+","+element.lon}<br />
            {"Amenity : "+element.tags.amenity}
          </strong>
        </div>
    </Popup>
  </Marker>)
}
if(state.waterdata){
  Waterbodies = <GeoJSON  data={state.waterdata}  style={function (feature) {
    return { color: "#2f9af7" };
  }}   onEachFeature={function onEachFeature(feature, layer) {
  console.log(feature.properties.tags);
  if ((feature.properties && feature.properties.tags )&& feature.properties.tags.name){
        layer.bindPopup(
          `<div><h6>Name:${feature.properties.tags.name}</h6>
          <h6>Type:Water Body</h6></div>`
        );
  }else{
    layer.bindPopup(
      `<div>
      <h6>Type:Water Body</h6></div>`
    );
  }
  }}/>
}

if(state.forestdata){
  Forest = <GeoJSON  data={state.forestdata}  style={function (feature) {
    return { color: "#c4fb6d" };
  }}   onEachFeature={function onEachFeature1(feature, layer) {
  console.log(feature.properties.tags);
  if ((feature.properties && feature.properties.tags )&& feature.properties.tags.name){
        layer.bindPopup(
          `<div><h6>Name:${feature.properties.tags.name}</h6>
          <h6>Type:Forest</h6></div>`
        );
  }else{
    layer.bindPopup(
      `<div>
      <h6>Type:Forest</h6></div>`
    );
  }
  }}/>
}
if((state.roaddata)&&(state.roads)){
  Roads = <GeoJSON  data={state.roaddata}  style={function (feature) {
    return { color: "grey" };
  }}   onEachFeature={(feature,layer)=>{if ((feature.properties && feature.properties.tags )&& feature.properties.tags.name){
        layer.bindPopup(
          `<div><h6>Name:${feature.properties.tags.name}</h6>
          <h6>Type:Road</h6></div>`
        );
  }else{
    layer.bindPopup(
      `<div><h6>Name:Not found</h6>
      <h6>Type:Road</h6></div>`
    );
  }}}/>
}
if(coardinate.circle === true){
  CircleBlock = <Circle
    key={1}
    center={[parseFloat(coardinate.lat),parseFloat(coardinate.lng)]}
    fillColor="#E95617"
    radius={parseInt(coardinate.radius*1000)}
    color= '#E95617'

  >
  </Circle>
}
// function to handle change in the place coordinate and radius
const handle = (event) => {
  if(event.target.name === "Lat"){
    setcoordinate({...coardinate,lat:event.target.value});
  }else if (event.target.name === "Lng"){
    setcoordinate({...coardinate, lng:event.target.value});
  }else if (event.target.name === "radius"){
    setcoordinate({...coardinate, radius:event.target.value});
  }
}
//////////fucntion to calculateDistance distance travelled by draw line
function calculateDistance(e){
  if (line) {
    // var featurecollection = [];
    // if (state.waterbodies) {
    //   featurecollection.push(state.waterdata);
    //     // console.log(featurecollection);
    //
    // }
    // if (state.forests) {
    //   featurecollection.push(state.forestdata);
    //     // console.log(featurecollection);
    //
    // }
    LineSectionsOnPolygon(line, state.waterdata?state.waterdata:0,state.forestdata?state.forestdata:0);

  } else {
    alert.show("Please first draw a line on map.");
  }
}
var distance_on_waterforest = 0;
// geospatial analysing the distance and slices of lines on the waterbodies and forests
function LineSectionsOnPolygon(line, fcPoly1,fcPoly2) {
  // console.log(line);
  var total_distance = turf.length(line);

    var bbline = turf.bboxPolygon(turf.bbox(line));
if(fcPoly1){
for (var i = 0; i < fcPoly1.features.length; i++) {
  var bb = turf.bboxPolygon(turf.bbox(fcPoly1.features[i]));
  if (turf.intersect(bbline, bb)) {
    var slc = turf.lineSplit(line, fcPoly1.features[i]);
    console.log(slc);
    for (var j = 0; j < slc.features.length; j++) {
        var curSlc = slc.features[j];
        var len = turf.length(curSlc, { units: "kilometers" });
        var ptMiddle = turf.centroid(curSlc);
        if (turf.booleanWithin(ptMiddle, fcPoly1.features[i])) {
          curSlc.properties = fcPoly1.features[i];
          console.log(curSlc);
          const values = lineoverwaterdata;
          values.push(<GeoJSON key={j} data={curSlc} style={function (feature) {
            return { color: "yellow", weight: 5 };
          }}/>)
          setlineoverwaterdata(values);
          distance_on_waterforest += len;
          console.log(distance_on_waterforest);
          setLineOnWate(true);
        }
    }
    console.log("intersect")
  }
}}
if(fcPoly2){
for (var m = 0; m < fcPoly2.features.length; m++) {
  var bb2 = turf.bboxPolygon(turf.bbox(fcPoly2.features[m]));
  if (turf.intersect(bbline, bb2)) {
    var slc2 = turf.lineSplit(line, fcPoly2.features[m]);
    console.log(slc2);
    for (var n = 0; n < slc2.features.length; n++) {
        var curSlc2 = slc2.features[n];
        var len2 = turf.length(curSlc2, { units: "kilometers" });
        var ptMiddle2 = turf.centroid(curSlc2);
        if (turf.booleanWithin(ptMiddle2, fcPoly2.features[m])) {
          curSlc2.properties = fcPoly2.features[m];
          console.log(curSlc2);
          const values2 = lineoverforestdata;
          values2.push(<GeoJSON key={j} data={curSlc2} style={function (feature) {
            return { color: "yellow", weight: 5 };
          }}/>)
          setlineoverforestdata(values2);
          // console.log(Lineoverdata);
          distance_on_waterforest += len2;
          console.log(distance_on_waterforest);
          setLineOnForest(true);
        }
    }
    console.log("intersect")
  }
}}
  settotalDistance(total_distance);
  console.log("Total distacnce of line>> ", total_distance.toFixed(3), "km");
  setdistanceoverforestwater(distance_on_waterforest);
}
if(lineoverwaterdata.length !== 0){
  LineOverWater = lineoverwaterdata;
}
if(lineoverforestdata.length !== 0){
  LineOverForest = lineoverforestdata;
}
const _onEdited = (e) => {

    let numEdited = 0;
    e.layers.eachLayer( (layer) => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);
  }
const  _onCreated = (e) => {
      let drawn_layer = e.layer;
      let type = e.layerType;
      if (type === 'marker') {
        console.log("_onCreated: marker created", e);
        setmarkerformstate(true);
      }else if (type === "polyline") {
        console.log(drawn_layer.toGeoJSON());
        console.log("_onCreated: marker created", e);
        setline(drawn_layer.toGeoJSON());
      }
      else {
        console.log("_onCreated: something else created:", type, e);
      }
    }

const  _onDeleted = (e) => {

      let numDeleted = 0;
      e.layers.eachLayer( (layer) => {
        numDeleted += 1;
      });
      console.log(`onDeleted: removed ${numDeleted} layers`, e);

      // _onChange();
    }
  return (
    <div>
    <div className={classes.root} >

        <div>
          <FormGroup style={{display: "block"}}>

              <FormControlLabel style={{marginTop :'5px'}}
                control={<PurpleSwitch size="small"  checked={state.hospitals} onChange={handleChange} name="hospitals" />}
                label="Hospitals"
              />
              <FormControlLabel style={{marginTop :'5px'}}
                control={<PurpleSwitch size="small"  checked={state.educationals} onChange={handleChange} name="educationals" />}
                label="Educationals"
              />
              <FormControlLabel style={{marginTop :'5px'}}
                control={<PurpleSwitch size="small" checked={state.waterbodies} onChange={handleChange} name="waterbodies" />}
                label="Waterbodies"
              />
              <FormControlLabel style={{marginTop :'5px'}}
                control={<PurpleSwitch size="small" checked={state.roads} onChange={handleChange} name="roads" />}
                label="Roads"
              />
              <FormControlLabel style={{marginTop :'5px'}}
                control={<PurpleSwitch size="small" checked={state.electricity} onChange={handleChange} name="electricity" />}
                label="Electricity"
              />
              <FormControlLabel style={{marginTop :'5px'}}
                control={<PurpleSwitch  size="small" checked={state.forests} onChange={handleChange} name="forests" />}
                label="Forest"
              />
              <FormControlLabel style={{marginTop :'5px'}}
                control={<PurpleSwitch  size="small" checked={state.elevations} onChange={handleChange} name="elevations" />}
                label="Elevations"
              />
              <Button  style={{color:"#E95617"}} onClick={handleClickOpen}>
             Enter
             </Button>
             { line &&   <Button  style={{color:"#E95617"}} onClick={calculateDistance}>
              Calculate Distance
              </Button>}
              { totalDistance && <h4><span>Total Distance : {totalDistance.toFixed(4)} Km |</span> Distance over Forest and Waterbodies : {distanceoverforestwater.toFixed(4)} Km</h4> }
            </FormGroup>
            <Dialog open={state.opendialog} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogContent>

                <TextField name="Lat" label="Latitude"  value={coardinate.lat} onChange={handle} style={{marginRight :'15px'}} required={true} />
                <TextField name="Lng" label="Longitude" value={coardinate.lng} onChange={handle} style={{marginRight :'15px'}} required={true}/>
                <TextField name="radius"label="Enter Radius" value={coardinate.radius} onChange={handle} style={{marginRight :'15px'}}  required={true}/>
                </DialogContent>
                <DialogActions>
                  <Button  style={{color:"#E95617"}} onClick={handleDialogClick}>
                  Enter
                  </Button>
                </DialogActions>
                </Dialog>
        </div>
     </div>
    <Aux style={{height: " 70vh"}}>
        <Row>
            <Col xl={12}>
                <Map
                  className={classes.map}
                  center={coardinate.circle ? [coardinate.lat,coardinate.lng] : position} zoom={coardinate.circle ? 8 : 12}

                 >
                  <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <FeatureGroup>
    <EditControl
      position='topleft'
      onEdited={_onEdited}
      onCreated={_onCreated}
      onDeleted={_onDeleted}
      draw={{
        rectangle: false,
        circle:false,
        polygon:false,
        circlemarker:false,
        polyline:{
          shapeOptions: {
            color: "red",
            opacity: 0.7,
          },
        },
      }}
    />

  </FeatureGroup>
                    {CircleBlock}
                      {HospitalMarker}
                      {EducationalMarker}
                      {ElevationMarker}
                      {ElectricityMarker}
                      {Waterbodies}
                      {Forest}
                      {Roads}
                      {LineOverWater}
                      {LineOverForest}
                </Map>
                <Dialog open={markerformstate} onClose={handlemarkerformClose} aria-labelledby="form-dialog-title">
                  <DialogContent>

                    <TextField name="Lat" label="Marker Name"   style={{marginRight :'15px'}}  />
                    <TextField name="Lng" label="Obstacle Radius" style={{marginRight :'15px'}} />
                    </DialogContent>
                    <DialogActions>
                      <Button  style={{color:"#E95617"}} onClick={handlemarkerformClose}>
                      Enter
                      </Button>
                    </DialogActions>
                    </Dialog>
            </Col>
        </Row>
      </Aux>
      </div>
  );
}
//////////Markers icon////////
  var HospitalIcon = new L.Icon({
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
    iconUrl: Hospital,
    iconRetinaUrl: Hospital,
  });
  var EducationalIcon = new L.Icon({
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
    iconUrl: Educational,
    iconRetinaUrl: Educational,
  });
  var ElevationIcon = new L.Icon({
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
    iconUrl: Elevation,
    iconRetinaUrl: Elevation,
  });
  var ElectricityIcon = new L.Icon({
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
    iconUrl: Electricity,
    iconRetinaUrl: Electricity,
  });
