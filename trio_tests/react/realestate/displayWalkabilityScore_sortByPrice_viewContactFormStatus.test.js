import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayWalkabilityScore_sortByPrice_viewContactFormStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Display walkability score successfully', async () => {
  fetchMock.get('/api/walkability-score', { score: 85 });

  await act(async () => { render(<MemoryRouter><WalkabilityScore /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('85')).toBeInTheDocument();
}, 10000);

test('Display walkability score fails with error', async () => {
  fetchMock.get('/api/walkability-score', 500);

  await act(async () => { render(<MemoryRouter><WalkabilityScore /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error displaying walkability score.')).toBeInTheDocument();
}, 10000);

test('sorts property listings by price in ascending order', async () => {
  fetchMock.get('/properties?sort=price', { body: [] });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortPrice'), { target: { value: 'asc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to sort property listings by price due to network error', async () => {
  fetchMock.get('/properties?sort=price', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortPrice'), { target: { value: 'asc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sort properties by price')).toBeInTheDocument();
}, 10000);

test('successfully shows contact form status', async () => {
  fetchMock.post('/api/contact/status', 200);

  await act(async () => { render(<MemoryRouter><ViewContactFormStatus /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-status-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('status-success')).toBeInTheDocument();
}, 10000);

test('fails to show contact form status and shows error message', async () => {
  fetchMock.post('/api/contact/status', 500);

  await act(async () => { render(<MemoryRouter><ViewContactFormStatus /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-status-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('status-error')).toBeInTheDocument();
}, 10000);
