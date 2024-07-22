import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './postDraftEditing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Test editing saved drafts.', async () => {
  fetchMock.put('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: 'Updated draft content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft updated successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure changes are saved and displayed (draft).', async () => {
  fetchMock.put('/api/posts/draft/1', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update draft.')).toBeInTheDocument();
}, 10000);

