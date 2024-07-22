import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CMS from './addStructuredData';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds structured data to a post', async () => {
  fetchMock.post('/api/structured-data', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/structured data added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add structured data to a post due to server error', async () => {
  fetchMock.post('/api/structured-data', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/failed to add structured data/i)).toBeInTheDocument();
}, 10000);

