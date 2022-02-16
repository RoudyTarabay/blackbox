import { useState } from "react";

const Signup = (props) => {
    const [formData, setFormDate] = useState({
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        password_confirmation: ""
    })
    const _handleChange = (e) => {
        setFormDate({ ...formData, [e.target.name]: e.target.value });
    }
    const _handleSignup = async (e) => {
        e.preventDefault();
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).catch(err => {
            // alert();
        });
        if (!response.ok) {
            const err = await response.json();
            let errorState = {
                email: "",
                password: "",
                password_confirmation: ""
            };
            err.details.map(el => {
                const keys = Object.keys(el);
                errorState = { ...errorState, [keys[0]]: el[keys[0]] }
            })
            setErrors(errorState);
        }
        else {
            props.setIsSignup(false);
        }
    }
    return <form onSubmit={_handleSignup}>
        <div>
            <input placeholder="email" onChange={_handleChange} type="email" name="email" required />
            <p className="validation-errors">{errors.email}</p>
        </div>
        <div>
            <input type="password" placeholder="password" onChange={_handleChange} name="password" required />
            <p className="validation-errors">{errors.password}</p>
        </div>
        <div>
            <input type="password" placeholder="confirm password" onChange={_handleChange} name="password_confirmation" required />
            <p className="validation-errors">{errors.password_confirmation}</p>
        </div>
        <button type="submit" value="submit">Sign Up</button>
        <div className="switch">
            <a href="#" onClick={() => { props.setIsSignup(false) }}> Go To Login</a>
        </div>
    </form>

}
export default Signup