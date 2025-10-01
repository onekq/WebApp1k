import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contactAgentForViewing_displayNearbySchools_filterByPropertyFeatures';

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

test('shows information about nearby schools for a property', async () => {
  fetchMock.get('/property/1/schools', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Schools')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('schoolInfo')).toBeInTheDocument();
}, 10000);

test('fails to display nearby schools due to network error', async () => {
  fetchMock.get('/property/1/schools', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Schools')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load nearby schools')).toBeInTheDocument();
}, 10000);

test('Filter by Property Features filters properties by features successfully', async () => {
  fetchMock.get('/api/properties?features=balcony', {
    status: 200,
    body: [{ id: 1, features: ['balcony'] }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/features/i), { target: { value: 'balcony' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('balcony')).toBeInTheDocument();
}, 10000);

test('Filter by Property Features filters properties by features fails', async () => {
  fetchMock.get('/api/properties?features=balcony', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/features/i), { target: { value: 'balcony' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);
