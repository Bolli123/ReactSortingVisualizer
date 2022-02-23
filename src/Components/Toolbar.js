import './Toolbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faStepBackward, faStepForward, faForward, faBackward, faPlay } from '@fortawesome/free-solid-svg-icons'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import React from 'react';



class Toolbar extends React.Component {
    constructor(props) {
		super(props)
		this.state = {
            dropdownOptions: [
                { value: 'selection', label: 'Selection Sort' },
                { value: 'insertion', label: 'Insertion Sort' },
                { value: 'bubble', label: 'Bubble Sort' },
                { value: 'quick', label: 'Quick Sort' },
                { value: 'merge', label: 'Merge Sort' },
              ],
            selected: "selection",
            speed: 50
		}
	}
    handleSelection(selectedValue) {
        const { selected } = this.state
        if (selectedValue !== selected) {
            this.props.handleAlgorithmChange(selectedValue)
            this.setState({
                selected: selectedValue
            })
        }
    }
    handleSpeedChange(e) {
        this.setState({
            speed: e.target.value
        })
        this.props.handleSpeedChange(e.target.value)
    }
    render() {
        const { playing } = this.props
        const { dropdownOptions, selected, speed } = this.state
        var playIcon = faPlay
        if (playing) {
            playIcon = faPause
        }
        return (
            <div className="Toolbar">
                <div className="Dropdown-Container" id="left">
                    <Dropdown style={{color: "black"}} className="Dropdown" disabled={playing} options={dropdownOptions} onChange={(selectedValue) => this.handleSelection(selectedValue)} value={selected}/>
                </div>
                <div className="slidecontainer">
                    <input type="range" min="1" max="100" value={speed} className="slider" id="myRange" onChange={(e) => this.handleSpeedChange(e)}>
                    </input>
                </div>
                <div className="Toolbar-Element" id="center" aria-hidden="true">
                    <button onClick={(e) => this.props.clicked(e, "reset")}>
                        <FontAwesomeIcon className="Icon" icon={faBackward} />
                    </button>
                    <button onClick={(e) => this.props.clicked(e, "frameBack")}>
                        <FontAwesomeIcon className="Icon" icon={faStepBackward} />
                    </button>
                    <button onClick={(e) => this.props.clicked(e, "play")}>
                        <FontAwesomeIcon className="Icon" icon={playIcon} />
                    </button>
                    <button onClick={(e) => this.props.clicked(e, "frameForward")}>
                        <FontAwesomeIcon className="Icon" icon={faStepForward} />
                    </button>
                    <button onClick={(e) => this.props.clicked(e, "finish")}>
                        <FontAwesomeIcon className="Icon" icon={faForward} />
                    </button>
                    
                </div>
                <a href="#/" className="Toolbar-Element" id="right">
                    GitHub
                </a>
            </div>
        )
    }

}

export default Toolbar;
