import React, { Component } from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

export default class TreesOverlay extends Component {
    render () {
        if(!this.props.data|| this.props.data.length === 0) {
            return null
        }
        console.log(this.props)
        let layer =
            new ScatterplotLayer({
                id: 'trees-layer',
                getPosition: d => [d.longitude, d.latitude],
                getColor: d => d.color || [0,255,125],
                getRadius: d => {
                    if(this.props.viewport && this.props.viewport.zoom && this.props.viewport.zoom < 5) {
                        return 4
                    }
                    return 7;
                },
                onHover: info => console.log('Hovered:', info),
                onClick: info => console.log('Clicked:', info),
                pickable: true,
                radiusMinPixels: 0.25,
                radiusMaxPixels: 30,

                ...this.props
            });
        return (
            <DeckGL {...this.props.viewport} layers={[layer]}/>
        )
    }
}