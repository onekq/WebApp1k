import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contactAgentForViewing_filterByFurnished_sharePropertyListings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully contacts agent for viewing', async () => {
  fetchMock.post('/api/agent/contact', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('viewing-date'), { target: { value: '2023-10-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-agent-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-success')).toBeInTheDocument();
}, 10000);

test('fails to contact agent for viewing and shows error message', async () => {
  fetchMock.post('/api/agent/contact', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('viewing-date'), { target: { value: '2023-10-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-agent-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-error')).toBeInTheDocument();
}, 10000);

test('Filter by furnished properties successfully', async () => {
  fetchMock.get('/api/furnished-properties', { properties: [{ id: 1, name: "Furnished 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-furnished-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Furnished 1')).toBeInTheDocument();
}, 10000);

test('Filter by furnished properties fails with error', async () => {
  fetchMock.get('/api/furnished-properties', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-furnished-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering furnished properties.')).toBeInTheDocument();
}, 10000);

test('successfully shares property listings', async () => {
  fetchMock.post('/api/share', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-listing-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('share-success')).toBeInTheDocument();
}, 10000);

test('fails to share property listings and shows error message', async () => {
  fetchMock.post('/api/share', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-listing-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('share-error')).toBeInTheDocument();
}, 10000);
