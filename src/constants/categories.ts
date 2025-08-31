/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CategoryConfig } from '../types/index.d.ts';

export const CATEGORIES_CONFIG: CategoryConfig[] = [
    { name: "Food", color: "#ffc107", icon: "las la-utensils" },
    { name: "Transport", color: "#17a2b8", icon: "las la-bus" },
    { name: "Entertainment", color: "#6f42c1", icon: "las la-film" },
    { name: "Utilities", color: "#fd7e14", icon: "las la-bolt" },
    { name: "Shopping", color: "#20c997", icon: "las la-shopping-bag" },
    { name: "Rent", color: "#e83e8c", icon: "las la-home" },
    { name: "Health", color: "#dc3545", icon: "las la-heartbeat" },
    { name: "Other", color: "#6c757d", icon: "las la-ellipsis-h" },
];

export const categoryConfigMap = Object.fromEntries(CATEGORIES_CONFIG.map(c => [c.name, c]));
