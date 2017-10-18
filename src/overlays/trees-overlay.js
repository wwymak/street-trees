import React, { Component } from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

export default class TreesOverlay extends Component {
    render () {
        if(!this.props.data|| Object.keys(this.props.data).length === 0) {
            return null
        }
        console.log(this.props);
        let layerSettings = this.props.settings;
        let layers = [];

        Object.keys(this.props.data).forEach(key => {
            let currSettings = layerSettings.filter(d => d.name === key);

                let layer =
                    new ScatterplotLayer({
                        id: `trees-layer-${key}`,
                        getPosition: d => [d.longitude, d.latitude],
                        getColor: d => d.color || [0,255,125],
                        getRadius: d => {
                            if(this.props.viewport && this.props.viewport.zoom && this.props.viewport.zoom < 5) {
                                return 4
                            }
                            return 7;
                        },
                        onHover: info => {console.log('Hovered:', info, key); this.props.onHover(info, key)},
                        onClick: info => console.log('Clicked:', info),
                        pickable: true,
                        radiusMinPixels: 0.25,
                        radiusMaxPixels: 30,
                        data: this.props.data[key],
                        // ...this.props.viewport
                    });

                if(!currSettings || currSettings.length === 0) {console.log('no settings!!!'); return }
                if(currSettings[0].value) {
                    layers.push(layer)
                }


        });

        return (
            <DeckGL {...this.props.viewport} layers={layers}/>
        )
    }
}