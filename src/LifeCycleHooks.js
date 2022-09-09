import { useState, useEffect } from "react";

function LifeCycleHooks() {
    const [isActive, setActive] = useState(false);
    useEffect(() => {
        console.log(isActive);
    }, [isActive]); // <-  componentDidmount + watch textColor changes

    useEffect(() => {
        console.log('hello from componentDidMount');
    }, []); // componentDidmount

    useEffect(() => {
        console.log('hello from componentDidMount + componentDidUpdate');
    }); // componentDidmount + componentDidUpdate

    useEffect(() => {
        return () => {
            console.log('this is from componentWillUnmount');
        };
    }, []);
    return (
        <div>
            <button onClick={() => setActive(!isActive)}>{isActive ? 'active' : 'disabled'}</button>
        </div>
    );
}

export default LifeCycleHooks;