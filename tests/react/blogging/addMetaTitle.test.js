import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CMS from './addMetaTitle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a meta title to a post', async () => {
  fetchMock.post('/api/meta-title', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/meta title updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta title to a post due to server error', async () => {
  fetchMock.post('/api/meta-title', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/failed to update meta title/i)).toBeInTheDocument();
}, 10000);

