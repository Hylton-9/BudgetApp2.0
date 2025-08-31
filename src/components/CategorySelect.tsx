/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CATEGORIES_CONFIG, categoryConfigMap } from '../constants/categories.ts';

interface CategorySelectProps {
    value: string | string[];
    onChange: (value: any) => void;
    placeholder?: string;
    multiple?: boolean;
}

const CategorySelect = ({ value, onChange, placeholder = "Select...", multiple = false }: CategorySelectProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (categoryName: string) => {
        if (multiple) {
            const currentValue = Array.isArray(value) ? value : [];
            const newSelection = currentValue.includes(categoryName)
                ? currentValue.filter(c => c !== categoryName)
                : [...currentValue, categoryName];
            onChange(newSelection);
        } else {
            onChange(categoryName);
            setIsOpen(false);
        }
    };

    const displayValue = () => {
        if (multiple) {
            const selected = Array.isArray(value) ? value : [];
            if (selected.length === 0) return <span className="placeholder">{placeholder}</span>;
            return (
                <div className="selected-categories-container">
                    {selected.map(catName => {
                        const config = categoryConfigMap[catName];
                        if (!config) return null;
                        return (
                            <span key={catName} className="category-tag-sm" style={{ backgroundColor: config.color }}>
                                <i className={config.icon}></i> {config.name}
                            </span>
                        );
                    })}
                </div>
            );
        }
        const config = typeof value === 'string' ? categoryConfigMap[value] : null;
        if (!config) return <span className="placeholder">{placeholder}</span>;
        return (
            <div className="category-label">
                <i className={config.icon} style={{ color: config.color }}></i> {config.name}
            </div>
        );
    };

    return (
        <div className="category-select-container" ref={containerRef}>
            <button type="button" className="category-select-button" onClick={() => setIsOpen(!isOpen)} aria-haspopup="listbox" aria-expanded={isOpen}>
                {displayValue()}
                <i className={`las la-angle-down dropdown-arrow ${isOpen ? 'open' : ''}`}></i>
            </button>
            {isOpen && (
                <ul className="category-select-dropdown" role="listbox">
                    {CATEGORIES_CONFIG.map(config => (
                        <li
                            key={config.name}
                            className="category-select-item"
                            onClick={() => handleSelect(config.name)}
                            role="option"
                            aria-selected={multiple ? (value as string[]).includes(config.name) : value === config.name}
                        >
                            {multiple && (
                                <input
                                    type="checkbox"
                                    checked={(value as string[]).includes(config.name)}
                                    readOnly
                                />
                            )}
                            <div className="category-label">
                                <i className={config.icon} style={{ color: config.color }}></i> {config.name}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategorySelect;
