import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contactPropertyOwner_displayPropertyTaxInformation_viewOpenHouseSchedule';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully contacts property owner', async () => {
  fetchMock.post('/api/contact', 200);

  await act(async () => { render(<MemoryRouter><ContactPropertyOwner /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-success')).toBeInTheDocument();
}, 10000);

test('fails to contact property owner and shows error message', async () => {
  fetchMock.post('/api/contact', 500);

  await act(async () => { render(<MemoryRouter><ContactPropertyOwner /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-error')).toBeInTheDocument();
}, 10000);

test('shows property tax details for a listing', async () => {
  fetchMock.get('/property/1/tax', { body: {} });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Tax')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('taxInfo')).toBeInTheDocument();
}, 10000);

test('fails to display property tax information due to network error', async () => {
  fetchMock.get('/property/1/tax', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Tax')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property tax information')).toBeInTheDocument();
}, 10000);

test('View open house schedule successfully', async () => {
  fetchMock.get('/api/open-house-schedule', { schedule: 'Sun 2-4 PM' });

  await act(async () => { render(<MemoryRouter><OpenHouseSchedule /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-schedule-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Sun 2-4 PM')).toBeInTheDocument();
}, 10000);

test('View open house schedule fails with error', async () => {
  fetchMock.get('/api/open-house-schedule', 500);

  await act(async () => { render(<MemoryRouter><OpenHouseSchedule /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-schedule-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error fetching open house schedule.')).toBeInTheDocument();
}, 10000);
