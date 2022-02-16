import { useState } from "react";

const Login = (props) => {
    const [formData, setFormDate] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    })
    const _handleChange = (e) => {
        setFormDate({ ...formData, [e.target.name]: e.target.value });
    }
    const _handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('/auth/login', {
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
            };
            err.details.map(el => {
                const keys = Object.keys(el);
                errorState = { ...errorState, [keys[0]]: el[keys[0]] }
            })
            setErrors(errorState);
        } else {
            const res = await response.json();
            localStorage.setItem('blackbox_token', res.token);
            props.setToken(res.token);
        }

    }
    return <form onSubmit={_handleLogin}>
        <div>
            <input placeholder="email" onChange={_handleChange} type="email" name="email" required />
            <p className="validation-errors">{errors.email}</p>
        </div>
        <div>
            <input type="password" placeholder="password" onChange={_handleChange} name="password" required />
            <p className="validation-errors">{errors.password}</p>
        </div>
        <button type="submit" value="submit">Login</button>
        <div className="switch">
            <a href="#" onClick={() => { props.setIsSignup(true) }}> Go To Login</a>
        </div>
    </form>

}
export default Login