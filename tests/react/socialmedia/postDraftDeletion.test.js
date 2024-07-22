import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './postDraftDeletion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Verify deletion of saved drafts.', async () => {
  fetchMock.delete('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for non-existent draft deletion.', async () => {
  fetchMock.delete('/api/posts/draft/1', 404);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft not found.')).toBeInTheDocument();
}, 10000);

