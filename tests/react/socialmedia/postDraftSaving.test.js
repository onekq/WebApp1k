import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './postDraftSaving';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Verify saving posts as drafts.', async () => {
  fetchMock.post('/api/posts/draft', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: 'Save as draft content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save as Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft saved successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for saving drafts.', async () => {
  fetchMock.post('/api/posts/draft', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save as Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save draft.')).toBeInTheDocument();
}, 10000);
