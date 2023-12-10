'use client'

import React, { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const renderIcon = () => {
        if (!mounted) {
            return <Sun className="h-6 w-6" />;
        }
        return theme === "dark" ? <Sun className="h-6 w-6 hover_icon" /> : <Moon className="h-6 w-6 hover_icon" />;
    };

    return (
        <button onClick={toggleTheme} aria-label="Toggle theme">
            {renderIcon()}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
