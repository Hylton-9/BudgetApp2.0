/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="btn-icon theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <i className={theme === 'light' ? 'las la-moon' : 'las la-sun'}></i>
        </button>
    );
};

export default ThemeToggle;
