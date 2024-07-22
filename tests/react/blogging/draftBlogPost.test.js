import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './draftBlogPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: save a draft of a blog post', async () => {
  fetchMock.post('/api/saveDraft', { status: 200, body: { id: 1, title: 'Draft Post', content: 'Some content' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Draft Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Some content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save draft/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft saved successfully')).toBeInTheDocument();
}, 10000);

test('Failure: save a draft of a blog post with network error', async () => {
  fetchMock.post('/api/saveDraft', { throws: new Error('Network Error') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Draft Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Some content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save draft/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

