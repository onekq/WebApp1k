import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './receivePropertyAlerts_searchByMlsNumber_viewContactFormStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully receives property alerts', async () => {
  fetchMock.get('/api/alerts', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('receive-alerts-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('alerts-list')).toBeInTheDocument();
}, 10000);

test('fails to receive property alerts and shows error message', async () => {
  fetchMock.get('/api/alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('receive-alerts-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('alerts-error')).toBeInTheDocument();
}, 10000);

test('Successfully searches by MLS number.', async () => {
  fetchMock.get('/api/properties?mls=12345', { data: { property: 'Property Data' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('mls-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/api/properties?mls=12345').length).toEqual(1);
  expect(screen.getByText('Property Data')).toBeInTheDocument();
}, 10000);

test('Fails to search by MLS number with error message.', async () => {
  fetchMock.get('/api/properties?mls=12345', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('mls-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/api/properties?mls=12345').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve property')).toBeInTheDocument();
}, 10000);

test('successfully shows contact form status', async () => {
  fetchMock.post('/api/contact/status', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-status-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('status-success')).toBeInTheDocument();
}, 10000);

test('fails to show contact form status and shows error message', async () => {
  fetchMock.post('/api/contact/status', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-status-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('status-error')).toBeInTheDocument();
}, 10000);
