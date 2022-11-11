import React from "react";
import { useMutation } from "@apollo/client";
import { Helmet } from 'react-helmet';
import { useForm } from "react-hook-form";
import { LOGIN_MUTATION } from "../api";
import { LoginMutation, LoginMutationVariables } from "../types/LoginMutation";
import { ErrorMesssage } from "../components/form-error";
import { LoginInput } from "../types/globalTypes";
import { Button } from '../components/button'
import { Link, useNavigate } from "react-router-dom";
import { emailPattern, logoUrl, TOKEN_KEY } from "../common/conts";
import { authToken, isLogged } from "../appollo";


interface LoginForm extends LoginInput { };
export const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm<LoginForm>();
    const onCompleted = (data: LoginMutation) => {
        const { login: { ok, error, token } } = data;
        if (ok && token) {
            console.log(token);
            localStorage.setItem(TOKEN_KEY, token);
            isLogged(true);
            authToken(token);
            navigate('/');
        }
    }
    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, { onCompleted });
    const onSubmit = () => {
        if (!loading) {
            loginMutation({ variables: { loginInput: getValues() } }).then(val => console.log(val));
        }

    }
    const onError = () => console.log(errors);

    return <div className="h-screen flex items-center justify-center bg-gray-800">
        <div className="bg-white w-full max-w-lg py-10 rounded-lg flex flex-col px-5 items-center">
            <img src={logoUrl} className="w-52 mb-10" alt="Nuber Eats"></img>
            <h1 className="w-full font-medium text-center text-3xl mb-5" >LOG IN</h1>
            <Helmet>
                <title>Login | Nuber Eats</title>
            </Helmet>
            <form
                className="grid gap-3 mt-5 px-5 w-full mb-5"
                onSubmit={handleSubmit(onSubmit, onError)}
            >
                <input
                    className="input mb-3"
                    {...register("email", { required: "Email is required", pattern: emailPattern })}
                    placeholder='Email'
                    required
                    type='email'
                    name='email'
                />
                {errors.email?.message && (
                    <ErrorMesssage message={errors.email?.message} />
                )}
                <input
                    className="input"
                    {...register("password", { required: "Password is required", minLength: 3 })}
                    placeholder='Password'
                    required
                    type='password'
                    name='password'
                />
                {errors.email?.type === "pattern" && (
                    <ErrorMesssage message={"Please enter a valid email"} />
                )}
                {errors.password?.message && (
                    <ErrorMesssage message={errors.password?.message} />
                )}
                {errors.password?.type === 'minLength' && (
                    <ErrorMesssage message="Password must be more than 3 chars" />
                )}
                {loginMutationResult?.login.error && (
                    <ErrorMesssage message={loginMutationResult.login.error} />
                )}
                <Button
                    className={isValid ? "btn mt-3" : "btn-disable mt-3"}
                    type="submit"
                    disabled={isValid ? false : true}
                >
                    {loading ? "Loading..." : "Log In"}
                </Button>
            </form>
            <div>
                New to Nuber?{"     "}
                <Link to="/create-account" className="text-lime-600 hover:underline">
                    Create an Account
                </Link>
            </div>
        </div>

    </div>
}