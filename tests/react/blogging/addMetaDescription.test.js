import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CMS from './addMetaDescription';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a meta description to a post', async () => {
  fetchMock.post('/api/meta-description', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta description/i), { target: { value: 'New Meta Description' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-description').length).toBe(1);
  expect(screen.getByText(/meta description updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta description to a post due to server error', async () => {
  fetchMock.post('/api/meta-description', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta description/i), { target: { value: 'New Meta Description' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-description').length).toBe(1);
  expect(screen.getByText(/failed to update meta description/i)).toBeInTheDocument();
}, 10000);

