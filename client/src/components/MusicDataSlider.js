import React from 'react';

const MusicDataSlider = (props) => {
    return (
        <div className="option-slider">
            <div>{props.optionName}:</div>
            <div className="option-slider-input">
                <input onMouseUp={props.sliderMouseUp} type="range"
                       onChange={({target}) => props.changeValue(target.value / 100)}
                       value={props.value * 100} min="0" max="100"
                       className="slider"/>
            </div>
            <div className="option-input">
                {Math.ceil(props.value * 100)}
            </div>
            <div className="option-targets">
                {[
                    {value: "Min", key: "min"},
                    {value: "Max", key: "max"},
                    {value: "Target", key: "target"},
                    {value: "X", key: "disabled"}
                ].map(value =>
                    <div key={value.key} onClick={() => props.changeFunction(value.key)}
                         className={`option-function ${props.optionFunction === value.key ? "selected" : ""}`}>{value.value}</div>
                )}
            </div>
        </div>
    );
};

export default MusicDataSlider;
