import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './publishBlogPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: publish a draft blog post', async () => {
  fetchMock.put('/api/publishPost', { status: 200, body: { id: 1, title: 'Draft Post', content: 'Some content', status: 'Published' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/publish/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post published successfully')).toBeInTheDocument();
}, 10000);

test('Failure: publish a draft post without content', async () => {
  fetchMock.put('/api/publishPost', { status: 400, body: { error: 'Content cannot be empty' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/publish/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content cannot be empty')).toBeInTheDocument();
}, 10000);

