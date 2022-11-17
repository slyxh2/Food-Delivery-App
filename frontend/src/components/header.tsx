import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { logoUrl } from "../common/conts";
import { useMe } from "../common/hooks/useMe";

export const Header: React.FC = () => {
    const { data } = useMe();
    return (
        <>
            {!data?.me.verified && (
                <div className="bg-red-500 p-3 text-center text-base text-white">
                    <span>Please verify your email.</span>
                </div>
            )}
            <header className="header">
                <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
                    <Link to="/">
                        <img src={logoUrl} className="w-44" alt="Nuber Eats" />
                    </Link>
                    <span className="text-xs">
                        <Link to="/edit-profile">
                            <FontAwesomeIcon icon={faUser} className="text-3xl" />
                        </Link>
                    </span>
                </div>
            </header>
        </>
    );
};