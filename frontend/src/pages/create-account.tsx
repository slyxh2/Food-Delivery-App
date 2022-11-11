import React from "react";
import { useMutation } from "@apollo/client";
import { Helmet } from 'react-helmet';
import { useForm } from "react-hook-form";
import { CREATE_ACCOUNT_MUTATION } from "../api";
import { CreateAccountMutation, CreateAccountMutationVariables } from "../types/CreateAccountMutation";
import { ErrorMesssage } from "../components/form-error";
import { CreateAccountInput, UserRole } from "../types/globalTypes";
import { Button } from '../components/button'
import { Link, useNavigate } from "react-router-dom";
import { emailPattern, logoUrl } from "../common/conts";

interface CreateAccountForm extends CreateAccountInput { };
export const CreateAccount = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm<CreateAccountForm>();
    const onCompleted = (data: CreateAccountMutation) => {
        console.log(data);
        const { createAccount: { ok } } = data;
        if (ok) {
            alert("Account Created! Log in Now!");
            navigate('/login');
        }
    }
    const [createAccountMutation, { data: createAccountMutationResult, loading }] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, { onCompleted });
    const onSubmit = () => {
        if (!loading) {
            console.log(getValues());
            createAccountMutation({ variables: { createAccountInput: getValues() } });
        }

    }
    const onError = () => console.log(errors);

    return <div className="h-screen flex items-center justify-center bg-gray-800">
        <div className="bg-white w-full max-w-lg py-10 rounded-lg flex flex-col px-5 items-center">
            <img src={logoUrl} className="w-52 mb-10" alt="Nuber Eats"></img>
            <h1 className="w-full font-medium text-center text-3xl mb-5" >Create Account</h1>
            <Helmet>
                <title>Create Account | Nuber Eats</title>
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
                <select
                    {...register("role", { required: "Role is required" })}
                    placeholder="Pleaese select your role"
                    className="input"
                >
                    {
                        Object.keys(UserRole).map((role, index) => <option value={role} key={index}>{role}</option>)
                    }
                </select>

                <Button
                    className={isValid ? "btn mt-3" : "btn-disable mt-3"}
                    type="submit"
                    disabled={isValid ? false : true}
                >
                    {loading ? "Loading..." : "Create an account"}
                </Button>
                {
                    createAccountMutationResult?.createAccount.error && <ErrorMesssage message={createAccountMutationResult?.createAccount.error} />
                }
            </form>
            <div>
                Already have an account?{"     "}
                <Link to="/login" className="text-lime-600 hover:underline">
                    Log in now
                </Link>
            </div>
        </div>

    </div>
}