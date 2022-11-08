import React from "react";

interface ErrorMesssageProp {
    message: string
}

export const ErrorMesssage: React.FC<ErrorMesssageProp> = ({ message }) => {
    return <span className="font-medium text-red-500">{message}</span>
}