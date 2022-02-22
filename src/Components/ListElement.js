import React from 'react';
import './ListElement.css';

class ListElement extends React.Component {
    infoBoxHover(e) {
        e.preventDefault()
        //var bounds = e.target.getBoundingClientRect();
        // Convert px to vw
        var x = (e.clientX * 100) / window.innerWidth
        //Convert px to vh
        var y = (e.clientY * 100) / window.innerHeight
        this.setState({
            infoBoxX: x,
            infoBoxY: y,
            infoBoxVisibility: true
        })
        this.props.infoBoxHover(x, y, this.props.length)
    }
    infoBoxHide(e) {
        e.preventDefault()
        this.props.infoBoxHide()
    }
    render() {
        const { length, selected, swapped, sorted } = this.props
        var height = length - 8
        var ElementCSS = {
            height: height + "vh",
            backgroundColor: "darkcyan",
            //borderTop: altHeight + 'vh solid #97D0D0'
        }
        if (selected) {
            ElementCSS.backgroundColor = "goldenrod"
        }
        if (swapped) {
            ElementCSS.backgroundColor = "firebrick"
        }
        if (sorted) {
            ElementCSS.backgroundColor = "darkgreen"
        }
        return (
            <div>
                <div className="List-Element" style={ElementCSS} onMouseEnter={(e) => this.infoBoxHover(e)} onMouseLeave={(e) => this.infoBoxHide(e)}> </div>
            </div>
        );
        }
    }

export default ListElement;
