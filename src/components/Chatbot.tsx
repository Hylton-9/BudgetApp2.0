/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import React from 'react';
import type { ChatMessage, Expense } from '../types/index.d.ts';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { CATEGORIES_CONFIG } from '../constants/categories.ts';

interface ChatbotProps {
    expenses: Omit<Expense, 'id'>[];
    addExpense: (expense: Omit<Expense, 'id'>) => void;
}

const Chatbot = ({ expenses, addExpense }: ChatbotProps) => {
    const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chatMessages', [
        { role: 'system', text: "Hello! Ask about your spending or add expenses (e.g., 'spent 15 on lunch and 30 for gas')." }
    ]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const expenseData = JSON.stringify(expenses, null, 2);
        
        const validCategories = CATEGORIES_CONFIG.map(c => c.name);
        const today = new Date().toISOString().split('T')[0];

        const systemInstruction = `You are a dual-function personal finance assistant. Your capabilities are:
1.  **Expense Entry:** Parse user messages to create an array of new expense entries. Find all valid expenses mentioned.
2.  **Answering Questions:** Analyze provided JSON expense data to answer questions about spending.

**Instructions:**
- First, determine the user's intent: Are they trying to add one or more expenses ('EXPENSE_ENTRY') or ask a question ('QUESTION')?
- If the intent is unclear, classify it as 'UNCLEAR'.
- Today's date is ${today}. Use this for relative dates like 'today' or 'yesterday'.
- Valid expense categories are: [${validCategories.join(', ')}]. If the user provides a category not on this list, map it to the closest valid one or 'Other'.
- Respond ONLY in the specified JSON format.`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                intent: { type: Type.STRING, enum: ["QUESTION", "EXPENSE_ENTRY", "UNCLEAR"], description: "The user's primary intent." },
                expenses: {
                    type: Type.ARRAY,
                    nullable: true,
                    description: "An array of expense objects parsed from the user's message.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            amount: { type: Type.NUMBER, description: "The numeric amount of the expense." },
                            description: { type: Type.STRING, description: "A brief description of the expense." },
                            category: { type: Type.STRING, enum: validCategories, description: "The category of the expense from the provided list." },
                            date: { type: Type.STRING, description: "The date of the expense in YYYY-MM-DD format." }
                        },
                        required: ["amount", "description", "category", "date"]
                    }
                },
                answer: { type: Type.STRING, nullable: true, description: "A concise, helpful answer if the intent is 'QUESTION'." },
                clarification: { type: Type.STRING, nullable: true, description: "A question to ask the user if details are incomplete or the intent is unclear." }
            },
            required: ["intent"]
        };
        
        const prompt = `Based on the rules and the data below, process the user's request.

Current Filtered Expense Data (for Q&A):
${expenseData}

User's Request:
"${input}"`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema,
                }
            });

            const parsedResponse = JSON.parse(response.text);
            
            switch (parsedResponse.intent) {
                case 'EXPENSE_ENTRY':
                    if (parsedResponse.expenses && parsedResponse.expenses.length > 0) {
                        let confirmationText = `Added ${parsedResponse.expenses.length} expense(s):`;
                        parsedResponse.expenses.forEach((expense: Omit<Expense, 'id'>) => {
                            addExpense(expense);
                            confirmationText += `\n- ✅ ${expense.description} | ${expense.category} | $${expense.amount.toFixed(2)}`;
                        });
                        setMessages(prev => [...prev, { role: 'system', text: confirmationText.replace(/\n/g, '<br />') }]);
                    } else {
                        const clarification = parsedResponse.clarification || "I couldn't add that expense. Please provide an amount, description, and category.";
                        setMessages(prev => [...prev, { role: 'model', text: clarification }]);
                    }
                    break;
                case 'QUESTION':
                    const answer = parsedResponse.answer || "I found an answer, but it's empty.";
                    setMessages(prev => [...prev, { role: 'model', text: answer }]);
                    break;
                case 'UNCLEAR':
                default:
                    const clarification = parsedResponse.clarification || "I'm not sure how to help. You can ask about your spending or tell me to add an expense.";
                    setMessages(prev => [...prev, { role: 'model', text: clarification }]);
                    break;
            }

        } catch (error) {
            console.error("Gemini API Error:", error);
            const errorMessage: ChatMessage = { role: 'system', text: "Sorry, I had trouble understanding that. Please check your API key and try rephrasing." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-card card">
            <h2 className="card-title"><i className="las la-robot"></i> AI Budget Assistant</h2>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                        <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message model">
                        <div className="loading-dots">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask or add an expense..."
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="btn btn-primary"><i className="las la-paper-plane"></i></button>
            </div>
        </div>
    );
};

export default Chatbot;
