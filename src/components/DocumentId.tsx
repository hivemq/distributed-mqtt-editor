import React from "react";

export function DocumentId() {
    const docId = window.location.pathname.split("/").pop()
    return <h1>{`DocumentId: ${docId}`}</h1>;
}