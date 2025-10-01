import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addAltTextToImage_addStructuredData_assignPostToCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds alt text to an image', async () => {
  fetchMock.post('/api/alt-text', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/alt text updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add alt text to an image due to server error', async () => {
  fetchMock.post('/api/alt-text', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/failed to update alt text/i)).toBeInTheDocument();
}, 10000);

test('successfully adds structured data to a post', async () => {
  fetchMock.post('/api/structured-data', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/structured data added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add structured data to a post due to server error', async () => {
  fetchMock.post('/api/structured-data', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/failed to add structured data/i)).toBeInTheDocument();
}, 10000);

test('User can assign a post to a category successfully', async () => {
  fetchMock.post('/posts/1/categories', {
    status: 200,
    body: { postId: 1, categoryId: 1 }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Category')); });

  expect(fetchMock.calls('/posts/1/categories').length).toBe(1);
  expect(screen.getByText('Post assigned to category successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when assigning a post to a category fails', async () => {
  fetchMock.post('/posts/1/categories', {
    status: 500,
    body: { error: 'Unable to assign category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Category')); });

  expect(fetchMock.calls('/posts/1/categories').length).toBe(1);
  expect(screen.getByText('Error: Unable to assign category')).toBeInTheDocument();
}, 10000);
