import { useState } from "react";

function ChangeTextColor() {
    const [textColor, setTextColor] = useState("#000000");

    function handleOnchange(e) {
        let inputValue = Number(e.target.value);
        switch (inputValue) {
            case 1: {
                setTextColor("#ff0000");
                break;
            }
            case 2: {
                setTextColor("#00ff00");
                break;
            }
            case 3: {
                setTextColor("#0000ff");
                break;
            }
            default: {
                setTextColor("#000000");
            }
        }
    }
    return (
        <div>
            <h1 style={{ color: textColor }}>
                Hello world !
            </h1>
            <input onChange={(e) => setTextColor(`#${e.target.value}`)} placeholder="Input color (hex)" />
            <input onChange={handleOnchange} placeholder="Input 1, 2 or 3" />
        </div>
    );
}

export default ChangeTextColor;
