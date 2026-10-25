import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AngledCarousel } from '../AngledCarousel.tsx';

describe('AngledCarousel', () => {
  it('renders carousel cards with images', () => {
    render(<AngledCarousel onSelectCaseStudy={vi.fn()} />);
    expect(screen.getByAltText('Carizma Luxury Hotels')).toBeInTheDocument();
  });

  it('handles clicking the active center card to trigger onSelectCaseStudy', () => {
    const handleSelect = vi.fn();
    render(<AngledCarousel onSelectCaseStudy={handleSelect} />);
    const activeCardImg = screen.getByAltText('Carizma Luxury Hotels');
    fireEvent.click(activeCardImg);
    expect(handleSelect).toHaveBeenCalledWith('carizma-hotels');
  });
});
