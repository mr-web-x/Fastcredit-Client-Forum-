"use client";

import "./ToastProvider.scss"

import { Toaster } from "sonner";

export default function ToastProvider() {
    return (
        <div className="ToastProvider">
            <Toaster
                position="bottom-right"
                duration={3000}
                richColors
                closeButton
                expand={false}
                visibleToasts={5}
            />
        </div>
    );
}