import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaTitle_editTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a meta title to a post', async () => {
  fetchMock.post('/api/meta-title', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/meta title updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta title to a post due to server error', async () => {
  fetchMock.post('/api/meta-title', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/failed to update meta title/i)).toBeInTheDocument();
}, 10000);

test('User can edit an existing tag successfully', async () => {
  fetchMock.put('/tags/1', {
    status: 200,
    body: { id: 1, name: 'Updated Tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'Updated Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag updated successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when editing a tag fails', async () => {
  fetchMock.put('/tags/1', {
    status: 500,
    body: { error: 'Unable to update tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'Updated Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to update tag')).toBeInTheDocument();
}, 10000);