/**
 * LanguageSelector Component Tests
 *
 * Tests for the language selection UI component.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from './LanguageSelector.tsx';

describe('LanguageSelector', () => {
    const mockOnLanguageChange = vi.fn();

    beforeEach(() => {
        mockOnLanguageChange.mockClear();
    });

    // ============================================================================
    // User Journey: Viewing Language Options
    // ============================================================================
    describe('Rendering', () => {
        it('renders both language buttons (EN and RO)', () => {
            render(
                <LanguageSelector currentLanguage="en" onLanguageChange={mockOnLanguageChange} />
            );
            expect(screen.getByText('EN')).toBeInTheDocument();
            expect(screen.getByText('RO')).toBeInTheDocument();
        });

        it('renders buttons with correct accessible role', () => {
            render(
                <LanguageSelector currentLanguage="en" onLanguageChange={mockOnLanguageChange} />
            );
            const buttons = screen.getAllByRole('button');
            expect(buttons).toHaveLength(2);
        });
    });

    // ============================================================================
    // User Journey: Switching Languages
    // ============================================================================
    describe('Language Selection', () => {
        it('calls onLanguageChange with "en" when EN button clicked', () => {
            render(
                <LanguageSelector currentLanguage="ro" onLanguageChange={mockOnLanguageChange} />
            );
            fireEvent.click(screen.getByText('EN'));
            expect(mockOnLanguageChange).toHaveBeenCalledWith('en');
        });

        it('calls onLanguageChange with "ro" when RO button clicked', () => {
            render(
                <LanguageSelector currentLanguage="en" onLanguageChange={mockOnLanguageChange} />
            );
            fireEvent.click(screen.getByText('RO'));
            expect(mockOnLanguageChange).toHaveBeenCalledWith('ro');
        });

        it('calls onLanguageChange exactly once per click', () => {
            render(
                <LanguageSelector currentLanguage="en" onLanguageChange={mockOnLanguageChange} />
            );
            fireEvent.click(screen.getByText('RO'));
            expect(mockOnLanguageChange).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================================================
    // User Journey: Visual Feedback for Current Language
    // ============================================================================
    describe('Active State Styling', () => {
        it('applies active styles to current language button (EN)', () => {
            render(
                <LanguageSelector currentLanguage="en" onLanguageChange={mockOnLanguageChange} />
            );
            const enButton = screen.getByText('EN');
            expect(enButton.className).toContain('bg-indigo-500');
            expect(enButton.className).toContain('text-white');
        });

        it('applies active styles to current language button (RO)', () => {
            render(
                <LanguageSelector currentLanguage="ro" onLanguageChange={mockOnLanguageChange} />
            );
            const roButton = screen.getByText('RO');
            expect(roButton.className).toContain('bg-indigo-500');
            expect(roButton.className).toContain('text-white');
        });

        it('applies inactive styles to non-selected language button', () => {
            render(
                <LanguageSelector currentLanguage="en" onLanguageChange={mockOnLanguageChange} />
            );
            const roButton = screen.getByText('RO');
            expect(roButton.className).toContain('bg-transparent');
            expect(roButton.className).toContain('text-indigo-600');
        });
    });
});
