import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { VERIFY_EMAIL_MUTATION } from "../../api";
import { verifyEmail, verifyEmailVariables } from "../../types/verifyEmail";

export const ConfirmEmail = () => {
    let code = useLoaderData() + '';
    const navigate = useNavigate()
    const onCompleted = (data: verifyEmail) => {
        setTimeout(() => {
            navigate('/');
        }, 2000);
    }
    const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(VERIFY_EMAIL_MUTATION, { onCompleted });
    console.log(code);
    useEffect(() => {
        verifyEmail({
            variables: {
                input: { code }
            }
        })
    }, [verifyEmail])
    return <div className="mt-52 flex flex-col items-center justify-center">
        <Helmet>
            <title>Verify Email | Nuber Eats</title>
        </Helmet>
        <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
        <h4 className="text-gray-700 text-sm">
            Please wait, don't close this page...
        </h4>
    </div>
}