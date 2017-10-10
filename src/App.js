import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import MapGL from 'react-map-gl';
import * as d3 from 'd3';
import OSPoint from 'ospoint';

import TreesOverlay from './overlays/trees-overlay';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
const MAPBOX_KEY = 'pk.eyJ1Ijoid3d5bWFrIiwiYSI6IkxEbENMZzgifQ.pxk3bdzd7n8h4pKzc9zozw';
const TREE_NAMES = [ 'Cherry', 'Maple', 'Lime', 'Plane', 'Ash', 'Oak', 'Whitebeam', 'Birch', 'Hawthorn', 'Apple', 'Hornbeam', 'Chestnut', 'Pear', 'Cypress', 'Poplar', 'Alder', 'Willow', 'Beech', 'Pine', 'Black Locust', 'Elm', 'Hazel' ];
const colorScale = d3.scaleOrdinal(d3.schemeCategory20b).domain(TREE_NAMES.slice(0, 20));
console.log(colorScale('Cherry'), d3.rgb(colorScale('Cherry')))
class App extends Component {
    constructor(props) {
        super (props);
        this.state = {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                longitude: -0.12,
                latitude: 51.51,
                zoom: 11,
                maxZoom: 20,
                minZoom: 9
            },
            data: []
        };
        this.resizeHandler = this.resizeHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeHandler);
        this.resizeHandler();

        d3.csv('data/Borough_tree_list_may16.csv', d => {
            return {
                id: d.ID,
                ox: d.Ox,
                oy: d.Oy,
                name: d['Display name'],
                species: d['Species name']
            }
        },(err, data) => {
            if(!err && data){
                let parsed = [];
                data.forEach(d => {
                    let colorObj = d3.rgb(colorScale(d.name));
                    d.color = [colorObj.r, colorObj.g,colorObj.b];
                    let ospoint = new OSPoint(d.oy, d.ox);
                    parsed.push({...d, ...ospoint.toWGS84()});
                });
                let groupedByTrees = d3.nest().key(d => d.name).object(parsed);
                console.log(groupedByTrees)
                this.setState({
                    // data: groupedByTrees
                    data: parsed
                });
                this.forceUpdate()
            } else {

                this.setState({
                    data: []
                })
            }
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler)
    }

    parseDate (data) {

    }

    viewportChangeHandler(viewport) {
        this.setState({
            viewport: {...this.state.viewport, ...viewport}
        })
    }

    resizeHandler() {
        this.viewportChangeHandler({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }
    render() {
        return (
            <div className="App">
                {/*<header className="App-header">*/}
                    {/*<img src={logo} className="App-logo" alt="logo" />*/}
                    {/*<h1 className="App-title">geo-vis</h1>*/}
                {/*</header>*/}
                <MapGL
                    {...this.state.viewport}
                    mapStyle={MAPBOX_STYLE}
                    mapboxApiAccessToken={MAPBOX_KEY}
                    onViewportChange={ (viewport) =>{
                        this.viewportChangeHandler(viewport)
                    }
                    }
                >
                    <TreesOverlay
                        viewport = {this.state.viewport}
                        data = {this.state.data}
                    />
                </MapGL>
            </div>
        );
    }
}

export default App;
