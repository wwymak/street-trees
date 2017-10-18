import React, { Component } from 'react';
import {layerControlStyle} from './../styles';

export class TreesLayerControl extends Component {
    onValueChangeHandler (settingKey, settingValue) {
        let currSettings = this.props.settings;
        let settingToUpdate = currSettings.filter(d => d.name === settingKey);
        if(settingToUpdate.length > 0 && settingToUpdate[0].value !== settingValue) {
            settingToUpdate[0].value = settingValue
        }
        console.log(currSettings)
        this.props.onChange(currSettings)
        // if(currSettings[settingKey] !== settingValue) {
        //     currSettings[settingKey] = settingValue;
        //     let newSettings = {
        //         ...this.props.settings,
        //         [settingKey]: settingValue
        //     };
        //
        //     this.props.onChange(newSettings)
        // }
    }

    render () {
        const {title, settings} = this.props;
        let currSettings =  [];
        Object.keys(settings).forEach(d => currSettings.push(settings[d]));
        currSettings.sort((a, b) => a.name < b.name? -1 : a.name > b.name? 1: 0);
        return (
            <div className="layer-controls" style={layerControlStyle}>
                <h4>{title}</h4>
                {
                    currSettings.map(item => {
                        return (
                            <div key={item.name}>
                                {/*<Checkbox*/}
                                {/*settingName={item.name}/>*/}
                                <Checkbox
                                    settingName={item.name}
                                    value={item.value}
                                    propType={item.name}
                                    onChange={this.onValueChangeHandler.bind(this)}/>
                            </div>
                        )
                    })
                }

            </div>
        )
    }
}

const Checkbox = (settingName) => {
    let colorStyle = {
        width: '10px',
        height: '10px',
        'backgroundColor':'blue'
    }
    return (
        <div  key={settingName.settingName}>
            <div className="input-group">
                <label>
                    <input type="checkbox"
                       id={settingName.target}
                       checked={settingName.value}
                       onChange={e => {console.log(e.target.value);
                            settingName.onChange(settingName.settingName, e.target.checked)
                       }}/>
                    <span style={colorStyle}></span>{settingName.settingName}
                </label>

            </div>
        </div>
    )
};