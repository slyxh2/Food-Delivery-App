import React from "react";
import { useMutation } from "@apollo/client";
import { Helmet } from 'react-helmet';
import { useForm } from "react-hook-form";
import { CREATE_ACCOUNT_MUTATION } from "../api";
import { CreateAccountMutation, CreateAccountMutationVariables } from "../types/CreateAccountMutation";
import { ErrorMesssage } from "../components/form-error";
import { LoginInput } from "../types/globalTypes";
import { Button } from '../components/button'
import { Link } from "react-router-dom";


interface LoginForm extends LoginInput { };
export const CreateAccount = () => {
    const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm<LoginForm>();
    const onCompleted = (data: CreateAccountMutation) => {

    }
    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, { onCompleted });
    const onSubmit = () => {
        if (!loading) {
            // loginMutation({ variables: { createAccounInput } }).then(val => console.log(val));
        }

    }
    const onError = () => console.log(errors);

    return <div className="h-screen flex items-center justify-center bg-gray-800">
        <div className="bg-white w-full max-w-lg py-10 rounded-lg flex flex-col px-5 items-center">
            <img src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/97c43f8974e6c876.svg" className="w-52 mb-10" alt="Nuber Eats"></img>
            <h1 className="w-full font-medium text-center text-3xl mb-5" >LOG IN</h1>
            <Helmet>
                <title>Create Account | Nuber Eats</title>
            </Helmet>
            <form
                className="grid gap-3 mt-5 px-5 w-full mb-5"
                onSubmit={handleSubmit(onSubmit, onError)}
            >
                <input
                    className="input mb-3"
                    {...register("email", { required: "Email is required" })}
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
                {errors.password?.message && (
                    <ErrorMesssage message={errors.password?.message} />
                )}
                {errors.password?.type === 'minLength' && (
                    <ErrorMesssage message="Password must be more than 3 chars" />
                )}

                <Button
                    className={isValid ? "btn mt-3" : "btn-disable mt-3"}
                    type="submit"
                    disabled={isValid ? false : true}
                >
                    {loading ? "Loading..." : "Log In"}
                </Button>
            </form>
        </div>

    </div>
}