import React from 'react';

function Loading() {
    return (
        <div className="flex flex-col items-center justify-center" style={{ height: "100vh" }}>
            <div className="loader">
                <span className="loading loading-infinity loading-xl text-primary"></span>
            </div>
        </div>
    );
}

export default Loading