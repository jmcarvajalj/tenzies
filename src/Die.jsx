/* eslint-disable react/prop-types */
import { useState } from "react"

export default function Die(props) {

    const [hover, setHover] = useState(false)

    const styles = {
        normal: {
            backgroundColor: props.isHeld ? "#59E391" : "white"
        },
        hover: {
            backgroundColor: "#6FEAA2"
        }
    }
    return (
        <div
            className="die-face"
            onMouseEnter={() => {
                setHover(true)
            }}
            onMouseLeave={() => {
                setHover(false)
            }}            
            style={{
                ...styles.normal,
                ...(hover ? styles.hover : null)
            }}
            onClick={props.holdDice}
        >
            <h2 className="die-num">{props.value}</h2>
        </div>
    )
}