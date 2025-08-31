/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
}

export interface CategoryConfig {
    name: string;
    color: string;
    icon: string;
}
