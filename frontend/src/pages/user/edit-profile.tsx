import React from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { EDIT_PROFILE_MUTATION } from "../../api";
import { useMe } from "../../common/hooks/useMe";
import { editProfile, editProfileVariables } from "../../types/editProfile";
import { EditProfileInput } from "../../types/globalTypes";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import { ErrorMesssage } from "../../components/form-error";
import { Button } from "../../components/button";
import { emailPattern } from "../../common/conts";


interface EditProfileForm extends EditProfileInput { };

export const EditProfile = () => {
    const { data: userData } = useMe();
    const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm<EditProfileForm>({
        mode: 'onChange',
        defaultValues: {
            email: userData?.me.email
        }
    });
    const client = useApolloClient();
    const onCompleted = (data: editProfile) => {
        const {
            editProfile: { ok },
        } = data;
        if (ok && userData) {
            const {
                me: { email: prevEmail, id },
            } = userData;
            const { email: newEmail } = getValues();
            if (prevEmail !== newEmail) {
                client.writeFragment({
                    id: `User:${id}`,
                    fragment: gql`
                fragment EditedUser on User {
                  verified
                  email
                }
              `,
                    data: {
                        email: newEmail,
                        verified: false,
                    },
                });
            }
        }
    };
    const [editProfileMutation, { data: editProfileMutationResult, loading }] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, { onCompleted });
    const onSubmit = () => {
        editProfileMutation({
            variables: { input: getValues() }
        });
    }
    return (
        <div className="mt-52 flex flex-col justify-center items-center">
            <Helmet>
                <title>Edit Profile | Nuber Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
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
                {editProfileMutationResult?.editProfile.error && (
                    <ErrorMesssage message={editProfileMutationResult.editProfile.error} />
                )}
                <Button
                    className={isValid ? "btn mt-3" : "btn-disable mt-3"}
                    type="submit"
                    disabled={isValid ? false : true}
                >
                    {loading ? "Loading..." : "Edit Profile"}
                </Button>
            </form>
        </div>
    )
}